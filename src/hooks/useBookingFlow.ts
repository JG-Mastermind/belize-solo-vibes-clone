
import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BookingData {
  adventureId: string;
  bookingDate: Date;
  fullName: string;
  email: string;
  phone: string;
  numberOfTravelers: number;
}

export const useBookingFlow = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const createBooking = async (bookingData: BookingData) => {
    if (!user) {
      toast.error('Please sign in to make a booking');
      return null;
    }

    setIsLoading(true);
    try {
      const { data: adventure } = await supabase
        .from('adventures')
        .select('price_per_person')
        .eq('id', bookingData.adventureId)
        .single();

      if (!adventure) {
        throw new Error('Adventure not found');
      }

      const totalAmount = adventure.price_per_person * bookingData.numberOfTravelers;

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          adventure_id: bookingData.adventureId,
          booking_date: bookingData.bookingDate.toISOString().split('T')[0],
          participants: bookingData.numberOfTravelers,
          total_amount: totalAmount,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Booking created successfully!');
      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createBooking,
    isLoading,
    isAuthenticated: !!user
  };
};
