import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, Users, Clock, CreditCard, Gift, AlertCircle } from 'lucide-react';
import { format, addDays, isAfter, isBefore } from 'date-fns';
import { Adventure, BookingFormData, PricingBreakdown } from '@/types/booking';
import { BookingService } from '@/services/bookingService';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';

interface BookingWidgetProps {
  adventure: Adventure;
  onBookingStart: (formData: BookingFormData) => void;
  className?: string;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({ 
  adventure, 
  onBookingStart,
  className = ''
}) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [participants, setParticipants] = useState<number>(1);
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
  const [availableSpots, setAvailableSpots] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [selectedDateAvailability, setSelectedDateAvailability] = useState<{
    remainingSpots: number;
    isAvailable: boolean;
  } | null>(null);

  // Available times for the selected date
  const availableTimes = [
    { value: '09:00', label: '9:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '15:00', label: '3:00 PM' },
  ];

  useEffect(() => {
    if (selectedDate) {
      checkAvailability();
    }
  }, [selectedDate, participants]);

  useEffect(() => {
    calculatePricing();
  }, [selectedDate, participants, appliedPromo]);

  // Load disabled dates when component mounts or adventure changes
  useEffect(() => {
    const loadDisabledDates = async () => {
      try {
        const disabledDateStrings = await BookingService.getDisabledDates(adventure.id, user?.id);
        const disabledDateObjects = disabledDateStrings.map(dateStr => new Date(dateStr));
        setDisabledDates(disabledDateObjects);
      } catch (error) {
        console.error('Error loading disabled dates:', error);
      }
    };

    loadDisabledDates();
  }, [adventure.id, user?.id]);

  // Function to refresh disabled dates (called after booking)
  const refreshDisabledDates = async () => {
    try {
      const disabledDateStrings = await BookingService.getDisabledDates(adventure.id, user?.id);
      const disabledDateObjects = disabledDateStrings.map(dateStr => new Date(dateStr));
      setDisabledDates(disabledDateObjects);
    } catch (error) {
      console.error('Error refreshing disabled dates:', error);
    }
  };

  // Function to handle date selection with availability checking
  const handleDateSelection = async (date: Date | undefined) => {
    if (!date) {
      setSelectedDate(undefined);
      setSelectedDateAvailability(null);
      return;
    }
    
    const dateStr = format(date, 'yyyy-MM-dd');
    
    try {
      const availability = await BookingService.checkDateAvailability(adventure.id, dateStr);
      
      // Handle service errors gracefully
      if (availability.error) {
        toast.warning("Could not verify availability for this date. You can continue browsing, but availability will be confirmed at booking.");
        setSelectedDateAvailability({
          remainingSpots: 8, // Optimistic default
          isAvailable: true
        });
        setSelectedDate(date);
        return;
      }
      
      setSelectedDateAvailability({
        remainingSpots: availability.remainingSpots,
        isAvailable: availability.isAvailable
      });
      
      // If the date is fully booked, show warning but allow selection for browsing
      if (availability.remainingSpots <= 0 && !availability.isBlocked) {
        toast.warning("This date is fully booked, but you can continue browsing trip details.");
        setSelectedDate(date); // Set the date for browsing
        // Don't return here - allow user to continue browsing
      }
      
      // If the date is blocked by admin, prevent selection
      if (availability.isBlocked) {
        toast.error("This date is not available. Please select another date.");
        setSelectedDate(date); // Still set the date so user can see it's selected
        return;
      }
      
      // If available, show success feedback
      if (availability.isAvailable) {
        const spotsMessage = availability.remainingSpots === 1 
          ? "1 spot remaining" 
          : `${availability.remainingSpots} spots remaining`;
        toast.success(`Date selected! ${spotsMessage}`);
        setSelectedDate(date);
      }
      
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.warning("Could not verify availability for this date. You can continue browsing, but availability will be confirmed at booking.");
      // Set optimistic availability state for UI
      setSelectedDateAvailability({
        remainingSpots: 8, // Optimistic default
        isAvailable: true
      });
      setSelectedDate(date); // Still allow selection in case of error
    }
  };

  const checkAvailability = async () => {
    if (!selectedDate) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const spots = await BookingService.getAvailableSpots(adventure.id, dateStr);
    setAvailableSpots(spots);
  };

  const calculatePricing = () => {
    if (!selectedDate) return;
    
    const formData: BookingFormData = {
      selectedDate: format(selectedDate, 'yyyy-MM-dd'),
      selectedTime,
      participants,
      leadGuest: { name: '', email: '', phone: '' },
      guestDetails: {
        dietaryRestrictions: [],
        experienceLevel: '',
        emergencyContact: { name: '', phone: '' }
      },
      selectedAddOns: [],
      specialRequests: '',
      notifications: { email: true, sms: false, whatsapp: false },
      promoCode: promoCode,
      appliedPromotion: appliedPromo
    };
    
    const pricingBreakdown = BookingService.calculatePricing(adventure, formData, appliedPromo);
    setPricing(pricingBreakdown);
  };

  const handlePromoCodeSubmit = async () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code');
      return;
    }
    
