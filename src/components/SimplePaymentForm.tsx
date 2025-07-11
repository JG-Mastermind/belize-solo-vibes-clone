
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface SimplePaymentFormProps {
  bookingData: {
    adventureTitle: string;
    bookingDate: string;
    participants: number;
    totalAmount: number;
    fullName: string;
    email: string;
  };
  onPaymentSuccess: () => void;
  isLoading?: boolean;
}

export const SimplePaymentForm: React.FC<SimplePaymentFormProps> = ({
  bookingData,
  onPaymentSuccess,
  isLoading = false
}) => {
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [zip, setZip] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, accept test card number
      if (cardNumber === '4242424242424242' || cardNumber === '4242 4242 4242 4242') {
        toast.success('Payment successful!');
        onPaymentSuccess();
      } else {
        throw new Error('Please use test card number: 4242 4242 4242 4242');
      }
    } catch (err) {
      toast.error((err as Error).message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Booking Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-muted-foreground">Adventure</p>
              <p className="font-semibold">{bookingData.adventureTitle}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Date</p>
              <p className="font-semibold">{bookingData.bookingDate}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Travelers</p>
              <p className="font-semibold">{bookingData.participants} person(s)</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Guest</p>
              <p className="font-semibold">{bookingData.fullName}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Amount</span>
              <span className="text-2xl font-bold text-primary">
                ${bookingData.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Payment Information</span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Secured by Stripe
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Lock className="h-3 w-3 mr-1" />
                SSL Encrypted
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Test Mode Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Test Mode</h4>
              <p className="text-sm text-yellow-700 mb-2">
                This is a test payment. Use the following test card:
              </p>
              <div className="bg-white rounded p-2 font-mono text-sm">
                <p><strong>Card Number:</strong> 4242 4242 4242 4242</p>
                <p><strong>Expiry:</strong> Any future date</p>
                <p><strong>CVC:</strong> Any 3 digits</p>
                <p><strong>ZIP:</strong> Any 5 digits</p>
              </div>
            </div>

            {/* Card Input Fields */}
            <div className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium mb-2">
                  Card Number
                </label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                  className="font-mono"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="expiry" className="block text-sm font-medium mb-2">
                    Expiry
                  </label>
                  <Input
                    id="expiry"
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cvc" className="block text-sm font-medium mb-2">
                    CVC
                  </label>
                  <Input
                    id="cvc"
                    type="text"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="zip" className="block text-sm font-medium mb-2">
                    ZIP
                  </label>
                  <Input
                    id="zip"
                    type="text"
                    placeholder="12345"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2 text-sm">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="terms" className="text-muted-foreground">
                I agree to the{' '}
                <a href="/terms" className="text-primary hover:underline">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={processing || isLoading}
              className="w-full h-12 text-lg"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </>
              ) : (
                `Complete Booking - $${bookingData.totalAmount.toFixed(2)}`
              )}
            </Button>

            {/* Security Notice */}
            <div className="text-center text-xs text-muted-foreground">
              <p className="flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" />
                Your payment information is secure and encrypted
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
