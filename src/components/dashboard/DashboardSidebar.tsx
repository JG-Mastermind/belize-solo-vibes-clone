
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
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Overview',
    icon: LayoutDashboard,
    url: '/dashboard',
  },
  {
    title: 'Bookings',
    icon: BookOpen,
    url: '/dashboard/bookings',
  },
  {
    title: 'Calendar',
    icon: Calendar,
    url: '/dashboard/calendar',
  },
  {
    title: 'Adventures',
    icon: MapPin,
    url: '/dashboard/adventures',
  },
  {
    title: 'Messages',
    icon: MessageSquare,
    url: '/dashboard/messages',
  },
  {
    title: 'Payouts',
    icon: CreditCard,
    url: '/dashboard/payouts',
  },
];

const adminItems = [
  {
    title: 'User Management',
    icon: Users,
    url: '/dashboard/users',
  },
  {
    title: 'Safety Alerts',
    icon: AlertTriangle,
    url: '/dashboard/alerts',
  },
];

export const DashboardSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className="border-r border-[hsl(var(--dashboard-border))]">
      <SidebarHeader className="p-6">
        <Link to="/" className="text-xl font-bold text-primary">
          BelizeVibes
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link to={item.url} className="sidebar-nav-item">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link to={item.url} className="sidebar-nav-item">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