    setIsLoading(true);
    try {
      const promo = await BookingService.validatePromoCode(promoCode, adventure.id);
      
      if (promo) {
        setAppliedPromo(promo);
        toast.success(`Promo code applied! ${promo.discount_value}% off`);
      } else {
        toast.error('Invalid or expired promo code');
      }
    } catch (error) {
      toast.error('Error validating promo code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookNow = async () => {
    if (!selectedDate || !selectedTime || participants < 1) {
      toast.error('Please select date, time, and number of participants');
      return;
    }
    
    // Perform final availability check before booking
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const finalAvailability = await BookingService.checkDateAvailability(adventure.id, dateStr);
      
      // If there's an error checking availability, proceed with optimistic booking
      if (finalAvailability.error) {
        console.warn('Could not verify final availability, proceeding with booking');
      } else {
        // Only block if we can successfully verify the date is unavailable
        if (!finalAvailability.isAvailable) {
          toast.error('This date is no longer available. Please select another date.');
          return;
        }
        
        if (participants > finalAvailability.remainingSpots) {
          toast.error(`Only ${finalAvailability.remainingSpots} spots available for this date`);
          return;
        }
      }
    } catch (error) {
      console.warn('Error checking final availability, proceeding with booking:', error);
      // Continue with booking - database constraints will handle conflicts
    }
    
    const formData: BookingFormData = {
      selectedDate: format(selectedDate, 'yyyy-MM-dd'),
      selectedTime,
      participants,
      leadGuest: { name: '', email: '', phone: '' },
      guestDetails: {
        dietaryRestrictions: [],
        experienceLevel: '',
        emergencyContact: { name: '', phone: '' }
      },
      selectedAddOns: [],
      specialRequests: '',
      notifications: { email: true, sms: false, whatsapp: false },
      promoCode: promoCode,
      appliedPromotion: appliedPromo
    };
    
    onBookingStart(formData);
    
    // Refresh disabled dates after starting booking process
    await refreshDisabledDates();
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    const minDate = addDays(today, 1); // Must book at least 1 day in advance
    const maxDate = addDays(today, adventure.max_advance_booking_days);
    
    // Check basic date range constraints
    if (isBefore(date, minDate) || isAfter(date, maxDate)) {
      return true;
    }
    
    // Check if date is in the disabled dates list (blocked, fully booked, or user conflict)
    return disabledDates.some(disabledDate => 
      disabledDate.toDateString() === date.toDateString()
    );
  };

