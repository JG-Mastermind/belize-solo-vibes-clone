import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, getUserRole } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Wait for auth state to be established
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (user) {
          toast.success('Successfully signed in!');
          
          // Check if user needs to select a role
          if (!getUserRole()) {
            navigate('/?role-selection=true');
          } else {
            navigate('/');
          }
        } else {
          toast.error('Authentication failed');
          navigate('/');
        }
      } catch (error) {
        toast.error('Authentication error');
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [user, getUserRole, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <h2 className="text-lg font-semibold mb-2">Completing sign in...</h2>
        <p className="text-gray-600">Please wait while we redirect you.</p>
      </div>
    </div>
  );
};

export default AuthCallback;