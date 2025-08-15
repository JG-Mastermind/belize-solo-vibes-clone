import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

interface AdminLoginFormProps {
  onForgotPassword: (email: string) => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { signIn, getUserRole } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('🔐 Admin login attempt for:', email);
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        console.error('❌ Sign in error:', signInError);
        console.error('Error details:', {
          message: signInError.message,
          code: signInError.code,
          status: signInError.status
        });
        setError('Invalid credentials. Please check your email and password.');
        return;
      }

      console.log('✅ Sign in successful, checking role...');

      // Wait for auth state to update and role to be fetched
      // Poll for role until it's available or timeout after 5 seconds
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds with 100ms intervals
      let userRole = null;
      
      while (attempts < maxAttempts) {
        userRole = getUserRole();
        if (userRole) break;
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      // Verify user has admin role
      if (userRole !== 'admin' && userRole !== 'super_admin') {
        setError('Access denied. This account does not have admin privileges.');
        return;
      }
      toast.success('Welcome to the admin portal!');
      navigate('/admin');

    } catch (error) {
      console.error('Admin login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      toast.error('Please enter your email address first');
      return;
    }
    onForgotPassword(email);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Admin Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your admin email"
          className={error ? 'border-red-500' : ''}
          required
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className={error ? 'border-red-500' : ''}
            required
            autoComplete="current-password"
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
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button 
        type="submit" 
        className="w-full bg-red-600 hover:bg-red-700 text-white"
        disabled={isLoading}
      >
        {isLoading ? 'Signing In...' : 'Sign In to Admin Portal'}
      </Button>

      <div className="text-center">
        <Button
          type="button"
          variant="ghost"
          onClick={handleForgotPassword}
          className="text-sm text-gray-600 hover:text-gray-800"
          disabled={!email}
        >
          Forgot admin password?
        </Button>
      </div>
    </form>
  );
};

export default AdminLoginForm;