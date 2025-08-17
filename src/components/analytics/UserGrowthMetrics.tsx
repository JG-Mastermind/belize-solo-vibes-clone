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
  Users, 
  UserPlus, 
  UserCheck,
  TrendingUp,
  TrendingDown,
  Activity,
  Heart,
  Clock,
  Globe
} from 'lucide-react';

interface UserGrowthMetricsProps {
  dateRange: string;
  compact?: boolean;
}

// User growth data
const growthData = [
  { month: 'Jan', newUsers: 245, totalUsers: 1245, activeUsers: 890, retentionRate: 71.5 },
  { month: 'Feb', newUsers: 312, totalUsers: 1557, activeUsers: 1124, retentionRate: 72.2 },
  { month: 'Mar', newUsers: 289, totalUsers: 1846, activeUsers: 1287, retentionRate: 69.7 },
  { month: 'Apr', newUsers: 387, totalUsers: 2233, activeUsers: 1598, retentionRate: 71.6 },
  { month: 'May', newUsers: 445, totalUsers: 2678, activeUsers: 1924, retentionRate: 71.8 },
  { month: 'Jun', newUsers: 523, totalUsers: 3201, activeUsers: 2301, retentionRate: 71.9 },
  { month: 'Jul', newUsers: 612, totalUsers: 3813, activeUsers: 2745, retentionRate: 72.0 },
  { month: 'Aug', newUsers: 589, totalUsers: 4402, activeUsers: 3169, retentionRate: 72.0 },
  { month: 'Sep', newUsers: 634, totalUsers: 5036, activeUsers: 3625, retentionRate: 72.0 },
  { month: 'Oct', newUsers: 712, totalUsers: 5748, activeUsers: 4138, retentionRate: 72.0 },
  { month: 'Nov', newUsers: 798, totalUsers: 6546, activeUsers: 4713, retentionRate: 72.0 },
  { month: 'Dec', newUsers: 856, totalUsers: 7402, activeUsers: 5329, retentionRate: 72.0 },
];

// User segments
const segmentData = [
  { name: 'New Users', value: 35, color: '#3B82F6', count: 2591 },
  { name: 'Returning Users', value: 45, color: '#10B981', count: 3331 },
  { name: 'Loyal Users', value: 20, color: '#F59E0B', count: 1480 },
];

// User acquisition channels
const acquisitionData = [
  { channel: 'Organic Search', users: 2847, percentage: 38.5, color: '#3B82F6' },
  { channel: 'Social Media', users: 1924, percentage: 26.0, color: '#10B981' },
  { channel: 'Direct', users: 1332, percentage: 18.0, color: '#F59E0B' },
  { channel: 'Referral', users: 888, percentage: 12.0, color: '#EF4444' },
  { channel: 'Email', users: 411, percentage: 5.5, color: '#8B5CF6' },
];

// Demographics data
const ageData = [
  { age: '18-24', users: 1628, percentage: 22.0, color: '#3B82F6' },
  { age: '25-34', users: 2593, percentage: 35.0, color: '#10B981' },
  { age: '35-44', users: 1924, percentage: 26.0, color: '#F59E0B' },
  { age: '45-54', users: 889, percentage: 12.0, color: '#EF4444' },
  { age: '55+', users: 368, percentage: 5.0, color: '#8B5CF6' },
];

const geoData = [
  { country: 'United States', users: 2961, percentage: 40.0, flag: '🇺🇸' },
  { country: 'Canada', users: 1480, percentage: 20.0, flag: '🇨🇦' },
  { country: 'United Kingdom', users: 1036, percentage: 14.0, flag: '🇬🇧' },
  { country: 'Australia', users: 592, percentage: 8.0, flag: '🇦🇺' },
  { country: 'Germany', users: 444, percentage: 6.0, flag: '🇩🇪' },
  { country: 'Others', users: 889, percentage: 12.0, flag: '🌍' },
];

