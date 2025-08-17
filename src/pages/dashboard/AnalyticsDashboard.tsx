import React, { Suspense, lazy, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MapPin, 
  Calendar, 
  Star,
  DollarSign,
  Activity,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

// Lazy load analytics components for performance
const RevenueTrends = lazy(() => import('@/components/analytics/RevenueTrends'));
const BookingConversion = lazy(() => import('@/components/analytics/BookingConversion'));
const UserGrowthMetrics = lazy(() => import('@/components/analytics/UserGrowthMetrics'));
const AdventurePerformance = lazy(() => import('@/components/analytics/AdventurePerformance'));
const GeographicDistribution = lazy(() => import('@/components/analytics/GeographicDistribution'));
const SeasonalPatterns = lazy(() => import('@/components/analytics/SeasonalPatterns'));
const GuidePerformance = lazy(() => import('@/components/analytics/GuidePerformance'));
const CustomerLifetimeValue = lazy(() => import('@/components/analytics/CustomerLifetimeValue'));

// Loading fallback component
const AnalyticsLoading = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
    <div className="h-64 bg-gray-200 rounded"></div>
  </div>
);

const AnalyticsDashboard: React.FC = () => {
  const { t } = useTranslation(['dashboard']);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExport = () => {
    // TODO: Implement analytics export functionality
    console.log('Export analytics data');
  };

  return (
    <>
      <Helmet>
        <title>Analytics Dashboard - BelizeVibes Admin</title>
        <meta name="description" content="Comprehensive business intelligence and analytics dashboard" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive business intelligence and performance insights
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Date Range Selector */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-muted-foreground mr-3">Date Range:</span>
              {[
                { value: '7d', label: 'Last 7 days' },
                { value: '30d', label: 'Last 30 days' },
                { value: '90d', label: 'Last 3 months' },
                { value: '1y', label: 'Last year' },
                { value: 'all', label: 'All time' }
              ].map(range => (
                <Button
                  key={range.value}
                  variant={dateRange === range.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDateRange(range.value)}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Revenue</span>
            </TabsTrigger>
            <TabsTrigger value="conversion" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Conversion</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="adventures" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Adventures</span>
            </TabsTrigger>
            <TabsTrigger value="geography" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Geography</span>
            </TabsTrigger>
            <TabsTrigger value="seasonal" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Seasonal</span>
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">Guides</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Suspense fallback={<AnalyticsLoading />}>
                <RevenueTrends dateRange={dateRange} compact />
              </Suspense>
              <Suspense fallback={<AnalyticsLoading />}>
                <UserGrowthMetrics dateRange={dateRange} compact />
              </Suspense>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Suspense fallback={<AnalyticsLoading />}>
                <AdventurePerformance dateRange={dateRange} compact />
              </Suspense>
              <Suspense fallback={<AnalyticsLoading />}>
                <CustomerLifetimeValue dateRange={dateRange} compact />
              </Suspense>
            </div>
          </TabsContent>

          {/* Revenue Analysis Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <Suspense fallback={<AnalyticsLoading />}>
              <RevenueTrends dateRange={dateRange} />
            </Suspense>
          </TabsContent>

          {/* Conversion Analysis Tab */}
          <TabsContent value="conversion" className="space-y-6">
            <Suspense fallback={<AnalyticsLoading />}>
              <BookingConversion dateRange={dateRange} />
            </Suspense>
          </TabsContent>

          {/* User Growth Tab */}
          <TabsContent value="users" className="space-y-6">
            <Suspense fallback={<AnalyticsLoading />}>
              <UserGrowthMetrics dateRange={dateRange} />
            </Suspense>
          </TabsContent>

          {/* Adventure Performance Tab */}
          <TabsContent value="adventures" className="space-y-6">
            <Suspense fallback={<AnalyticsLoading />}>
              <AdventurePerformance dateRange={dateRange} />
            </Suspense>
          </TabsContent>

          {/* Geographic Distribution Tab */}
          <TabsContent value="geography" className="space-y-6">
            <Suspense fallback={<AnalyticsLoading />}>
              <GeographicDistribution dateRange={dateRange} />
            </Suspense>
          </TabsContent>

          {/* Seasonal Patterns Tab */}
          <TabsContent value="seasonal" className="space-y-6">
            <Suspense fallback={<AnalyticsLoading />}>
              <SeasonalPatterns dateRange={dateRange} />
            </Suspense>
          </TabsContent>

          {/* Guide Performance Tab */}
          <TabsContent value="guides" className="space-y-6">
            <div className="grid gap-6">
              <Suspense fallback={<AnalyticsLoading />}>
                <GuidePerformance dateRange={dateRange} />
              </Suspense>
              <Suspense fallback={<AnalyticsLoading />}>
                <CustomerLifetimeValue dateRange={dateRange} />
              </Suspense>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AnalyticsDashboard;