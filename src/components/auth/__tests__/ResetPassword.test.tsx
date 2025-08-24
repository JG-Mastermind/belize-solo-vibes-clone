import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ResetPassword from '@/pages/ResetPassword';
import { AuthProvider } from '@/components/auth/AuthProvider';

// Mock react-router-dom
const mockNavigate = jest.fn();
const mockSearchParams = new URLSearchParams();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useSearchParams: () => [mockSearchParams]
}));

// Mock Supabase client - complete mock for AuthProvider compatibility
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      setSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      signOut: jest.fn(() => Promise.resolve({ error: null })),
      updateUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } }
      }))
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn(() => Promise.resolve({ data: null, error: null }))
    }))
  }
}));

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  }
}));

// Get access to mocked Supabase client
const { supabase: mockSupabase } = require('@/integrations/supabase/client');

const MockAuthProvider = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    {children}
  </AuthProvider>
);

const renderResetPassword = (searchParams = '') => {
  const url = new URL('http://localhost/auth/reset-password' + searchParams);
  // Clear URLSearchParams manually since clear() method doesn't exist in jest environment
  [...mockSearchParams.keys()].forEach(key => mockSearchParams.delete(key));
  url.searchParams.forEach((value, key) => {
    mockSearchParams.set(key, value);
  });

  return render(
    <BrowserRouter>
      <MockAuthProvider>
        <ResetPassword />
      </MockAuthProvider>
    </BrowserRouter>
  );
};

describe('ResetPassword Token Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear URLSearchParams
    [...mockSearchParams.keys()].forEach(key => mockSearchParams.delete(key));
  });

  it('should reject missing recovery type parameter', async () => {
    renderResetPassword('?access_token=test&refresh_token=test');
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should reject missing access_token parameter', async () => {
    renderResetPassword('?type=recovery&refresh_token=test');
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should reject missing refresh_token parameter', async () => {
    renderResetPassword('?type=recovery&access_token=test');
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should validate tokens by testing session creation', async () => {
    const mockSession = { access_token: 'valid_token', user: { id: 'user123' } };
    mockSupabase.auth.setSession.mockResolvedValueOnce({
      data: { session: mockSession, user: { id: 'user123' } },
      error: null
    });
    mockSupabase.auth.signOut.mockResolvedValueOnce({ error: null });

    renderResetPassword('?type=recovery&access_token=valid_token&refresh_token=valid_refresh');
    
    await waitFor(() => {
      expect(mockSupabase.auth.setSession).toHaveBeenCalledWith({
        access_token: 'valid_token',
        refresh_token: 'valid_refresh'
      });
    });

    // Should immediately sign out after validation
    await waitFor(() => {
      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    });

    // Should show password reset form
    expect(screen.getByText('Reset Your Password')).toBeInTheDocument();
  });

  it('should reject invalid tokens', async () => {
    mockSupabase.auth.setSession.mockResolvedValueOnce({
      data: { session: null, user: null },
      error: { message: 'Invalid token' }
    });

    renderResetPassword('?type=recovery&access_token=invalid_token&refresh_token=invalid_refresh');
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should handle password update with session re-establishment', async () => {
    // Setup initial token validation
    mockSupabase.auth.setSession
      .mockResolvedValueOnce({
        data: { session: { access_token: 'valid' }, user: { id: 'user123' } },
        error: null
      })
      .mockResolvedValueOnce({
        data: { session: { access_token: 'valid' }, user: { id: 'user123' } },
        error: null
      });
    
    mockSupabase.auth.signOut.mockResolvedValue({ error: null });
    mockSupabase.auth.updateUser.mockResolvedValueOnce({ error: null });

    renderResetPassword('?type=recovery&access_token=valid_token&refresh_token=valid_refresh');
    
    // Wait for form to appear
    await waitFor(() => {
      expect(screen.getByText('Reset Your Password')).toBeInTheDocument();
    });

    // Fill in password fields
    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password');
    
    fireEvent.change(newPasswordInput, { target: { value: 'NewPassword123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'NewPassword123!' } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /update password/i });
    fireEvent.click(submitButton);

    // Should re-establish session for password update
    await waitFor(() => {
      expect(mockSupabase.auth.setSession).toHaveBeenCalledTimes(2);
    });

    // Should call updateUser
    await waitFor(() => {
      expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
        password: 'NewPassword123!'
      });
    });

    // Should sign out after update
    await waitFor(() => {
      expect(mockSupabase.auth.signOut).toHaveBeenCalledTimes(2);
    });

    // Should redirect home
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should validate password requirements', async () => {
    mockSupabase.auth.setSession.mockResolvedValueOnce({
      data: { session: { access_token: 'valid' }, user: { id: 'user123' } },
      error: null
    });
    mockSupabase.auth.signOut.mockResolvedValue({ error: null });

    renderResetPassword('?type=recovery&access_token=valid_token&refresh_token=valid_refresh');
    
    await waitFor(() => {
      expect(screen.getByText('Reset Your Password')).toBeInTheDocument();
    });

    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password');
    
    // Test weak password
    fireEvent.change(newPasswordInput, { target: { value: 'weak' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'weak' } });

    const submitButton = screen.getByRole('button', { name: /update password/i });
    expect(submitButton).toBeDisabled();

    // Test strong password
    fireEvent.change(newPasswordInput, { target: { value: 'StrongPassword123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'StrongPassword123!' } });

    expect(submitButton).not.toBeDisabled();
  });

  it('should prevent submission with mismatched passwords', async () => {
    mockSupabase.auth.setSession.mockResolvedValueOnce({
      data: { session: { access_token: 'valid' }, user: { id: 'user123' } },
      error: null
    });
    mockSupabase.auth.signOut.mockResolvedValue({ error: null });

    renderResetPassword('?type=recovery&access_token=valid_token&refresh_token=valid_refresh');
    
    await waitFor(() => {
      expect(screen.getByText('Reset Your Password')).toBeInTheDocument();
    });

    const newPasswordInput = screen.getByLabelText('New Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password');
    
    fireEvent.change(newPasswordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPassword123!' } });

    const submitButton = screen.getByRole('button', { name: /update password/i });
    expect(submitButton).toBeDisabled();
  });
});