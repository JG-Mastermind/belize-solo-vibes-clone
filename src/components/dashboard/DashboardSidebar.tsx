
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
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
  UserPlus,
  Shield,
  FileText,
  UserCheck,
  BarChart3,
  Key,
  DollarSign,
  Activity,
  Bell,
  TrendingUp,
  ChevronRight,
  Database,
  Zap,
  Target,
  Eye,
  Users2,
  Receipt,
  Calculator,
  PieChart,
  Banknote,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { dashboardNavigationItems, adminNavigationItems, superAdminNavigationItems, filterNavigationByRole } from '@/lib/navigation';

// Icon mapping for dashboard navigation
const iconMap = {
  '/dashboard': LayoutDashboard,
  '/dashboard/bookings': BookOpen,
  '/dashboard/calendar': Calendar,
  '/dashboard/adventures': MapPin,
  '/dashboard/create-adventure': Plus,
  '/dashboard/messages': MessageSquare,
  '/dashboard/payouts': CreditCard,
  '/dashboard/analytics': BarChart3,
  '/dashboard/users': Users,
  '/dashboard/alerts': AlertTriangle,
  '/admin/invitations': UserPlus,
  '/admin/users': Shield,
  '/dashboard/blog-management': FileText,
  '/dashboard/guide-assignment': UserCheck,
};

