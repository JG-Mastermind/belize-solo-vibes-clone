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
import { getDateFnsLocale } from '@/lib/locale';

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
      return format(new Date(dateString), 'EEEE, MMMM d, yyyy', { locale: getDateFnsLocale() });
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

  const getDynamicSalesCopy = (adventure: Adventure) => {
    const title = adventure.title || 'this incredible experience';
    const location = adventure.location || 'beautiful Belize';
    
    // Universal template that works for any adventure type
    return `This is the adventure of a lifetime waiting for you in pristine ${location}. You'll experience something most people only dream about - ${title} in an authentic, unforgettable way. The natural beauty and expert local guides will create memories that last forever. Don't let this incredible opportunity slip away when you're so close to booking. You're almost there - complete your booking now and start your unforgettable Belizean adventure!`;
  };

  const handleLocationClick = () => {
    const location = adventure.location || 'Belize';
    const mapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(location)}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="sticky top-4 overflow-hidden">
      {/* Hero Image */}
      <div className="relative">
        <img
          src={adventure.featured_image_url || '/placeholder.svg'}
          alt={adventure.title}
          className="w-full aspect-[16/9] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      
      <CardHeader>
        <CardTitle className="text-lg">Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Adventure Details */}
        <div className="space-y-3">
          <div>
            <h3 className="text-foreground font-bold text-lg leading-tight">{adventure.title}</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed mb-4">
              {getDynamicSalesCopy(adventure)}
            </p>
            <p 
              className="text-sm text-belize-orange-500 hover:text-belize-orange-600 cursor-pointer underline flex items-center mt-3"
              onClick={handleLocationClick}
            >
              <MapPin className="w-3 h-3 mr-1" />
              {adventure.location}
            </p>
          </div>
        </div>

        <Separator />

        {/* Booking Details */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Your Selection</h4>
          
          {formData.selectedDate && (
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="w-4 h-4 text-orange-400" />
              <span className="text-foreground">{formatDate(formData.selectedDate)}</span>
            </div>
          )}
          
          {formData.selectedTime && (
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="w-4 h-4 text-orange-400" />
              <span className="text-foreground">{formatTime(formData.selectedTime)}</span>
            </div>
          )}
          
          {formData.participants > 0 && (
            <div className="flex items-center space-x-2 text-sm">
              <Users className="w-4 h-4 text-orange-400" />
              <span className="text-foreground">{formData.participants} participant{formData.participants > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Add-ons */}
        {formData.selectedAddOns.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Add-ons</h4>
              {formData.selectedAddOns.map((addon, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{addon.name}</span>
                  <span className="text-foreground">${addon.price.toFixed(2)}</span>
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
              <h4 className="font-medium text-foreground">Price Details</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground">${adventure.base_price} × {formData.participants}</span>
                  <span className="text-foreground">${pricing.subtotal.toFixed(2)}</span>
                </div>
                
                {formData.participants >= 4 && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-green-600">Group discount</span>
                    <span>-${(pricing.subtotal * 0.1).toFixed(2)}</span>
                  </div>
                )}
                
                {pricing.earlyBirdDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-green-600">Early bird discount</span>
                    <span>-${pricing.earlyBirdDiscount.toFixed(2)}</span>
                  </div>
                )}
                
                {pricing.promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-green-600">Promo discount</span>
                    <span>-${pricing.promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                
                {pricing.addOnsTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-foreground">Add-ons</span>
                    <span className="text-foreground">${pricing.addOnsTotal.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-foreground">Taxes & fees</span>
                  <span className="text-foreground">${pricing.taxAmount.toFixed(2)}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg text-foreground">Total</span>
                <span className="font-bold text-xl text-green-500">${pricing.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}

        {/* Trust Indicators */}
        <div className="pt-4 border-t border-gray-100">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <Shield className="w-4 h-4 trust-icon" />
              <span className="text-muted-foreground">Free cancellation up to 24 hours</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <CreditCard className="w-4 h-4 trust-icon" />
              <span className="text-muted-foreground">Secure payment processing</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <AlertCircle className="w-4 h-4 trust-icon" />
              <span className="text-muted-foreground">Instant confirmation</span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="pt-4 border-t border-gray-100">
          <div className="text-center text-sm text-muted-foreground">
            <p>Need help? Contact us at</p>
            <p className="font-medium text-foreground">support@belizevibes.com</p>
            <p className="font-medium text-foreground">+1 (501) 555-0123</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};