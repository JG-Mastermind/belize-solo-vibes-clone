
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaymentIntentData {
  adventureTitle: string;
  totalAmount: number;
  userEmail: string;
  bookingId?: string;
}

export const useCreatePaymentIntent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const createPaymentIntent = async (data: PaymentIntentData) => {
    setIsLoading(true);
    try {
      console.log('Creating payment intent for:', data);
      
      const { data: result, error } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          bookingId: data.bookingId,
          amount: data.totalAmount,
          currency: 'usd'
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to create payment intent');
      }

      if (!result?.clientSecret) {
        throw new Error('No client secret returned from payment service');
      }
      
      setClientSecret(result.clientSecret);
      
      console.log('Payment Intent created successfully');
      
      return { clientSecret: result.clientSecret };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      toast.error('Failed to initialize payment: ' + (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPaymentIntent,
    clientSecret,
    isLoading
  };
};
