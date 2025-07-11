
import React from 'react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { BookingsTable } from '@/components/dashboard/BookingsTable';
import { RevenueChart } from '@/components/dashboard/DashboardCharts';
import {
  Calendar,
  DollarSign,
  MapPin,
  Star,
} from 'lucide-react';

const GuideDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Guide Dashboard</h2>
        <p className="text-muted-foreground">
          Manage your tours and bookings
        </p>
      </div>

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