export const DashboardSidebar = () => {
  const location = useLocation();
  const { getUserRole } = useAuth();
  const { t } = useTranslation(['dashboard']);
  const currentPath = location.pathname;
  const userRole = getUserRole();
  const [apiManagementOpen, setApiManagementOpen] = useState(false);
  const [marketingIntelligenceOpen, setMarketingIntelligenceOpen] = useState(false);
  const [financialTransactionsOpen, setFinancialTransactionsOpen] = useState(false);
  const [adventuresOpen, setAdventuresOpen] = useState(false);
  const [blogPostsOpen, setBlogPostsOpen] = useState(false);
  const [invoiceManagementOpen, setInvoiceManagementOpen] = useState(false);

  const isActive = (path: string) => currentPath === path;

  // Get translated navigation name
  const getNavName = (path: string) => {
    const pathMap: Record<string, string> = {
      '/dashboard': t('dashboard:navigation.overview'),
      '/dashboard/bookings': t('dashboard:navigation.bookings'),
      '/dashboard/calendar': t('dashboard:navigation.calendar'),
      '/dashboard/adventures': t('dashboard:navigation.adventures'),
      '/dashboard/create-adventure': t('dashboard:navigation.createAdventure'),
      '/dashboard/messages': t('dashboard:navigation.messages'),
      '/dashboard/payouts': t('dashboard:navigation.payouts'),
      '/dashboard/analytics': 'Analytics',
      '/dashboard/users': t('dashboard:navigation.users'),
      '/dashboard/alerts': t('dashboard:navigation.alerts'),
      '/dashboard/create-post': 'Create Post',
      '/dashboard/blog-posts': 'Blog Posts',
      '/admin/invitations': 'Invitations',
      '/admin/users': 'Users',
    };
    return pathMap[path] || path;
  };

  // Filter navigation items based on user role
  const mainNavItems = filterNavigationByRole(dashboardNavigationItems, userRole);
  const adminNavItems = filterNavigationByRole(adminNavigationItems, userRole);
  const superAdminNavItems = filterNavigationByRole(superAdminNavigationItems, userRole);

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
                
                // Handle Adventures with dropdown for Create Adventure
                if (item.path === '/dashboard/adventures') {
                  const hasCreatePermission = userRole && ['guide', 'admin', 'super_admin'].includes(userRole);
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton 
                        onClick={() => setAdventuresOpen(!adventuresOpen)}
                        isActive={currentPath.startsWith('/dashboard/adventures') || currentPath === '/dashboard/create-adventure'}
                        className="cursor-pointer"
                      >
                        {IconComponent && <IconComponent className="h-4 w-4" />}
                        <span>{getNavName(item.path)}</span>
                        <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${adventuresOpen ? 'rotate-90' : ''}`} />
                      </SidebarMenuButton>
                      {adventuresOpen && (
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild isActive={isActive('/dashboard/adventures')}>
                              <Link to="/dashboard/adventures">
                                <MapPin className="h-4 w-4" />
                                <span>View Adventures</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          {hasCreatePermission && (
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild isActive={isActive('/dashboard/create-adventure')}>
                                <Link to="/dashboard/create-adventure">
                                  <Plus className="h-4 w-4" />
                                  <span>{getNavName('/dashboard/create-adventure')}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  );
                }
                
                // Handle Blog Posts with dropdown for Create Post
                if (item.path === '/dashboard/blog-posts') {
                  const hasCreatePermission = userRole && ['blogger', 'admin', 'super_admin'].includes(userRole);
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton 
                        onClick={() => setBlogPostsOpen(!blogPostsOpen)}
                        isActive={currentPath.startsWith('/dashboard/blog') || currentPath === '/dashboard/create-post'}
                        className="cursor-pointer"
                      >
                        <FileText className="h-4 w-4" />
                        <span>{getNavName(item.path)}</span>
                        <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${blogPostsOpen ? 'rotate-90' : ''}`} />
                      </SidebarMenuButton>
                      {blogPostsOpen && (
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild isActive={isActive('/dashboard/blog-posts')}>
                              <Link to="/dashboard/blog-posts">
                                <FileText className="h-4 w-4" />
                                <span>View Posts</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          {hasCreatePermission && (
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton asChild isActive={isActive('/dashboard/create-post')}>
                                <Link to="/dashboard/create-post">
                                  <Plus className="h-4 w-4" />
                                  <span>{getNavName('/dashboard/create-post')}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  );
                }
                
                // Skip standalone Create Adventure and Create Post items as they're now in dropdowns
                if (item.path === '/dashboard/create-adventure' || item.path === '/dashboard/create-post') {
                  return null;
                }
                
                // Handle all other navigation items normally
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive(item.path)}>
                      <Link to={item.path} className="sidebar-nav-item">
                        {IconComponent && <IconComponent className="h-4 w-4" />}
                        <span>{getNavName(item.path)}</span>
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
                          <span>{getNavName(item.path)}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
                
                {/* Invoice Management Dropdown - Admin and Super Admin Only */}
                {userRole && ['admin', 'super_admin'].includes(userRole) && (
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setInvoiceManagementOpen(!invoiceManagementOpen)}
                      isActive={currentPath.startsWith('/dashboard/invoices')}
                      className="cursor-pointer"
                    >
                      <Receipt className="h-4 w-4" />
                      <span>Invoice Management</span>
                      <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${invoiceManagementOpen ? 'rotate-90' : ''}`} />
                    </SidebarMenuButton>
                    {invoiceManagementOpen && (
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={isActive('/dashboard/invoices/sent')}>
                            <Link to="/dashboard/invoices/sent">
                              <Receipt className="h-4 w-4" />
                              <span>Invoices Sent</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={isActive('/dashboard/invoices/received')}>
                            <Link to="/dashboard/invoices/received">
                              <FileText className="h-4 w-4" />
                              <span>Invoices Received</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={isActive('/dashboard/invoices/reports')}>
                            <Link to="/dashboard/invoices/reports">
                              <PieChart className="h-4 w-4" />
                              <span>Financial Reports</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {(superAdminNavItems.length > 0 || userRole === 'super_admin') && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/60">Super Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {superAdminNavItems.map((item) => {
                  const IconComponent = iconMap[item.path as keyof typeof iconMap];
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild isActive={isActive(item.path)}>
                        <Link to={item.path} className="sidebar-nav-item">
                          {IconComponent && <IconComponent className="h-4 w-4" />}
                          <span>{getNavName(item.path)}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}

                {/* API Management Dropdown - Super Admin Only */}
                {userRole === 'super_admin' && (
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setApiManagementOpen(!apiManagementOpen)}
                      isActive={currentPath.startsWith('/dashboard/api-management')}
                      className="cursor-pointer"
                    >
                      <Key className="h-4 w-4" />
                      <span>API Management</span>
                      <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${apiManagementOpen ? 'rotate-90' : ''}`} />
                    </SidebarMenuButton>
                    {apiManagementOpen && (
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={isActive('/dashboard/api-management/keys')}>
                            <Link to="/dashboard/api-management/keys">
                              <Database className="h-4 w-4" />
                              <span>API Keys Dashboard</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={isActive('/dashboard/api-management/costs')}>
                            <Link to="/dashboard/api-management/costs">
                              <DollarSign className="h-4 w-4" />
                              <span>Cost Analysis</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={isActive('/dashboard/api-management/monitoring')}>
                            <Link to="/dashboard/api-management/monitoring">
                              <Activity className="h-4 w-4" />
                              <span>Usage Monitoring</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={isActive('/dashboard/api-management/alerts')}>
                            <Link to="/dashboard/api-management/alerts">
                              <Bell className="h-4 w-4" />
                              <span>Alerts & Notifications</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={isActive('/dashboard/api-management/optimization')}>
                            <Link to="/dashboard/api-management/optimization">
                              <Zap className="h-4 w-4" />
                              <span>Optimization</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={isActive('/dashboard/api-management/metrics')}>
                            <Link to="/dashboard/api-management/metrics">
                              <TrendingUp className="h-4 w-4" />
                              <span>Super Admin Metrics</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                )}

                {/* Marketing Intelligence Dropdown - Super Admin Only */}
                {userRole === 'super_admin' && (
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setMarketingIntelligenceOpen(!marketingIntelligenceOpen)}
                      isActive={currentPath.startsWith('/dashboard/marketing')}
                      className="cursor-pointer"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span>Marketing Intelligence</span>
                      <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${marketingIntelligenceOpen ? 'rotate-90' : ''}`} />
                    </SidebarMenuButton>
                    {marketingIntelligenceOpen && (
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={isActive('/dashboard/marketing/campaigns')}>
                            <Link to="/dashboard/marketing/campaigns">
                              <Target className="h-4 w-4" />
                              <span>Campaign Performance</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={isActive('/dashboard/marketing/traffic')}>
                            <Link to="/dashboard/marketing/traffic">
                              <TrendingUp className="h-4 w-4" />
                              <span>Traffic Analytics</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={isActive('/dashboard/marketing/leads')}>
                            <Link to="/dashboard/marketing/leads">
                              <Users2 className="h-4 w-4" />
                              <span>Lead Generation</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={isActive('/dashboard/marketing/content')}>
                            <Link to="/dashboard/marketing/content">
                              <Eye className="h-4 w-4" />
                              <span>Content Performance</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={isActive('/dashboard/marketing/conversions')}>
                            <Link to="/dashboard/marketing/conversions">
                              <Activity className="h-4 w-4" />
                              <span>Conversion Analytics</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={isActive('/dashboard/marketing/roi')}>
                            <Link to="/dashboard/marketing/roi">
                              <DollarSign className="h-4 w-4" />
                              <span>Marketing ROI</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                )}

                {/* Financial Transactions Dropdown - Super Admin Only */}
                {userRole === 'super_admin' && (
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setFinancialTransactionsOpen(!financialTransactionsOpen)}
                      isActive={currentPath.startsWith('/dashboard/financial-transactions')}
                      className="cursor-pointer"
                    >
                      <Banknote className="h-4 w-4" />
                      <span>Financial Transactions</span>
                      <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${financialTransactionsOpen ? 'rotate-90' : ''}`} />
                    </SidebarMenuButton>
                    {financialTransactionsOpen && (
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={isActive('/dashboard/financial-transactions/processing')}>
                            <Link to="/dashboard/financial-transactions/processing">
                              <CreditCard className="h-4 w-4" />
                              <span>Payment Processing</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={isActive('/dashboard/financial-transactions/analytics')}>
                            <Link to="/dashboard/financial-transactions/analytics">
                              <TrendingUp className="h-4 w-4" />
                              <span>Revenue Analytics</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={isActive('/dashboard/financial-transactions/disputes')}>
                            <Link to="/dashboard/financial-transactions/disputes">
                              <ShieldAlert className="h-4 w-4" />
                              <span>Dispute Management</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                )}
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
