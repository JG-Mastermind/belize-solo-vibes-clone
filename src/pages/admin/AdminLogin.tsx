import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Shield, AlertTriangle, KeyRound } from 'lucide-react';
import AdminLoginForm from '@/components/auth/AdminLoginForm';
import PasswordResetForm from '@/components/auth/PasswordResetForm';
import '@/utils/clearAuthState';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, getUserRole, loading, resetPassword } = useAuth();

  // Check if this is a password recovery flow
  const isPasswordReset = searchParams.get('type') === 'recovery' && searchParams.get('access_token');

  // Redirect if already authenticated with admin role (but not during password reset)
  useEffect(() => {
    if (!loading && user && !isPasswordReset) {
      const userRole = getUserRole();
      if (userRole === 'admin' || userRole === 'super_admin') {
        navigate('/admin');
        return;
      }
      // If user is logged in but not admin, sign them out
      toast.error('Access denied. Admin credentials required.');
    }
  }, [user, getUserRole, loading, navigate, isPasswordReset]);

  const handleForgotPassword = async (email: string) => {
    try {
      const { error } = await resetPassword(email);
      if (error) {
        toast.error('Unable to send password reset email');
      } else {
        toast.success('If an admin account exists with this email, you will receive password reset instructions.');
      }
    } catch (error) {
      toast.error('Unable to send password reset email');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            {isPasswordReset ? (
              <KeyRound className="w-6 h-6 text-red-600" />
            ) : (
              <Shield className="w-6 h-6 text-red-600" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            {isPasswordReset ? 'Reset Admin Password' : 'Admin Portal'}
          </CardTitle>
          <CardDescription>
            {isPasswordReset 
              ? 'Create a new secure password for your admin account'
              : 'Restricted access - Admin credentials required'
            }
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!isPasswordReset && (
            <Alert className="mb-6 border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                This area is restricted to authorized administrators only. 
                All login attempts are logged and monitored.
              </AlertDescription>
            </Alert>
          )}

          {isPasswordReset ? (
            <PasswordResetForm />
          ) : (
            <AdminLoginForm onForgotPassword={handleForgotPassword} />
          )}

          {!isPasswordReset && (
            <div className="mt-6 text-center">
              <div className="border-t pt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="text-sm w-full"
                >
                  Return to Main Site
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;