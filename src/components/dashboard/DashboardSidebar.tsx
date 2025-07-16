
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Calendar,
  MapPin,
  Users,
  BookOpen,
  Settings,
  CreditCard,
  AlertTriangle,
  MessageSquare,
  Plus,
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { dashboardNavigationItems, adminNavigationItems, filterNavigationByRole } from '@/lib/navigation';

// Icon mapping for dashboard navigation
const iconMap = {
  '/dashboard': LayoutDashboard,
  '/dashboard/bookings': BookOpen,
  '/dashboard/calendar': Calendar,
  '/dashboard/adventures': MapPin,
  '/dashboard/create-adventure': Plus,
  '/dashboard/messages': MessageSquare,
  '/dashboard/payouts': CreditCard,
  '/dashboard/users': Users,
  '/dashboard/alerts': AlertTriangle,
};

export const DashboardSidebar = () => {
  const location = useLocation();
  const { getUserRole } = useAuth();
  const currentPath = location.pathname;
  const userRole = getUserRole();

  const isActive = (path: string) => currentPath === path;

  // Filter navigation items based on user role
  const mainNavItems = filterNavigationByRole(dashboardNavigationItems, userRole);
  const adminNavItems = filterNavigationByRole(adminNavigationItems, userRole);

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-6">
        <Link to="/" className="text-xl font-bold text-sidebar-primary hover:text-sidebar-primary/80 transition-colors">
          BelizeVibes
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const IconComponent = iconMap[item.path as keyof typeof iconMap];
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive(item.path)}>
                      <Link to={item.path} className="sidebar-nav-item">
                        {IconComponent && <IconComponent className="h-4 w-4" />}
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {adminNavItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/60">Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNavItems.map((item) => {
                  const IconComponent = iconMap[item.path as keyof typeof iconMap];
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild isActive={isActive(item.path)}>
                        <Link to={item.path} className="sidebar-nav-item">
                          {IconComponent && <IconComponent className="h-4 w-4" />}
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/dashboard/settings" className="sidebar-nav-item">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
