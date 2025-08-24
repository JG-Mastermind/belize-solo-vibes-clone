import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/components/auth/AuthProvider';
import AdminLogin from '@/pages/admin/AdminLogin';

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

// Use centralized mock from jest.config.js moduleNameMapper

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock AuthProvider to prevent loading state
jest.mock('@/components/auth/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuth: () => ({
    user: null,
    loading: false,
    getUserRole: jest.fn().mockReturnValue(null),
    resetPassword: jest.fn(),
    signIn: jest.fn().mockResolvedValue({ error: null }),
    signOut: jest.fn().mockResolvedValue({ error: null })
  })
}));

const TestWrapper: React.FC<{ children: React.ReactNode; initialEntries?: string[] }> = ({ 
  children, 
  initialEntries = ['/admin/login'] 
}) => (
  <MemoryRouter initialEntries={initialEntries}>
    {children}
  </MemoryRouter>
);

describe('Admin Password Reset Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('complete password reset flow: email request → recovery link → password update', async () => {
    const { supabase } = require('@/integrations/supabase/client');
    const { toast } = require('sonner');

    // Step 1: Admin login page with forgot password
    supabase.auth.resetPasswordForEmail.mockResolvedValue({ data: {}, error: null });

    const { rerender } = render(
      <TestWrapper>
        <AdminLogin />
      </TestWrapper>
    );

    // Verify we're on the admin login page
    expect(screen.getByText('Admin Portal')).toBeInTheDocument();
    
    // Enter email and request password reset
    const emailInput = screen.getByPlaceholderText('Enter your admin email');
    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });

    const forgotPasswordButton = screen.getByText('Forgot admin password?');
    fireEvent.click(forgotPasswordButton);

    await waitFor(() => {
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('admin@example.com', {
        redirectTo: 'http://localhost/admin/login'
      });
      expect(toast.success).toHaveBeenCalledWith('If an admin account exists with this email, you will receive password reset instructions.');
    });

    // Step 2: User clicks recovery link (simulated by URL change)
    supabase.auth.getUser.mockResolvedValue({ 
      data: { user: { id: 'admin-123', email: 'admin@example.com' } }, 
      error: null 
    });

    const recoveryUrl = '/admin/login?type=recovery&access_token=recovery-token-123&refresh_token=refresh-token-123';
    
    rerender(
      <TestWrapper initialEntries={[recoveryUrl]}>
        <AdminLogin />
      </TestWrapper>
    );

    // Verify we're now on the password reset form
    await waitFor(() => {
      expect(screen.getByText('Reset Admin Password')).toBeInTheDocument();
      expect(screen.getByText('Create a new secure password for your admin account')).toBeInTheDocument();
    });

    // Step 3: Complete password reset
    supabase.auth.setSession.mockResolvedValue({ error: null });
    supabase.auth.updateUser.mockResolvedValue({ error: null });
    supabase.auth.signOut.mockResolvedValue({ error: null });

    const passwordInput = screen.getByPlaceholderText('Enter your new password');
    const confirmInput = screen.getByPlaceholderText('Confirm your new password');
    
    fireEvent.change(passwordInput, { target: { value: 'NewSecureP@ssw0rd123!' } });
    fireEvent.change(confirmInput, { target: { value: 'NewSecureP@ssw0rd123!' } });

    // Verify password strength is good
    await waitFor(() => {
      expect(screen.getByText('Strong')).toBeInTheDocument();
      expect(screen.getByText('Passwords match')).toBeInTheDocument();
    });

    const updateButton = screen.getByText('Update Password');
    expect(updateButton).not.toBeDisabled();
    
    fireEvent.click(updateButton);

    // Verify the complete password reset flow
    await waitFor(() => {
      expect(supabase.auth.setSession).toHaveBeenCalledWith({
        access_token: 'recovery-token-123',
        refresh_token: 'refresh-token-123'
      });
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        password: 'NewSecureP@ssw0rd123!'
      });
      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/admin/login');
      expect(toast.success).toHaveBeenCalledWith('Password updated successfully! Please sign in with your new password.');
    });
  });

  test('security: no auto-login during password reset flow', async () => {
    const { supabase } = require('@/integrations/supabase/client');
    
    // Mock valid recovery token
    supabase.auth.getUser.mockResolvedValue({ 
      data: { user: { id: 'admin-123', email: 'admin@example.com' } }, 
      error: null 
    });

    const recoveryUrl = '/admin/login?type=recovery&access_token=recovery-token&refresh_token=refresh-token';
    
    render(
      <TestWrapper initialEntries={[recoveryUrl]}>
        <AdminLogin />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Reset Admin Password')).toBeInTheDocument();
    });

    // Verify that setSession is NOT called during component mount
    // (it should only be called when the user submits the password form)
    expect(supabase.auth.setSession).not.toHaveBeenCalled();
    
    // Verify we're shown the password reset form, not auto-logged in
    expect(screen.getByPlaceholderText('Enter your new password')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalledWith('/admin');
  });

  test('handles expired recovery tokens gracefully', async () => {
    const { supabase } = require('@/integrations/supabase/client');
    const { toast } = require('sonner');
    
    // Mock expired token
    supabase.auth.getUser.mockResolvedValue({ 
      data: { user: null }, 
      error: new Error('Token expired') 
    });

    const recoveryUrl = '/admin/login?type=recovery&access_token=expired-token';
    
    render(
      <TestWrapper initialEntries={[recoveryUrl]}>
        <AdminLogin />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid or expired recovery token');
      expect(mockNavigate).toHaveBeenCalledWith('/admin/login');
    });
  });

  test('prevents weak passwords from being submitted', async () => {
    const { supabase } = require('@/integrations/supabase/client');
    
    supabase.auth.getUser.mockResolvedValue({ 
      data: { user: { id: 'admin-123' } }, 
      error: null 
    });

    const recoveryUrl = '/admin/login?type=recovery&access_token=valid-token';
    
    render(
      <TestWrapper initialEntries={[recoveryUrl]}>
        <AdminLogin />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Reset Admin Password')).toBeInTheDocument();
    });

    const passwordInput = screen.getByPlaceholderText('Enter your new password');
    const confirmInput = screen.getByPlaceholderText('Confirm your new password');
    
    // Enter weak password
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    fireEvent.change(confirmInput, { target: { value: 'weak' } });

    await waitFor(() => {
      expect(screen.getByText('Weak')).toBeInTheDocument();
    });

    const updateButton = screen.getByText('Update Password');
    expect(updateButton).toBeDisabled();

    // Verify no password update is attempted
    expect(supabase.auth.updateUser).not.toHaveBeenCalled();
  });

  test('normal admin login flow remains unchanged', async () => {
    const { supabase } = require('@/integrations/supabase/client');
    
    // Mock successful admin login
    supabase.auth.signInWithPassword.mockResolvedValue({ 
      data: { 
        user: { id: 'admin-123', user_metadata: { role: 'admin' } },
        session: { access_token: 'session-token' }
      }, 
      error: null 
    });

    render(
      <TestWrapper>
        <AdminLogin />
      </TestWrapper>
    );

    // Verify normal admin login form is shown
    expect(screen.getByText('Admin Portal')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your admin email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();

    // Fill in credentials
    const emailInput = screen.getByPlaceholderText('Enter your admin email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    
    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'adminpassword' } });

    const signInButton = screen.getByText('Sign In to Admin Portal');
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'admin@example.com',
        password: 'adminpassword'
      });
    });
  });
});