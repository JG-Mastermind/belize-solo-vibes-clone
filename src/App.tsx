
// src/App.tsx
import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "./components/auth/AuthProvider";
import { AdventureCreationProvider } from "./contexts/AdventureCreationContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import RequireRole from "./components/auth/RequireRole";
import { registerServiceWorker } from "./utils/serviceWorker";

// Lazy load all page components for code splitting
const LandingPage = lazy(() => import("./pages/LandingPage"));
const AdventuresPage = lazy(() => import("./pages/AdventuresPage"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const About = lazy(() => import("./pages/About"));
const Safety = lazy(() => import("./pages/Safety"));
const Booking = lazy(() => import("./pages/Booking"));
const BookingCheckout = lazy(() => import("./pages/BookingCheckout"));
const AdventureDetail = lazy(() => import("./pages/AdventureDetail"));
const SuccessPage = lazy(() => import("./pages/booking/success"));
const Confirmation = lazy(() => import("./pages/Confirmation"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AuthCallback = lazy(() => import("./pages/auth/callback"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

// Lazy load dashboard components
const DashboardLayout = lazy(() => import("./components/dashboard/DashboardLayout").then(module => ({ default: module.DashboardLayout })));
const AdminDashboard = lazy(() => import("./pages/dashboard/AdminDashboard"));
const GuideDashboard = lazy(() => import("./pages/dashboard/GuideDashboard"));
const TravelerDashboard = lazy(() => import("./pages/dashboard/TravelerDashboard"));
const CreateAdventure = lazy(() => import("./pages/dashboard/CreateAdventure"));
const CreatePost = lazy(() => import("./pages/dashboard/CreatePost"));
const BlogPosts = lazy(() => import("./pages/dashboard/BlogPosts"));
const EditPost = lazy(() => import("./pages/dashboard/EditPost"));

// Lazy load admin components
const AdminAdventures = lazy(() => import("./pages/admin/AdminAdventures"));
const AdminCreateAdventure = lazy(() => import("./pages/admin/AdminCreateAdventure"));
const AdminEditAdventure = lazy(() => import("./pages/admin/AdminEditAdventure"));
const InvitationManager = lazy(() => import("./pages/admin/InvitationManager"));
const UserManager = lazy(() => import("./pages/admin/UserManager"));
const AcceptInvitation = lazy(() => import("./pages/admin/AcceptInvitation"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const SafetyAlerts = lazy(() => import("./pages/dashboard/SafetyAlerts"));
const Bookings = lazy(() => import("./pages/dashboard/Bookings"));
const Calendar = lazy(() => import("./pages/dashboard/Calendar"));
const Messages = lazy(() => import("./pages/dashboard/Messages"));
const Payouts = lazy(() => import("./pages/dashboard/Payouts"));
const AnalyticsDashboard = lazy(() => import("./pages/dashboard/AnalyticsDashboard"));
const SuperAdminMetricsPage = lazy(() => import("./pages/dashboard/SuperAdminMetrics"));
const ApiKeysManagement = lazy(() => import("./pages/dashboard/ApiKeysManagement"));
const ApiCostAnalysis = lazy(() => import("./pages/dashboard/ApiCostAnalysis"));
const ApiUsageMonitoring = lazy(() => import("./pages/dashboard/ApiUsageMonitoring"));
const ApiAlertsManagement = lazy(() => import("./pages/dashboard/ApiAlertsManagement"));
const ApiOptimization = lazy(() => import("./pages/dashboard/ApiOptimization"));
const MarketingCampaigns = lazy(() => import("./pages/dashboard/MarketingCampaigns"));
const MarketingTraffic = lazy(() => import("./pages/dashboard/MarketingTraffic"));
const MarketingLeads = lazy(() => import("./pages/dashboard/MarketingLeads"));
const MarketingContent = lazy(() => import("./pages/dashboard/MarketingContent"));
const MarketingConversions = lazy(() => import("./pages/dashboard/MarketingConversions"));
const MarketingROI = lazy(() => import("./pages/dashboard/MarketingROI"));
const InvoicesSent = lazy(() => import("./pages/dashboard/InvoicesSent"));
const InvoicesReceived = lazy(() => import("./pages/dashboard/InvoicesReceived"));
const FinancialReports = lazy(() => import("./pages/dashboard/FinancialReports"));
const FinancialTransactionsProcessing = lazy(() => import("./pages/dashboard/FinancialTransactionsProcessing"));
const FinancialTransactionsAnalytics = lazy(() => import("./pages/dashboard/FinancialTransactionsAnalytics"));
const FinancialTransactionsDisputes = lazy(() => import("./pages/dashboard/FinancialTransactionsDisputes"));
const UserSettings = lazy(() => import("./pages/dashboard/UserSettings"));
const TestAI = lazy(() => import("./pages/TestAI"));

// Loading component for suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    <span className="ml-3 text-sm text-gray-600">Loading...</span>
  </div>
);

const queryClient = new QueryClient();

const AppLayout = () => (
  <div className="flex flex-col min-h-screen bg-background text-foreground">
    <Header />
    <main className="flex-grow pt-16">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const App = () => {
  // Register service worker on app initialization
  useEffect(() => {
    registerServiceWorker({
      onSuccess: () => console.log('Service Worker: Registration successful'),
      onUpdate: () => console.log('Service Worker: New content available'),
      onError: (error) => console.error('Service Worker: Registration failed', error)
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <AuthProvider>
            <AdventureCreationProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              {/* Separate Suspense boundaries for static vs dynamic routes */}
              <Routes>
              <Route path="/" element={<AppLayout />}>
                {/* Static routes - shared Suspense boundary (no data dependencies) */}
                <Route index element={
                  <Suspense fallback={<PageLoader />}>
                    <LandingPage />
                  </Suspense>
                } />
                <Route path="adventures" element={
                  <Suspense fallback={<PageLoader />}>
                    <AdventuresPage />
                  </Suspense>
                } />
                <Route path="contact" element={
                  <Suspense fallback={<PageLoader />}>
                    <Contact />
                  </Suspense>
                } />
                <Route path="about" element={
                  <Suspense fallback={<PageLoader />}>
                    <About />
                  </Suspense>
                } />
                <Route path="safety" element={
                  <Suspense fallback={<PageLoader />}>
                    <Safety />
                  </Suspense>
                } />
                <Route path="fr-ca/securite" element={
                  <Suspense fallback={<PageLoader />}>
                    <Safety />
                  </Suspense>
                } />
                <Route path="fr-ca/a-propos" element={
                  <Suspense fallback={<PageLoader />}>
                    <About />
                  </Suspense>
                } />
                <Route path="fr-ca/contact" element={
                  <Suspense fallback={<PageLoader />}>
                    <Contact />
                  </Suspense>
                } />
                <Route path="fr-ca/aventures" element={
                  <Suspense fallback={<PageLoader />}>
                    <AdventuresPage />
                  </Suspense>
                } />
                
                {/* Dynamic routes with data dependencies - separate Suspense boundaries */}
                <Route path="blog" element={
                  <Suspense fallback={<PageLoader />}>
                    <Blog />
                  </Suspense>
                } />
                <Route path="blog/:slug" element={
                  <Suspense fallback={<PageLoader />}>
                    <BlogPost />
                  </Suspense>
                } />
                <Route path="fr-ca/blog" element={
                  <Suspense fallback={<PageLoader />}>
                    <Blog />
                  </Suspense>
                } />
                <Route path="fr-ca/blog/:frenchSlug" element={
                  <Suspense fallback={<PageLoader />}>
                    <BlogPost />
                  </Suspense>
                } />
                <Route path="fr-ca/tours/:frenchSlug" element={
                  <Suspense fallback={<PageLoader />}>
                    <AdventureDetail />
                  </Suspense>
                } />
                <Route path="tours/:slug" element={
                  <Suspense fallback={<PageLoader />}>
                    <AdventureDetail />
                  </Suspense>
                } />
                <Route path="tours/:id" element={
                  <Suspense fallback={<PageLoader />}>
                    <AdventureDetail />
                  </Suspense>
                } />
                
                {/* Booking flow routes - separate boundary */}
                <Route path="booking" element={
                  <Suspense fallback={<PageLoader />}>
                    <Booking />
                  </Suspense>
                } />
                <Route path="booking/:id" element={
                  <Suspense fallback={<PageLoader />}>
                    <BookingCheckout />
                  </Suspense>
                } />
                <Route path="booking/success" element={
                  <Suspense fallback={<PageLoader />}>
                    <SuccessPage />
                  </Suspense>
                } />
                <Route path="confirmation" element={
                  <Suspense fallback={<PageLoader />}>
                    <Confirmation />
                  </Suspense>
                } />
                <Route path="test-ai" element={
                  <Suspense fallback={<PageLoader />}>
                    <TestAI />
                  </Suspense>
                } />
                <Route path="auth/callback" element={
                  <Suspense fallback={<PageLoader />}>
                    <AuthCallback />
                  </Suspense>
                } />
                <Route path="auth/reset-password" element={
                  <Suspense fallback={<PageLoader />}>
                    <ResetPassword />
                  </Suspense>
                } />
                <Route path="*" element={
                  <Suspense fallback={<PageLoader />}>
                    <NotFound />
                  </Suspense>
                } />
              </Route>
              
              {/* Dashboard routes with granular Suspense for dynamic pages */}
              <Route path="/dashboard" element={
                <Suspense fallback={<PageLoader />}>
                  <DashboardLayout />
                </Suspense>
              }>
                {/* Frequently used dashboard routes - separate boundaries to reduce cascade */}
                <Route index element={
                  <Suspense fallback={<PageLoader />}>
                    <AdminDashboard />
                  </Suspense>
                } />
                <Route path="admin" element={
                  <Suspense fallback={<PageLoader />}>
                    <AdminDashboard />
                  </Suspense>
                } />
                <Route path="guide" element={
                  <Suspense fallback={<PageLoader />}>
                    <GuideDashboard />
                  </Suspense>
                } />
                <Route path="traveler" element={
                  <Suspense fallback={<PageLoader />}>
                    <TravelerDashboard />
                  </Suspense>
                } />
                <Route path="bookings" element={
                  <Suspense fallback={<PageLoader />}>
                    <Bookings />
                  </Suspense>
                } />
                <Route path="calendar" element={
                  <Suspense fallback={<PageLoader />}>
                    <Calendar />
                  </Suspense>
                } />
                <Route path="adventures" element={
                  <Suspense fallback={<PageLoader />}>
                    <AdminAdventures />
                  </Suspense>
                } />
                <Route path="messages" element={
                  <Suspense fallback={<PageLoader />}>
                    <Messages />
                  </Suspense>
                } />
                <Route path="payouts" element={
                  <Suspense fallback={<PageLoader />}>
                    <Payouts />
                  </Suspense>
                } />
                <Route path="create-adventure" element={
                  <Suspense fallback={<PageLoader />}>
                    <CreateAdventure />
                  </Suspense>
                } />
                <Route path="users" element={
                  <Suspense fallback={<PageLoader />}>
                    <RequireRole allowedRoles={['admin', 'super_admin']}>
                      <UserManager />
                    </RequireRole>
                  </Suspense>
                } />
                <Route path="alerts" element={
                  <Suspense fallback={<PageLoader />}>
                    <RequireRole allowedRoles={['admin', 'super_admin']}>
                      <SafetyAlerts />
                    </RequireRole>
                  </Suspense>
                } />
                <Route path="analytics" element={
                  <Suspense fallback={<PageLoader />}>
                    <RequireRole allowedRoles={['admin', 'super_admin']}>
                      <AnalyticsDashboard />
                    </RequireRole>
                  </Suspense>
                } />
                <Route path="api-management/metrics" element={
                  <RequireRole allowedRoles={['super_admin']}>
                    <SuperAdminMetricsPage />
                  </RequireRole>
                } />
                <Route path="api-management/keys" element={
                  <RequireRole allowedRoles={['super_admin']}>
                    <ApiKeysManagement />
                  </RequireRole>
                } />
                <Route path="api-management/costs" element={
                  <RequireRole allowedRoles={['super_admin']}>
                    <ApiCostAnalysis />
                  </RequireRole>
                } />
                <Route path="api-management/monitoring" element={
                  <RequireRole allowedRoles={['super_admin']}>
                    <ApiUsageMonitoring />
                  </RequireRole>
                } />
                <Route path="api-management/alerts" element={
                  <RequireRole allowedRoles={['super_admin']}>
                    <ApiAlertsManagement />
                  </RequireRole>
                } />
                <Route path="api-management/optimization" element={
                  <RequireRole allowedRoles={['super_admin']}>
                    <ApiOptimization />
                  </RequireRole>
                } />
                <Route path="marketing/campaigns" element={
                  <RequireRole allowedRoles={['super_admin']}>
                    <MarketingCampaigns />
                  </RequireRole>
                } />
                <Route path="marketing/traffic" element={
                  <RequireRole allowedRoles={['super_admin']}>
                    <MarketingTraffic />
                  </RequireRole>
                } />
                <Route path="marketing/leads" element={
                  <RequireRole allowedRoles={['super_admin']}>
                    <MarketingLeads />
                  </RequireRole>
                } />
                <Route path="marketing/content" element={
                  <RequireRole allowedRoles={['super_admin']}>
                    <MarketingContent />
                  </RequireRole>
                } />
                <Route path="marketing/conversions" element={
                  <RequireRole allowedRoles={['super_admin']}>
                    <MarketingConversions />
                  </RequireRole>
                } />
                <Route path="marketing/roi" element={
                  <RequireRole allowedRoles={['super_admin']}>
                    <MarketingROI />
                  </RequireRole>
                } />
                <Route path="invoices/sent" element={
                  <RequireRole allowedRoles={['admin', 'super_admin']}>
                    <InvoicesSent />
                  </RequireRole>
                } />
                <Route path="invoices/received" element={
                  <RequireRole allowedRoles={['admin', 'super_admin']}>
                    <InvoicesReceived />
                  </RequireRole>
                } />
                <Route path="invoices/reports" element={
                  <RequireRole allowedRoles={['admin', 'super_admin']}>
                    <FinancialReports />
                  </RequireRole>
                } />
                <Route path="financial-transactions/processing" element={
                  <RequireRole allowedRoles={['super_admin']}>
                    <FinancialTransactionsProcessing />
                  </RequireRole>
                } />
                <Route path="financial-transactions/analytics" element={
                  <RequireRole allowedRoles={['super_admin']}>
                    <FinancialTransactionsAnalytics />
                  </RequireRole>
                } />
                <Route path="financial-transactions/disputes" element={
                  <RequireRole allowedRoles={['super_admin']}>
                    <FinancialTransactionsDisputes />
                  </RequireRole>
                } />
                {/* Blog management routes - separate boundaries for data fetching + component loading */}
                <Route path="create-post" element={
                  <Suspense fallback={<PageLoader />}>
                    <CreatePost />
                  </Suspense>
                } />
                <Route path="blog-posts" element={
                  <Suspense fallback={<PageLoader />}>
                    <BlogPosts />
                  </Suspense>
                } />
                {/* EditPost - Critical fix for triple lazy loading cascade */}
                <Route path="edit-post/:id" element={
                  <Suspense fallback={<PageLoader />}>
                    <EditPost />
                  </Suspense>
                } />
                <Route path="settings" element={<UserSettings />} />
              </Route>
              
              <Route path="/admin" element={<DashboardLayout />}>
                <Route path="adventures" element={<AdminAdventures />} />
                <Route path="adventures/new" element={<AdminCreateAdventure />} />
                <Route path="adventures/edit/:id" element={<AdminEditAdventure />} />
                <Route path="invitations" element={
                  <RequireRole allowedRoles={['super_admin']}>
                    <InvitationManager />
                  </RequireRole>
                } />
                <Route path="users" element={
                  <RequireRole allowedRoles={['super_admin']}>
                    <UserManager />
                  </RequireRole>
                } />
              </Route>
              
              {/* Standalone admin routes with individual Suspense boundaries */}
              <Route path="/admin/posts/new" element={
                <Suspense fallback={<PageLoader />}>
                  <CreatePost />
                </Suspense>
              } />
              <Route path="/admin/posts/edit/:id" element={
                <Suspense fallback={<PageLoader />}>
                  <EditPost />
                </Suspense>
              } />
              <Route path="/admin/accept" element={
                <Suspense fallback={<PageLoader />}>
                  <AcceptInvitation />
                </Suspense>
              } />
              <Route path="/admin/login" element={
                <Suspense fallback={<PageLoader />}>
                  <AdminLogin />
                </Suspense>
              } />
              
              <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            </AdventureCreationProvider>
          </AuthProvider>
        </TooltipProvider>
        </HelmetProvider>
      </QueryClientProvider>
    );
  };

export default App;
