import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Plus, Minus, Camera, Utensils, Car, Gift, MessageCircle, Star, Sparkles, Lightbulb } from 'lucide-react';
import { Adventure, BookingFormData } from '@/types/booking';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

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

interface Combo {
  id: string;
  name: string;
  description: string;
  items: string[]; // AddOn IDs that are included
  bundlePrice: number;
  savings: number;
  badge: string;
}

export const BookingStepFour: React.FC<BookingStepFourProps> = ({
  adventure,
  formData,
  onUpdate
}) => {
  const { t } = useTranslation(['booking']);
  const [promoCode, setPromoCode] = useState(formData.promoCode || '');
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [selectedCombos, setSelectedCombos] = useState<string[]>([]);

  // Mock add-ons data (in real app, this would come from the adventure or API)
  const addOns: AddOn[] = [
    {
      id: 'photos',
      name: t('booking:step4.addOns.photos.name'),
      description: t('booking:step4.addOns.photos.description'),
      price: 45,
      icon: <Camera className="w-5 h-5 text-orange-500" />,
      category: t('booking:step4.addOns.photos.category'),
      popular: true
    },
    {
      id: 'lunch',
      name: t('booking:step4.addOns.lunch.name'),
      description: t('booking:step4.addOns.lunch.description'),
      price: 25,
      icon: <Utensils className="w-5 h-5 text-orange-500" />,
      category: t('booking:step4.addOns.lunch.category')
    },
    {
      id: 'transport',
      name: t('booking:step4.addOns.transport.name'),
      description: t('booking:step4.addOns.transport.description'),
      price: 15,
      icon: <Car className="w-5 h-5 text-orange-500" />,
      category: t('booking:step4.addOns.transport.category')
    },
    {
      id: 'gear',
      name: t('booking:step4.addOns.gear.name'),
      description: t('booking:step4.addOns.gear.description'),
      price: 35,
      icon: <Star className="w-5 h-5 text-orange-500" />,
      category: t('booking:step4.addOns.gear.category')
    },
    {
      id: 'souvenir',
      name: t('booking:step4.addOns.souvenir.name'),
      description: t('booking:step4.addOns.souvenir.description'),
      price: 20,
      icon: <Gift className="w-5 h-5 text-orange-500" />,
      category: t('booking:step4.addOns.souvenir.category')
    }
  ];

  // Combo packages
  const combos: Combo[] = [
    {
      id: 'memory',
      name: t('booking:step4.combos.memory.name'),
      description: t('booking:step4.combos.memory.description', { bundlePrice: 60, savings: 5 }),
      items: ['photos', 'souvenir'],
      bundlePrice: 60,
      savings: 5,
      badge: t('booking:step4.combos.memory.badge')
    },
    {
      id: 'comfort',
      name: t('booking:step4.combos.comfort.name'), 
      description: t('booking:step4.combos.comfort.description', { bundlePrice: 35, savings: 5 }),
      items: ['transport', 'lunch'],
      bundlePrice: 35,
      savings: 5,
      badge: t('booking:step4.combos.comfort.badge')
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
      toast.error(t('booking:step4.messages.enterPromoCode'));
      return;
    }

    setIsValidatingPromo(true);
    
    // Simulate API call to validate promo code
    setTimeout(() => {
      const validCodes = ['WELCOME10', 'EARLY20', 'GROUPSAVE'];
      if (validCodes.includes(promoCode.toUpperCase())) {
        toast.success(t('booking:step4.messages.promoSuccess'));
        onUpdate({ promoCode: promoCode.toUpperCase() });
      } else {
        toast.error(t('booking:step4.messages.promoInvalid'));
      }
      setIsValidatingPromo(false);
    }, 1000);
  };

  const handleSpecialRequestsChange = (value: string) => {
    onUpdate({ specialRequests: value });
  };

  const handleComboSelect = (comboId: string) => {
    const combo = combos.find(c => c.id === comboId);
    if (!combo) return;

    const isSelected = selectedCombos.includes(comboId);
    
    if (isSelected) {
      // Deselect combo - remove bundle and restore individual items if they were selected before
      setSelectedCombos(prev => prev.filter(id => id !== comboId));
      
      // Remove combo from selected add-ons
      const currentAddOns = formData.selectedAddOns || [];
      const newAddOns = currentAddOns.filter(addon => addon.id !== `combo-${comboId}`);
      onUpdate({ selectedAddOns: newAddOns });
      
      toast.info(t('booking:step4.messages.comboRemoved', { name: combo.name }));
    } else {
      // Select combo - check for conflicts with individual items
      const currentAddOns = formData.selectedAddOns || [];
      const conflictingItems = currentAddOns.filter(addon => combo.items.includes(addon.id));
      
      if (conflictingItems.length > 0) {
        // Remove individual items and add combo
        const nonConflictingAddOns = currentAddOns.filter(addon => !combo.items.includes(addon.id));
        const comboAddOn = {
          id: `combo-${comboId}`,
          name: combo.name,
          price: combo.bundlePrice,
          quantity: 1
        };
        
        onUpdate({ selectedAddOns: [...nonConflictingAddOns, comboAddOn] });
        
        const itemNames = conflictingItems.map(item => item.name).join(', ');
        toast.success(t('booking:step4.messages.comboSelectedWithReplace', { name: combo.name, items: itemNames, savings: combo.savings }));
      } else {
        // No conflicts, just add combo
        const comboAddOn = {
          id: `combo-${comboId}`,
          name: combo.name,
          price: combo.bundlePrice,
          quantity: 1
        };
        
        onUpdate({ selectedAddOns: [...currentAddOns, comboAddOn] });
        toast.success(t('booking:step4.messages.comboAdded', { name: combo.name, savings: combo.savings }));
      }
      
      setSelectedCombos(prev => [...prev, comboId]);
    }
  };

  const isComboSelected = (comboId: string) => {
    return selectedCombos.includes(comboId);
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
          <CardTitle className="text-lg flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-orange-500" />
            {t('booking:step4.headers.enhanceAdventure')}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t('booking:step4.descriptions.enhanceAdventure')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(groupedAddOns).map(([category, categoryAddOns]) => (
              <div key={category} className="space-y-3">
                <h3 className="font-semibold text-foreground">{category}</h3>
                <div className="space-y-3">
                  {categoryAddOns.map((addon) => (
                    <div key={addon.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          {/* Icon and Pricing Column */}
                          <div className="flex flex-col items-center space-y-1 flex-shrink-0">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              {addon.icon}
                            </div>
                            <div className="text-sm sm:text-base font-bold text-green-600">${addon.price}</div>
                          </div>
                          
                          {/* Content Column */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                              <h4 className="font-semibold text-base sm:text-lg">{addon.name}</h4>
                              {addon.popular && (
                                <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs mt-1 sm:mt-0 w-fit">
                                  {t('booking:step4.labels.popular')}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm sm:text-base text-muted-foreground break-words">{addon.description}</p>
                          </div>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-center sm:justify-end space-x-2 sm:ml-4 mt-2 sm:mt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddOnChange(addon.id, Math.max(0, getAddOnQuantity(addon.id) - 1))}
                            disabled={getAddOnQuantity(addon.id) === 0}
                            className="min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px]"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          
                          <span className="w-8 sm:w-8 text-center font-semibold text-base sm:text-lg">
                            {getAddOnQuantity(addon.id)}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddOnChange(addon.id, getAddOnQuantity(addon.id) + 1)}
                            disabled={addon.maxQuantity && getAddOnQuantity(addon.id) >= addon.maxQuantity}
                            className="min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px]"
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
            <CardTitle className="text-lg text-green-600">{t('booking:step4.labels.selectedAddOns')}</CardTitle>
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
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-green-600">{t('booking:step4.labels.addOnsTotal')}</span>
                  <span className="text-green-500">${getTotalAddOnsCost().toFixed(2)}</span>
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
            <Gift className="w-5 h-5 mr-2 text-orange-500" />
            {t('booking:step4.headers.promoCode')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder={t('booking:step4.placeholders.promoCode')}
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="flex-1"
              />
              <Button
                onClick={handlePromoCodeSubmit}
                disabled={isValidatingPromo || !promoCode.trim()}
              >
                {isValidatingPromo ? t('booking:step4.buttons.checking') : t('booking:step4.buttons.apply')}
              </Button>
            </div>
            
            {formData.promoCode && (
              <div className="p-3 bg-primary/10 border border-primary rounded-lg">
                <div className="flex items-center space-x-2">
                  <Gift className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary-foreground">
                    {t('booking:step4.messages.promoApplied', { code: formData.promoCode })}
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
            <MessageCircle className="w-5 h-5 mr-2 text-orange-500" />
            {t('booking:step4.headers.specialRequests')}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t('booking:step4.descriptions.specialRequests')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="specialRequests">{t('booking:step4.labels.additionalInfo')}</Label>
            <Textarea
              id="specialRequests"
              placeholder={t('booking:step4.placeholders.specialRequests')}
              value={formData.specialRequests}
              onChange={(e) => handleSpecialRequestsChange(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              {t('booking:step4.messages.accommodateRequests')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Popular Combinations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-orange-500" />
            {t('booking:step4.headers.popularCombinations')}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t('booking:step4.descriptions.popularCombinations')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {combos.map((combo) => (
              <button
                key={combo.id}
                onClick={() => handleComboSelect(combo.id)}
                className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all text-left min-h-[44px] ${
                  isComboSelected(combo.id)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-border/70'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground mb-1 text-sm sm:text-base">{combo.name}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 break-words">
                      {combo.description}
                    </p>
                    <div className="text-xs text-primary">
                      {combo.badge}
                    </div>
                  </div>
                  <div className="sm:ml-4 self-start">
                    {isComboSelected(combo.id) && (
                      <Badge variant="default" className="bg-primary text-primary-foreground text-xs">
                        {t('booking:step4.labels.selected')}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};