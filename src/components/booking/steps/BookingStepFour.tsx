import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Plus, Minus, Camera, Utensils, Car, Gift, MessageCircle, Star } from 'lucide-react';
import { Adventure, BookingFormData } from '@/types/booking';
import { toast } from 'sonner';

interface BookingStepFourProps {
  adventure: Adventure;
  formData: BookingFormData;
  onUpdate: (updates: Partial<BookingFormData>) => void;
}

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ReactNode;
  category: string;
  popular?: boolean;
  maxQuantity?: number;
}

export const BookingStepFour: React.FC<BookingStepFourProps> = ({
  adventure,
  formData,
  onUpdate
}) => {
  const [promoCode, setPromoCode] = useState(formData.promoCode || '');
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  // Mock add-ons data (in real app, this would come from the adventure or API)
  const addOns: AddOn[] = [
    {
      id: 'photos',
      name: 'Professional Photos',
      description: 'Get high-quality photos of your adventure taken by our professional photographer',
      price: 45,
      icon: <Camera className="w-5 h-5" />,
      category: 'Photography',
      popular: true
    },
    {
      id: 'lunch',
      name: 'Gourmet Lunch',
      description: 'Enjoy a delicious locally-sourced lunch with vegetarian options available',
      price: 25,
      icon: <Utensils className="w-5 h-5" />,
      category: 'Food & Drink'
    },
    {
      id: 'transport',
      name: 'Hotel Pickup',
      description: 'Convenient pickup and drop-off from your hotel in the main tourist areas',
      price: 15,
      icon: <Car className="w-5 h-5" />,
      category: 'Transportation'
    },
    {
      id: 'gear',
      name: 'Premium Gear Upgrade',
      description: 'Upgrade to premium adventure gear for enhanced comfort and safety',
      price: 35,
      icon: <Star className="w-5 h-5" />,
      category: 'Equipment'
    },
    {
      id: 'souvenir',
      name: 'Adventure Souvenir Pack',
      description: 'Take home a branded t-shirt, water bottle, and photo album',
      price: 20,
      icon: <Gift className="w-5 h-5" />,
      category: 'Souvenirs'
    }
  ];

  const handleAddOnChange = (addOnId: string, quantity: number) => {
    const addOn = addOns.find(a => a.id === addOnId);
    if (!addOn) return;

    const currentAddOns = formData.selectedAddOns || [];
    const existingIndex = currentAddOns.findIndex(a => a.id === addOnId);

    let newAddOns;
    if (quantity === 0) {
      // Remove add-on
      newAddOns = currentAddOns.filter(a => a.id !== addOnId);
    } else if (existingIndex >= 0) {
      // Update existing add-on
      newAddOns = [...currentAddOns];
      newAddOns[existingIndex] = {
        ...newAddOns[existingIndex],
        quantity
      };
    } else {
      // Add new add-on
      newAddOns = [...currentAddOns, {
        id: addOnId,
        name: addOn.name,
        price: addOn.price,
        quantity
      }];
    }

    onUpdate({ selectedAddOns: newAddOns });
  };

  const getAddOnQuantity = (addOnId: string) => {
    const addOn = formData.selectedAddOns?.find(a => a.id === addOnId);
    return addOn?.quantity || 0;
  };

  const handlePromoCodeSubmit = async () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code');
      return;
    }

    setIsValidatingPromo(true);
    
    // Simulate API call to validate promo code
    setTimeout(() => {
      const validCodes = ['WELCOME10', 'EARLY20', 'GROUPSAVE'];
      if (validCodes.includes(promoCode.toUpperCase())) {
        toast.success('Promo code applied successfully!');
        onUpdate({ promoCode: promoCode.toUpperCase() });
      } else {
        toast.error('Invalid or expired promo code');
      }
      setIsValidatingPromo(false);
    }, 1000);
  };

  const handleSpecialRequestsChange = (value: string) => {
    onUpdate({ specialRequests: value });
  };

  const getTotalAddOnsCost = () => {
    return (formData.selectedAddOns || []).reduce((total, addon) => {
      return total + (addon.price * addon.quantity);
    }, 0);
  };

  const groupedAddOns = addOns.reduce((acc, addon) => {
    const category = addon.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(addon);
    return acc;
  }, {} as Record<string, AddOn[]>);

  return (
    <div className="space-y-6">
      {/* Add-ons Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Enhance Your Adventure</CardTitle>
          <p className="text-sm text-muted-foreground">
            Add optional extras to make your experience even more memorable
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(groupedAddOns).map(([category, categoryAddOns]) => (
              <div key={category} className="space-y-3">
                <h3 className="font-semibold text-foreground">{category}</h3>
                <div className="space-y-3">
                  {categoryAddOns.map((addon) => (
                    <div key={addon.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            {addon.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold">{addon.name}</h4>
                              {addon.popular && (
                                <Badge variant="secondary" className="bg-warning/10 text-warning">
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{addon.description}</p>
                            <div className="text-lg font-bold text-primary">${addon.price}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddOnChange(addon.id, Math.max(0, getAddOnQuantity(addon.id) - 1))}
                            disabled={getAddOnQuantity(addon.id) === 0}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          
                          <span className="w-8 text-center font-semibold">
                            {getAddOnQuantity(addon.id)}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddOnChange(addon.id, getAddOnQuantity(addon.id) + 1)}
                            disabled={addon.maxQuantity && getAddOnQuantity(addon.id) >= addon.maxQuantity}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add-ons Summary */}
      {formData.selectedAddOns && formData.selectedAddOns.length > 0 && (
        <Card className="border-primary bg-primary/10">
          <CardHeader>
            <CardTitle className="text-lg text-primary-foreground">Selected Add-ons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {formData.selectedAddOns.map((addon, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">
                    {addon.name} {addon.quantity > 1 && `(×${addon.quantity})`}
                  </span>
                  <span className="font-semibold">
                    ${(addon.price * addon.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center font-semibold text-primary-foreground">
                  <span>Add-ons Total</span>
                  <span>${getTotalAddOnsCost().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Promo Code */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Gift className="w-5 h-5 mr-2" />
            Promo Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="flex-1"
              />
              <Button
                onClick={handlePromoCodeSubmit}
                disabled={isValidatingPromo || !promoCode.trim()}
              >
                {isValidatingPromo ? 'Checking...' : 'Apply'}
              </Button>
            </div>
            
            {formData.promoCode && (
              <div className="p-3 bg-primary/10 border border-primary rounded-lg">
                <div className="flex items-center space-x-2">
                  <Gift className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary-foreground">
                    Promo code "{formData.promoCode}" applied!
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Special Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Special Requests
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Let us know if you have any special requests or additional information
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="specialRequests">Additional Information (Optional)</Label>
            <Textarea
              id="specialRequests"
              placeholder="e.g., celebrating a special occasion, mobility considerations, specific dietary needs not mentioned earlier..."
              value={formData.specialRequests}
              onChange={(e) => handleSpecialRequestsChange(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              We'll do our best to accommodate your requests, though some may not be possible depending on availability.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Popular Add-on Recommendations */}
      <Card className="border-primary bg-primary/10">
        <CardHeader>
          <CardTitle className="text-lg text-primary-foreground">💡 Popular Combinations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-background rounded-lg border border-primary">
              <h4 className="font-semibold text-foreground mb-1">Memory Package</h4>
              <p className="text-sm text-primary-foreground mb-2">
                Professional Photos + Souvenir Pack = $60 (Save $5!)
              </p>
              <div className="text-xs text-primary">
                Most popular choice for first-time visitors
              </div>
            </div>
            
            <div className="p-3 bg-background rounded-lg border border-primary">
              <h4 className="font-semibold text-foreground mb-1">Comfort Package</h4>
              <p className="text-sm text-primary-foreground mb-2">
                Hotel Pickup + Gourmet Lunch = $35 (Save $5!)
              </p>
              <div className="text-xs text-primary">
                Perfect for a hassle-free experience
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};