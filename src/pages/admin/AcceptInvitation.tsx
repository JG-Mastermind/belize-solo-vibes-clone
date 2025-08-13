import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Mail, Shield } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

const AcceptInvitation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  
  const email = searchParams.get('email');
  const code = searchParams.get('code');
  
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid' | 'expired' | 'used' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [invitation, setInvitation] = useState<any>(null);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (!email || !code) {
      setStatus('invalid');
      setMessage('Invalid invitation link. Email and code are required.');
      return;
    }

    validateInvitation();
  }, [email, code]);

  const validateInvitation = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_invitations')
        .select('*')
        .eq('email', email)
        .eq('invitation_code', code)
        .single();

      if (error || !data) {
        setStatus('invalid');
        setMessage('Invalid invitation link. The invitation may not exist.');
        return;
      }

      setInvitation(data);

      if (data.used_at) {
        setStatus('used');
        setMessage('This invitation has already been used.');
        return;
      }

      if (!data.is_active) {
        setStatus('invalid');
        setMessage('This invitation has been revoked.');
        return;
      }

      if (new Date(data.expires_at) < new Date()) {
        setStatus('expired');
        setMessage('This invitation has expired. Please request a new one.');
        return;
      }

      setStatus('valid');
      setMessage(`You've been invited to join BelizeVibes as a ${data.role_type}.`);
    } catch (error) {
      console.error('Error validating invitation:', error);
      setStatus('error');
      setMessage('An error occurred while validating the invitation.');
    }
  };

  const acceptInvite = async () => {
    if (!user) {
      setMessage('You must be signed in to accept this invitation. Please sign in first.');
      return;
    }

    if (user.email?.toLowerCase() !== email?.toLowerCase()) {
      setMessage('You must be signed in with the invited email address to accept this invitation.');
      return;
    }

    setAccepting(true);
    try {
      const { data, error } = await supabase.rpc('accept_admin_invitation', {
        p_email: email,
        p_code: code,
      });

      if (error) {
        throw error;
      }

      setStatus('success');
      setMessage(`Invitation accepted successfully! You are now a ${invitation.role_type}.`);
      
      // Refresh user session to get updated role
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      setStatus('error');
      setMessage(error.message || 'Failed to accept invitation. Please try again.');
    } finally {
      setAccepting(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'valid':
        return <Clock className="h-6 w-6 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'invalid':
      case 'expired':
      case 'used':
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'valid':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'invalid':
      case 'expired':
      case 'used':
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:bg-gradient-to-br dark:from-blue-950/20 dark:via-background dark:to-blue-950/10 flex items-center justify-center p-4">
      <Card className={`w-full max-w-md ${getStatusColor()}`}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Invitation
          </CardTitle>
          <CardDescription>
            {email && (
              <div className="flex items-center justify-center gap-1 mt-2">
                <Mail className="h-4 w-4" />
                {email}
              </div>
            )}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">{message}</p>
            
            {invitation && status === 'valid' && (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <Badge variant="outline" className="text-sm">
                    {invitation.role_type.toUpperCase()} ROLE
                  </Badge>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Expires: {new Date(invitation.expires_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {!user && status === 'valid' && (
              <Button onClick={() => signIn()} className="w-full">
                Sign In to Accept Invitation
              </Button>
            )}

            {user && status === 'valid' && (
              <Button 
                onClick={acceptInvite} 
                disabled={accepting}
                className="w-full"
              >
                {accepting ? 'Accepting...' : 'Accept Invitation'}
              </Button>
            )}

            {status === 'success' && (
              <Button 
                onClick={() => navigate('/dashboard')} 
                className="w-full"
              >
                Go to Dashboard
              </Button>
            )}

            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptInvitation;