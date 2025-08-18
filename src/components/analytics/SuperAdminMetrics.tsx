import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { 
  Key, 
  DollarSign,
  Activity,
  Bell,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Database,
  Shield,
  Globe,
  Server
} from 'lucide-react';

interface SuperAdminMetricsProps {
  dateRange: string;
}

// API Keys Usage Data
const apiKeysData = [
  { 
    service: 'OpenAI API', 
    status: 'Active', 
    usage: 8547, 
    limit: 10000, 
    cost: 127.34, 
    expiry: '2025-12-15',
    calls: 2847,
    avgResponseTime: 1.2,
    errorRate: 0.3
  },
  { 
    service: 'Stripe API', 
    status: 'Active', 
    usage: 2341, 
    limit: 5000, 
    cost: 45.67, 
    expiry: '2025-11-30',
    calls: 1234,
    avgResponseTime: 0.8,
    errorRate: 0.1
  },
  { 
    service: 'Google Maps API', 
    status: 'Warning', 
    usage: 4789, 
    limit: 5000, 
    cost: 89.23, 
    expiry: '2025-10-22',
    calls: 5678,
    avgResponseTime: 2.1,
    errorRate: 0.5
  },
  { 
    service: 'Supabase API', 
    status: 'Active', 
    usage: 15847, 
    limit: 50000, 
    cost: 156.78, 
    expiry: '2026-01-15',
    calls: 12456,
    avgResponseTime: 0.4,
    errorRate: 0.2
  },
];

// Monthly cost trends
const costTrends = [
  { month: 'Jan', openai: 98.45, stripe: 34.21, maps: 67.89, supabase: 123.45, total: 324.00 },
  { month: 'Feb', openai: 112.67, stripe: 41.33, maps: 78.56, supabase: 134.67, total: 367.23 },
  { month: 'Mar', openai: 127.34, stripe: 45.67, maps: 89.23, supabase: 156.78, total: 419.02 },
  { month: 'Apr', openai: 134.56, stripe: 52.89, maps: 92.34, supabase: 167.89, total: 447.68 },
  { month: 'May', openai: 145.78, stripe: 48.92, maps: 85.67, supabase: 178.92, total: 459.29 },
  { month: 'Jun', openai: 156.89, stripe: 55.34, maps: 98.45, supabase: 189.45, total: 500.13 },
];

// Usage patterns by service
const usagePatterns = [
  { hour: '00', openai: 12, stripe: 5, maps: 23, supabase: 45 },
  { hour: '04', openai: 8, stripe: 3, maps: 15, supabase: 32 },
  { hour: '08', openai: 45, stripe: 18, maps: 67, supabase: 89 },
  { hour: '12', openai: 78, stripe: 34, maps: 89, supabase: 123 },
  { hour: '16', openai: 89, stripe: 42, maps: 78, supabase: 156 },
  { hour: '20', openai: 67, stripe: 28, maps: 56, supabase: 134 },
];

// Error rate tracking
const errorTracking = [
  { date: '2024-12-01', openai: 0.2, stripe: 0.1, maps: 0.4, supabase: 0.1 },
  { date: '2024-12-02', openai: 0.3, stripe: 0.1, maps: 0.5, supabase: 0.2 },
  { date: '2024-12-03', openai: 0.1, stripe: 0.0, maps: 0.3, supabase: 0.1 },
  { date: '2024-12-04', openai: 0.4, stripe: 0.2, maps: 0.6, supabase: 0.3 },
  { date: '2024-12-05', openai: 0.2, stripe: 0.1, maps: 0.4, supabase: 0.2 },
];

// Security alerts
const securityAlerts = [
  { id: 1, severity: 'High', message: 'Unusual API key usage pattern detected', service: 'OpenAI', timestamp: '2024-12-18 14:32' },
  { id: 2, severity: 'Medium', message: 'Rate limit approaching for Google Maps API', service: 'Maps', timestamp: '2024-12-18 13:15' },
  { id: 3, severity: 'Low', message: 'API key expires in 30 days', service: 'Maps', timestamp: '2024-12-18 09:45' },
  { id: 4, severity: 'Medium', message: 'Increased error rate detected', service: 'OpenAI', timestamp: '2024-12-17 16:20' },
];

