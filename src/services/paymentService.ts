import Stripe from 'stripe';
import { BookingFormData, Adventure, PricingBreakdown } from '@/types/booking';

// Payment Intent types
export interface PaymentIntentData {
  amount: number;
  currency: string;
  adventureId: string;
  bookingData: BookingFormData;
  metadata: Record<string, string>;
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  clientSecret?: string;
  error?: string;
}

export interface PaymentMethodData {
  id: string;
  type: 'card' | 'apple_pay' | 'google_pay' | 'link';
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export class PaymentService {
  private static stripe: Stripe | null = null;

  private static initializeStripe(): Stripe {
    if (!this.stripe) {
      const secretKey = import.meta.env.STRIPE_SECRET_KEY || '';
      if (!secretKey) {
        throw new Error('Stripe secret key not found in environment variables');
      }
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2023-10-16',
      });
    }
    return this.stripe;
  }

  static async createPaymentIntent(data: PaymentIntentData): Promise<PaymentResult> {
    try {
      const stripe = this.initializeStripe();
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: data.currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          adventureId: data.adventureId,
          participants: data.bookingData.participants.toString(),
          selectedDate: data.bookingData.selectedDate,
          selectedTime: data.bookingData.selectedTime,
          leadGuestEmail: data.bookingData.leadGuest.email,
          ...data.metadata,
        },
      });

      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret!,
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  static async updatePaymentIntent(
    paymentIntentId: string,
    amount: number,
    metadata?: Record<string, string>
  ): Promise<PaymentResult> {
    try {
      const stripe = this.initializeStripe();
      
      const paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
        amount: Math.round(amount * 100),
        metadata: metadata || {},
      });

      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret!,
      };
    } catch (error) {
      console.error('Error updating payment intent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  static async confirmPayment(
    paymentIntentId: string,
    paymentMethodId: string
  ): Promise<PaymentResult> {
    try {
      const stripe = this.initializeStripe();
      
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });

      return {
        success: paymentIntent.status === 'succeeded',
        paymentIntentId: paymentIntent.id,
        error: paymentIntent.status === 'succeeded' ? undefined : 'Payment failed',
      };
    } catch (error) {
      console.error('Error confirming payment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  static async getPaymentMethod(paymentMethodId: string): Promise<PaymentMethodData | null> {
    try {
      const stripe = this.initializeStripe();
      
      const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
      
      return {
        id: paymentMethod.id,
        type: paymentMethod.type as 'card' | 'apple_pay' | 'google_pay' | 'link',
        card: paymentMethod.card ? {
          brand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4,
          exp_month: paymentMethod.card.exp_month,
          exp_year: paymentMethod.card.exp_year,
        } : undefined,
      };
    } catch (error) {
      console.error('Error retrieving payment method:', error);
      return null;
    }
  }

  static async refundPayment(
    paymentIntentId: string,
    amount?: number,
    reason?: string
  ): Promise<PaymentResult> {
    try {
      const stripe = this.initializeStripe();
      
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
        reason: reason as Stripe.RefundCreateParams.Reason,
      });

      return {
        success: refund.status === 'succeeded',
        paymentIntentId: refund.payment_intent as string,
        error: refund.status === 'succeeded' ? undefined : 'Refund failed',
      };
    } catch (error) {
      console.error('Error creating refund:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  static async createSetupIntent(customerId?: string): Promise<PaymentResult> {
    try {
      const stripe = this.initializeStripe();
      
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
      });

      return {
        success: true,
        paymentIntentId: setupIntent.id,
        clientSecret: setupIntent.client_secret!,
      };
    } catch (error) {
      console.error('Error creating setup intent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  static calculateStripeFee(amount: number): number {
    // Stripe fees: 2.9% + 30¢ for US cards
    return Math.round((amount * 0.029 + 0.30) * 100) / 100;
  }

  static formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  static async validateWebhook(payload: string, signature: string): Promise<boolean> {
    try {
      const stripe = this.initializeStripe();
      const endpointSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;
      
      if (!endpointSecret) {
        throw new Error('Webhook secret not configured');
      }

      stripe.webhooks.constructEvent(payload, signature, endpointSecret);
      return true;
    } catch (error) {
      console.error('Webhook validation failed:', error);
      return false;
    }
  }
}

// Helper function to create payment metadata
export const createPaymentMetadata = (
  adventure: Adventure,
  bookingData: BookingFormData,
  pricing: PricingBreakdown
): Record<string, string> => {
  return {
    adventureTitle: adventure.title,
    adventureLocation: adventure.location,
    bookingDate: bookingData.selectedDate,
    bookingTime: bookingData.selectedTime,
    participants: bookingData.participants.toString(),
    leadGuestName: bookingData.leadGuest.name,
    leadGuestEmail: bookingData.leadGuest.email,
    leadGuestPhone: bookingData.leadGuest.phone,
    subtotal: pricing.subtotal.toString(),
    totalAmount: pricing.totalAmount.toString(),
    promoCode: bookingData.promoCode || '',
    promoDiscount: pricing.promoDiscount.toString(),
    addOnsCount: bookingData.selectedAddOns.length.toString(),
    addOnsTotal: pricing.addOnsTotal.toString(),
  };
};