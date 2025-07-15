
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { BookingsTable } from '@/components/dashboard/BookingsTable';
import { RevenueChart } from '@/components/dashboard/DashboardCharts';
import { AIAssistantPanel } from '@/components/dashboard/AIAssistantPanel';
import { useAuth } from '@/components/auth/AuthProvider';
import { useAdventureCreation } from '@/contexts/AdventureCreationContext';
import { toast } from 'sonner';
import {
  Calendar,
  DollarSign,
  MapPin,
  Star,
} from 'lucide-react';

const GuideDashboard = () => {
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
        <h2 className="text-3xl font-bold tracking-tight">Guide Dashboard</h2>
        <p className="text-muted-foreground">
          Manage your tours and bookings
        </p>
      </div>

      {/* AI Assistant Panel */}
      {user && (
        <AIAssistantPanel 
          userType={user.user_metadata?.role || 'guide'}
          onUseGenerated={handleAIGenerated}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="This Month"
          value="32"
          description="Bookings this month"
          icon={Calendar}
          trend={{ value: 20, isPositive: true }}
        />
        <StatsCard
          title="Earnings"
          value="$3,240"
          description="Monthly earnings"
          icon={DollarSign}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Adventures"
          value="8"
          description="Active adventures"
          icon={MapPin}
        />
        <StatsCard
          title="Rating"
          value="4.9"
          description="Average rating"
          icon={Star}
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        <RevenueChart />
      </div>

      <BookingsTable />
    </div>
  );
};

export default GuideDashboard;
