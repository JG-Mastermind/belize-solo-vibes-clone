import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResetPassword from '../../../pages/ResetPassword';
import { AuthProvider } from '@/components/auth/AuthProvider';

// Mock react-router-dom
const mockNavigate = jest.fn();

// Mock the entire Supabase client to control its behavior for all tests in this file.
// This prevents timeouts by ensuring all async auth calls resolve immediately.
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      // Simulate an initial state where no user session exists initially
      getSession: jest.fn(() => Promise.resolve({
        data: { session: null },
        error: null,
      })),
      // Mock the function that updates the user's password. Default to successful response.
      updateUser: jest.fn(() => Promise.resolve({ data: { user: {} }, error: null })),
      // Mock token verification for password reset flow
      verifyOtp: jest.fn(() => Promise.resolve({ 
        data: { user: { id: '123', email: 'test@example.com' }, session: null }, 
        error: null 
      })),
      // Mock session setting - critical for token validation
      setSession: jest.fn(() => Promise.resolve({
        data: { 
          session: { 
            access_token: 'valid-token', 
            refresh_token: 'valid-refresh',
            user: { id: '123', email: 'test@example.com' }
          },
          user: { id: '123', email: 'test@example.com' }
        }, 
        error: null 
      })),
      // Mock sign out
      signOut: jest.fn(() => Promise.resolve({ error: null })),
      // Provide a mock for onAuthStateChange to prevent errors.
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
    // Mock the database query chain used by AuthProvider.
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  },
}));

// Get access to the mocked supabase for individual test customization
const { supabase: mockSupabase } = require('@/integrations/supabase/client');

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  }
}));

// Mock TokenDebugger
jest.mock('../TokenDebugger', () => ({
  TokenDebugger: () => null,
  useTokenInspector: () => ({
    inspectTokens: jest.fn(() => ({}))
  })
}));

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useSearchParams: jest.fn()
}));

