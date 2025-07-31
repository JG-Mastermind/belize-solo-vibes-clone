import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User, Phone, Mail, AlertTriangle, MessageCircle, Bell, Utensils, Award, Shield, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Adventure, BookingFormData } from '@/types/booking';
import { useAuth } from '@/components/auth/AuthProvider';

interface BookingStepThreeProps {
  adventure: Adventure;
  formData: BookingFormData;
  onUpdate: (updates: Partial<BookingFormData>) => void;
}

export const BookingStepThree: React.FC<BookingStepThreeProps> = ({
  adventure,
  formData,
  onUpdate
}) => {
  const { user } = useAuth();
  const { t } = useTranslation(['booking']);
  const [dietaryOther, setDietaryOther] = useState('');

  useEffect(() => {
    // Pre-fill with user data if available
    if (user && !formData.leadGuest.name) {
      const userMetadata = user.user_metadata || {};
      onUpdate({
        leadGuest: {
          name: `${userMetadata.first_name || ''} ${userMetadata.last_name || ''}`.trim(),
          email: user.email || '',
          phone: formData.leadGuest.phone
        }
      });
    }
  }, [user, formData.leadGuest.name, onUpdate]);

  const handleLeadGuestChange = (field: string, value: string) => {
    onUpdate({
      leadGuest: {
        ...formData.leadGuest,
        [field]: value
      }
    });
  };

  const handleGuestDetailsChange = (field: string, value: any) => {
    onUpdate({
      guestDetails: {
        ...formData.guestDetails,
        [field]: value
      }
    });
  };

  const handleEmergencyContactChange = (field: string, value: string) => {
    onUpdate({
      guestDetails: {
        ...formData.guestDetails,
        emergencyContact: {
          ...formData.guestDetails.emergencyContact,
          [field]: value
        }
      }
    });
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    onUpdate({
      notifications: {
        ...formData.notifications,
        [field]: value
      }
    });
  };

  const dietaryOptions = [
    { key: 'vegetarian', label: t('booking:step3.dietary.vegetarian') },
    { key: 'vegan', label: t('booking:step3.dietary.vegan') },
    { key: 'glutenFree', label: t('booking:step3.dietary.glutenFree') },
    { key: 'dairyFree', label: t('booking:step3.dietary.dairyFree') },
    { key: 'nutAllergy', label: t('booking:step3.dietary.nutAllergy') },
    { key: 'shellfishAllergy', label: t('booking:step3.dietary.shellfishAllergy') },
    { key: 'other', label: t('booking:step3.dietary.other') }
  ];

  const experienceLevels = [
    { value: 'beginner', label: t('booking:step3.experienceLevels.beginner.label'), description: t('booking:step3.experienceLevels.beginner.description') },
    { value: 'intermediate', label: t('booking:step3.experienceLevels.intermediate.label'), description: t('booking:step3.experienceLevels.intermediate.description') },
    { value: 'advanced', label: t('booking:step3.experienceLevels.advanced.label'), description: t('booking:step3.experienceLevels.advanced.description') },
    { value: 'expert', label: t('booking:step3.experienceLevels.expert.label'), description: t('booking:step3.experienceLevels.expert.description') }
  ];

  const handleDietaryChange = (option: string, checked: boolean) => {
    const current = formData.guestDetails.dietaryRestrictions || [];
    if (checked) {
      handleGuestDetailsChange('dietaryRestrictions', [...current, option]);
    } else {
      handleGuestDetailsChange('dietaryRestrictions', current.filter(item => item !== option));
    }
  };

  return (
    <div className="space-y-6">
      {/* Lead Guest Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <User className="w-5 h-5 mr-2 text-orange-400" />
            {t('booking:step3.headers.leadGuestInformation')}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t('booking:step3.descriptions.leadGuest')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">{t('booking:step3.labels.fullName')}</Label>
                <Input
                  id="fullName"
                  value={formData.leadGuest.name}
                  onChange={(e) => handleLeadGuestChange('name', e.target.value)}
                  placeholder={t('booking:step3.placeholders.enterFullName')}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">{t('booking:step3.labels.phoneNumber')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.leadGuest.phone}
                  onChange={(e) => handleLeadGuestChange('phone', e.target.value)}
                  placeholder={t('booking:step3.placeholders.phoneFormat')}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('booking:step3.labels.emailAddress')}</Label>
              <Input
                id="email"
                type="email"
                value={formData.leadGuest.email}
                onChange={(e) => handleLeadGuestChange('email', e.target.value)}
                placeholder={t('booking:step3.placeholders.emailFormat')}
                required
              />
              <p className="text-xs text-muted-foreground">
                {t('booking:step3.messages.emailConfirmation')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experience Level */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Award className="w-5 h-5 mr-2 text-orange-400" />
            {t('booking:step3.headers.experienceLevel')}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t('booking:step3.descriptions.experienceLevel')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experienceLevels.map((level) => (
              <button
                key={level.value}
                onClick={() => handleGuestDetailsChange('experienceLevel', level.value)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  formData.guestDetails.experienceLevel === level.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-border/70'
                }`}
              >
                <div className="font-semibold">{level.label}</div>
                <div className="text-sm text-muted-foreground">{level.description}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dietary Restrictions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Utensils className="w-5 h-5 mr-2 text-orange-400" />
            {t('booking:step3.headers.dietaryRestrictions')}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t('booking:step3.descriptions.dietary')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dietaryOptions.map((option) => (
                <div key={option.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.key}
                    checked={formData.guestDetails.dietaryRestrictions?.includes(option.key) || false}
                    onCheckedChange={(checked) => handleDietaryChange(option.key, checked as boolean)}
                  />
                  <Label htmlFor={option.key} className="text-sm">{option.label}</Label>
                </div>
              ))}
            </div>
            
            {formData.guestDetails.dietaryRestrictions?.includes('other') && (
              <div className="space-y-2">
                <Label htmlFor="dietaryOther">{t('booking:step3.labels.pleaseSpecify')}</Label>
                <Input
                  id="dietaryOther"
                  value={dietaryOther}
                  onChange={(e) => setDietaryOther(e.target.value)}
                  placeholder={t('booking:step3.placeholders.dietaryNeeds')}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-400" />
            {t('booking:step3.headers.emergencyContact')}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t('booking:step3.descriptions.emergencyContact')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyName">{t('booking:step3.labels.fullName')}</Label>
              <Input
                id="emergencyName"
                value={formData.guestDetails.emergencyContact.name}
                onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                placeholder={t('booking:step3.placeholders.emergencyContactName')}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">{t('booking:step3.labels.phoneNumber')}</Label>
              <Input
                id="emergencyPhone"
                type="tel"
                value={formData.guestDetails.emergencyContact.phone}
                onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                placeholder={t('booking:step3.placeholders.phoneFormat')}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communication Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Bell className="w-5 h-5 mr-2 text-orange-400" />
            {t('booking:step3.headers.communicationPreferences')}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t('booking:step3.descriptions.communications')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="email"
                checked={formData.notifications.email}
                onCheckedChange={(checked) => handleNotificationChange('email', checked as boolean)}
              />
              <Label htmlFor="email" className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{t('booking:step3.notifications.email')}</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sms"
                checked={formData.notifications.sms}
                onCheckedChange={(checked) => handleNotificationChange('sms', checked as boolean)}
              />
              <Label htmlFor="sms" className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>{t('booking:step3.notifications.sms')}</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="whatsapp"
                checked={formData.notifications.whatsapp}
                onCheckedChange={(checked) => handleNotificationChange('whatsapp', checked as boolean)}
              />
              <Label htmlFor="whatsapp" className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>{t('booking:step3.notifications.whatsapp')}</span>
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adventure-Specific Requirements */}
      {adventure.requirements && adventure.requirements.length > 0 && (
        <Card className="border-warning bg-warning/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-warning-foreground">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {t('booking:step3.headers.adventureRequirements')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {adventure.requirements.map((requirement, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-warning-foreground">{requirement}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Privacy & Security Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Shield className="w-5 h-5 mr-2 text-orange-400" />
            {t('booking:step3.headers.privacySecurity')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm important-info">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Secure Data Processing:</strong> All personal information is encrypted and stored securely
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Limited Data Use:</strong> Information used only for booking processing and customer support
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>No Spam Policy:</strong> We'll only contact you about your booking unless you opt-in
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Privacy Compliant:</strong> Full compliance with Privacy Policy and Terms of Service
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};