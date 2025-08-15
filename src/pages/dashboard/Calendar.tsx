import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { CalendarDays, MapPin, Users, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';

interface CalendarBooking {
  id: string;
  tour_date: string;
  total_amount: number;
  status: string;
  group_size: number;
  tours: {
    id: string;
    title: string;
    location: string;
    duration: string;
  };
  users: {
    id: string;
    email: string;
    full_name?: string;
  };
}

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['calendar-bookings', selectedDate],
    queryFn: async () => {
      const start = startOfMonth(selectedDate);
      const end = endOfMonth(selectedDate);

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          tours:tour_id (
            id,
            title,
            location,
            duration
          ),
          users:user_id (
            id,
            email,
            full_name
          )
        `)
        .gte('tour_date', start.toISOString())
        .lte('tour_date', end.toISOString())
        .order('tour_date', { ascending: true });

      if (error) throw error;
      return data as CalendarBooking[];
    },
  });

  const getBookingsForDate = (date: Date) => {
    if (!bookings) return [];
    return bookings.filter(booking => 
      isSameDay(parseISO(booking.tour_date), date)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BZ', {
      style: 'currency',
      currency: 'BZD',
    }).format(amount);
  };

  const hasBookings = (date: Date) => {
    return getBookingsForDate(date).length > 0;
  };

  const selectedDateBookings = getBookingsForDate(selectedDate);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-sm text-gray-600">Loading calendar...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            View and manage tour bookings by date
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'month' ? 'default' : 'outline'}
            onClick={() => setViewMode('month')}
          >
            Month
          </Button>
          <Button
            variant={viewMode === 'week' ? 'default' : 'outline'}
            onClick={() => setViewMode('week')}
          >
            Week
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Component */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{format(selectedDate, 'MMMM yyyy')}</span>
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              modifiers={{
                hasBookings: (date) => hasBookings(date),
              }}
              modifiersStyles={{
                hasBookings: {
                  backgroundColor: 'rgb(59 130 246 / 0.1)',
                  color: 'rgb(59 130 246)',
                  fontWeight: 'bold',
                }
              }}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Selected Date Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5" />
              <span>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
            </CardTitle>
            <CardDescription>
              {selectedDateBookings.length === 0 
                ? 'No bookings scheduled for this date'
                : `${selectedDateBookings.length} booking${selectedDateBookings.length === 1 ? '' : 's'} scheduled`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDateBookings.length === 0 ? (
              <div className="text-center py-8">
                <CalendarDays className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No tours scheduled for this date</p>
                <Button variant="outline" className="mt-4">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Schedule Tour
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateBookings.map((booking) => (
                  <Card key={booking.id} className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold flex items-center space-x-2">
                            <span>{booking.tours?.title}</span>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Customer: {booking.users?.full_name || booking.users?.email}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(booking.total_amount)}</p>
                          <p className="text-sm text-muted-foreground">
                            Booking: {booking.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.tours?.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.group_size} guests</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.tours?.duration}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Summary</CardTitle>
          <CardDescription>
            Booking overview for {format(selectedDate, 'MMMM yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{bookings?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {bookings?.filter(b => b.status === 'confirmed').length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Confirmed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {bookings?.filter(b => b.status === 'pending').length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {formatCurrency(
                  bookings?.reduce((sum, b) => sum + b.total_amount, 0) || 0
                )}
              </p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;