import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Minus, DollarSign, Percent, Heart } from 'lucide-react';
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
        type: 'Group Discount',
        value: adventure.group_discount_percentage,
        description: `${adventure.group_discount_percentage}% off for groups of 4+`
      });
    }
    
    if (adventure.early_bird_discount_percentage > 0) {
      discounts.push({
        type: 'Early Bird',
        value: adventure.early_bird_discount_percentage,
        description: `${adventure.early_bird_discount_percentage}% off when booking ${adventure.early_bird_days} days ahead`
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
            <Users className="w-5 h-5 mr-2" />
            How Many People?
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
                <div className="text-sm text-gray-600">
                  {formData.participants === 1 ? 'Participant' : 'Participants'}
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
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg font-semibold">{count}</div>
                  <div className="text-xs text-gray-600">
                    {count === 1 ? 'Solo' : count === 2 ? 'Couple' : 'Group'}
                  </div>
                </button>
              ))}
            </div>

            {/* Availability Warning */}
            {availableSpots > 0 && availableSpots <= 3 && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-orange-800">
                    Only {availableSpots} spots left for this date!
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
              Price Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>${adventure.base_price} × {formData.participants} participant{formData.participants > 1 ? 's' : ''}</span>
                <span className="font-semibold">${pricing.subtotal.toFixed(2)}</span>
              </div>
              
              {pricing.groupDiscount > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Group discount</span>
                  <span>-${pricing.groupDiscount.toFixed(2)}</span>
                </div>
              )}
              
              {pricing.earlyBirdDiscount > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Early bird discount</span>
                  <span>-${pricing.earlyBirdDiscount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Taxes & fees</span>
                <span>${pricing.taxAmount.toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span>${pricing.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Discounts Available */}
      {discounts.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-green-800">
              <Percent className="w-5 h-5 mr-2" />
              Available Discounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {discounts.map((discount, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-green-200">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{discount.value}%</span>
                  </div>
                  <div>
                    <div className="font-semibold text-green-800">{discount.type}</div>
                    <div className="text-sm text-green-700">{discount.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Solo Traveler Support */}
      {formData.participants === 1 && (
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-purple-600" />
              <div>
                <h3 className="font-semibold text-purple-800">Solo Traveler Friendly</h3>
                <p className="text-sm text-purple-700">
                  This adventure is perfect for solo travelers. You'll join a small group of like-minded adventurers!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Group Benefits */}
      {formData.participants >= 4 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-800">Group Benefits</h3>
                <p className="text-sm text-blue-700">
                  Great choice for groups! You'll get a discount and can enjoy a more personalized experience.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Capacity Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Capacity Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Maximum group size:</span>
              <span className="font-semibold">{adventure.max_participants} people</span>
            </div>
            <div className="flex justify-between">
              <span>Available spots for this date:</span>
              <span className="font-semibold">{availableSpots} spots</span>
            </div>
            <div className="flex justify-between">
              <span>Your selection:</span>
              <span className="font-semibold">{formData.participants} participant{formData.participants > 1 ? 's' : ''}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};