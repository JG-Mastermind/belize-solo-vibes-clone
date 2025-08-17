import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Users, DollarSign, Clock, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/components/auth/AuthProvider';

interface Booking {
  id: string;
  tour_date: string;
  total_amount: number;
  status: string;
  group_size: number;
  special_requests?: string;
  created_at: string;
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

const Bookings = () => {
  const { getUserRole } = useAuth();
  const userRole = getUserRole();

  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['dashboard-bookings'],
    queryFn: async () => {
      let query = supabase
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
        .order('created_at', { ascending: false });

      // If user is not admin, filter to their bookings only
      if (userRole !== 'admin' && userRole !== 'super_admin') {
        const { data: user } = await supabase.auth.getUser();
        if (user.user) {
          query = query.eq('user_id', user.user.id);
        }
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Booking[];
    },
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-sm text-gray-600">Loading bookings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 mb-4">
          <CalendarDays className="h-12 w-12 mx-auto mb-2" />
          <p>Failed to load bookings</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">
            {userRole === 'admin' || userRole === 'super_admin' 
              ? 'Manage all customer bookings and reservations'
              : 'View your bookings and reservations'
            }
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <Badge className="bg-green-100 text-green-800">
              {bookings?.filter(b => b.status === 'confirmed').length || 0}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(
                bookings?.filter(b => b.status === 'confirmed')
                  .reduce((sum, b) => sum + b.total_amount, 0) || 0
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Badge className="bg-yellow-100 text-yellow-800">
              {bookings?.filter(b => b.status === 'pending').length || 0}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(
                bookings?.filter(b => b.status === 'pending')
                  .reduce((sum, b) => sum + b.total_amount, 0) || 0
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                bookings?.filter(b => {
                  const bookingDate = new Date(b.created_at);
                  const now = new Date();
                  return bookingDate.getMonth() === now.getMonth() && 
                         bookingDate.getFullYear() === now.getFullYear();
                }).reduce((sum, b) => sum + b.total_amount, 0) || 0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings List */}
      <div className="grid gap-4">
        {bookings?.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <CalendarDays className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No bookings found</h3>
                <p className="text-gray-500">
                  {userRole === 'admin' || userRole === 'super_admin' 
                    ? 'Bookings will appear here once customers make reservations.'
                    : 'Your bookings will appear here once you make a reservation.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          bookings?.map((booking) => (
            <Card key={booking.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center space-x-2">
                      <span>{booking.tours?.title}</span>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.toUpperCase()}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Booking ID: {booking.id.slice(0, 8)}...
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {format(new Date(booking.tour_date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{booking.tours?.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{booking.group_size} guests</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {formatCurrency(booking.total_amount)}
                    </span>
                  </div>
                </div>
                
                {(userRole === 'admin' || userRole === 'super_admin') && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Customer: {booking.users?.full_name || booking.users?.email}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Booked: {format(new Date(booking.created_at), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                )}

                {booking.special_requests && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-muted-foreground">
                      <strong>Special Requests:</strong> {booking.special_requests}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Bookings;