import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const PasswordResetForm: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(true);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signOut } = useAuth();

  // Password strength calculation
  const calculatePasswordStrength = (password: string): number => {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 15;
    if (/[a-z]/.test(password)) score += 15;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 15;
    return Math.min(score, 100);
  };

  const passwordStrength = calculatePasswordStrength(newPassword);

  const getStrengthColor = (strength: number): string => {
    if (strength < 40) return 'bg-red-500';
    if (strength < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthLabel = (strength: number): string => {
    if (strength < 40) return 'Weak';
    if (strength < 70) return 'Good';
    return 'Strong';
  };

  // Validation criteria
  const validationCriteria = [
    { label: 'At least 8 characters', test: (pwd: string) => pwd.length >= 8 },
    { label: 'Contains uppercase letter', test: (pwd: string) => /[A-Z]/.test(pwd) },
    { label: 'Contains lowercase letter', test: (pwd: string) => /[a-z]/.test(pwd) },
    { label: 'Contains number', test: (pwd: string) => /[0-9]/.test(pwd) },
    { label: 'Contains special character', test: (pwd: string) => /[^A-Za-z0-9]/.test(pwd) },
  ];

  // Validate access token on component mount
  useEffect(() => {
    const validateToken = async () => {
      const accessToken = searchParams.get('access_token');
      const type = searchParams.get('type');

      if (type !== 'recovery' || !accessToken) {
        toast.error('Invalid or missing recovery token');
        navigate('/admin/login');
        return;
      }

      try {
        // Validate the token without setting session
        const { data, error } = await supabase.auth.getUser(accessToken);
        
        if (error || !data.user) {
          toast.error('Invalid or expired recovery token');
          navigate('/admin/login');
          return;
        }

        setIsValidating(false);
      } catch (error) {
        console.error('Token validation error:', error);
        toast.error('Token validation failed');
        navigate('/admin/login');
      }
    };

    validateToken();
  }, [searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (passwordStrength < 70) {
      setError('Password does not meet minimum security requirements');
      return;
    }

    setIsLoading(true);

    try {
      const accessToken = searchParams.get('access_token');
      
      if (!accessToken) {
        setError('Recovery token is missing');
        return;
      }

      // Set session temporarily to update password
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: searchParams.get('refresh_token') || '',
      });

      if (sessionError) {
        console.error('Session error:', sessionError);
        setError('Failed to validate recovery token');
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        console.error('Password update error:', updateError);
        setError('Failed to update password. Please try again.');
        return;
      }

      // SECURITY: Sign out after password reset
      await signOut();

      toast.success('Password updated successfully! Please sign in with your new password.');
      navigate('/admin/login');

    } catch (error) {
      console.error('Password reset error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Validating recovery token...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="new-password">New Password</Label>
        <div className="relative">
          <Input
            id="new-password"
            type={showPasswords ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            className={error ? 'border-red-500' : ''}
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPasswords(!showPasswords)}
          >
            {showPasswords ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>

        {/* Password strength indicator */}
        {newPassword && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Password Strength:</span>
              <span className={passwordStrength >= 70 ? 'text-green-600' : passwordStrength >= 40 ? 'text-yellow-600' : 'text-red-600'}>
                {getStrengthLabel(passwordStrength)}
              </span>
            </div>
            <Progress 
              value={passwordStrength} 
              className="h-2"
            />
          </div>
        )}

        {/* Password criteria checklist */}
        {newPassword && (
          <div className="space-y-1">
            {validationCriteria.map((criterion, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                {criterion.test(newPassword) ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <span className={criterion.test(newPassword) ? 'text-green-700' : 'text-red-700'}>
                  {criterion.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm New Password</Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showPasswords ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            className={error ? 'border-red-500' : ''}
            required
            autoComplete="new-password"
          />
        </div>

        {/* Password match indicator */}
        {confirmPassword && (
          <div className="flex items-center space-x-2 text-sm">
            {newPassword === confirmPassword ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-green-700">Passwords match</span>
              </>
            ) : (
              <>
                <X className="h-4 w-4 text-red-500" />
                <span className="text-red-700">Passwords do not match</span>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button 
        type="submit" 
        className="w-full bg-red-600 hover:bg-red-700 text-white"
        disabled={isLoading || passwordStrength < 70 || newPassword !== confirmPassword}
      >
        {isLoading ? 'Updating Password...' : 'Update Password'}
      </Button>

      <div className="text-center">
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate('/admin/login')}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Cancel and return to login
        </Button>
      </div>
    </form>
  );
};

export default PasswordResetForm;