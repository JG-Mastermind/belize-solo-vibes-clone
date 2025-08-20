import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { User, Settings, Bell, Moon, Phone, Shield, Save, Camera } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  user_type: string;
  profile_image?: string;
  whatsapp_enabled: boolean;
  notification_preferences: {
    email: boolean;
    whatsapp: boolean;
    push: boolean;
  };
  dark_mode: boolean;
  // Traveler-specific
  emergency_contact?: {
    name: string;
    phone: string;
    relation: string;
  };
  dietary_restrictions?: string;
  // Guide-specific
  bio?: string;
  certifications?: string[];
  operating_region?: string;
  languages_spoken?: string[];
}

const UserSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Mock profile data for now - will be replaced with backend API call
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Mock data based on current user
        const mockProfile: UserProfile = {
          id: user?.id || '',
          email: user?.email || '',
          full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || '',
          user_type: user?.user_metadata?.user_type || 'traveler',
          profile_image: user?.user_metadata?.avatar_url || '',
          whatsapp_enabled: false,
          notification_preferences: {
            email: true,
            whatsapp: false,
            push: false
          },
          dark_mode: false,
          // Role-specific defaults
          ...(user?.user_metadata?.user_type === 'traveler' && {
            emergency_contact: {
              name: '',
              phone: '',
              relation: ''
            },
            dietary_restrictions: ''
          }),
          ...(user?.user_metadata?.user_type === 'guide' && {
            bio: '',
            certifications: [],
            operating_region: '',
            languages_spoken: ['English']
          })
        };
        
        setProfile(mockProfile);
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile settings.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadProfile();
    }
  }, [user, toast]);

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      // TODO: Replace with actual backend API call to update-user-settings
      console.log('Saving profile:', profile);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Your settings have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error", 
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!profile) return;
    setProfile({ ...profile, ...updates });
  };

  const updateNotificationPreferences = (key: keyof UserProfile['notification_preferences'], value: boolean) => {
    if (!profile) return;
    updateProfile({
      notification_preferences: {
        ...profile.notification_preferences,
        [key]: value
      }
    });
  };

  const updateEmergencyContact = (updates: Partial<UserProfile['emergency_contact']>) => {
    if (!profile?.emergency_contact) return;
    updateProfile({
      emergency_contact: {
        ...profile.emergency_contact,
        ...updates
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Unable to load profile settings.</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>User Settings - BelizeVibes</title>
        <meta name="description" content="Manage your profile settings and preferences" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Profile Information */}
        <Card className="dashboard-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <CardDescription>
              Update your basic profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                {profile.profile_image ? (
                  <img src={profile.profile_image} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-orange-600" />
                )}
              </div>
              <Button variant="outline" size="sm">
                <Camera className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profile.full_name}
                  onChange={(e) => updateProfile({ full_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize">
                {profile.user_type.replace('_', ' ')}
              </Badge>
              <Shield className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Role cannot be changed</span>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="dashboard-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure how you want to receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={profile.notification_preferences.email}
                onCheckedChange={(checked) => updateNotificationPreferences('email', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="whatsappNotifications">WhatsApp Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via WhatsApp</p>
              </div>
              <Switch
                id="whatsappNotifications"
                checked={profile.notification_preferences.whatsapp}
                onCheckedChange={(checked) => updateNotificationPreferences('whatsapp', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pushNotifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
              </div>
              <Switch
                id="pushNotifications"
                checked={profile.notification_preferences.push}
                onCheckedChange={(checked) => updateNotificationPreferences('push', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="dashboard-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5" />
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>
              Customize how the application looks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="darkMode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Enable dark theme</p>
              </div>
              <Switch
                id="darkMode"
                checked={profile.dark_mode}
                onCheckedChange={(checked) => updateProfile({ dark_mode: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Traveler-specific settings */}
        {profile.user_type === 'traveler' && profile.emergency_contact && (
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
              <CardDescription>
                Contact information for emergencies during your adventures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyName">Contact Name</Label>
                  <Input
                    id="emergencyName"
                    value={profile.emergency_contact.name}
                    onChange={(e) => updateEmergencyContact({ name: e.target.value })}
                    placeholder="Emergency contact name"
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Phone Number</Label>
                  <Input
                    id="emergencyPhone"
                    value={profile.emergency_contact.phone}
                    onChange={(e) => updateEmergencyContact({ phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="emergencyRelation">Relationship</Label>
                <Input
                  id="emergencyRelation"
                  value={profile.emergency_contact.relation}
                  onChange={(e) => updateEmergencyContact({ relation: e.target.value })}
                  placeholder="e.g., Spouse, Parent, Sibling"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Traveler dietary restrictions */}
        {profile.user_type === 'traveler' && (
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Dietary Restrictions</CardTitle>
              <CardDescription>
                Let us know about any dietary restrictions or allergies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={profile.dietary_restrictions || ''}
                onChange={(e) => updateProfile({ dietary_restrictions: e.target.value })}
                placeholder="Describe any dietary restrictions, allergies, or special requirements..."
                rows={3}
              />
            </CardContent>
          </Card>
        )}

        {/* Guide-specific settings */}
        {profile.user_type === 'guide' && (
          <>
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Guide Profile</CardTitle>
                <CardDescription>
                  Information displayed to potential customers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio || ''}
                    onChange={(e) => updateProfile({ bio: e.target.value })}
                    placeholder="Tell customers about your experience and expertise..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="operatingRegion">Operating Region</Label>
                  <Input
                    id="operatingRegion"
                    value={profile.operating_region || ''}
                    onChange={(e) => updateProfile({ operating_region: e.target.value })}
                    placeholder="e.g., Placencia Peninsula, Cayo District"
                  />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  );
};

export default UserSettings;