import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import AdminLogin from '@/pages/admin/AdminLogin';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';

// Mock the components that might cause issues
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

// Mock the Supabase client to control its behavior for all tests in this file.
// This mock resolves the AuthProvider's loading state immediately.
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      // Simulate an initial state where no user is logged in.
      getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      // Mock other auth functions to prevent errors if they are called.
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
      getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      setSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      updateUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      resetPasswordForEmail: jest.fn(() => Promise.resolve({ data: {}, error: null })),
      signInWithPassword: jest.fn(() => Promise.resolve({ 
        data: { user: null, session: null }, 
        error: null 
      })),
      signOut: jest.fn(() => Promise.resolve({ error: null })),
    },
    // Mock the database query chain used by AuthProvider to get user roles.
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      // Ensure it resolves to no user data, matching the getSession mock.
      maybeSingle: jest.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  },
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const TestWrapper: React.FC<{ children: React.ReactNode; initialEntries?: string[] }> = ({ children, initialEntries = ['/'] }) => (
  <MemoryRouter initialEntries={initialEntries}>
    <AuthProvider>
      {children}
    </AuthProvider>
  </MemoryRouter>
);

describe('AdminLogin Password Reset Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows normal admin login by default', async () => {
    render(
      <TestWrapper initialEntries={['/admin/login']}>
        <AdminLogin />
      </TestWrapper>
    );

    // Use findByText which waits for the element to appear.
    // This handles the initial loading state of the AuthProvider.
    expect(await screen.findByText('Admin Portal')).toBeInTheDocument();
    expect(screen.getByText('Restricted access - Admin credentials required')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your admin email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  test('shows password reset form when recovery parameters are present', async () => {
    const recoveryUrl = '/admin/login?type=recovery&access_token=fake-token&refresh_token=fake-refresh';
    
    render(
      <TestWrapper initialEntries={[recoveryUrl]}>
        <AdminLogin />
      </TestWrapper>
    );

    // Use findByText which waits for the element to appear.
    expect(await screen.findByText('Reset Admin Password')).toBeInTheDocument();
    expect(screen.getByText('Create a new secure password for your admin account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your new password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm your new password')).toBeInTheDocument();
  });

  test('admin login form handles forgot password correctly', async () => {
    const { supabase } = require('@/integrations/supabase/client');
    supabase.auth.resetPasswordForEmail.mockResolvedValue({ data: {}, error: null });

    render(
      <TestWrapper initialEntries={['/admin/login']}>
        <AdminLogin />
      </TestWrapper>
    );

    // Wait for the form to load and then enter email
    const emailInput = await screen.findByPlaceholderText('Enter your admin email');
    fireEvent.change(emailInput, { target: { value: 'admin@test.com' } });

    // Click forgot password
    const forgotPasswordButton = screen.getByText('Forgot admin password?');
    fireEvent.click(forgotPasswordButton);

    await waitFor(() => {
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('admin@test.com', {
        redirectTo: 'http://localhost/admin/login'
      });
    });
  });

  test('password reset form validates token on mount', async () => {
    const { supabase } = require('@/integrations/supabase/client');
    supabase.auth.getUser.mockResolvedValue({ 
      data: { user: { id: 'user-123' } }, 
      error: null 
    });

    const recoveryUrl = '/admin/login?type=recovery&access_token=valid-token';
    
    render(
      <TestWrapper initialEntries={[recoveryUrl]}>
        <AdminLogin />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(supabase.auth.getUser).toHaveBeenCalledWith('valid-token');
    });
  });

  test('password reset form redirects on invalid token', async () => {
    const { supabase } = require('@/integrations/supabase/client');
    supabase.auth.getUser.mockResolvedValue({ 
      data: { user: null }, 
      error: new Error('Invalid token') 
    });

    const recoveryUrl = '/admin/login?type=recovery&access_token=invalid-token';
    
    render(
      <TestWrapper initialEntries={[recoveryUrl]}>
        <AdminLogin />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin/login');
      expect(toast.error).toHaveBeenCalledWith('Invalid or expired recovery token');
    });
  });

  test('password reset form validates password strength', async () => {
    const { supabase } = require('@/integrations/supabase/client');
    supabase.auth.getUser.mockResolvedValue({ 
      data: { user: { id: 'user-123' } }, 
      error: null 
    });

    const recoveryUrl = '/admin/login?type=recovery&access_token=valid-token';
    
    render(
      <TestWrapper initialEntries={[recoveryUrl]}>
        <AdminLogin />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.queryByText('Validating recovery token...')).not.toBeInTheDocument();
    });

    // Enter weak password
    const passwordInput = screen.getByPlaceholderText('Enter your new password');
    fireEvent.change(passwordInput, { target: { value: 'weak' } });

    await waitFor(() => {
      expect(screen.getByText('Weak')).toBeInTheDocument();
    });

    // Enter strong password
    fireEvent.change(passwordInput, { target: { value: 'StrongP@ssw0rd123!' } });

    await waitFor(() => {
      expect(screen.getByText('Strong')).toBeInTheDocument();
    });
  });

  test('password reset form signs out after successful reset', async () => {
    const { supabase } = require('@/integrations/supabase/client');
    supabase.auth.getUser.mockResolvedValue({ 
      data: { user: { id: 'user-123' } }, 
      error: null 
    });
    supabase.auth.setSession.mockResolvedValue({ error: null });
    supabase.auth.updateUser.mockResolvedValue({ error: null });
    supabase.auth.signOut.mockResolvedValue({ error: null });

    const recoveryUrl = '/admin/login?type=recovery&access_token=valid-token&refresh_token=refresh-token';
    
    render(
      <TestWrapper initialEntries={[recoveryUrl]}>
        <AdminLogin />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.queryByText('Validating recovery token...')).not.toBeInTheDocument();
    });

    // Enter strong password
    const passwordInput = screen.getByPlaceholderText('Enter your new password');
    const confirmInput = screen.getByPlaceholderText('Confirm your new password');
    
    fireEvent.change(passwordInput, { target: { value: 'StrongP@ssw0rd123!' } });
    fireEvent.change(confirmInput, { target: { value: 'StrongP@ssw0rd123!' } });

    // Submit form
    const submitButton = screen.getByText('Update Password');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(supabase.auth.setSession).toHaveBeenCalledWith({
        access_token: 'valid-token',
        refresh_token: 'refresh-token'
      });
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        password: 'StrongP@ssw0rd123!'
      });
      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/admin/login');
      expect(toast.success).toHaveBeenCalledWith('Password updated successfully! Please sign in with your new password.');
    });
  });
});