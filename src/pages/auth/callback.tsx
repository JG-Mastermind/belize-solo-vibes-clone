import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { TokenDebugger } from '@/components/auth/TokenDebugger';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, getUserRole } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if this is a password recovery callback
        const type = searchParams.get('type');
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        
        console.log('[DEBUG] Auth callback received:', {
          type,
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          tokenLength: accessToken?.length,
          allParams: Object.fromEntries(searchParams.entries())
        });
        
        // SECURITY: Never auto-login on password recovery
        if (type === 'recovery' && accessToken) {
          console.log('[DEBUG] Password recovery detected - redirecting to reset form');
          console.log('[DEBUG] Recovery token details:', {
            accessTokenLength: accessToken?.length,
            hasRefreshToken: !!refreshToken,
            paramString: searchParams.toString()
          });
          
          // CRITICAL: Sign out any auto-created session before redirect
          const { error: signOutError } = await supabase.auth.signOut();
          if (signOutError) {
            console.error('[DEBUG] Error signing out auto-session:', signOutError);
          }
          
          // Redirect to admin login page with recovery token for admin password reset
          navigate(`/admin/login?${searchParams.toString()}`);
          return;
        }
        
        // Wait for auth state to be established for normal auth flows
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
  }, [user, getUserRole, navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <TokenDebugger />
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <h2 className="text-lg font-semibold mb-2">Completing sign in...</h2>
        <p className="text-gray-600">Please wait while we redirect you.</p>
      </div>
    </div>
  );
};

export default AuthCallback;