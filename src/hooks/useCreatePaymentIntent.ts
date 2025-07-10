
import { useState } from 'react';
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
      // For now, we'll create a mock client secret for testing
      // In production, this would call your backend to create a real payment intent
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock client secret (in production, this comes from Stripe)
      const mockClientSecret = `pi_test_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`;
      
      setClientSecret(mockClientSecret);
      
      console.log('Mock Payment Intent created:', {
        clientSecret: mockClientSecret,
        amount: data.totalAmount * 100, // Stripe uses cents
        adventure: data.adventureTitle,
        email: data.userEmail
      });
      
      return { clientSecret: mockClientSecret };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      toast.error('Failed to initialize payment');
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
