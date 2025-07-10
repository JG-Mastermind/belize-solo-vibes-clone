
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// This should be your Stripe publishable key
// For development, you can use Stripe's test key
const stripePromise = loadStripe('pk_test_51HdSGjxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

interface StripeProviderProps {
  children: React.ReactNode;
  clientSecret?: string;
}

export const StripeProvider: React.FC<StripeProviderProps> = ({ 
  children, 
  clientSecret 
}) => {
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: 'hsl(var(--primary))',
        colorBackground: 'hsl(var(--background))',
        colorText: 'hsl(var(--foreground))',
        colorDanger: 'hsl(var(--destructive))',
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '6px',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={clientSecret ? options : undefined}>
      {children}
    </Elements>
  );
};
