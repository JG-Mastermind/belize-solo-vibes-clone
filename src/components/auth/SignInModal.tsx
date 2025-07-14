
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useAuth } from './AuthProvider';
import { RoleSelection } from './RoleSelection';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import analytics from '@/utils/analytics';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

type AuthMode = 'signin' | 'signup' | 'reset';
type AuthProvider = 'google' | 'apple' | 'instagram';

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onSwitchToSignUp }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<AuthProvider | null>(null);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  
  const { 
    signIn, 
    signUp, 
    signInWithOAuth, 
    resetPassword, 
    isDeviceIOS, 
    rememberSignInMethod, 
    getPreferredSignInMethod,
    getUserRole
  } = useAuth();

  useEffect(() => {
    if (isOpen) {
      analytics.trackModalOpen('auth_modal');
      const preferred = getPreferredSignInMethod();
      if (preferred && preferred !== 'email') {
        // Auto-highlight preferred method
      }
    }
  }, [isOpen, getPreferredSignInMethod]);

  const validateEmail = (email: string): string[] => {
    const errors: string[] = [];
    if (!email) errors.push('Email is required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Please enter a valid email address');
    return errors;
  };

  const validatePassword = (password: string, isSignUp: boolean = false): string[] => {
    const errors: string[] = [];
    if (!password) errors.push('Password is required');
    else if (isSignUp) {
      if (password.length < 8) errors.push('Password must be at least 8 characters');
      if (!/[A-Z]/.test(password)) errors.push('Password must contain an uppercase letter');
      if (!/[a-z]/.test(password)) errors.push('Password must contain a lowercase letter');
      if (!/\d/.test(password)) errors.push('Password must contain a number');
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Password must contain a special character');
    }
    return errors;
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password, mode === 'signup');
    
    setEmailErrors(emailValidation);
    setPasswordErrors(passwordValidation);
    
    if (emailValidation.length > 0 || passwordValidation.length > 0) {
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (mode === 'signup' && !agreeToTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password, rememberMe);
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password');
          } else if (error.message.includes('Email not confirmed')) {
            toast.error('Please check your email and click the confirmation link');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Successfully signed in!');
          rememberSignInMethod('email');
          
          // Check if user needs to select a role
          if (!getUserRole()) {
            setShowRoleSelection(true);
          } else {
            onClose();
          }
          
          resetForm();
        }
      } else if (mode === 'signup') {
        const { error } = await signUp(email, password, {
          first_name: firstName,
          last_name: lastName
        });
        
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Account created! Please check your email for verification.');
          setMode('signin');
          resetForm();
        }
      } else if (mode === 'reset') {
        const { error } = await resetPassword(email);
        
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Password reset email sent! Check your inbox.');
          setMode('signin');
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: AuthProvider) => {
    setOauthLoading(provider);
    
    try {
      const { error } = await signInWithOAuth(provider);
      
      if (error) {
        toast.error(`Failed to sign in with ${provider}`);
      } else {
        rememberSignInMethod(provider);
        toast.success(`Redirecting to ${provider}...`);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setOauthLoading(null);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setEmailErrors([]);
    setPasswordErrors([]);
    setAgreeToTerms(false);
  };

  const handleClose = () => {
    analytics.trackModalClose('auth_modal');
    resetForm();
    setMode('signin');
    onClose();
  };

  const handleRoleSelectionClose = () => {
    setShowRoleSelection(false);
    onClose();
  };

  const isIOS = isDeviceIOS();
  const preferredMethod = getPreferredSignInMethod();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {mode === 'signin' ? 'Welcome Back!' : 
               mode === 'signup' ? 'Join BelizeVibes' : 
               'Reset Password'}
            </DialogTitle>
            <p className="text-center text-gray-600">
              {mode === 'signin' ? 'Sign in to book your next adventure' : 
               mode === 'signup' ? 'Start your adventure journey today' : 
               'We\'ll send you a link to reset your password'}
            </p>
          </DialogHeader>

          {mode !== 'reset' && (
            <div className="space-y-3">
              {/* OAuth Buttons */}
              <div className="grid grid-cols-1 gap-3">
                {/* Google Sign-In (Primary) */}
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-center space-x-2 border-2 hover:border-blue-500 transition-colors"
                  onClick={() => handleOAuthSignIn('google')}
                  disabled={oauthLoading !== null}
                >
                  {oauthLoading === 'google' ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  <span>Continue with Google</span>
                  {preferredMethod === 'google' && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Preferred</span>
                  )}
                </Button>

                {/* Apple Sign-In (Prioritized on iOS) */}
                {isIOS && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-center space-x-2 border-2 hover:border-gray-800 transition-colors"
                    onClick={() => handleOAuthSignIn('apple')}
                    disabled={oauthLoading !== null}
                  >
                    {oauthLoading === 'apple' ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.017 17.507c-.005-.014-.008-.027-.011-.041-.007-.022-.01-.045-.014-.068-.006-.032-.008-.065-.009-.098 0-.033.003-.066.009-.098.004-.023.007-.046.014-.068.003-.014.006-.027.011-.041.007-.023.018-.045.031-.066.008-.014.018-.026.029-.037.016-.017.035-.032.056-.044.014-.008.029-.014.045-.019.023-.007.047-.01.071-.01s.048.003.071.01c.016.005.031.011.045.019.021.012.04.027.056.044.011.011.021.023.029.037.013.021.024.043.031.066zm-.999-4.507c0-.552-.447-1-1-1s-1 .448-1 1 .447 1 1 1 1-.448 1-1zm2.5 0c0-.552-.447-1-1-1s-1 .448-1 1 .447 1 1 1 1-.448 1-1z"/>
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                    )}
                    <span>Continue with Apple</span>
                    {preferredMethod === 'apple' && (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Preferred</span>
                    )}
                  </Button>
                )}

                {/* Apple Sign-In for non-iOS */}
                {!isIOS && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-center space-x-2 border hover:border-gray-800 transition-colors"
                    onClick={() => handleOAuthSignIn('apple')}
                    disabled={oauthLoading !== null}
                  >
                    {oauthLoading === 'apple' ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                    )}
                    <span>Continue with Apple</span>
                    {preferredMethod === 'apple' && (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Preferred</span>
                    )}
                  </Button>
                )}

                {/* Instagram Sign-In */}
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-center space-x-2 border-2 hover:border-pink-500 transition-colors"
                  onClick={() => handleOAuthSignIn('instagram')}
                  disabled={oauthLoading !== null}
                >
                  {oauthLoading === 'instagram' ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  )}
                  <span>Continue with Instagram</span>
                  {preferredMethod === 'instagram' && (
                    <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">Preferred</span>
                  )}
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>
            </div>
          )}

          {/* Email Authentication Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 ${emailErrors.length > 0 ? 'border-red-500' : ''}`}
                  placeholder="Enter your email"
                  required
                />
              </div>
              {emailErrors.map((error, index) => (
                <p key={index} className="text-sm text-red-600">{error}</p>
              ))}
            </div>

            {mode !== 'reset' && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 pr-10 ${passwordErrors.length > 0 ? 'border-red-500' : ''}`}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordErrors.map((error, index) => (
                  <p key={index} className="text-sm text-red-600">{error}</p>
                ))}
              </div>
            )}

            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signin' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Remember me
                  </Label>
                </div>
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {mode === 'signup' && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm font-normal">
                  I agree to the{' '}
                  <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
                </Label>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'signin' ? 'Signing in...' : 
                   mode === 'signup' ? 'Creating account...' : 
                   'Sending email...'}
                </>
              ) : (
                mode === 'signin' ? 'Sign In' : 
                mode === 'signup' ? 'Create Account' : 
                'Send Reset Email'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center text-sm space-y-2">
            {mode === 'signin' ? (
              <p>
                New to BelizeVibes?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Create an account
                </button>
              </p>
            ) : mode === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p>
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <RoleSelection 
        isOpen={showRoleSelection} 
        onClose={handleRoleSelectionClose} 
      />
    </>
  );
};
