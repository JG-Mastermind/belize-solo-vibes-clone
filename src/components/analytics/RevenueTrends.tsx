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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  Activity,
  Calendar
} from 'lucide-react';

interface RevenueTrendsProps {
  dateRange: string;
  compact?: boolean;
}

// Sample data matching TailAdmin style
const revenueData = [
  { month: 'Jan', revenue: 45000, growth: 12, bookings: 89, avg: 506 },
  { month: 'Feb', revenue: 52000, growth: 15, bookings: 95, avg: 547 },
  { month: 'Mar', revenue: 48000, growth: -8, bookings: 87, avg: 552 },
  { month: 'Apr', revenue: 61000, growth: 27, bookings: 112, avg: 545 },
  { month: 'May', revenue: 55000, growth: -10, bookings: 98, avg: 561 },
  { month: 'Jun', revenue: 67000, growth: 22, bookings: 118, avg: 568 },
  { month: 'Jul', revenue: 71000, growth: 6, bookings: 125, avg: 568 },
  { month: 'Aug', revenue: 69000, growth: -3, bookings: 121, avg: 570 },
  { month: 'Sep', revenue: 74000, growth: 7, bookings: 131, avg: 565 },
  { month: 'Oct', revenue: 78000, growth: 5, bookings: 138, avg: 565 },
  { month: 'Nov', revenue: 82000, growth: 5, bookings: 145, avg: 566 },
  { month: 'Dec', revenue: 85000, growth: 4, bookings: 152, avg: 559 },
];

const dailyData = [
  { day: 'Mon', revenue: 2800, bookings: 12 },
  { day: 'Tue', revenue: 3200, bookings: 15 },
  { day: 'Wed', revenue: 2900, bookings: 13 },
  { day: 'Thu', revenue: 3800, bookings: 18 },
  { day: 'Fri', revenue: 4200, bookings: 22 },
  { day: 'Sat', revenue: 5100, bookings: 28 },
  { day: 'Sun', revenue: 4800, bookings: 25 },
];

const weeklyData = [
  { week: 'W1', revenue: 18500, bookings: 78 },
  { week: 'W2', revenue: 21200, bookings: 85 },
  { week: 'W3', revenue: 19800, bookings: 82 },
  { week: 'W4', revenue: 23400, bookings: 95 },
];

const yearlyData = [
  { year: '2021', revenue: 584000, bookings: 1250 },
  { year: '2022', revenue: 652000, bookings: 1380 },
  { year: '2023', revenue: 748000, bookings: 1520 },
  { year: '2024', revenue: 867000, bookings: 1680 },
];

const RevenueTrends: React.FC<RevenueTrendsProps> = ({ dateRange, compact = false }) => {
  const [viewType, setViewType] = useState<'line' | 'area' | 'bar'>('area');
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  const getCurrentData = () => {
    switch (timeFrame) {
      case 'daily': return dailyData;
      case 'weekly': return weeklyData;
      case 'monthly': return revenueData;
      case 'yearly': return yearlyData;
      default: return revenueData;
    }
  };

  const getDataKey = () => {
    switch (timeFrame) {
      case 'daily': return 'day';
      case 'weekly': return 'week';
      case 'monthly': return 'month';
      case 'yearly': return 'year';
      default: return 'month';
    }
  };

  const currentData = getCurrentData();
  const dataKey = getDataKey();
  
  // Calculate totals and trends
  const totalRevenue = currentData.reduce((sum, item) => sum + item.revenue, 0);
  const totalBookings = currentData.reduce((sum, item) => sum + item.bookings, 0);
  const avgRevenue = Math.round(totalRevenue / currentData.length);
  const trend = currentData.length > 1 ? 
    ((currentData[currentData.length - 1].revenue - currentData[0].revenue) / currentData[0].revenue * 100) : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: {entry.name.includes('Revenue') ? '$' : ''}{entry.value.toLocaleString()}
                {entry.name.includes('Revenue') ? '' : ' bookings'}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data: currentData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (viewType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey={dataKey} 
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
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              name="Revenue"
            />
            <Line 
              type="monotone" 
              dataKey="bookings" 
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
              yAxisId="right"
              name="Bookings"
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="revenueAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="bookingsAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey={dataKey} 
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
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#revenueAreaGradient)"
              name="Revenue"
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={1}/>
                <stop offset="95%" stopColor="#1D4ED8" stopOpacity={1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey={dataKey} 
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
              dataKey="revenue" 
              fill="url(#barGradient)"
              radius={[4, 4, 0, 0]}
              name="Revenue"
            />
          </BarChart>
        );

      default:
        return null;
    }
  };

  if (compact) {
    return (
      <Card className="dashboard-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Revenue Trends</CardTitle>
            <Badge variant="outline" className="text-green-600 border-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">${(totalRevenue / 1000).toFixed(0)}K</p>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{totalBookings}</p>
              <p className="text-xs text-muted-foreground">Bookings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">${avgRevenue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Avg. Value</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            {renderChart()}
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
              <DollarSign className="w-5 h-5 text-blue-600" />
              Revenue Trends & Analysis
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Track revenue performance across different time periods
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Time Frame Selector */}
            <div className="flex gap-1">
              {[
                { value: 'daily', label: 'Daily', icon: Calendar },
                { value: 'weekly', label: 'Weekly', icon: BarChart3 },
                { value: 'monthly', label: 'Monthly', icon: Activity },
                { value: 'yearly', label: 'Yearly', icon: TrendingUp }
              ].map(({ value, label, icon: Icon }) => (
                <Button
                  key={value}
                  variant={timeFrame === value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeFrame(value as any)}
                  className="text-xs"
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {label}
                </Button>
              ))}
            </div>
            
            {/* Chart Type Selector */}
            <div className="flex gap-1">
              {[
                { value: 'area', label: 'Area' },
                { value: 'line', label: 'Line' },
                { value: 'bar', label: 'Bar' }
              ].map(({ value, label }) => (
                <Button
                  key={value}
                  variant={viewType === value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewType(value as any)}
                  className="text-xs"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold">${(totalRevenue / 1000).toFixed(0)}K</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-200" />
            </div>
            <div className="flex items-center mt-2">
              {trend > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-300 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-300 mr-1" />
              )}
              <span className="text-sm">{trend > 0 ? '+' : ''}{trend.toFixed(1)}% from last period</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Bookings</p>
                <p className="text-2xl font-bold">{totalBookings.toLocaleString()}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-200" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-300 mr-1" />
              <span className="text-sm">+12% conversion rate</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Avg. Booking Value</p>
                <p className="text-2xl font-bold">${avgRevenue.toLocaleString()}</p>
              </div>
              <Activity className="w-8 h-8 text-purple-200" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-purple-300 mr-1" />
              <span className="text-sm">+5.2% vs last period</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Growth Rate</p>
                <p className="text-2xl font-bold">{Math.abs(trend).toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-200" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-orange-300 mr-1" />
              <span className="text-sm">Monthly growth</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueTrends;