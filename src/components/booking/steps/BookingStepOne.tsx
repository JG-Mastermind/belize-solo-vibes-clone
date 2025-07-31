import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Clock, Users, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation(['booking']);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    formData.selectedDate ? new Date(formData.selectedDate) : undefined
  );
  const [availableSpots, setAvailableSpots] = useState<number>(0);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  const timeSlots = [
    { value: '09:00', label: '9:00 AM', description: t('booking:step1.timeSlots.morningDeparture') },
    { value: '12:00', label: '12:00 PM', description: t('booking:step1.timeSlots.afternoonDeparture') },
    { value: '15:00', label: '3:00 PM', description: t('booking:step1.timeSlots.lateAfternoonDeparture') },
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
      return { status: 'loading', message: t('booking:step1.availability.checkingAvailability'), color: 'bg-primary/10 text-primary' };
    }
    
    if (availableSpots === 0) {
      return { status: 'full', message: t('booking:step1.availability.fullyBooked'), color: 'bg-destructive/10 text-destructive' };
    } else if (availableSpots <= 3) {
      return { status: 'limited', message: t('booking:step1.availability.onlyXSpotsLeft', { count: availableSpots }), color: 'bg-orange-100 text-orange-800 spots-available' };
    } else {
      return { status: 'available', message: t('booking:step1.availability.xSpotsAvailable', { count: availableSpots }), color: 'bg-primary/10 text-green-500 hover:bg-gray-800' };
    }
  };

  const availabilityStatus = getAvailabilityStatus();

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-orange-400" />
{t('booking:step1.selectDate')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2 flex justify-center items-start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={isDateDisabled}
                className="rounded-md border"
                showOutsideDays={true}
                fixedWeeks={true}
              />
            </div>
            
            {/* Date Info */}
            <div className="space-y-4">
              {selectedDate ? (
                <div className="space-y-3">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </h3>
                    
                    {availabilityStatus && (
                      <Badge className={availabilityStatus.color}>
                        {availabilityStatus.message}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Weather Info (Mock) */}
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">{t('booking:step1.weatherForecast')}</h4>
                    <div className="flex items-center space-x-2 text-sm text-green-500">
                      <span>🌤️ 82°F</span>
                      <span>•</span>
                      <span>{t('booking:step1.weather.partlyCloudy')}</span>
                      <span>•</span>
                      <span>10% chance of rain</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-muted rounded-lg text-center">
                  <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">{t('booking:step1.selectDateToCheck')}</p>
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
              <Clock className="w-5 h-5 mr-2 text-orange-400" />
              {t('booking:step1.chooseTime')}
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
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-border/70'
                  }`}
                >
                  <div className="font-semibold">{slot.label}</div>
                  <div className="text-sm text-muted-foreground">{slot.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {t('booking:step1.duration.hours', { count: adventure.duration_hours })}
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
            <AlertCircle className="w-5 h-5 mr-2 text-orange-400" />
            {t('booking:step1.importantInfo')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm important-info">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>{t('booking:step1.info.bookingWindow')}</strong> {t('booking:step1.info.bookingWindowDesc', { days: adventure.max_advance_booking_days })}
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>{t('booking:step1.info.freeCancellation')}</strong> {t('booking:step1.info.freeCancellationDesc')}
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>{t('booking:step1.info.groupSize')}</strong> {t('booking:step1.info.groupSizeDesc', { count: adventure.max_participants })}
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>{t('booking:step1.info.meetingPoint')}</strong> {adventure.meeting_point || t('booking:step1.info.meetingPointFallback')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Early Bird Discount */}
      {adventure.early_bird_discount_percentage > 0 && selectedDate && (
        <Card className="border-primary bg-primary/10">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">%</span>
              </div>
              <div>
                <h3 className="font-semibold text-green-800">
                  {t('booking:step1.earlyBird.title', { percent: adventure.early_bird_discount_percentage })}
                </h3>
                <p className="text-sm text-green-700">
                  {t('booking:step1.earlyBird.description', { days: adventure.early_bird_days })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};