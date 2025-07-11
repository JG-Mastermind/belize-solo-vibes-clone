import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Backpack, MapPin, Users, Shield } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { toast } from 'sonner';

interface RoleSelectionProps {
  isOpen: boolean;
  onClose: () => void;
}

const roles = [
  {
    id: 'traveler',
    title: 'Traveler',
    description: 'Book amazing adventures and explore Belize',
    icon: Backpack,
    color: 'bg-blue-500',
    features: ['Book adventures', 'Join group tours', 'Write reviews', 'Connect with guides'],
    popular: true
  },
  {
    id: 'guide',
    title: 'Adventure Guide',
    description: 'Lead tours and share your expertise',
    icon: MapPin,
    color: 'bg-green-500',
    features: ['Create tours', 'Manage bookings', 'Set your rates', 'Build your reputation'],
    popular: false
  },
  {
    id: 'host',
    title: 'Host',
    description: 'Offer accommodations to travelers',
    icon: Users,
    color: 'bg-purple-500',
    features: ['List your property', 'Manage bookings', 'Set house rules', 'Earn income'],
    popular: false
  },
  {
    id: 'admin',
    title: 'Administrator',
    description: 'Platform management and oversight',
    icon: Shield,
    color: 'bg-red-500',
    features: ['Manage users', 'Monitor activities', 'Handle disputes', 'System administration'],
    popular: false
  }
];

export const RoleSelection: React.FC<RoleSelectionProps> = ({ isOpen, onClose }) => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { updateUserRole } = useAuth();

  const handleRoleSelection = async () => {
    if (!selectedRole) return;

    setLoading(true);
    try {
      const { error } = await updateUserRole(selectedRole);
      
      if (error) {
        toast.error('Failed to update role');
      } else {
        toast.success(`Welcome! You're now registered as a ${roles.find(r => r.id === selectedRole)?.title}`);
        onClose();
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Choose Your Role
          </DialogTitle>
          <p className="text-center text-gray-600 mt-2">
            Select how you'd like to use BelizeVibes. You can always change this later.
          </p>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card 
                key={role.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedRole === role.id 
                    ? 'ring-2 ring-blue-500 shadow-lg' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${role.color}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{role.title}</CardTitle>
                        {role.popular && (
                          <Badge variant="secondary" className="mt-1">
                            Most Popular
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedRole === role.id 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {selectedRole === role.id && (
                        <div className="w-full h-full rounded-full bg-blue-500" />
                      )}
                    </div>
                  </div>
                  <CardDescription className="text-sm mt-2">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center mt-6">
          <Button 
            onClick={handleRoleSelection}
            disabled={!selectedRole || loading}
            className="w-full max-w-md"
            size="lg"
          >
            {loading ? 'Setting up your account...' : 'Continue'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};