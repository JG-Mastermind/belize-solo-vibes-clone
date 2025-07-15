
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { BookingsTable } from '@/components/dashboard/BookingsTable';
import { RevenueChart, BookingsChart } from '@/components/dashboard/DashboardCharts';
import { AIAssistantPanel } from '@/components/dashboard/AIAssistantPanel';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAdventureCreation } from '@/contexts/AdventureCreationContext';
import { toast } from 'sonner';
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { setPrefilledData } = useAdventureCreation();
  
  const handleAIGenerated = (data: { image: string; description: string; title?: string }) => {
    // Store the generated data in context
    setPrefilledData({
      title: data.title,
      description: data.description,
      image: data.image,
    });
    
    // Navigate to the create adventure page
    navigate('/dashboard/create-adventure');
    toast.success('Redirecting to adventure creation form...');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Platform overview and management tools
        </p>
      </div>

      {/* AI Assistant Panel */}
      {user && (
        <AIAssistantPanel 
          userType={user.user_metadata?.role || 'admin'}
          onUseGenerated={handleAIGenerated}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value="2,350"
          description="Active platform users"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total Bookings"
          value="1,234"
          description="All-time bookings"
          icon={BookOpen}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Revenue"
          value="$45,231"
          description="Total platform revenue"
          icon={DollarSign}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Growth Rate"
          value="23.5%"
          description="Month over month"
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <RevenueChart />
        </div>
        <div className="col-span-3">
          <BookingsChart />
        </div>
      </div>

      <BookingsTable />
    </div>
  );
};

export default AdminDashboard;
