import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock useAuth hook before importing RequireRole
const mockUseAuth = jest.fn();

// Mock the AuthProvider module
jest.mock('../AuthProvider', () => ({
  useAuth: mockUseAuth,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock react-router-dom Navigate component
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: ({ to }: { to: string }) => {
    mockNavigate(to);
    return <div data-testid="navigate">Redirecting to {to}</div>;
  }
}));

// Import RequireRole after mocking
import RequireRole from '../RequireRole';

describe('RequireRole', () => {
  const RestrictedContent = () => <div>Restricted Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  test('renders children when user has required role', () => {
    const mockSuperAdmin = {
      id: '1',
      email: 'admin@test.com',
      user_type: 'super_admin'
    };

    mockUseAuth.mockReturnValue({
      user: mockSuperAdmin,
      loading: false,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getUserRole: jest.fn().mockReturnValue('super_admin'),
    });

    render(
      <MemoryRouter>
        <RequireRole allowedRoles={['super_admin']}>
          <RestrictedContent />
        </RequireRole>
      </MemoryRouter>
    );

    expect(screen.getByText('Restricted Content')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('redirects non-super_admin to 403', () => {
    const mockRegularUser = {
      id: '2',
      email: 'user@test.com',
      user_type: 'traveler'
    };

    mockUseAuth.mockReturnValue({
      user: mockRegularUser,
      loading: false,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getUserRole: jest.fn().mockReturnValue('traveler'),
    });

    render(
      <MemoryRouter initialEntries={['/admin/invitations']}>
        <RequireRole allowedRoles={['super_admin']}>
          <RestrictedContent />
        </RequireRole>
      </MemoryRouter>
    );

    // Should not render restricted content
    expect(screen.queryByText('Restricted Content')).not.toBeInTheDocument();
    // Should navigate to 403
    expect(screen.getByTestId('navigate')).toHaveTextContent('Redirecting to /403');
    expect(mockNavigate).toHaveBeenCalledWith('/403');
  });

  test('redirects unauthenticated user to 403', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getUserRole: jest.fn().mockReturnValue(null),
    });

    render(
      <MemoryRouter initialEntries={['/admin/invitations']}>
        <RequireRole allowedRoles={['super_admin']}>
          <RestrictedContent />
        </RequireRole>
      </MemoryRouter>
    );

    // Should not render restricted content
    expect(screen.queryByText('Restricted Content')).not.toBeInTheDocument();
    // Should navigate to 403
    expect(screen.getByTestId('navigate')).toHaveTextContent('Redirecting to /403');
    expect(mockNavigate).toHaveBeenCalledWith('/403');
  });

  test('shows loading state when auth is loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getUserRole: jest.fn(),
    });

    render(
      <MemoryRouter>
        <RequireRole allowedRoles={['super_admin']}>
          <RestrictedContent />
        </RequireRole>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Restricted Content')).not.toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('allows multiple roles', () => {
    const mockAdmin = {
      id: '3',
      email: 'admin@test.com',
      user_type: 'admin'
    };

    mockUseAuth.mockReturnValue({
      user: mockAdmin,
      loading: false,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getUserRole: jest.fn().mockReturnValue('admin'),
    });

    render(
      <MemoryRouter>
        <RequireRole allowedRoles={['admin', 'super_admin']}>
          <RestrictedContent />
        </RequireRole>
      </MemoryRouter>
    );

    expect(screen.getByText('Restricted Content')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});