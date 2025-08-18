import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Activity, TrendingUp, Target, Users, ShoppingCart, CreditCard, Clock, Download } from 'lucide-react';

const MarketingConversions: React.FC = () => {
  const conversionOverview = {
    totalVisitors: 89456,
    totalConversions: 3214,
    conversionRate: 3.6,
    revenuePerVisitor: 42.50,
    averageOrderValue: 1183,
    totalRevenue: 3804502,
    conversionVelocity: 18.5,
    returnCustomerRate: 24.7
  };

  const conversionFunnel = [
    { stage: 'Website Visitors', count: 89456, percentage: 100, dropOff: 0, conversionRate: 27.4 },
    { stage: 'Adventure Views', count: 24567, percentage: 27.4, dropOff: 72.6, conversionRate: 31.8 },
    { stage: 'Booking Intent', count: 7821, percentage: 31.8, dropOff: 68.2, conversionRate: 45.6 },
    { stage: 'Guest Information', count: 3567, percentage: 45.6, dropOff: 54.4, conversionRate: 67.8 },
    { stage: 'Date Selection', count: 2419, percentage: 67.8, dropOff: 32.2, conversionRate: 78.9 },
    { stage: 'Payment Page', count: 1909, percentage: 78.9, dropOff: 21.1, conversionRate: 84.6 },
    { stage: 'Booking Complete', count: 1615, percentage: 84.6, dropOff: 15.4, conversionRate: 100 }
  ];

  const conversionBySource = [
    { source: 'Direct Traffic', visitors: 21834, conversions: 892, rate: 4.1, revenue: 1056489, aov: 1184 },
    { source: 'Organic Search', visitors: 32145, conversions: 1134, rate: 3.5, revenue: 1342156, aov: 1183 },
    { source: 'Paid Search', visitors: 12456, conversions: 687, rate: 5.5, revenue: 813492, aov: 1184 },
    { source: 'Social Media', visitors: 18967, conversions: 423, rate: 2.2, revenue: 500439, aov: 1183 },
    { source: 'Email Marketing', visitors: 4054, conversions: 78, rate: 1.9, revenue: 92156, aov: 1182 }
  ];

  const conversionByDevice = [
    { device: 'Desktop', visitors: 42578, conversions: 1789, rate: 4.2, revenue: 2118456 },
    { device: 'Mobile', visitors: 38123, conversions: 1185, rate: 3.1, revenue: 1401234 },
    { device: 'Tablet', visitors: 8755, conversions: 240, rate: 2.7, revenue: 284812 }
  ];

  const adventureConversions = [
    { adventure: 'Belize Caves Exploration', views: 8934, conversions: 456, rate: 5.1, revenue: 539424, aov: 1183 },
    { adventure: 'Blue Hole Diving', views: 7623, conversions: 398, rate: 5.2, revenue: 470834, aov: 1183 },
    { adventure: 'Maya Ruins Discovery', views: 6745, conversions: 298, rate: 4.4, revenue: 352534, aov: 1183 },
    { adventure: 'Barrier Reef Snorkeling', views: 5634, conversions: 245, rate: 4.3, revenue: 289835, aov: 1183 },
    { adventure: 'Jungle Zip-line Tours', views: 4987, conversions: 189, rate: 3.8, revenue: 223587, aov: 1183 }
  ];

  const monthlyConversions = [
    { month: 'Jan', conversions: 287, rate: 3.2, revenue: 339621 },
    { month: 'Feb', conversions: 342, rate: 3.4, revenue: 404586 },
    { month: 'Mar', conversions: 398, rate: 3.6, revenue: 470834 },
    { month: 'Apr', conversions: 445, rate: 3.8, revenue: 526635 },
    { month: 'May', conversions: 523, rate: 4.1, revenue: 618729 },
    { month: 'Jun', conversions: 589, rate: 4.3, revenue: 696787 }
  ];

  const conversionOptimization = [
    {
      optimization: 'Mobile Checkout Simplification',
      implemented: true,
      impact: '+18% mobile conversion rate',
      timeline: '2024-02-15',
      status: 'completed'
    },
    {
      optimization: 'Express Booking Flow',
      implemented: true,
      impact: '+12% overall conversion rate',
      timeline: '2024-01-20',
      status: 'completed'
    },
    {
      optimization: 'Trust Signals on Payment Page',
      implemented: false,
      impact: '+8% estimated improvement',
      timeline: '2024-04-01',
      status: 'planned'
    },
    {
      optimization: 'Abandoned Cart Email Sequence',
      implemented: true,
      impact: '+15% recovery rate',
      timeline: '2024-03-10',
      status: 'active'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'active':
        return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
      case 'planned':
        return <Badge className="bg-orange-100 text-orange-800">Planned</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Conversion Analytics - BelizeVibes Marketing Dashboard</title>
        <meta name="description" content="Track conversion funnel performance and optimize booking completion rates" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Conversion Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive funnel analysis and conversion optimization tracking
            </p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Analysis
          </Button>
        </div>

        {/* Conversion Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversionOverview.conversionRate}%</div>
              <div className="flex items-center text-xs">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-green-600">+0.4% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversionOverview.totalConversions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                From {conversionOverview.totalVisitors.toLocaleString()} visitors
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue per Visitor</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${conversionOverview.revenuePerVisitor}</div>
              <p className="text-xs text-muted-foreground">
                ${conversionOverview.averageOrderValue} AOV
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Velocity</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversionOverview.conversionVelocity} days</div>
              <p className="text-xs text-muted-foreground">
                Average time to convert
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Conversion Funnel */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Conversion Funnel Analysis</CardTitle>
            <CardDescription>
              Step-by-step breakdown of user journey and drop-off points
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionFunnel.map((stage, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{stage.stage}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm">{stage.count.toLocaleString()}</span>
                      {index > 0 && (
                        <Badge variant="outline" className="text-xs">
                          -{stage.dropOff}% drop-off
                        </Badge>
                      )}
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {stage.conversionRate}% conv rate
                      </Badge>
                    </div>
                  </div>
                  <Progress value={stage.percentage} className="h-3" />
                  <div className="text-xs text-muted-foreground">
                    {stage.percentage}% of total visitors
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Conversion by Source */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Conversion by Traffic Source</CardTitle>
              <CardDescription>
                Conversion performance across different acquisition channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionBySource.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{source.source}</h3>
                        <Badge className={`${source.rate >= 4 ? 'bg-green-100 text-green-800' : source.rate >= 3 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
                          {source.rate}% CR
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-sm text-muted-foreground">
                        <div>
                          <span>Visitors: </span>
                          <span className="font-medium text-foreground">{source.visitors.toLocaleString()}</span>
                        </div>
                        <div>
                          <span>Conversions: </span>
                          <span className="font-medium text-foreground">{source.conversions}</span>
                        </div>
                        <div>
                          <span>Revenue: </span>
                          <span className="font-medium text-foreground">${source.revenue.toLocaleString()}</span>
                        </div>
                        <div>
                          <span>AOV: </span>
                          <span className="font-medium text-foreground">${source.aov}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Device Performance */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Device Conversion Performance</CardTitle>
              <CardDescription>
                Conversion rates across different device types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionByDevice.map((device, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{device.device}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{device.conversions} conversions</span>
                        <Badge className={`${device.rate >= 4 ? 'bg-green-100 text-green-800' : device.rate >= 3 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
                          {device.rate}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={(device.visitors / conversionOverview.totalVisitors) * 100} className="h-2" />
                    <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                      <div>
                        <span>Visitors: </span>
                        <span className="font-medium text-foreground">{device.visitors.toLocaleString()}</span>
                      </div>
                      <div>
                        <span>Conv Rate: </span>
                        <span className="font-medium text-foreground">{device.rate}%</span>
                      </div>
                      <div>
                        <span>Revenue: </span>
                        <span className="font-medium text-foreground">${device.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Adventure Conversion Performance */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Adventure Conversion Performance</CardTitle>
            <CardDescription>
              Individual adventure page conversion rates and revenue generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {adventureConversions.map((adventure, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{adventure.adventure}</h3>
                      <Badge className={`${adventure.rate >= 5 ? 'bg-green-100 text-green-800' : adventure.rate >= 4 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
                        {adventure.rate}% CR
                      </Badge>
                    </div>
                    <div className="grid grid-cols-5 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Views:</span>
                        <div className="font-medium">{adventure.views.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Bookings:</span>
                        <div className="font-medium">{adventure.conversions}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Conv Rate:</span>
                        <div className="font-medium">{adventure.rate}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Revenue:</span>
                        <div className="font-medium">${adventure.revenue.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">AOV:</span>
                        <div className="font-medium">${adventure.aov}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Optimization Initiatives */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Conversion Optimization Initiatives</CardTitle>
            <CardDescription>
              Implemented and planned optimizations with their impact on conversion rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionOptimization.map((optimization, index) => (
                <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{optimization.optimization}</h3>
                      {getStatusBadge(optimization.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {optimization.impact} | Timeline: {optimization.timeline}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {optimization.implemented ? (
                      <Badge className="bg-green-100 text-green-800">
                        Live
                      </Badge>
                    ) : (
                      <Button variant="outline" size="sm">
                        Implement
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Conversion Trends */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Monthly Conversion Trends</CardTitle>
            <CardDescription>
              Historical conversion rate and revenue performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {monthlyConversions.map((month, index) => (
                <div key={index} className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-bold text-orange-600 mb-1">{month.month}</div>
                  <div className="text-sm text-muted-foreground mb-2">{month.conversions} conversions</div>
                  <div className="text-xs font-medium">{month.rate}% rate</div>
                  <div className="text-xs text-muted-foreground">${month.revenue.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default MarketingConversions;