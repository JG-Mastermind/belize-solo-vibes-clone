
import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { adventures } from '@/data/adventures';

export interface BookingData {
  adventureId: string;
  bookingDate: Date;
  fullName: string;
  email: string;
  phone: string;
  numberOfTravelers: number;
  specialRequests?: string;
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
      // Check if the adventure exists in the database first
      let adventurePrice = null;
      const { data: dbAdventure } = await supabase
        .from('adventures')
        .select('price_per_person')
        .eq('id', bookingData.adventureId)
        .single();

      if (dbAdventure) {
        adventurePrice = dbAdventure.price_per_person;
      } else {
        // Fallback to local adventure data
        const localAdventure = adventures.find(adv => adv.id.toString() === bookingData.adventureId);
        if (localAdventure) {
          adventurePrice = parseFloat(localAdventure.price.replace('$', ''));
        } else {
          throw new Error('Adventure not found');
        }
      }

      const totalAmount = adventurePrice * bookingData.numberOfTravelers;

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          adventure_id: bookingData.adventureId,
          booking_date: bookingData.bookingDate.toISOString().split('T')[0],
          participants: bookingData.numberOfTravelers,
          total_amount: totalAmount,
          special_requests: bookingData.specialRequests || null,
          status: 'pending',
          payment_status: 'pending'
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
