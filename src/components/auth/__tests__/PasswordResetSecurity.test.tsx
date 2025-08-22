import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResetPassword from '../../../pages/ResetPassword';

// Mock react-router-dom
const mockNavigate = jest.fn();

// Mock supabase client
const mockVerifyOtp = jest.fn();
const mockSetSession = jest.fn().mockResolvedValue({
  data: { 
    session: { access_token: 'valid-token', refresh_token: 'valid-refresh' },
    user: { id: '123', email: 'test@example.com' }
  }, 
  error: null 
});
const mockSignOut = jest.fn().mockResolvedValue({ error: null });
const mockUpdateUser = jest.fn();

jest.mock('../../../integrations/supabase/client', () => ({
  supabase: {
    auth: {
      verifyOtp: mockVerifyOtp,
      setSession: mockSetSession,
      signOut: mockSignOut,
      updateUser: mockUpdateUser,
    }
  }
}));

// Mock the AuthProvider
const mockAuthSignOut = jest.fn();
jest.mock('../AuthProvider', () => ({
  useAuth: () => ({
    signOut: mockAuthSignOut,
  })
}));

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

// Create a wrapper component to test with different URL params
const ResetPasswordWrapper = ({ searchParams }: { searchParams: string }) => {
  jest.doMock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams(searchParams)]
  }));

  return (
    <MemoryRouter>
      <ResetPassword />
    </MemoryRouter>
  );
};

describe('PasswordResetSecurity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockVerifyOtp.mockResolvedValue({ 
      data: { user: { id: '1', email: 'test@example.com' } }, 
      error: null 
    });
  });

  describe('Token Validation Security', () => {
    test('SECURITY: validates recovery token before allowing reset', async () => {
      const validParams = 'type=recovery&access_token=valid-token&refresh_token=valid-refresh';
      
      render(<ResetPasswordWrapper searchParams={validParams} />);

      // Should show loading state initially
      expect(screen.getByText('Verifying password reset link...')).toBeInTheDocument();

      // Wait for token verification
      await waitFor(() => {
        expect(mockVerifyOtp).toHaveBeenCalledWith({
          token_hash: 'valid-token',
          type: 'recovery',
        });
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