
// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Safety from "./pages/Safety";
import Booking from "./pages/Booking";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import GuideDashboard from "./pages/dashboard/GuideDashboard";
import TravelerDashboard from "./pages/dashboard/TravelerDashboard";

const queryClient = new QueryClient();

const AppLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow pt-16">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Index />} />
              <Route path="contact" element={<Contact />} />
              <Route path="blog" element={<Blog />} />
              <Route path="about" element={<About />} />
              <Route path="safety" element={<Safety />} />
              <Route path="booking/:id" element={<Booking />} />
            </Route>
            
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="guide" element={<GuideDashboard />} />
              <Route path="traveler" element={<TravelerDashboard />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
