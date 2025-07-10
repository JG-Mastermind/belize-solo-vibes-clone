
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const bookingId = searchParams.get('booking');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            adventures (
              title,
              location
            )
          `)
          .eq('id', bookingId)
          .single();

        if (error) throw error;
        
        setBooking(data);

        // Update booking status to confirmed
        await supabase
          .from('bookings')
          .update({ status: 'confirmed' })
          .eq('id', bookingId);

      } catch (error) {
        console.error('Error fetching booking:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading your booking confirmation...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="text-center bg-green-50">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-green-800">
              🎉 Booking & Payment Confirmed!
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            {booking ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Booking Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Adventure</p>
                    <p className="font-semibold">{booking.adventures?.title}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600">Location</p>
                    <p className="font-semibold">{booking.adventures?.location}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600">Date</p>
                    <p className="font-semibold">
                      {new Date(booking.booking_date).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600">Travelers</p>
                    <p className="font-semibold">{booking.participants} person(s)</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Amount</p>
                    <p className="font-semibold text-green-600">${booking.total_amount}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <p className="font-semibold text-green-600 capitalize">{booking.status}</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    You'll receive a confirmation email shortly with all the details and next steps.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-600 mb-6">
                You'll receive an email shortly with all the details.
              </p>
            )}

            <div className="text-center mt-8">
              <Link to="/">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8">
                  Explore More Adventures
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
