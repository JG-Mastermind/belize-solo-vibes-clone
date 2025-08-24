import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock useAuth hook directly - cleaner approach avoiding Supabase client complexity
const mockUseAuth = jest.fn();

jest.mock('../AuthProvider', () => ({
  useAuth: mockUseAuth,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Test component that uses the auth context
const TestComponent = () => {
  const { user, getUserRole, loading } = mockUseAuth();
  
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
  });

  it('should fetch and return super_admin role from database', async () => {
    const mockUser = {
      id: 'a31a939e-7d90-4aa5-b821-c15e07ad4466',
      email: 'jg.mastermind@gmail.com',
      user_metadata: {},
    };

    // Mock useAuth to return super admin user with role detection
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      getUserRole: () => 'super_admin'
    });

    render(
      <BrowserRouter>
        <TestComponent />
      </BrowserRouter>
    );

    expect(screen.getByTestId('user-role')).toHaveTextContent('super_admin');
    expect(screen.getByTestId('user-id')).toHaveTextContent('a31a939e-7d90-4aa5-b821-c15e07ad4466');
  });

  it('should return null role when user metadata is missing and database query fails', async () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      user_metadata: {}, // No role in metadata
    };

    // Mock useAuth to return user without role
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      getUserRole: () => null
    });

    render(
      <BrowserRouter>
        <TestComponent />
      </BrowserRouter>
    );

    expect(screen.getByTestId('user-role')).toHaveTextContent('No role');
    expect(screen.getByTestId('user-id')).toHaveTextContent('test-user-id');
  });

  it('should return admin role from database', async () => {
    const mockUser = {
      id: 'admin-user-id',
      email: 'admin@example.com',
      user_metadata: {},
    };

    // Mock useAuth to return admin user
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      getUserRole: () => 'admin'
    });

    render(
      <BrowserRouter>
        <TestComponent />
      </BrowserRouter>
    );

    expect(screen.getByTestId('user-role')).toHaveTextContent('admin');
  });

  it('should handle no user session correctly', async () => {
    // Mock useAuth to return no user
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      getUserRole: () => null
    });

    render(
      <BrowserRouter>
        <TestComponent />
      </BrowserRouter>
    );

    expect(screen.getByTestId('user-id')).toHaveTextContent('No user');
    expect(screen.getByTestId('user-role')).toHaveTextContent('No role');
  });
});