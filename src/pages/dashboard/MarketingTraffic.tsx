import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Globe, Users, Eye, Clock, Download, ArrowUpRight } from 'lucide-react';

const MarketingTraffic: React.FC = () => {
  const trafficOverview = {
    totalSessions: 89456,
    uniqueVisitors: 67234,
    pageViews: 234567,
    avgSessionDuration: 4.2,
    bounceRate: 34.5,
    conversionRate: 3.8,
    newVisitors: 72.4,
    returningVisitors: 27.6
  };

  const trafficSources = [
    {
      source: 'Organic Search',
      sessions: 32145,
      percentage: 35.9,
      change: +12.5,
      conversions: 1234,
      conversionRate: 3.8,
      avgSessionDuration: 5.2
    },
    {
      source: 'Direct',
      sessions: 21834,
      percentage: 24.4,
      change: +8.3,
      conversions: 876,
      conversionRate: 4.0,
      avgSessionDuration: 6.1
    },
    {
      source: 'Social Media',
      sessions: 18967,
      percentage: 21.2,
      change: +15.7,
      conversions: 689,
      conversionRate: 3.6,
      avgSessionDuration: 3.4
    },
    {
      source: 'Paid Search',
      sessions: 12456,
      percentage: 13.9,
      change: +22.1,
      conversions: 567,
      conversionRate: 4.5,
      avgSessionDuration: 4.8
    },
    {
      source: 'Email',
      sessions: 4054,
      percentage: 4.5,
      change: +6.2,
      conversions: 189,
      conversionRate: 4.7,
      avgSessionDuration: 7.3
    }
  ];

  const topPages = [
    { page: '/adventures/belize-caves', views: 23456, uniqueViews: 18234, avgTime: '4:32', bounceRate: 28.5 },
    { page: '/adventures/barrier-reef', views: 19834, uniqueViews: 15678, avgTime: '3:56', bounceRate: 31.2 },
    { page: '/blog/maya-ruins-guide', views: 15678, uniqueViews: 12345, avgTime: '6:18', bounceRate: 22.1 },
    { page: '/adventures/jungle-tours', views: 14523, uniqueViews: 11234, avgTime: '4:12', bounceRate: 35.8 },
    { page: '/about-belize', views: 12345, uniqueViews: 9876, avgTime: '5:24', bounceRate: 29.4 },
    { page: '/contact', views: 10987, uniqueViews: 8765, avgTime: '2:45', bounceRate: 45.6 }
  ];

  const deviceBreakdown = [
    { device: 'Desktop', sessions: 42578, percentage: 47.6, conversionRate: 4.2 },
    { device: 'Mobile', sessions: 38123, percentage: 42.6, conversionRate: 3.1 },
    { device: 'Tablet', sessions: 8755, percentage: 9.8, conversionRate: 3.8 }
  ];

  const geoData = [
    { country: 'United States', sessions: 34567, percentage: 38.6, flag: '🇺🇸' },
    { country: 'Canada', sessions: 15234, percentage: 17.0, flag: '🇨🇦' },
    { country: 'United Kingdom', sessions: 8765, percentage: 9.8, flag: '🇬🇧' },
    { country: 'Germany', sessions: 6543, percentage: 7.3, flag: '🇩🇪' },
    { country: 'Australia', sessions: 4321, percentage: 4.8, flag: '🇦🇺' },
    { country: 'Others', sessions: 19726, percentage: 22.5, flag: '🌍' }
  ];

  const getChangeIcon = (change: number) => {
    return change > 0 ? (
      <TrendingUp className="w-3 h-3 text-green-500" />
    ) : (
      <TrendingDown className="w-3 h-3 text-red-500" />
    );
  };

  return (
    <>
      <Helmet>
        <title>Traffic Analytics - BelizeVibes Marketing Dashboard</title>
        <meta name="description" content="Analyze website traffic sources, user behavior, and conversion patterns" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Traffic Analytics</h1>
            <p className="text-muted-foreground">
              Comprehensive analysis of website traffic sources and user behavior
            </p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Traffic Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trafficOverview.totalSessions.toLocaleString()}</div>
              <div className="flex items-center text-xs">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-green-600">+14.2% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trafficOverview.uniqueVisitors.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {trafficOverview.newVisitors}% new visitors
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trafficOverview.pageViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {(trafficOverview.pageViews / trafficOverview.totalSessions).toFixed(1)} pages/session
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trafficOverview.avgSessionDuration}min</div>
              <p className="text-xs text-muted-foreground">
                {trafficOverview.bounceRate}% bounce rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Traffic Sources */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>
              Breakdown of website traffic by acquisition channel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{source.source}</h3>
                      <div className="flex items-center gap-2">
                        {getChangeIcon(source.change)}
                        <span className={`text-sm ${source.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {source.change > 0 ? '+' : ''}{source.change}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-4 text-sm mb-2">
                      <div>
                        <span className="text-muted-foreground">Sessions:</span>
                        <div className="font-medium">{source.sessions.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Share:</span>
                        <div className="font-medium">{source.percentage}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Conversions:</span>
                        <div className="font-medium">{source.conversions}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Conv Rate:</span>
                        <div className="font-medium">{source.conversionRate}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Duration:</span>
                        <div className="font-medium">{source.avgSessionDuration}min</div>
                      </div>
                    </div>

                    <Progress value={source.percentage} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Pages */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Top Performing Pages</CardTitle>
              <CardDescription>
                Most visited pages and their performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {page.page}
                        </code>
                        <ArrowUpRight className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                        <div>
                          <span>Views: </span>
                          <span className="font-medium text-foreground">{page.views.toLocaleString()}</span>
                        </div>
                        <div>
                          <span>Unique: </span>
                          <span className="font-medium text-foreground">{page.uniqueViews.toLocaleString()}</span>
                        </div>
                        <div>
                          <span>Time: </span>
                          <span className="font-medium text-foreground">{page.avgTime}</span>
                        </div>
                        <div>
                          <span>Bounce: </span>
                          <span className="font-medium text-foreground">{page.bounceRate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Device & Geo Analytics */}
          <div className="space-y-6">
            {/* Device Breakdown */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Device Analytics</CardTitle>
                <CardDescription>
                  Traffic distribution by device type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deviceBreakdown.map((device, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{device.device}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{device.sessions.toLocaleString()}</span>
                          <Badge variant="outline" className="text-xs">
                            {device.conversionRate}% CR
                          </Badge>
                        </div>
                      </div>
                      <Progress value={device.percentage} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {device.percentage}% of total sessions
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>
                  Top countries by session volume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {geoData.map((geo, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{geo.flag}</span>
                        <span className="font-medium">{geo.country}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{geo.sessions.toLocaleString()}</span>
                        <Badge variant="outline" className="text-xs">
                          {geo.percentage}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Real-time Analytics Placeholder */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Real-time Traffic Monitor</CardTitle>
            <CardDescription>
              Live tracking of current website activity and user flows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Real-time traffic visualization will be displayed here</p>
                <p className="text-sm text-gray-400">Integration with Google Analytics Real-Time API pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default MarketingTraffic;