
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { useDashboardAnalytics } from '@/hooks/useDashboardAnalytics';

export const RevenueChart = memo(() => {
  const { bookingAnalytics } = useDashboardAnalytics();
  
  // Transform booking analytics data for the chart
  const revenueData = bookingAnalytics.data?.map(item => ({
    name: new Date(item.month).toLocaleDateString('en-US', { month: 'short' }),
    value: Number(item.total_revenue) || 0
  })) || [];

  if (bookingAnalytics.isLoading) {
    return (
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p>Loading revenue data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--chart-primary))"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});

export const BookingsChart = memo(() => {
  const { bookingAnalytics } = useDashboardAnalytics();
  
  // Transform booking analytics data for the chart
  const bookingsData = bookingAnalytics.data?.map(item => ({
    name: new Date(item.month).toLocaleDateString('en-US', { month: 'short' }),
    bookings: Number(item.total_bookings) || 0
  })) || [];

  if (bookingAnalytics.isLoading) {
    return (
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Monthly Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p>Loading booking data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle>Monthly Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bookingsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="bookings" fill="hsl(var(--chart-primary))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});
