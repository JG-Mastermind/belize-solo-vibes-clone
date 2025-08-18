import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Globe, Database, Zap, Clock, Users, Download } from 'lucide-react';

const ApiUsageMonitoring: React.FC = () => {
  const usageStats = {
    totalRequests: 156742,
    requestsToday: 8934,
    avgResponseTime: 145,
    errorRate: 0.8,
    activeEndpoints: 24,
    uniqueUsers: 1247
  };

  const endpointUsage = [
    { endpoint: '/api/tours', requests: 45231, avgTime: 120, errorRate: 0.5, status: 'healthy' },
    { endpoint: '/api/bookings', requests: 23456, avgTime: 180, errorRate: 1.2, status: 'warning' },
    { endpoint: '/api/auth/login', requests: 18967, avgTime: 95, errorRate: 0.3, status: 'healthy' },
    { endpoint: '/api/users', requests: 15634, avgTime: 110, errorRate: 0.7, status: 'healthy' },
    { endpoint: '/api/payments', requests: 12890, avgTime: 250, errorRate: 2.1, status: 'critical' },
    { endpoint: '/api/admin', requests: 8543, avgTime: 89, errorRate: 0.4, status: 'healthy' }
  ];

  const recentActivity = [
    { time: '14:32', endpoint: '/api/bookings/create', status: 200, duration: 234, ip: '192.168.1.100' },
    { time: '14:31', endpoint: '/api/tours/search', status: 200, duration: 89, ip: '10.0.0.45' },
    { time: '14:30', endpoint: '/api/payments/process', status: 500, duration: 1205, ip: '172.16.0.23' },
    { time: '14:29', endpoint: '/api/auth/refresh', status: 200, duration: 45, ip: '192.168.1.100' },
    { time: '14:28', endpoint: '/api/tours/details', status: 200, duration: 156, ip: '10.0.0.67' },
    { time: '14:27', endpoint: '/api/admin/users', status: 403, duration: 12, ip: '203.0.113.42' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getHttpStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600';
    if (status >= 400 && status < 500) return 'text-orange-600';
    if (status >= 500) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <>
      <Helmet>
        <title>API Usage Monitoring - BelizeVibes Dashboard</title>
        <meta name="description" content="Monitor real-time API usage, performance, and errors" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">API Usage Monitoring</h1>
            <p className="text-muted-foreground">
              Real-time monitoring of API endpoints, performance, and usage patterns
            </p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Usage Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageStats.totalRequests.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                All time
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageStats.requestsToday.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageStats.avgResponseTime}ms</div>
              <p className="text-xs text-muted-foreground">
                -8ms from last hour
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageStats.errorRate}%</div>
              <p className="text-xs text-muted-foreground">
                Within normal range
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Endpoints</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageStats.activeEndpoints}</div>
              <p className="text-xs text-muted-foreground">
                All operational
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageStats.uniqueUsers}</div>
              <p className="text-xs text-muted-foreground">
                Last 24 hours
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Endpoint Performance */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Endpoint Performance</CardTitle>
            <CardDescription>
              Performance metrics for all API endpoints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {endpointUsage.map((endpoint, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {endpoint.endpoint}
                      </code>
                      {getStatusBadge(endpoint.status)}
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Requests:</span>
                        <div className="font-medium">{endpoint.requests.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Time:</span>
                        <div className="font-medium">{endpoint.avgTime}ms</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Error Rate:</span>
                        <div className={`font-medium ${endpoint.errorRate > 1 ? 'text-red-600' : 'text-green-600'}`}>
                          {endpoint.errorRate}%
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <div className="font-medium capitalize">{endpoint.status}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Recent API Activity</CardTitle>
            <CardDescription>
              Live feed of recent API requests and responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-mono text-muted-foreground">{activity.time}</span>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {activity.endpoint}
                    </code>
                    <Badge
                      variant="outline"
                      className={getHttpStatusColor(activity.status)}
                    >
                      {activity.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      {activity.duration}ms
                    </span>
                    <span className="text-muted-foreground font-mono">
                      {activity.ip}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Charts Placeholder */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>
              Visual representation of API performance over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
              <div className="text-center">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Performance charts will be displayed here</p>
                <p className="text-sm text-gray-400">Integration with charting library pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ApiUsageMonitoring;