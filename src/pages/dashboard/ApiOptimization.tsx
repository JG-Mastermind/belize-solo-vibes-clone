import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, TrendingUp, Database, Clock, Cpu, HardDrive, CheckCircle, AlertCircle } from 'lucide-react';

const ApiOptimization: React.FC = () => {
  const optimizationScore = 78;
  
  const performanceMetrics = {
    responseTime: { current: 145, target: 100, improvement: -31 },
    throughput: { current: 1250, target: 1500, improvement: 20 },
    errorRate: { current: 0.8, target: 0.5, improvement: -37.5 },
    uptime: { current: 99.2, target: 99.9, improvement: 0.7 }
  };

  const recommendations = [
    {
      id: '1',
      title: 'Database Query Optimization',
      description: 'Optimize slow-running queries identified in /api/tours and /api/bookings endpoints',
      impact: 'High',
      effort: 'Medium',
      category: 'database',
      implemented: false,
      estimatedImprovement: '25% faster response times',
      priority: 1
    },
    {
      id: '2',
      title: 'Enable Response Compression',
      description: 'Implement gzip compression for API responses to reduce bandwidth usage',
      impact: 'Medium',
      effort: 'Low',
      category: 'network',
      implemented: true,
      estimatedImprovement: '40% smaller payload sizes',
      priority: 2
    },
    {
      id: '3',
      title: 'Implement Request Caching',
      description: 'Add Redis caching layer for frequently requested tour data',
      impact: 'High',
      effort: 'High',
      category: 'caching',
      implemented: false,
      estimatedImprovement: '60% reduction in database load',
      priority: 3
    },
    {
      id: '4',
      title: 'API Rate Limiting Optimization',
      description: 'Fine-tune rate limiting rules to balance protection and user experience',
      impact: 'Medium',
      effort: 'Low',
      category: 'security',
      implemented: false,
      estimatedImprovement: '15% better throughput',
      priority: 4
    },
    {
      id: '5',
      title: 'Connection Pool Sizing',
      description: 'Optimize database connection pool settings for better resource utilization',
      impact: 'Medium',
      effort: 'Medium',
      category: 'database',
      implemented: true,
      estimatedImprovement: '20% better concurrency',
      priority: 5
    }
  ];

  const resourceUsage = [
    { resource: 'CPU Usage', current: 65, optimal: 70, status: 'good' },
    { resource: 'Memory Usage', current: 82, optimal: 80, status: 'warning' },
    { resource: 'Database Connections', current: 45, optimal: 60, status: 'good' },
    { resource: 'Network Bandwidth', current: 73, optimal: 75, status: 'good' }
  ];

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'High':
        return <Badge className="bg-red-100 text-red-800">High Impact</Badge>;
      case 'Medium':
        return <Badge className="bg-orange-100 text-orange-800">Medium Impact</Badge>;
      case 'Low':
        return <Badge className="bg-green-100 text-green-800">Low Impact</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getEffortBadge = (effort: string) => {
    switch (effort) {
      case 'High':
        return <Badge variant="outline" className="border-red-300 text-red-700">High Effort</Badge>;
      case 'Medium':
        return <Badge variant="outline" className="border-orange-300 text-orange-700">Medium Effort</Badge>;
      case 'Low':
        return <Badge variant="outline" className="border-green-300 text-green-700">Low Effort</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'database':
        return <Database className="w-4 h-4" />;
      case 'network':
        return <Zap className="w-4 h-4" />;
      case 'caching':
        return <HardDrive className="w-4 h-4" />;
      case 'security':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Cpu className="w-4 h-4" />;
    }
  };

  const getResourceStatus = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-500';
      case 'warning':
        return 'bg-orange-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <>
      <Helmet>
        <title>API Optimization - BelizeVibes Dashboard</title>
        <meta name="description" content="Optimize API performance, identify bottlenecks, and implement improvements" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">API Optimization</h1>
            <p className="text-muted-foreground">
              Analyze performance, identify bottlenecks, and implement optimizations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Optimization Score</div>
              <div className="text-2xl font-bold text-orange-600">{optimizationScore}%</div>
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Zap className="w-4 h-4 mr-2" />
              Run Analysis
            </Button>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.responseTime.current}ms</div>
              <div className="flex items-center text-xs">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-green-600">
                  {Math.abs(performanceMetrics.responseTime.improvement)}% improvement
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Target: {performanceMetrics.responseTime.target}ms
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Throughput</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.throughput.current}</div>
              <div className="flex items-center text-xs">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-green-600">
                  +{performanceMetrics.throughput.improvement}% vs target
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                req/min
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.errorRate.current}%</div>
              <div className="flex items-center text-xs">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-green-600">
                  {Math.abs(performanceMetrics.errorRate.improvement)}% better
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Target: {performanceMetrics.errorRate.target}%
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{performanceMetrics.uptime.current}%</div>
              <div className="flex items-center text-xs">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-green-600">
                  +{performanceMetrics.uptime.improvement}% improvement
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Target: {performanceMetrics.uptime.target}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resource Usage */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Resource Utilization</CardTitle>
            <CardDescription>
              Current resource usage compared to optimal levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resourceUsage.map((resource, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{resource.resource}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{resource.current}%</span>
                      <div className={`w-2 h-2 rounded-full ${getResourceStatus(resource.status)}`}></div>
                    </div>
                  </div>
                  <Progress value={resource.current} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    Optimal range: {resource.optimal}% | Status: {resource.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Optimization Recommendations */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Optimization Recommendations</CardTitle>
            <CardDescription>
              Prioritized list of optimizations to improve API performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(rec.category)}
                      <h3 className="font-medium">{rec.title}</h3>
                      {rec.implemented ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Priority {rec.priority}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                    <div className="flex items-center gap-4">
                      {getImpactBadge(rec.impact)}
                      {getEffortBadge(rec.effort)}
                      <span className="text-xs text-green-600 font-medium">
                        {rec.estimatedImprovement}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {rec.implemented ? (
                      <Badge className="bg-green-100 text-green-800">
                        Implemented
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

        {/* Performance Timeline */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Performance Timeline</CardTitle>
            <CardDescription>
              Track optimization implementations and their impact over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Performance timeline chart will be displayed here</p>
                <p className="text-sm text-gray-400">Showing before/after optimization impacts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ApiOptimization;