const UserGrowthMetrics: React.FC<UserGrowthMetricsProps> = ({ dateRange, compact = false }) => {
  const [activeView, setActiveView] = useState<'growth' | 'segments' | 'acquisition' | 'demographics'>('growth');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: {entry.value.toLocaleString()}
                {entry.name.includes('Rate') ? '%' : ''}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderGrowthChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={growthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="newUsersGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="totalUsersGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
        <XAxis 
          dataKey="month" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#9CA3AF' }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#9CA3AF' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area
          type="monotone"
          dataKey="newUsers"
          stackId="1"
          stroke="#3B82F6"
          fill="url(#newUsersGradient)"
          name="New Users"
        />
        <Area
          type="monotone"
          dataKey="activeUsers"
          stackId="2"
          stroke="#10B981"
          fill="url(#totalUsersGradient)"
          name="Active Users"
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  const renderSegmentsChart = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={segmentData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
            >
              {segmentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="space-y-4">
        <h4 className="font-semibold">User Segments</h4>
        {segmentData.map((segment, index) => (
          <div key={segment.name} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="font-medium">{segment.name}</span>
            </div>
            <div className="text-right">
              <p className="font-bold">{segment.count.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{segment.value}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAcquisitionChart = () => (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={acquisitionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            {acquisitionData.map((item, index) => (
              <linearGradient key={index} id={`acqGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={item.color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={item.color} stopOpacity={0.6}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="channel" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="users" 
            radius={[4, 4, 0, 0]}
            name="Users"
          >
            {acquisitionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`url(#acqGradient-${index})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {acquisitionData.map((channel, index) => (
          <div key={channel.channel} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm">{channel.channel}</h4>
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: channel.color }}
              />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold" style={{ color: channel.color }}>
                {channel.users.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {channel.percentage}% of total
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDemographicsChart = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Age Demographics */}
      <div className="space-y-4">
        <h4 className="font-semibold">Age Distribution</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={ageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              {ageData.map((item, index) => (
                <linearGradient key={index} id={`ageGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={item.color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={item.color} stopOpacity={0.6}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="age" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="users" 
              radius={[4, 4, 0, 0]}
              name="Users"
            >
              {ageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`url(#ageGradient-${index})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Geographic Distribution */}
      <div className="space-y-4">
        <h4 className="font-semibold">Geographic Distribution</h4>
        <div className="space-y-2">
          {geoData.map((country, index) => (
            <div key={country.country} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-xl">{country.flag}</span>
                <span className="font-medium">{country.country}</span>
              </div>
              <div className="text-right">
                <p className="font-bold">{country.users.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{country.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (compact) {
    return (
      <Card className="dashboard-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">User Growth</CardTitle>
            <Badge variant="outline" className="text-green-600 border-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +18.2%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">7.4K</p>
              <p className="text-xs text-muted-foreground">Total Users</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">856</p>
              <p className="text-xs text-muted-foreground">New This Month</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">72%</p>
              <p className="text-xs text-muted-foreground">Retention</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={growthData.slice(-6)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="compactGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="newUsers"
                stroke="#3B82F6"
                fill="url(#compactGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              User Growth & Retention Metrics
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Track user acquisition, retention, and demographic insights
            </p>
          </div>
          
          <div className="flex gap-2">
            {[
              { value: 'growth', label: 'Growth', icon: TrendingUp },
              { value: 'segments', label: 'Segments', icon: UserCheck },
              { value: 'acquisition', label: 'Acquisition', icon: UserPlus },
              { value: 'demographics', label: 'Demographics', icon: Globe }
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

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Users</p>
                <p className="text-2xl font-bold">7,402</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-blue-300 mr-1" />
              <span className="text-sm">+856 this month</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active Users</p>
                <p className="text-2xl font-bold">5,329</p>
              </div>
              <Activity className="w-8 h-8 text-green-200" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-300 mr-1" />
              <span className="text-sm">72% engagement</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Retention Rate</p>
                <p className="text-2xl font-bold">72.0%</p>
              </div>
              <Heart className="w-8 h-8 text-purple-200" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-purple-300 mr-1" />
              <span className="text-sm">+2.3% vs last month</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Avg. Session</p>
                <p className="text-2xl font-bold">8.5m</p>
              </div>
              <Clock className="w-8 h-8 text-orange-200" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-orange-300 mr-1" />
              <span className="text-sm">+12% session time</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {activeView === 'growth' && renderGrowthChart()}
        {activeView === 'segments' && renderSegmentsChart()}
        {activeView === 'acquisition' && renderAcquisitionChart()}
        {activeView === 'demographics' && renderDemographicsChart()}
      </CardContent>
    </Card>
  );
};

export default UserGrowthMetrics;