  const getDateAvailabilityStatus = () => {
    if (!selectedDate) return null;
    
    if (availableSpots === 0) {
      return { status: 'full', message: 'Fully booked', color: 'bg-red-100 text-red-800' };
    } else if (availableSpots <= 3) {
      return { status: 'limited', message: `Only ${availableSpots} spots left`, color: 'bg-orange-100 text-orange-800' };
    } else {
      return { status: 'available', message: `${availableSpots} spots available`, color: 'bg-green-100 text-green-800' };
    }
  };

  const availabilityStatus = getDateAvailabilityStatus();

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-2xl">
            From ${adventure.base_price}
            <span className="text-lg font-normal text-gray-500">/person</span>
          </span>
          {adventure.early_bird_discount_percentage > 0 && (
            <Badge className="bg-red-500 text-white animate-pulse">
              {adventure.early_bird_discount_percentage}% OFF
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Date Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Select Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelection}
                disabled={isDateDisabled}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          {selectedDate && selectedDateAvailability && (
            <Badge className={selectedDateAvailability.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {selectedDateAvailability.isAvailable 
                ? selectedDateAvailability.remainingSpots === 1
                  ? '1 spot remaining'
                  : `${selectedDateAvailability.remainingSpots} spots remaining`
                : 'Fully booked'
              }
            </Badge>
          )}
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select Time</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a time" />
              </SelectTrigger>
              <SelectContent>
                {availableTimes.map((time) => (
                  <SelectItem key={time.value} value={time.value}>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{time.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Participants */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Number of Participants</Label>
          <Select value={participants.toString()} onValueChange={(value) => setParticipants(parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: Math.min(adventure.max_participants, availableSpots || adventure.max_participants) }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{i + 1} {i + 1 === 1 ? 'Person' : 'People'}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Promo Code */}
        <div className="space-y-2">
          {!showPromoInput ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowPromoInput(true)}
            >
              <Gift className="w-4 h-4 mr-2" />
              Have a promo code?
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Input
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="flex-1"
              />
              <Button
                onClick={handlePromoCodeSubmit}
                disabled={isLoading}
                size="sm"
              >
                Apply
              </Button>
            </div>
          )}
          
          {appliedPromo && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Gift className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  {appliedPromo.name} applied!
                </span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                {appliedPromo.description}
              </p>
            </div>
          )}
        </div>

        {/* Pricing Breakdown */}
        {pricing && (
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium">Pricing Breakdown</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>${adventure.base_price} x {participants} person{participants > 1 ? 's' : ''}</span>
                <span>${pricing.subtotal.toFixed(2)}</span>
              </div>
              
              {pricing.groupDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Group discount</span>
                  <span>-${pricing.groupDiscount.toFixed(2)}</span>
                </div>
              )}
              
              {pricing.earlyBirdDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Early bird discount</span>
                  <span>-${pricing.earlyBirdDiscount.toFixed(2)}</span>
                </div>
              )}
              
              {pricing.promoDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Promo discount</span>
                  <span>-${pricing.promoDiscount.toFixed(2)}</span>
                </div>
              )}
              
              {pricing.addOnsTotal > 0 && (
                <div className="flex justify-between">
                  <span>Add-ons</span>
                  <span>${pricing.addOnsTotal.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Taxes & fees</span>
                <span>${pricing.taxAmount.toFixed(2)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${pricing.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Important Information */}
        <div className="space-y-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Free cancellation up to 24 hours before</p>
              <p className="text-xs text-blue-700 mt-1">
                Get a full refund if you cancel at least 24 hours in advance.
              </p>
            </div>
          </div>
        </div>

        {/* Book Now Button */}
        <Button 
          onClick={handleBookNow}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
          disabled={
            !selectedDate || 
            !selectedTime || 
            participants < 1
            // Removed availability checks - let user proceed and check at final confirmation
          }
        >
          <CreditCard className="w-5 h-5 mr-2" />
          {pricing ? `Book Now - $${pricing.totalAmount.toFixed(2)}` : 'Book Now'}
        </Button>
        
        <div className="text-center text-xs text-gray-500">
          You won't be charged yet
        </div>
      </CardContent>
    </Card>
  );
};