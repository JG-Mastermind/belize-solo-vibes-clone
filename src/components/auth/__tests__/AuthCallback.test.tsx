import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthCallback from '../../../pages/auth/callback';

// Mock react-router-dom
const mockNavigate = jest.fn();
let mockSearchParams = new URLSearchParams('type=recovery&access_token=test-token&refresh_token=test-refresh');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useSearchParams: () => [mockSearchParams]
}));

// Mock the AuthProvider
jest.mock('../AuthProvider', () => ({
  useAuth: () => ({
    user: null,
    getUserRole: jest.fn(() => null),
  })
}));

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  }
}));

describe('AuthCallback Security Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('SECURITY: detects recovery type and prevents auto-login', async () => {
    // Set default recovery params for this test
    mockSearchParams = new URLSearchParams('type=recovery&access_token=test-token&refresh_token=test-refresh');

    render(
      <MemoryRouter>
        <AuthCallback />
      </MemoryRouter>
    );

    // Wait for the effect to run
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        '/admin/login?type=recovery&access_token=test-token&refresh_token=test-refresh'
      );
    });

    // Ensure no auto-login occurs for recovery flows
    expect(screen.getByText('Completing sign in...')).toBeInTheDocument();
  });

  test('SECURITY: handles normal auth callback without recovery params', async () => {
    // Set specific params for this test  
    mockSearchParams = new URLSearchParams(''); // No recovery params

    render(
      <MemoryRouter>
        <AuthCallback />
      </MemoryRouter>
    );

    // Should not redirect to admin login for normal auth
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalledWith(
        expect.stringContaining('/admin/login')
      );
    });
  });

  test('SECURITY: prevents auto-login when access_token present with recovery type', async () => {
    // Set specific params for this test - component uses these exact params
    mockSearchParams = new URLSearchParams('type=recovery&access_token=test-token&refresh_token=test-refresh');

    render(
      <MemoryRouter>
        <AuthCallback />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Should redirect to admin login with recovery params, not complete authentication
      expect(mockNavigate).toHaveBeenCalledWith(
        '/admin/login?type=recovery&access_token=test-token&refresh_token=test-refresh'
      );
    });

    // Verify no success toast for auto-login
    const { toast } = require('sonner');
    expect(toast.success).not.toHaveBeenCalledWith('Successfully signed in!');
  });

  test('SECURITY: handles missing access_token with recovery type', async () => {
    // Set specific params for this test
    mockSearchParams = new URLSearchParams('type=recovery'); // Missing access_token

    render(
      <MemoryRouter>
        <AuthCallback />
      </MemoryRouter>
    );

    // Should not redirect to reset-password without access_token
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalledWith(
        expect.stringContaining('/auth/reset-password')
      );
    });
  });

  test('loads with proper UI elements', () => {
    render(
      <MemoryRouter>
        <AuthCallback />
      </MemoryRouter>
    );

    expect(screen.getByText('Completing sign in...')).toBeInTheDocument();
    expect(screen.getByText('Please wait while we redirect you.')).toBeInTheDocument();
  });
});