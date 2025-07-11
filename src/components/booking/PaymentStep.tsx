import React, { useState, useEffect } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Apple, 
  Smartphone, 
  Shield, 
  AlertCircle,
  CheckCircle,
  Loader2 
} from 'lucide-react';
import { Adventure, BookingFormData, PricingBreakdown } from '@/types/booking';
import { PaymentService, createPaymentMetadata } from '@/services/paymentService';
import stripePromise from '@/lib/stripe';
import { toast } from 'sonner';

interface PaymentStepProps {
  adventure: Adventure;
  formData: BookingFormData;
  pricing: PricingBreakdown;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onBack: () => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const PaymentForm: React.FC<PaymentStepProps> = ({ 
  adventure, 
  formData, 
  pricing, 
  onPaymentSuccess,
  onBack 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'google_pay'>('card');
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [billingDetails, setBillingDetails] = useState({
    name: formData.leadGuest.name,
    email: formData.leadGuest.email,
    phone: formData.leadGuest.phone,
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US',
    },
  });

  useEffect(() => {
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      const metadata = createPaymentMetadata(adventure, formData, pricing);
      const result = await PaymentService.createPaymentIntent({
        amount: pricing.totalAmount,
        currency: 'usd',
        adventureId: adventure.id,
        bookingData: formData,
        metadata,
      });

      if (result.success && result.clientSecret) {
        setPaymentIntentId(result.paymentIntentId!);
        setClientSecret(result.clientSecret);
      } else {
        setError(result.error || 'Failed to initialize payment');
      }
    } catch (error) {
      setError('Failed to initialize payment');
      console.error('Payment intent creation error:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: billingDetails,
          },
        }
      );

      if (paymentError) {
        setError(paymentError.message || 'Payment failed');
        toast.error('Payment failed: ' + paymentError.message);
      } else if (paymentIntent.status === 'succeeded') {
        toast.success('Payment successful!');
        onPaymentSuccess(paymentIntent.id);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setError(errorMessage);
      toast.error('Payment failed: ' + errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplePayClick = async () => {
    if (!stripe) return;

    setIsProcessing(true);
    try {
      const paymentRequest = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: `${adventure.title} - ${formData.participants} participant${formData.participants > 1 ? 's' : ''}`,
          amount: Math.round(pricing.totalAmount * 100),
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      const result = await paymentRequest.canMakePayment();
      if (result) {
        paymentRequest.show();
      } else {
        toast.error('Apple Pay is not available on this device');
      }
    } catch (error) {
      toast.error('Apple Pay setup failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGooglePayClick = async () => {
    if (!stripe) return;

    setIsProcessing(true);
    try {
      const paymentRequest = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: `${adventure.title} - ${formData.participants} participant${formData.participants > 1 ? 's' : ''}`,
          amount: Math.round(pricing.totalAmount * 100),
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      const result = await paymentRequest.canMakePayment();
      if (result && result.googlePay) {
        paymentRequest.show();
      } else {
        toast.error('Google Pay is not available on this device');
      }
    } catch (error) {
      toast.error('Google Pay setup failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Initializing payment...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Choose Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant={paymentMethod === 'card' ? 'default' : 'outline'}
              className="h-16 flex flex-col items-center justify-center space-y-1"
              onClick={() => setPaymentMethod('card')}
            >
              <CreditCard className="w-6 h-6" />
              <span className="text-sm">Credit Card</span>
            </Button>
            
            <Button
              variant={paymentMethod === 'apple_pay' ? 'default' : 'outline'}
              className="h-16 flex flex-col items-center justify-center space-y-1"
              onClick={() => setPaymentMethod('apple_pay')}
            >
              <Apple className="w-6 h-6" />
              <span className="text-sm">Apple Pay</span>
            </Button>
            
            <Button
              variant={paymentMethod === 'google_pay' ? 'default' : 'outline'}
              className="h-16 flex flex-col items-center justify-center space-y-1"
              onClick={() => setPaymentMethod('google_pay')}
            >
              <Smartphone className="w-6 h-6" />
              <span className="text-sm">Google Pay</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {paymentMethod === 'card' && (
          <Card>
            <CardHeader>
              <CardTitle>Card Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 border rounded-lg">
                <CardElement options={CARD_ELEMENT_OPTIONS} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cardholder-name">Cardholder Name</Label>
                  <Input
                    id="cardholder-name"
                    value={billingDetails.name}
                    onChange={(e) => setBillingDetails({
                      ...billingDetails,
                      name: e.target.value,
                    })}
                    placeholder="Name on card"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={billingDetails.email}
                    onChange={(e) => setBillingDetails({
                      ...billingDetails,
                      email: e.target.value,
                    })}
                    placeholder="Email address"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {paymentMethod === 'apple_pay' && (
          <Card>
            <CardContent className="pt-6">
              <Button
                type="button"
                onClick={handleApplePayClick}
                disabled={isProcessing}
                className="w-full h-12 bg-black text-white hover:bg-gray-800"
              >
                <Apple className="w-5 h-5 mr-2" />
                Pay with Apple Pay
              </Button>
            </CardContent>
          </Card>
        )}

        {paymentMethod === 'google_pay' && (
          <Card>
            <CardContent className="pt-6">
              <Button
                type="button"
                onClick={handleGooglePayClick}
                disabled={isProcessing}
                className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700"
              >
                <Smartphone className="w-5 h-5 mr-2" />
                Pay with Google Pay
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Billing Address */}
        {paymentMethod === 'card' && (
          <Card>
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address-line1">Address</Label>
                <Input
                  id="address-line1"
                  value={billingDetails.address.line1}
                  onChange={(e) => setBillingDetails({
                    ...billingDetails,
                    address: { ...billingDetails.address, line1: e.target.value },
                  })}
                  placeholder="Street address"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={billingDetails.address.city}
                    onChange={(e) => setBillingDetails({
                      ...billingDetails,
                      address: { ...billingDetails.address, city: e.target.value },
                    })}
                    placeholder="City"
                  />
                </div>
                
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={billingDetails.address.state}
                    onChange={(e) => setBillingDetails({
                      ...billingDetails,
                      address: { ...billingDetails.address, state: e.target.value },
                    })}
                    placeholder="State"
                  />
                </div>
                
                <div>
                  <Label htmlFor="postal-code">ZIP Code</Label>
                  <Input
                    id="postal-code"
                    value={billingDetails.address.postal_code}
                    onChange={(e) => setBillingDetails({
                      ...billingDetails,
                      address: { ...billingDetails.address, postal_code: e.target.value },
                    })}
                    placeholder="ZIP Code"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Security Information */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Secure Payment</span>
            </div>
            <p className="text-sm text-green-700">
              Your payment information is encrypted and secure. We never store your card details.
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            Back
          </Button>
          
          {paymentMethod === 'card' && (
            <Button
              type="submit"
              disabled={!stripe || isProcessing}
              className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay ${pricing.totalAmount.toFixed(2)}
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export const PaymentStep: React.FC<PaymentStepProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
};