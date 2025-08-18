import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import SuperAdminMetrics from '@/components/analytics/SuperAdminMetrics';

// Loading fallback component
const MetricsLoading = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
    <div className="h-64 bg-gray-200 rounded"></div>
  </div>
);

const SuperAdminMetricsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Super Admin Metrics - BelizeVibes API Management</title>
        <meta name="description" content="Comprehensive API management and super admin metrics dashboard" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Super Admin Metrics</h1>
            <p className="text-muted-foreground">
              Advanced API management, cost optimization, and system monitoring
            </p>
          </div>
        </div>

        {/* Super Admin Metrics Component */}
        <Suspense fallback={<MetricsLoading />}>
          <SuperAdminMetrics dateRange="30d" />
        </Suspense>
      </div>
    </>
  );
};

export default SuperAdminMetricsPage;