// Create a wrapper component to test with different URL params
const ResetPasswordWrapper = ({ searchParams }: { searchParams: string }) => {
  const { useSearchParams } = require('react-router-dom');
  useSearchParams.mockReturnValue([new URLSearchParams(searchParams)]);

  return (
    <MemoryRouter>
      <AuthProvider>
        <ResetPassword />
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('PasswordResetSecurity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset all mocked functions to their default successful responses
    mockSupabase.auth.verifyOtp.mockResolvedValue({ 
      data: { user: { id: '1', email: 'test@example.com' }, session: null }, 
      error: null 
    });
    mockSupabase.auth.updateUser.mockResolvedValue({ 
      data: { user: {} }, 
      error: null 
    });
    mockSupabase.auth.setSession.mockResolvedValue({
      data: { 
        session: { 
          access_token: 'valid-token', 
          refresh_token: 'valid-refresh',
          user: { id: '123', email: 'test@example.com' }
        },
        user: { id: '123', email: 'test@example.com' }
      }, 
      error: null 
    });
    mockSupabase.auth.signOut.mockResolvedValue({ error: null });
  });

  describe('Token Validation Security', () => {
    test('SECURITY: validates recovery token before allowing reset', async () => {
      const validParams = 'type=recovery&access_token=valid-token&refresh_token=valid-refresh';
      
      render(<ResetPasswordWrapper searchParams={validParams} />);

      // Wait for token verification to complete and form to appear
      // The key fix: place the assertion *inside* the waitFor callback
      await waitFor(() => {
        expect(screen.getByText('Reset Your Password')).toBeInTheDocument();
      });

      // Verify the mock was called with session setting (the component's validation approach)
      expect(mockSupabase.auth.setSession).toHaveBeenCalledWith({
        access_token: 'valid-token',
        refresh_token: 'valid-refresh',
      });
    });

    test('SECURITY: rejects invalid recovery type', async () => {
      const invalidParams = 'type=signup&access_token=token';
      mockNavigate.mockClear();
      
      render(<ResetPasswordWrapper searchParams={invalidParams} />);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });

      const { toast } = require('sonner');
      expect(toast.error).toHaveBeenCalledWith('Invalid password reset link');
    });

    test('SECURITY: rejects missing access token', async () => {
      const invalidParams = 'type=recovery'; // Missing access_token
      mockNavigate.mockClear();
      
      render(<ResetPasswordWrapper searchParams={invalidParams} />);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });

      const { toast } = require('sonner');
      expect(toast.error).toHaveBeenCalledWith('Invalid password reset link');
    });

    test('SECURITY: handles expired/invalid tokens', async () => {
      mockVerifyOtp.mockResolvedValue({ data: null, error: { message: 'Token expired' } });
      const validParams = 'type=recovery&access_token=expired-token';
      mockNavigate.mockClear();
      
      render(<ResetPasswordWrapper searchParams={validParams} />);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });

      const { toast } = require('sonner');
      expect(toast.error).toHaveBeenCalledWith('Invalid or expired password reset link');
    });
  });

  describe('Password Security Requirements', () => {
    beforeEach(async () => {
      const validParams = 'type=recovery&access_token=valid-token&refresh_token=valid-refresh';
      render(<ResetPasswordWrapper searchParams={validParams} />);
      
      // Wait for token validation to complete
      await waitFor(() => {
        expect(screen.getByText('Reset Your Password')).toBeInTheDocument();
      });
    });

    test('SECURITY: enforces strong password requirements', async () => {
      const passwordInput = screen.getByLabelText('New Password');
      const confirmInput = screen.getByLabelText('Confirm New Password');
      const submitButton = screen.getByRole('button', { name: /update password/i });

      // Test weak password
      fireEvent.change(passwordInput, { target: { value: 'weak' } });
      fireEvent.change(confirmInput, { target: { value: 'weak' } });

      // Button should be disabled for weak password
      expect(submitButton).toBeDisabled();

      // Check password requirements are shown
      expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
      expect(screen.getByText('One uppercase letter')).toBeInTheDocument();
      expect(screen.getByText('One lowercase letter')).toBeInTheDocument();
      expect(screen.getByText('One number')).toBeInTheDocument();
      expect(screen.getByText('One special character')).toBeInTheDocument();
    });

    test('SECURITY: validates password confirmation match', async () => {
      const passwordInput = screen.getByLabelText('New Password');
      const confirmInput = screen.getByLabelText('Confirm New Password');
      const submitButton = screen.getByRole('button', { name: /update password/i });

      // Strong password but mismatched confirmation
      fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } });
      fireEvent.change(confirmInput, { target: { value: 'DifferentPass123!' } });

      expect(submitButton).toBeDisabled();
    });

    test('SECURITY: allows strong matching passwords', async () => {
      const passwordInput = screen.getByLabelText('New Password');
      const confirmInput = screen.getByLabelText('Confirm New Password');
      const submitButton = screen.getByRole('button', { name: /update password/i });

      // Strong matching passwords
      fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } });
      fireEvent.change(confirmInput, { target: { value: 'StrongPass123!' } });

      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Session Security', () => {
    test('SECURITY: forces sign out after successful password reset', async () => {
      mockUpdateUser.mockResolvedValue({ data: {}, error: null });
      const validParams = 'type=recovery&access_token=valid-token&refresh_token=valid-refresh';
      
      render(<ResetPasswordWrapper searchParams={validParams} />);
      
      // Wait for form to load
      await waitFor(() => {
        expect(screen.getByText('Reset Your Password')).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText('New Password');
      const confirmInput = screen.getByLabelText('Confirm New Password');
      const submitButton = screen.getByRole('button', { name: /update password/i });

      // Enter strong password
      fireEvent.change(passwordInput, { target: { value: 'NewStrongPass123!' } });
      fireEvent.change(confirmInput, { target: { value: 'NewStrongPass123!' } });

      // Submit form
      fireEvent.click(submitButton);

      await waitFor(() => {
        // Verify password was updated
        expect(mockUpdateUser).toHaveBeenCalledWith({
          password: 'NewStrongPass123!',
        });

        // CRITICAL: Verify user is signed out after password reset
        expect(mockSignOut).toHaveBeenCalled();

        // Verify redirect to home for manual login
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });

      const { toast } = require('sonner');
      expect(toast.success).toHaveBeenCalledWith(
        'Password updated successfully! Please sign in with your new password.'
      );
    });

    test('SECURITY: handles password update errors gracefully', async () => {
      mockUpdateUser.mockResolvedValue({ 
        data: null, 
        error: { message: 'Password update failed' } 
      });
      const validParams = 'type=recovery&access_token=valid-token&refresh_token=valid-refresh';
      
      render(<ResetPasswordWrapper searchParams={validParams} />);
      
      await waitFor(() => {
        expect(screen.getByText('Reset Your Password')).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText('New Password');
      const confirmInput = screen.getByLabelText('Confirm New Password');
      const submitButton = screen.getByRole('button', { name: /update password/i });

      fireEvent.change(passwordInput, { target: { value: 'NewStrongPass123!' } });
      fireEvent.change(confirmInput, { target: { value: 'NewStrongPass123!' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        // Should not sign out on error
        expect(mockSignOut).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalledWith('/');
      });

      const { toast } = require('sonner');
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to update password: Password update failed'
      );
    });
  });

  describe('UI Security Features', () => {
    test('shows password visibility toggles', async () => {
      const validParams = 'type=recovery&access_token=valid-token&refresh_token=valid-refresh';
      render(<ResetPasswordWrapper searchParams={validParams} />);
      
      await waitFor(() => {
        expect(screen.getByText('Reset Your Password')).toBeInTheDocument();
      });

      // Should have password visibility toggles
      const passwordToggles = screen.getAllByRole('button', { name: '' }); // Eye icons
      expect(passwordToggles).toHaveLength(2); // One for each password field
    });

    test('displays invalid link page for malformed tokens', async () => {
      mockVerifyOtp.mockResolvedValue({ data: null, error: { message: 'Invalid token' } });
      const invalidParams = 'type=recovery&access_token=invalid-token';
      
      render(<ResetPasswordWrapper searchParams={invalidParams} />);

      await waitFor(() => {
        expect(screen.getByText('Invalid Link')).toBeInTheDocument();
        expect(screen.getByText('This password reset link is invalid or has expired.')).toBeInTheDocument();
        expect(screen.getByText('Return to Home')).toBeInTheDocument();
      });
    });
  });
});