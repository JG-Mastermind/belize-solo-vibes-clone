
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useStripePayment = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createPaymentSession = async (bookingId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { bookingId }
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating payment session:', error);
      toast.error('Failed to create payment session');
    } finally {
      setIsLoading(false);
    }
  };

  const createPaymentIntent = async (bookingId: string, amount: number) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: { 
          bookingId,
          amount,
          currency: 'usd'
        }
      });

      if (error) throw error;

      return {
        clientSecret: data?.clientSecret,
        paymentIntentId: data?.clientSecret?.split('_secret_')[0]
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      toast.error('Failed to create payment intent');
      return { clientSecret: null, paymentIntentId: null };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPaymentSession,
    createPaymentIntent,
    isLoading
  };
};
