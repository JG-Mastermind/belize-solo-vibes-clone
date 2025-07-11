import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Smartphone, 
  Shield, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Users,
  MapPin,
  Clock,
  DollarSign
} from 'lucide-react';
import { Adventure, BookingFormData, PricingBreakdown } from '@/types/booking';
import { format } from 'date-fns';

interface BookingStepFiveProps {
  adventure: Adventure;
  formData: BookingFormData;
  pricing: PricingBreakdown | null;
  onUpdate: (updates: Partial<BookingFormData>) => void;
  onPayment: () => void;
  isSubmitting: boolean;
}

export const BookingStepFive: React.FC<BookingStepFiveProps> = ({
  adventure,
  formData,
  pricing,
  onUpdate,
  onPayment,
  isSubmitting
}) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'apple_pay' | 'google_pay' | 'payment_plan'>('card');

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'EEEE, MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit or Debit Card',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Visa, Mastercard, American Express',
      popular: true
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      icon: <Smartphone className="w-5 h-5" />,
      description: 'Quick and secure payment',
      available: /iPad|iPhone|iPod/.test(navigator.userAgent)
    },
    {
      id: 'google_pay',
      name: 'Google Pay',
      icon: <Smartphone className="w-5 h-5" />,
      description: 'Pay with your Google account',
      available: true
    },
    {
      id: 'payment_plan',
      name: 'Payment Plan',
      icon: <DollarSign className="w-5 h-5" />,
      description: 'Pay in 3 monthly installments',
      available: pricing && pricing.totalAmount >= 200
    }
  ];

  const handlePaymentMethodChange = (method: 'card' | 'apple_pay' | 'google_pay' | 'payment_plan') => {
    setSelectedPaymentMethod(method);
  };

  const canProceed = acceptedTerms && selectedPaymentMethod;

  return (
    <div className="space-y-6">
      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Booking Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Adventure Details */}
            <div className="flex items-start space-x-3">
              <img
                src={adventure.featured_image_url || '/placeholder.svg'}
                alt={adventure.title}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{adventure.title}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{adventure.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(formData.selectedDate)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(formData.selectedTime)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{formData.participants} participant{formData.participants > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Lead Guest</h4>
              <div className="text-sm text-gray-600">
                <div>{formData.leadGuest.name}</div>
                <div>{formData.leadGuest.email}</div>
                <div>{formData.leadGuest.phone}</div>
              </div>
            </div>

            {/* Add-ons */}
            {formData.selectedAddOns && formData.selectedAddOns.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Add-ons</h4>
                <div className="space-y-1">
                  {formData.selectedAddOns.map((addon, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{addon.name} {addon.quantity > 1 && `(×${addon.quantity})`}</span>
                      <span>${(addon.price * addon.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Price Breakdown */}
      {pricing && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Price Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>${adventure.base_price} × {formData.participants}</span>
                <span>${pricing.subtotal.toFixed(2)}</span>
              </div>
              
              {pricing.groupDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Group discount</span>
                  <span>-${pricing.groupDiscount.toFixed(2)}</span>
                </div>
              )}
              
              {pricing.earlyBirdDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Early bird discount</span>
                  <span>-${pricing.earlyBirdDiscount.toFixed(2)}</span>
                </div>
              )}
              
              {pricing.promoDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Promo discount</span>
                  <span>-${pricing.promoDiscount.toFixed(2)}</span>
                </div>
              )}
              
              {pricing.addOnsTotal > 0 && (
                <div className="flex justify-between">
                  <span>Add-ons</span>
                  <span>${pricing.addOnsTotal.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Taxes & fees</span>
                <span>${pricing.taxAmount.toFixed(2)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total</span>
                <span>${pricing.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentMethods.filter(method => method.available !== false).map((method) => (
              <button
                key={method.id}
                onClick={() => handlePaymentMethodChange(method.id as any)}
                className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                  selectedPaymentMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {method.icon}
                    <div>
                      <div className="font-semibold flex items-center space-x-2">
                        <span>{method.name}</span>
                        {method.popular && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">{method.description}</div>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedPaymentMethod === method.id
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedPaymentMethod === method.id && (
                      <div className="w-full h-full rounded-full bg-blue-500" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Plan Details */}
      {selectedPaymentMethod === 'payment_plan' && pricing && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg text-blue-800">Payment Plan Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Today</span>
                <span className="font-semibold">${(pricing.totalAmount / 3).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>In 1 month</span>
                <span className="font-semibold">${(pricing.totalAmount / 3).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>In 2 months</span>
                <span className="font-semibold">${(pricing.totalAmount / 3).toFixed(2)}</span>
              </div>
              <div className="text-xs text-blue-700 mt-2">
                No interest charges. Automatic payments from your selected payment method.
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security & Trust */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security & Trust
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-green-600" />
              <span className="text-sm">SSL encrypted secure payment</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm">PCI DSS compliant processing</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Instant booking confirmation</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Free cancellation up to 24 hours</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                I agree to the{' '}
                <a href="/terms" className="text-blue-600 hover:underline" target="_blank">
                  Terms of Service
                </a>
                ,{' '}
                <a href="/privacy" className="text-blue-600 hover:underline" target="_blank">
                  Privacy Policy
                </a>
                , and{' '}
                <a href="/cancellation" className="text-blue-600 hover:underline" target="_blank">
                  Cancellation Policy
                </a>
                . I understand that this booking is subject to availability and confirmation.
              </Label>
            </div>
            
            <div className="text-xs text-gray-500 space-y-1">
              <p>
                • You will receive a confirmation email with booking details and QR code
              </p>
              <p>
                • Our team will contact you 24 hours before your adventure with final details
              </p>
              <p>
                • Free cancellation up to 24 hours before your scheduled adventure
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complete Booking Button */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <Button
            onClick={onPayment}
            disabled={!canProceed || isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold"
            size="lg"
          >
            {isSubmitting ? (
              'Processing your booking...'
            ) : (
              <>
                <Lock className="w-5 h-5 mr-2" />
                Complete Booking - {pricing ? `$${pricing.totalAmount.toFixed(2)}` : '$0.00'}
              </>
            )}
          </Button>
          
          <p className="text-center text-sm text-gray-600 mt-3">
            You will be redirected to our secure payment processor
          </p>
        </CardContent>
      </Card>
    </div>
  );
};