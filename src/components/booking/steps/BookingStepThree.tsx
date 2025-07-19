import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User, Phone, Mail, AlertTriangle, MessageCircle, Bell } from 'lucide-react';
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
    'Vegetarian',
    'Vegan',
    'Gluten-free',
    'Dairy-free',
    'Nut allergy',
    'Shellfish allergy',
    'Other'
  ];

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner', description: 'First time or very limited experience' },
    { value: 'intermediate', label: 'Intermediate', description: 'Some experience with similar activities' },
    { value: 'advanced', label: 'Advanced', description: 'Extensive experience and confident' },
    { value: 'expert', label: 'Expert', description: 'Professional level or extensive experience' }
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
            <User className="w-5 h-5 mr-2" />
            Lead Guest Information
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            This person will be the main contact for this booking
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.leadGuest.name}
                  onChange={(e) => handleLeadGuestChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.leadGuest.phone}
                  onChange={(e) => handleLeadGuestChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.leadGuest.email}
                onChange={(e) => handleLeadGuestChange('email', e.target.value)}
                placeholder="your@email.com"
                required
              />
              <p className="text-xs text-muted-foreground">
                We'll send booking confirmations and updates to this email
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experience Level */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Experience Level</CardTitle>
          <p className="text-sm text-muted-foreground">
            Help us provide the best experience for your skill level
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
          <CardTitle className="text-lg">Dietary Restrictions & Allergies</CardTitle>
          <p className="text-sm text-muted-foreground">
            Let us know about any dietary needs or allergies
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dietaryOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={formData.guestDetails.dietaryRestrictions?.includes(option) || false}
                    onCheckedChange={(checked) => handleDietaryChange(option, checked as boolean)}
                  />
                  <Label htmlFor={option} className="text-sm">{option}</Label>
                </div>
              ))}
            </div>
            
            {formData.guestDetails.dietaryRestrictions?.includes('Other') && (
              <div className="space-y-2">
                <Label htmlFor="dietaryOther">Please specify</Label>
                <Input
                  id="dietaryOther"
                  value={dietaryOther}
                  onChange={(e) => setDietaryOther(e.target.value)}
                  placeholder="Please describe your dietary needs"
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
            <AlertTriangle className="w-5 h-5 mr-2" />
            Emergency Contact
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Someone we can contact in case of emergency
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyName">Full Name *</Label>
              <Input
                id="emergencyName"
                value={formData.guestDetails.emergencyContact.name}
                onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                placeholder="Emergency contact name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">Phone Number *</Label>
              <Input
                id="emergencyPhone"
                type="tel"
                value={formData.guestDetails.emergencyContact.phone}
                onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
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
            <Bell className="w-5 h-5 mr-2" />
            Communication Preferences
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            How would you like to receive updates about your booking?
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
                <span>Email notifications</span>
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
                <span>SMS notifications</span>
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
                <span>WhatsApp notifications</span>
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
              Adventure Requirements
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

      {/* Data Privacy */}
      <Card>
        <CardContent className="pt-4">
          <div className="text-xs text-muted-foreground">
            <p className="mb-2">
              By providing your information, you agree to our Privacy Policy and Terms of Service.
              Your data will be used to process your booking and provide customer support.
            </p>
            <p>
              We'll only contact you about your booking unless you opt-in to marketing communications.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};