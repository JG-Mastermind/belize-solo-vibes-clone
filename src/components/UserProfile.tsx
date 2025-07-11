
import React, { useState } from 'react';
import { useAuth } from './auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SignInModal } from './auth/SignInModal';
import { SignUpModal } from './auth/SignUpModal';
import { toast } from 'sonner';

export const UserProfile: React.FC = () => {
  const { user, signOut, loading, getUserRole } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Successfully signed out');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-4">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setShowSignIn(true)}>
          Sign In
        </Button>
        <Button onClick={() => setShowSignUp(true)}>
          Sign Up
        </Button>
        
        <SignInModal
          isOpen={showSignIn}
          onClose={() => setShowSignIn(false)}
          onSwitchToSignUp={() => {
            setShowSignIn(false);
            setShowSignUp(true);
          }}
        />
        
        <SignUpModal
          isOpen={showSignUp}
          onClose={() => setShowSignUp(false)}
          onSwitchToSignIn={() => {
            setShowSignUp(false);
            setShowSignIn(true);
          }}
        />
      </div>
    );
  }

  const userMetadata = user.user_metadata || {};
  const userEmail = user.email || '';
  const firstName = userMetadata.first_name || '';
  const lastName = userMetadata.last_name || '';
  const userRole = getUserRole() || 'traveler';
  
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'guide': return 'bg-green-100 text-green-800';
      case 'host': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };
  
  const capitalizeRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="flex items-center gap-4">
      <Card className="min-w-[200px]">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={userMetadata.avatar_url} />
              <AvatarFallback>
                {firstName.charAt(0)}{lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm">
                {firstName} {lastName}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <Badge className={getRoleBadgeColor(userRole)}>
              {capitalizeRole(userRole)}
            </Badge>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
