import { loadStripe } from '@stripe/stripe-js';

// Environment-based Stripe configuration
const isProduction = import.meta.env.NODE_ENV === 'production' || import.meta.env.PROD;
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

// Validate Stripe keys to prevent test keys in production
const validateStripeKey = (key: string): boolean => {
  if (!key) return false;
  
  const isTestKey = key.startsWith('pk_test_');
  const isLiveKey = key.startsWith('pk_live_');
  
  if (isProduction && isTestKey) {
    console.error('🚨 ERROR: Test Stripe key detected in production environment!');
    console.error('Please update VITE_STRIPE_PUBLISHABLE_KEY with production key');
    return false;
  }
  
  if (!isProduction && isLiveKey) {
    console.warn('⚠️ WARNING: Live Stripe key detected in development environment');
    console.warn('Consider using test keys for development');
  }
  
  return isTestKey || isLiveKey;
};

// Validate the key before initializing Stripe
if (!validateStripeKey(stripePublishableKey)) {
  throw new Error(
    isProduction 
      ? 'Invalid or test Stripe key in production. Please configure production keys.'
      : 'Invalid Stripe publishable key. Please check your environment configuration.'
  );
}

// Initialize Stripe with validated key
const stripePromise = loadStripe(stripePublishableKey);

// Log the current environment and key type (without exposing full key)
const keyType = stripePublishableKey.startsWith('pk_test_') ? 'test' : 
               stripePublishableKey.startsWith('pk_live_') ? 'live' : 'unknown';

console.log(`🔑 Stripe initialized in ${isProduction ? 'production' : 'development'} mode with ${keyType} key`);

export default stripePromise;

// Export utility functions for other parts of the app
export const getStripeKeyType = () => keyType;
export const isProductionStripe = () => isProduction && keyType === 'live';
export const isDevelopmentStripe = () => !isProduction && keyType === 'test';