// Centralized navigation configuration for consistency across desktop and mobile
export interface NavigationItem {
  name: string;
  path: string;
  requiresAuth?: boolean;
  roles?: string[];
}

export const publicNavigationItems: NavigationItem[] = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Blog', path: '/blog' },
  { name: 'Safety', path: '/safety' },
  { name: 'Contact', path: '/contact' },
];

export const dashboardNavigationItems: NavigationItem[] = [
  { name: 'Overview', path: '/dashboard', requiresAuth: true },
  { name: 'Bookings', path: '/dashboard/bookings', requiresAuth: true },
  { name: 'Calendar', path: '/dashboard/calendar', requiresAuth: true },
  { name: 'Adventures', path: '/dashboard/adventures', requiresAuth: true },
  { name: 'Create Adventure', path: '/dashboard/create-adventure', requiresAuth: true, roles: ['guide', 'admin'] },
  { name: 'Messages', path: '/dashboard/messages', requiresAuth: true },
  { name: 'Payouts', path: '/dashboard/payouts', requiresAuth: true },
];

export const adminNavigationItems: NavigationItem[] = [
  { name: 'User Management', path: '/dashboard/users', requiresAuth: true, roles: ['admin'] },
  { name: 'Safety Alerts', path: '/dashboard/alerts', requiresAuth: true, roles: ['admin'] },
];

export const superAdminNavigationItems: NavigationItem[] = [
  { name: 'Invitations', path: '/admin/invitations', requiresAuth: true, roles: ['super_admin'] },
  { name: 'Users', path: '/admin/users', requiresAuth: true, roles: ['super_admin'] },
];

export const socialLinks = [
  { name: 'Instagram', url: 'https://instagram.com/belizevibes', color: 'text-pink-500 dark:text-pink-400' },
  { name: 'YouTube', url: 'https://youtube.com/@belizevibes', color: 'text-red-500 dark:text-red-400' },
  { name: 'X', url: 'https://x.com/belizevibes', color: 'text-blue-500 dark:text-blue-400' },
  { name: 'Facebook', url: 'https://facebook.com/belizevibes', color: 'text-blue-600 dark:text-blue-500' },
];

// Helper function to filter navigation items based on user role
export const filterNavigationByRole = (items: NavigationItem[], userRole?: string | null): NavigationItem[] => {
  if (!userRole) return items.filter(item => !item.requiresAuth);
  
  return items.filter(item => {
    if (!item.requiresAuth) return true;
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  });
};