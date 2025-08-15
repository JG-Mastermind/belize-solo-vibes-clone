import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { TokenDebugger, useTokenInspector } from '@/components/auth/TokenDebugger';

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { inspectTokens } = useTokenInspector();

  useEffect(() => {
    const verifyRecoveryToken = async () => {
      try {
        // Inspect tokens for debugging
        const tokenDetails = inspectTokens();
        
        const type = searchParams.get('type');
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');

        console.log('[DEBUG] Recovery token validation:', {
          type,
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          tokenLength: accessToken?.length,
          urlParams: searchParams.toString()
        });

        // Verify this is a valid recovery request
        if (type !== 'recovery' || !accessToken || !refreshToken) {
          console.error('[DEBUG] Invalid recovery parameters:', { type, hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken });
          toast.error('Invalid password reset link');
          navigate('/');
          return;
        }

        // SECURITY: Test token validity WITHOUT setting a session
        // We'll temporarily set session only to test validity, then immediately clear it
        let isValidRecoveryToken = false;
        
        try {
          // Test if tokens are valid by attempting to set session
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          console.log('[DEBUG] Session test result:', {
            hasSession: !!sessionData.session,
            hasUser: !!sessionData.user,
            error: sessionError?.message
          });

          if (sessionData.session && sessionData.user && !sessionError) {
            isValidRecoveryToken = true;
            
            // CRITICAL: Immediately clear the session to prevent auto-login
            await supabase.auth.signOut();
            console.log('[DEBUG] Session cleared after token validation');
          }
        } catch (testError) {
          console.error('[DEBUG] Token validation test failed:', testError);
          isValidRecoveryToken = false;
        }

        if (!isValidRecoveryToken) {
          console.error('[DEBUG] Recovery token validation failed');
          toast.error('Invalid or expired password reset link');
          navigate('/');
          return;
        }

        console.log('[DEBUG] Recovery token validated successfully');
        setIsValidToken(true);
      } catch (error) {
        console.error('[DEBUG] Error verifying recovery token:', error);
        toast.error('Failed to verify password reset link');
        navigate('/');
      } finally {
        setIsCheckingToken(false);
      }
    };

    verifyRecoveryToken();
  }, [searchParams, navigate]);

  const validatePassword = (password: string) => {
    const errors: string[] = [];
    if (password.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
    if (!/\d/.test(password)) errors.push('One number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('One special character');
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate passwords
    const validationErrors: {[key: string]: string} = {};
    
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      validationErrors.password = 'Password must contain: ' + passwordErrors.join(', ');
    }

    if (newPassword !== confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Re-establish session temporarily for password update
      const type = searchParams.get('type');
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');

      console.log('[DEBUG] Starting password update process');

      if (type !== 'recovery' || !accessToken || !refreshToken) {
        toast.error('Invalid password reset session');
        return;
      }

      // Set session temporarily for password update
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (sessionError || !sessionData.session) {
        console.error('[DEBUG] Failed to establish session for password update:', sessionError);
        toast.error('Failed to establish secure session for password update');
        return;
      }

      console.log('[DEBUG] Temporary session established for password update');

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        console.error('[DEBUG] Password update failed:', updateError);
        toast.error('Failed to update password: ' + updateError.message);
        return;
      }

      console.log('[DEBUG] Password updated successfully');
      toast.success('Password updated successfully! Please sign in with your new password.');

      // SECURITY: Force sign out after password reset
      await signOut();
      console.log('[DEBUG] User signed out after password reset');
      
      // Redirect to sign in page
      navigate('/');
      
    } catch (error) {
      console.error('[DEBUG] Error updating password:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying password reset link...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Invalid Link</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 mb-4">
              This password reset link is invalid or has expired.
            </p>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const passwordErrors = validatePassword(newPassword);
  const isPasswordValid = passwordErrors.length === 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <TokenDebugger />
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
          <CardDescription>
            Enter your new password below. You'll need to sign in after resetting your password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className={errors.password ? 'border-red-500' : ''}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">Password Requirements:</p>
                  <div className="space-y-1">
                    {[
                      { check: newPassword.length >= 8, text: 'At least 8 characters' },
                      { check: /[A-Z]/.test(newPassword), text: 'One uppercase letter' },
                      { check: /[a-z]/.test(newPassword), text: 'One lowercase letter' },
                      { check: /\d/.test(newPassword), text: 'One number' },
                      { check: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword), text: 'One special character' },
                    ].map((requirement, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {requirement.check ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm ${requirement.check ? 'text-green-600' : 'text-red-600'}`}>
                          {requirement.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {errors.password && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.password}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              
              {errors.confirmPassword && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.confirmPassword}</AlertDescription>
                </Alert>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || !isPasswordValid || newPassword !== confirmPassword}
            >
              {isLoading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel and return to home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;