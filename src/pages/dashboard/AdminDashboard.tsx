
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StatsCard } from '@/components/dashboard/StatsCard';

// Lazy load heavy dashboard components with improved loading
const BookingsTable = lazy(() => 
  import('@/components/dashboard/BookingsTable').then(module => ({ 
    default: module.BookingsTable 
  }))
);
const RevenueChart = lazy(() => 
  import('@/components/dashboard/DashboardCharts').then(module => ({ 
    default: module.RevenueChart 
  }))
);
const BookingsChart = lazy(() => 
  import('@/components/dashboard/DashboardCharts').then(module => ({ 
    default: module.BookingsChart 
  }))
);
const AIAssistantPanel = lazy(() => 
  import('@/components/dashboard/AIAssistantPanel').then(module => ({ 
    default: module.AIAssistantPanel 
  }))
);

import { useAuth } from '@/components/auth/AuthProvider';
import { useAdventureCreation } from '@/contexts/AdventureCreationContext';
import { toast } from 'sonner';
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Activity,
  BarChart3,
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(['dashboard']);
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
        <h2 className="text-3xl font-bold tracking-tight">{t('dashboard:adminTitle')}</h2>
        <p className="text-muted-foreground">
          {t('dashboard:subtitle')}
        </p>
      </div>

      {/* AI Assistant Panel */}
      {user && (
        <Suspense fallback={
          <div className="animate-pulse bg-gray-200 rounded-lg h-64 w-full"></div>
        }>
          <AIAssistantPanel 
            userType={user.user_metadata?.role || 'admin'}
            onUseGenerated={handleAIGenerated}
          />
        </Suspense>
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
          <Suspense fallback={
            <div className="animate-pulse bg-gray-200 rounded-lg h-96 w-full"></div>
          }>
            <RevenueChart />
          </Suspense>
        </div>
        <div className="col-span-3">
          <Suspense fallback={
            <div className="animate-pulse bg-gray-200 rounded-lg h-96 w-full"></div>
          }>
            <BookingsChart />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={
        <div className="animate-pulse bg-gray-200 rounded-lg h-64 w-full"></div>
      }>
        <BookingsTable />
      </Suspense>
    </div>
  );
};

export default AdminDashboard;
