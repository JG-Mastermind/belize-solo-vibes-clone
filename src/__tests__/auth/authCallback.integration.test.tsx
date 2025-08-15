import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import AuthCallback from '@/pages/auth/callback';
import { AuthProvider } from '@/components/auth/AuthProvider';

// Mock react-router-dom
const mockNavigate = jest.fn();
const mockSearchParams = new URLSearchParams();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useSearchParams: () => [mockSearchParams]
}));

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  }
}));

const MockAuthProvider = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    {children}
  </AuthProvider>
);

const renderAuthCallback = (searchParams = '') => {
  const url = new URL('http://localhost/auth/callback' + searchParams);
  // Clear URLSearchParams manually since clear() method doesn't exist in jest environment  
  [...mockSearchParams.keys()].forEach(key => mockSearchParams.delete(key));
  url.searchParams.forEach((value, key) => {
    mockSearchParams.set(key, value);
  });

  return render(
    <BrowserRouter>
      <MockAuthProvider>
        <AuthCallback />
      </MockAuthProvider>
    </BrowserRouter>
  );
};

describe('AuthCallback Recovery Token Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear URLSearchParams
    [...mockSearchParams.keys()].forEach(key => mockSearchParams.delete(key));
  });

  it('should detect recovery type and redirect to reset form', async () => {
    renderAuthCallback('?type=recovery&access_token=test_token&refresh_token=test_refresh');
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/auth/reset-password?type=recovery&access_token=test_token&refresh_token=test_refresh');
    });
  });

  it('should not redirect to reset form without recovery type', async () => {
    renderAuthCallback('?access_token=test_token&refresh_token=test_refresh');
    
    // Should not navigate to reset password form
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalledWith(expect.stringContaining('reset-password'));
    }, { timeout: 2000 });
  });

  it('should not redirect to reset form without access token', async () => {
    renderAuthCallback('?type=recovery&refresh_token=test_refresh');
    
    // Should not navigate to reset password form
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalledWith(expect.stringContaining('reset-password'));
    }, { timeout: 2000 });
  });

  it('should preserve all URL parameters in redirect', async () => {
    const params = 'type=recovery&access_token=jwt.token.here&refresh_token=refresh.token.here&redirect_to=dashboard';
    renderAuthCallback('?' + params);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/auth/reset-password?' + params);
    });
  });

  it('should handle recovery flow with minimal parameters', async () => {
    renderAuthCallback('?type=recovery&access_token=minimal_token');
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/auth/reset-password?type=recovery&access_token=minimal_token');
    });
  });

  it('should not process recovery flow for other auth types', async () => {
    renderAuthCallback('?type=signup&access_token=test_token&refresh_token=test_refresh');
    
    // Should not navigate to reset password form
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalledWith(expect.stringContaining('reset-password'));
    }, { timeout: 2000 });
  });

  it('should handle URL encoding in token parameters', async () => {
    const encodedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    renderAuthCallback(`?type=recovery&access_token=${encodeURIComponent(encodedToken)}&refresh_token=refresh123`);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('reset-password'));
      expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining(encodeURIComponent(encodedToken)));
    });
  });
});