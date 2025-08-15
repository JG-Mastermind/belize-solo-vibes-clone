import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../AuthProvider';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      updateUser: jest.fn(),
    },
    from: jest.fn(),
  },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

// Test component that uses the auth context
const TestComponent = () => {
  const { user, getUserRole, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  const role = getUserRole();
  
  return (
    <div>
      <div data-testid="user-id">{user?.id || 'No user'}</div>
      <div data-testid="user-role">{role || 'No role'}</div>
    </div>
  );
};

describe('Admin Role Detection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock subscription
    const mockSubscription = {
      unsubscribe: jest.fn(),
    };
    
    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: mockSubscription },
    });
  });

  it('should fetch and return super_admin role from database', async () => {
    const mockUser = {
      id: 'a31a939e-7d90-4aa5-b821-c15e07ad4466',
      email: 'jg.mastermind@gmail.com',
      user_metadata: {},
    };

    const mockSession = {
      user: mockUser,
      access_token: 'mock-token',
    };

    // Mock initial session with admin user
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    // Mock database query to return super_admin role
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { user_type: 'super_admin' },
            error: null,
          }),
        }),
      }),
    } as any);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    // Initially shows loading
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for role to be fetched
    await waitFor(() => {
      expect(screen.getByTestId('user-role')).toHaveTextContent('super_admin');
    });

    expect(screen.getByTestId('user-id')).toHaveTextContent('a31a939e-7d90-4aa5-b821-c15e07ad4466');
  });

  it('should return null role when user metadata is missing and database query fails', async () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      user_metadata: {}, // No role in metadata
    };

    const mockSession = {
      user: mockUser,
      access_token: 'mock-token',
    };

    // Mock initial session
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    // Mock database query to return error
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'User not found' },
          }),
        }),
      }),
    } as any);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    // Wait for role to be fetched
    await waitFor(() => {
      expect(screen.getByTestId('user-role')).toHaveTextContent('No role');
    });

    expect(screen.getByTestId('user-id')).toHaveTextContent('test-user-id');
  });

  it('should return admin role from database', async () => {
    const mockUser = {
      id: 'admin-user-id',
      email: 'admin@example.com',
      user_metadata: {},
    };

    const mockSession = {
      user: mockUser,
      access_token: 'mock-token',
    };

    // Mock initial session
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    // Mock database query to return admin role
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { user_type: 'admin' },
            error: null,
          }),
        }),
      }),
    } as any);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    // Wait for role to be fetched
    await waitFor(() => {
      expect(screen.getByTestId('user-role')).toHaveTextContent('admin');
    });
  });

  it('should handle no user session correctly', async () => {
    // Mock no session
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('user-id')).toHaveTextContent('No user');
    });

    expect(screen.getByTestId('user-role')).toHaveTextContent('No role');
  });
});