const SuperAdminMetrics: React.FC<SuperAdminMetricsProps> = ({ dateRange }) => {
  const [activeView, setActiveView] = useState<'overview' | 'costs' | 'usage' | 'security'>('overview');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: {entry.name.includes('cost') || entry.name.includes('total') ? '$' : ''}{entry.value}
                {entry.name.includes('rate') ? '%' : ''}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'Error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'text-red-600 border-red-600';
      case 'Medium':
        return 'text-yellow-600 border-yellow-600';
      case 'Low':
        return 'text-blue-600 border-blue-600';
      default:
        return 'text-gray-600 border-gray-600';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* API Keys Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {apiKeysData.map((api) => (
          <Card key={api.service} className="dashboard-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{api.service}</CardTitle>
                {getStatusIcon(api.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Usage</span>
                    <span>{api.usage.toLocaleString()} / {api.limit.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        (api.usage / api.limit) > 0.8 ? 'bg-red-500' : 
                        (api.usage / api.limit) > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(api.usage / api.limit) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Cost</p>
                    <p className="font-bold">${api.cost}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Calls</p>
                    <p className="font-bold">{api.calls.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Response</p>
                    <p className="font-bold">{api.avgResponseTime}s</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Error Rate</p>
                    <p className="font-bold">{api.errorRate}%</p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">Expires: {api.expiry}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Monthly Cost</p>
              <p className="text-2xl font-bold">$500.13</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200" />
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-blue-300 mr-1" />
            <span className="text-sm">+8.9% from last month</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active APIs</p>
              <p className="text-2xl font-bold">4</p>
            </div>
            <Database className="w-8 h-8 text-green-200" />
          </div>
          <div className="flex items-center mt-2">
            <CheckCircle className="w-4 h-4 text-green-300 mr-1" />
            <span className="text-sm">All systems operational</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Alerts</p>
              <p className="text-2xl font-bold">{securityAlerts.length}</p>
            </div>
            <Bell className="w-8 h-8 text-yellow-200" />
          </div>
          <div className="flex items-center mt-2">
            <AlertTriangle className="w-4 h-4 text-yellow-300 mr-1" />
            <span className="text-sm">1 high priority</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Uptime</p>
              <p className="text-2xl font-bold">99.9%</p>
            </div>
            <Server className="w-8 h-8 text-purple-200" />
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-purple-300 mr-1" />
            <span className="text-sm">Excellent performance</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCosts = () => (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={costTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area type="monotone" dataKey="total" stroke="#3B82F6" fill="url(#totalGradient)" name="Total Cost" />
          <Line type="monotone" dataKey="openai" stroke="#10B981" strokeWidth={2} name="OpenAI" />
          <Line type="monotone" dataKey="stripe" stroke="#F59E0B" strokeWidth={2} name="Stripe" />
          <Line type="monotone" dataKey="maps" stroke="#EF4444" strokeWidth={2} name="Google Maps" />
          <Line type="monotone" dataKey="supabase" stroke="#8B5CF6" strokeWidth={2} name="Supabase" />
        </AreaChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg">Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {apiKeysData.map((api, index) => (
                <div key={api.service} className="flex justify-between items-center">
                  <span className="text-sm">{api.service}</span>
                  <span className="font-bold">${api.cost}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg">Budget Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Monthly Budget</span>
                  <span>$500.13 / $600.00</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '83.4%' }} />
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                $99.87 remaining this month
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg">Optimization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p className="text-green-600">✓ OpenAI usage efficient</p>
              <p className="text-yellow-600">⚠ Maps API nearing limit</p>
              <p className="text-blue-600">ℹ Stripe usage below average</p>
              <p className="text-green-600">✓ Supabase well optimized</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderUsage = () => (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={usagePatterns} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="openai" stackId="a" fill="#10B981" name="OpenAI" />
          <Bar dataKey="stripe" stackId="a" fill="#F59E0B" name="Stripe" />
          <Bar dataKey="maps" stackId="a" fill="#EF4444" name="Maps" />
          <Bar dataKey="supabase" stackId="a" fill="#8B5CF6" name="Supabase" />
        </BarChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={errorTracking} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="openai" stroke="#10B981" strokeWidth={2} name="OpenAI Error Rate" />
          <Line type="monotone" dataKey="stripe" stroke="#F59E0B" strokeWidth={2} name="Stripe Error Rate" />
          <Line type="monotone" dataKey="maps" stroke="#EF4444" strokeWidth={2} name="Maps Error Rate" />
          <Line type="monotone" dataKey="supabase" stroke="#8B5CF6" strokeWidth={2} name="Supabase Error Rate" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Security Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Keys Secured</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Rate Limiting Active</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Monitoring Enabled</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Alerts Configured</span>
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              Global Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>US East</span>
                <span className="text-green-600">Healthy</span>
              </div>
              <div className="flex justify-between">
                <span>US West</span>
                <span className="text-green-600">Healthy</span>
              </div>
              <div className="flex justify-between">
                <span>Europe</span>
                <span className="text-yellow-600">Degraded</span>
              </div>
              <div className="flex justify-between">
                <span>Asia Pacific</span>
                <span className="text-green-600">Healthy</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Avg Response Time</span>
                  <span>1.2s</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                15% faster than last month
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="text-lg">Security Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{alert.service}</span>
                  </div>
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.timestamp}</p>
                </div>
                <Button variant="ghost" size="sm">
                  Resolve
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-600" />
              Super Admin API Management & Metrics
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Comprehensive API monitoring, cost analysis, and security oversight
            </p>
          </div>
          
          <div className="flex gap-2">
            {[
              { value: 'overview', label: 'Overview', icon: Database },
              { value: 'costs', label: 'Costs', icon: DollarSign },
              { value: 'usage', label: 'Usage', icon: Activity },
              { value: 'security', label: 'Security', icon: Shield }
            ].map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                variant={activeView === value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView(value as any)}
                className="text-xs"
              >
                <Icon className="w-3 h-3 mr-1" />
                {label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {activeView === 'overview' && renderOverview()}
        {activeView === 'costs' && renderCosts()}
        {activeView === 'usage' && renderUsage()}
        {activeView === 'security' && renderSecurity()}
      </CardContent>
    </Card>
  );
};

export default SuperAdminMetrics;