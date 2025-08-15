import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PasswordResetForm from '@/components/auth/PasswordResetForm';
import { AuthProvider } from '@/components/auth/AuthProvider';

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
      setSession: jest.fn(),
      updateUser: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } }
      })
    }
  }
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const TestWrapper: React.FC<{ children: React.ReactNode; searchParams?: string }> = ({ 
  children, 
  searchParams = '?type=recovery&access_token=test-token' 
}) => (
  <MemoryRouter initialEntries={[`/admin/login${searchParams}`]}>
    <AuthProvider>
      {children}
    </AuthProvider>
  </MemoryRouter>
);

describe('PasswordResetForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders password reset form with validation criteria', async () => {
    const { supabase } = require('@/integrations/supabase/client');
    supabase.auth.getUser.mockResolvedValue({ 
      data: { user: { id: 'user-123' } }, 
      error: null 
    });

    render(
      <TestWrapper>
        <PasswordResetForm />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.queryByText('Validating recovery token...')).not.toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText('Enter your new password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm your new password')).toBeInTheDocument();
    expect(screen.getByText('Update Password')).toBeInTheDocument();
  });

  test('shows password strength indicator when typing', async () => {
    const { supabase } = require('@/integrations/supabase/client');
    supabase.auth.getUser.mockResolvedValue({ 
      data: { user: { id: 'user-123' } }, 
      error: null 
    });

    render(
      <TestWrapper>
        <PasswordResetForm />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.queryByText('Validating recovery token...')).not.toBeInTheDocument();
    });

    const passwordInput = screen.getByPlaceholderText('Enter your new password');
    
    // Enter weak password
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    
    await waitFor(() => {
      expect(screen.getByText('Weak')).toBeInTheDocument();
      expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
    });
  });

  test('validates password criteria', async () => {
    const { supabase } = require('@/integrations/supabase/client');
    supabase.auth.getUser.mockResolvedValue({ 
      data: { user: { id: 'user-123' } }, 
      error: null 
    });

    render(
      <TestWrapper>
        <PasswordResetForm />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.queryByText('Validating recovery token...')).not.toBeInTheDocument();
    });

    const passwordInput = screen.getByPlaceholderText('Enter your new password');
    
    // Enter password that meets all criteria
    fireEvent.change(passwordInput, { target: { value: 'StrongP@ssw0rd123!' } });
    
    await waitFor(() => {
      expect(screen.getByText('Strong')).toBeInTheDocument();
    });
  });

  test('validates password confirmation match', async () => {
    const { supabase } = require('@/integrations/supabase/client');
    supabase.auth.getUser.mockResolvedValue({ 
      data: { user: { id: 'user-123' } }, 
      error: null 
    });

    render(
      <TestWrapper>
        <PasswordResetForm />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.queryByText('Validating recovery token...')).not.toBeInTheDocument();
    });

    const passwordInput = screen.getByPlaceholderText('Enter your new password');
    const confirmInput = screen.getByPlaceholderText('Confirm your new password');
    
    fireEvent.change(passwordInput, { target: { value: 'StrongP@ssw0rd123!' } });
    fireEvent.change(confirmInput, { target: { value: 'DifferentPassword!' } });
    
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });

    // Fix the confirmation
    fireEvent.change(confirmInput, { target: { value: 'StrongP@ssw0rd123!' } });
    
    await waitFor(() => {
      expect(screen.getByText('Passwords match')).toBeInTheDocument();
    });
  });

  test('handles password update successfully', async () => {
    const { supabase } = require('@/integrations/supabase/client');
    const { toast } = require('sonner');
    
    supabase.auth.getUser.mockResolvedValue({ 
      data: { user: { id: 'user-123' } }, 
      error: null 
    });
    supabase.auth.setSession.mockResolvedValue({ error: null });
    supabase.auth.updateUser.mockResolvedValue({ error: null });
    supabase.auth.signOut.mockResolvedValue({ error: null });

    render(
      <TestWrapper searchParams="?type=recovery&access_token=valid-token&refresh_token=refresh-token">
        <PasswordResetForm />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.queryByText('Validating recovery token...')).not.toBeInTheDocument();
    });

    const passwordInput = screen.getByPlaceholderText('Enter your new password');
    const confirmInput = screen.getByPlaceholderText('Confirm your new password');
    
    fireEvent.change(passwordInput, { target: { value: 'StrongP@ssw0rd123!' } });
    fireEvent.change(confirmInput, { target: { value: 'StrongP@ssw0rd123!' } });

    const submitButton = screen.getByText('Update Password');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        password: 'StrongP@ssw0rd123!'
      });
      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Password updated successfully! Please sign in with your new password.');
      expect(mockNavigate).toHaveBeenCalledWith('/admin/login');
    });
  });

  test('redirects if token is invalid', async () => {
    const { supabase } = require('@/integrations/supabase/client');
    const { toast } = require('sonner');
    
    supabase.auth.getUser.mockResolvedValue({ 
      data: { user: null }, 
      error: new Error('Invalid token') 
    });

    render(
      <TestWrapper>
        <PasswordResetForm />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid or expired recovery token');
      expect(mockNavigate).toHaveBeenCalledWith('/admin/login');
    });
  });

  test('handles missing recovery parameters', async () => {
    const { toast } = require('sonner');

    render(
      <TestWrapper searchParams="?type=signin">
        <PasswordResetForm />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid or missing recovery token');
      expect(mockNavigate).toHaveBeenCalledWith('/admin/login');
    });
  });
});