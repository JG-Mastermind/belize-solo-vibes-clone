
// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "./components/auth/AuthProvider";
import { AdventureCreationProvider } from "./contexts/AdventureCreationContext";
import LandingPage from "./pages/LandingPage";
import AdventuresPage from "./pages/AdventuresPage";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import About from "./pages/About";
import Safety from "./pages/Safety";
import Booking from "./pages/Booking";
import BookingCheckout from "./pages/BookingCheckout";
import AdventureDetail from "./pages/AdventureDetail";
import SuccessPage from "./pages/booking/success";
import Confirmation from "./pages/Confirmation";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/auth/callback";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import GuideDashboard from "./pages/dashboard/GuideDashboard";
import TravelerDashboard from "./pages/dashboard/TravelerDashboard";
import CreateAdventure from "./pages/dashboard/CreateAdventure";
import CreatePost from "./pages/dashboard/CreatePost";

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <AuthProvider>
          <AdventureCreationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="adventures" element={<AdventuresPage />} />
              <Route path="contact" element={<Contact />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="about" element={<About />} />
              <Route path="safety" element={<Safety />} />
              <Route path="tours/:id" element={<AdventureDetail />} />
              <Route path="AdventureDetail/:id" element={<AdventureDetail />} />
              <Route path="booking" element={<Booking />} />
              <Route path="adventure/:id" element={<AdventureDetail />} />
              <Route path="booking/:id" element={<BookingCheckout />} />
              <Route path="booking/success" element={<SuccessPage />} />
              <Route path="confirmation" element={<Confirmation />} />
              <Route path="auth/callback" element={<AuthCallback />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="guide" element={<GuideDashboard />} />
              <Route path="traveler" element={<TravelerDashboard />} />
              <Route path="create-adventure" element={<CreateAdventure />} />
            </Route>
            
            <Route path="/admin/posts/new" element={<CreatePost />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </AdventureCreationProvider>
      </AuthProvider>
    </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
