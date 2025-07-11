
import React from 'react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { BookingsTable } from '@/components/dashboard/BookingsTable';
import {
  MapPin,
  Calendar,
  Heart,
  Clock,
} from 'lucide-react';

const TravelerDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Dashboard</h2>
        <p className="text-muted-foreground">
          Track your adventures and bookings
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Adventures Booked"
          value="12"
          description="Total adventures"
          icon={MapPin}
        />
        <StatsCard
          title="Upcoming"
          value="3"
          description="Next 30 days"
          icon={Calendar}
        />
        <StatsCard
          title="Favorites"
          value="8"
          description="Saved adventures"
          icon={Heart}
        />
        <StatsCard
          title="Last Trip"
          value="5 days"
          description="Days ago"
          icon={Clock}
        />
      </div>

      <BookingsTable />
    </div>
  );
};

export default TravelerDashboard;
