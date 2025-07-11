import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Clock, Users, AlertCircle } from 'lucide-react';
import { format, addDays, isAfter, isBefore } from 'date-fns';
import { Adventure, BookingFormData } from '@/types/booking';
import { BookingService } from '@/services/bookingService';

interface BookingStepOneProps {
  adventure: Adventure;
  formData: BookingFormData;
  onUpdate: (updates: Partial<BookingFormData>) => void;
}

export const BookingStepOne: React.FC<BookingStepOneProps> = ({
  adventure,
  formData,
  onUpdate
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    formData.selectedDate ? new Date(formData.selectedDate) : undefined
  );
  const [availableSpots, setAvailableSpots] = useState<number>(0);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  const timeSlots = [
    { value: '09:00', label: '9:00 AM', description: 'Morning departure' },
    { value: '12:00', label: '12:00 PM', description: 'Afternoon departure' },
    { value: '15:00', label: '3:00 PM', description: 'Late afternoon departure' },
  ];

  useEffect(() => {
    if (selectedDate) {
      checkAvailability();
    }
  }, [selectedDate]);

  const checkAvailability = async () => {
    if (!selectedDate) return;
    
    setIsCheckingAvailability(true);
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const spots = await BookingService.getAvailableSpots(adventure.id, dateStr);
    setAvailableSpots(spots);
    setIsCheckingAvailability(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      onUpdate({ selectedDate: format(date, 'yyyy-MM-dd') });
    }
  };

  const handleTimeSelect = (time: string) => {
    onUpdate({ selectedTime: time });
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    const minDate = addDays(today, 1); // Must book at least 1 day in advance
    const maxDate = addDays(today, adventure.max_advance_booking_days);
    
    return isBefore(date, minDate) || isAfter(date, maxDate);
  };

  const getAvailabilityStatus = () => {
    if (!selectedDate) return null;
    
    if (isCheckingAvailability) {
      return { status: 'loading', message: 'Checking availability...', color: 'bg-blue-100 text-blue-800' };
    }
    
    if (availableSpots === 0) {
      return { status: 'full', message: 'Fully booked', color: 'bg-red-100 text-red-800' };
    } else if (availableSpots <= 3) {
      return { status: 'limited', message: `Only ${availableSpots} spots left`, color: 'bg-orange-100 text-orange-800' };
    } else {
      return { status: 'available', message: `${availableSpots} spots available`, color: 'bg-green-100 text-green-800' };
    }
  };

  const availabilityStatus = getAvailabilityStatus();

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2" />
            Select Your Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Calendar */}
            <div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={isDateDisabled}
                className="rounded-md border"
              />
            </div>
            
            {/* Date Info */}
            <div className="space-y-4">
              {selectedDate ? (
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </h3>
                    
                    {availabilityStatus && (
                      <Badge className={availabilityStatus.color}>
                        {availabilityStatus.message}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Weather Info (Mock) */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Weather Forecast</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>🌤️ 82°F</span>
                      <span>•</span>
                      <span>Partly cloudy</span>
                      <span>•</span>
                      <span>10% chance of rain</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <CalendarIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600">Select a date to check availability</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Selection */}
      {selectedDate && availableSpots > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Choose Your Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {timeSlots.map((slot) => (
                <button
                  key={slot.value}
                  onClick={() => handleTimeSelect(slot.value)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    formData.selectedTime === slot.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold">{slot.label}</div>
                  <div className="text-sm text-gray-600">{slot.description}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {adventure.duration_hours} hours
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Important Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Important Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Booking Window:</strong> Book at least 24 hours in advance, up to {adventure.max_advance_booking_days} days ahead
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Free Cancellation:</strong> Cancel up to 24 hours before your adventure for a full refund
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Group Size:</strong> Maximum {adventure.max_participants} participants per session
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Meeting Point:</strong> {adventure.meeting_point || 'Details will be provided after booking'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Early Bird Discount */}
      {adventure.early_bird_discount_percentage > 0 && selectedDate && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">%</span>
              </div>
              <div>
                <h3 className="font-semibold text-green-800">
                  Early Bird Special: {adventure.early_bird_discount_percentage}% Off!
                </h3>
                <p className="text-sm text-green-700">
                  Book {adventure.early_bird_days} days in advance and save on your adventure
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};