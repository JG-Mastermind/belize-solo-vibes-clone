import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Minus, DollarSign, Percent, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Adventure, BookingFormData } from '@/types/booking';
import { BookingService } from '@/services/bookingService';

interface BookingStepTwoProps {
  adventure: Adventure;
  formData: BookingFormData;
  onUpdate: (updates: Partial<BookingFormData>) => void;
}

export const BookingStepTwo: React.FC<BookingStepTwoProps> = ({
  adventure,
  formData,
  onUpdate
}) => {
  const { t } = useTranslation(['booking']);
  const [availableSpots, setAvailableSpots] = useState<number>(0);
  const [pricing, setPricing] = useState<any>(null);

  useEffect(() => {
    if (formData.selectedDate) {
      checkAvailability();
    }
  }, [formData.selectedDate]);

  useEffect(() => {
    calculatePricing();
  }, [formData.participants]);

  const checkAvailability = async () => {
    if (!formData.selectedDate) return;
    
    const spots = await BookingService.getAvailableSpots(adventure.id, formData.selectedDate);
    setAvailableSpots(spots);
  };

  const calculatePricing = () => {
    const mockFormData = { ...formData, selectedAddOns: [] };
    const pricingBreakdown = BookingService.calculatePricing(adventure, mockFormData);
    setPricing(pricingBreakdown);
  };

  const handleParticipantChange = (newCount: number) => {
    if (newCount >= 1 && newCount <= Math.min(adventure.max_participants, availableSpots)) {
      onUpdate({ participants: newCount });
    }
  };

  const getGroupSizeOptions = () => {
    const maxParticipants = Math.min(adventure.max_participants, availableSpots);
    return Array.from({ length: maxParticipants }, (_, i) => i + 1);
  };

  const getDiscountInfo = () => {
    const discounts = [];
    
    if (adventure.group_discount_percentage > 0 && formData.participants >= 4) {
      discounts.push({
        type: t('booking:step2.discountTypes.groupDiscount'),
        value: adventure.group_discount_percentage,
        description: t('booking:step2.discountDescriptions.groupDiscountDesc', { percent: adventure.group_discount_percentage })
      });
    }
    
    if (adventure.early_bird_discount_percentage > 0) {
      discounts.push({
        type: t('booking:step2.discountTypes.earlyBird'),
        value: adventure.early_bird_discount_percentage,
        description: t('booking:step2.discountDescriptions.earlyBirdDesc', { percent: adventure.early_bird_discount_percentage, days: adventure.early_bird_days })
      });
    }
    
    return discounts;
  };

  const discounts = getDiscountInfo();

  return (
    <div className="space-y-6">
      {/* Group Size Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Users className="w-5 h-5 mr-2 text-orange-400" />
            {t('booking:step2.headers.howManyPeople')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Counter */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleParticipantChange(formData.participants - 1)}
                disabled={formData.participants <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              
              <div className="text-center">
                <div className="text-3xl font-bold">{formData.participants}</div>
                <div className="text-sm text-muted-foreground">
                  {formData.participants === 1 ? t('booking:step2.labels.participant') : t('booking:step2.labels.participants')}
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleParticipantChange(formData.participants + 1)}
                disabled={formData.participants >= Math.min(adventure.max_participants, availableSpots)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Group Size Options */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {getGroupSizeOptions().map((count) => (
                <button
                  key={count}
                  onClick={() => handleParticipantChange(count)}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    formData.participants === count
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-border/70'
                  }`}
                >
                  <div className="text-lg font-semibold">{count}</div>
                  <div className="text-xs text-muted-foreground">
                    {count === 1 ? t('booking:step2.labels.solo') : count === 2 ? t('booking:step2.labels.couple') : t('booking:step2.labels.group')}
                  </div>
                </button>
              ))}
            </div>

            {/* Availability Warning */}
            {availableSpots > 0 && availableSpots <= 3 && (
              <div className="p-3 bg-warning/10 border border-warning rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-warning-foreground">
                    {t('booking:step2.messages.onlyXSpotsLeft', { count: availableSpots })}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Preview */}
      {pricing && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              {t('booking:step2.headers.priceBreakdown')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>{formData.participants === 1 ? t('booking:step2.pricing.participantCount', { price: adventure.base_price, count: formData.participants }) : t('booking:step2.pricing.participantCountPlural', { price: adventure.base_price, count: formData.participants })}</span>
                <span className="font-semibold">${pricing.subtotal.toFixed(2)}</span>
              </div>
              
              {formData.participants >= 4 && (
                <div className="flex justify-between text-green-600">
                  <span>{t('booking:step2.pricing.groupDiscount', { percent: 10 })}</span>
                  <span>-${(pricing.subtotal * 0.1).toFixed(2)}</span>
                </div>
              )}
              
              {pricing.earlyBirdDiscount > 0 && (
                <div className="flex justify-between items-center text-primary">
                  <span>{t('booking:step2.pricing.earlyBirdDiscount')}</span>
                  <span>-${pricing.earlyBirdDiscount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>{t('booking:step2.pricing.taxesAndFees')}</span>
                <span>${pricing.taxAmount.toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>{t('booking:step2.labels.total')}</span>
                  <span>${pricing.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Discounts Available */}
      {discounts.length > 0 && (
        <Card className="border-primary bg-primary/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-primary-foreground">
              <Percent className="w-5 h-5 mr-2" />
              {t('booking:step2.headers.availableDiscounts')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {discounts.map((discount, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-green-200">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{discount.value}%</span>
                  </div>
                  <div>
                    <div className="font-semibold text-primary-foreground">{discount.type}</div>
                    <div className="text-sm text-primary">{discount.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Solo Traveler Support */}
      {formData.participants === 1 && (
        <Card className="border-accent bg-accent/10">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-yellow-500" />
              <div>
                <h3 className="font-semibold text-accent-foreground">{t('booking:step2.messages.soloTravelerFriendly')}</h3>
                <p className="text-sm text-accent-foreground/80">
                  {t('booking:step2.messages.soloDescription')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Group Benefits */}
      {formData.participants >= 4 && (
        <Card className="border-primary bg-primary/10">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-orange-400" />
              <div>
                <h3 className="font-semibold text-white">{t('booking:step2.messages.groupBenefits')}</h3>
                <p className="text-sm text-green-600">
                  {t('booking:step2.messages.groupDescription')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Capacity Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Users className="w-5 h-5 mr-2 text-orange-400" />
            {t('booking:step2.headers.capacityInformation')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm important-info">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex justify-between w-full">
                <span><strong>{t('booking:step2.capacity.maxGroupSize')}</strong></span>
                <span className="font-semibold">{adventure.max_participants} people</span>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex justify-between w-full">
                <span><strong>{t('booking:step2.capacity.availableSpots')}</strong></span>
                <span className="font-semibold">{availableSpots} {t('booking:step2.labels.spots')}</span>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex justify-between w-full">
                <span><strong>{t('booking:step2.capacity.yourSelection')}</strong></span>
                <span className="font-semibold">{formData.participants} {formData.participants === 1 ? t('booking:step2.labels.participant') : t('booking:step2.labels.participants')}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};