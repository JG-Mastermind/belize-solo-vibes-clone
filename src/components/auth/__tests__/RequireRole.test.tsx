import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RequireRole from '../RequireRole';
import { AuthProvider } from '../AuthProvider';

// Mock the AuthProvider to provide controlled user state
const MockAuthProvider = ({ 
  children, 
  mockUser 
}: { 
  children: React.ReactNode; 
  mockUser: any 
}) => {
  const mockAuthContextValue = {
    user: mockUser,
    loading: false,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    getUserRole: jest.fn().mockReturnValue(mockUser?.user_type || null),
  };

  return (
    <div data-testid="mock-auth-provider">
      {/* Mock implementation that passes the user prop */}
      {React.createElement(
        React.createContext(mockAuthContextValue).Provider, 
        { value: mockAuthContextValue }, 
        children
      )}
    </div>
  );
};

describe('RequireRole', () => {
  const RestrictedContent = () => <div>Restricted Content</div>;

  test('renders children when user has required role', () => {
    const mockSuperAdmin = {
      id: '1',
      email: 'admin@test.com',
      user_type: 'super_admin'
    };

    render(
      <MemoryRouter>
        <MockAuthProvider mockUser={mockSuperAdmin}>
          <RequireRole allowedRoles={['super_admin']}>
            <RestrictedContent />
          </RequireRole>
        </MockAuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Restricted Content')).toBeInTheDocument();
  });

  test('redirects non-super_admin to 403', () => {
    const mockRegularUser = {
      id: '2',
      email: 'user@test.com',
      user_type: 'traveler'
    };

    render(
      <MemoryRouter initialEntries={['/admin/invitations']}>
        <MockAuthProvider mockUser={mockRegularUser}>
          <RequireRole allowedRoles={['super_admin']}>
            <RestrictedContent />
          </RequireRole>
        </MockAuthProvider>
      </MemoryRouter>
    );

    // Should not render restricted content
    expect(screen.queryByText('Restricted Content')).not.toBeInTheDocument();
  });

  test('redirects unauthenticated user to 403', () => {
    render(
      <MemoryRouter initialEntries={['/admin/invitations']}>
        <MockAuthProvider mockUser={null}>
          <RequireRole allowedRoles={['super_admin']}>
            <RestrictedContent />
          </RequireRole>
        </MockAuthProvider>
      </MemoryRouter>
    );

    // Should not render restricted content
    expect(screen.queryByText('Restricted Content')).not.toBeInTheDocument();
  });

  test('shows loading state when auth is loading', () => {
    const MockLoadingAuthProvider = ({ children }: { children: React.ReactNode }) => {
      const mockAuthContextValue = {
        user: null,
        loading: true,
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        getUserRole: jest.fn(),
      };

      return (
        <div>
          {React.createElement(
            React.createContext(mockAuthContextValue).Provider, 
            { value: mockAuthContextValue }, 
            children
          )}
        </div>
      );
    };

    render(
      <MemoryRouter>
        <MockLoadingAuthProvider>
          <RequireRole allowedRoles={['super_admin']}>
            <RestrictedContent />
          </RequireRole>
        </MockLoadingAuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Restricted Content')).not.toBeInTheDocument();
  });

  test('allows multiple roles', () => {
    const mockAdmin = {
      id: '3',
      email: 'admin@test.com',
      user_type: 'admin'
    };

    render(
      <MemoryRouter>
        <MockAuthProvider mockUser={mockAdmin}>
          <RequireRole allowedRoles={['admin', 'super_admin']}>
            <RestrictedContent />
          </RequireRole>
        </MockAuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Restricted Content')).toBeInTheDocument();
  });
});