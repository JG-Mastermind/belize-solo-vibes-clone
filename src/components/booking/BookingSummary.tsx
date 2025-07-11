import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Tag, 
  Shield,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { Adventure, BookingFormData, PricingBreakdown } from '@/types/booking';
import { format } from 'date-fns';

interface BookingSummaryProps {
  adventure: Adventure;
  formData: BookingFormData;
  pricing: PricingBreakdown | null;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  adventure,
  formData,
  pricing
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'EEEE, MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
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

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg">Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Adventure Details */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <img
              src={adventure.featured_image_url || '/placeholder.svg'}
              alt={adventure.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold line-clamp-2">{adventure.title}</h3>
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                {adventure.location}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Booking Details */}
        <div className="space-y-3">
          <h4 className="font-medium">Your Selection</h4>
          
          {formData.selectedDate && (
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>{formatDate(formData.selectedDate)}</span>
            </div>
          )}
          
          {formData.selectedTime && (
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>{formatTime(formData.selectedTime)}</span>
            </div>
          )}
          
          {formData.participants > 0 && (
            <div className="flex items-center space-x-2 text-sm">
              <Users className="w-4 h-4 text-gray-500" />
              <span>{formData.participants} participant{formData.participants > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Add-ons */}
        {formData.selectedAddOns.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium">Add-ons</h4>
              {formData.selectedAddOns.map((addon, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{addon.name}</span>
                  <span>${addon.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Promo Code */}
        {formData.appliedPromotion && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  {formData.appliedPromotion.name}
                </span>
              </div>
              <p className="text-xs text-green-700">
                {formData.appliedPromotion.description}
              </p>
            </div>
          </>
        )}

        {/* Pricing */}
        {pricing && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium">Price Details</h4>
              
              <div className="space-y-2 text-sm">
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
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-bold text-xl">${pricing.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}

        {/* Trust Indicators */}
        <div className="pt-4 border-t border-gray-100">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Free cancellation up to 24 hours</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CreditCard className="w-4 h-4" />
              <span>Secure payment processing</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <AlertCircle className="w-4 h-4" />
              <span>Instant confirmation</span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="pt-4 border-t border-gray-100">
          <div className="text-center text-sm text-gray-600">
            <p>Need help? Contact us at</p>
            <p className="font-medium text-blue-600">support@belizevibes.com</p>
            <p className="font-medium text-blue-600">+1 (501) 555-0123</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};