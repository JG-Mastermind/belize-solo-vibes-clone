import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Eye,
  MousePointer,
  CreditCard,
  CheckCircle,
  Target,
  Filter
} from 'lucide-react';

interface BookingConversionProps {
  dateRange: string;
}

// Conversion funnel data
const funnelData = [
  { name: 'Page Views', value: 10000, percentage: 100, color: '#3B82F6' },
  { name: 'Adventure Views', value: 6500, percentage: 65, color: '#10B981' },
  { name: 'Booking Started', value: 2800, percentage: 28, color: '#F59E0B' },
  { name: 'Payment Initiated', value: 1950, percentage: 19.5, color: '#EF4444' },
  { name: 'Booking Completed', value: 1560, percentage: 15.6, color: '#8B5CF6' },
];

// Channel conversion data
const channelData = [
  { channel: 'Direct', visitors: 3200, bookings: 680, rate: 21.3, color: '#3B82F6' },
  { channel: 'Google Ads', visitors: 2800, bookings: 420, rate: 15.0, color: '#10B981' },
  { channel: 'Social Media', visitors: 2100, bookings: 294, rate: 14.0, color: '#F59E0B' },
  { channel: 'Referral', visitors: 1400, bookings: 168, rate: 12.0, color: '#EF4444' },
  { channel: 'Email', visitors: 900, bookings: 108, rate: 12.0, color: '#8B5CF6' },
];

// Device breakdown
const deviceData = [
  { name: 'Desktop', value: 45, color: '#3B82F6' },
  { name: 'Mobile', value: 38, color: '#10B981' },
  { name: 'Tablet', value: 17, color: '#F59E0B' },
];

// Monthly conversion trends
const monthlyConversion = [
  { month: 'Jan', rate: 12.5, bookings: 156, visitors: 1248 },
  { month: 'Feb', rate: 14.2, bookings: 178, visitors: 1254 },
  { month: 'Mar', rate: 13.8, bookings: 165, visitors: 1196 },
  { month: 'Apr', rate: 15.6, bookings: 198, visitors: 1269 },
  { month: 'May', rate: 16.2, bookings: 215, visitors: 1327 },
  { month: 'Jun', rate: 18.1, bookings: 245, visitors: 1354 },
  { month: 'Jul', rate: 19.3, bookings: 268, visitors: 1388 },
  { month: 'Aug', rate: 17.8, bookings: 234, visitors: 1315 },
  { month: 'Sep', rate: 16.9, bookings: 221, visitors: 1308 },
  { month: 'Oct', rate: 15.4, bookings: 198, visitors: 1286 },
  { month: 'Nov', rate: 17.2, bookings: 225, visitors: 1308 },
  { month: 'Dec', rate: 18.9, bookings: 256, visitors: 1354 },
];

const BookingConversion: React.FC<BookingConversionProps> = ({ dateRange }) => {
  const [activeView, setActiveView] = useState<'funnel' | 'channels' | 'devices' | 'trends'>('funnel');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: {entry.value}
                {entry.name.includes('rate') || entry.name.includes('Rate') ? '%' : ''}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const FunnelTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{data.name}</p>
          <p className="text-sm text-blue-600">Users: {data.value.toLocaleString()}</p>
          <p className="text-sm text-green-600">Conversion: {data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const renderFunnelChart = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {funnelData.map((step, index) => (
          <div key={step.name} className="text-center">
            <div 
              className="h-16 flex items-center justify-center rounded-lg mb-2 relative"
              style={{ backgroundColor: step.color + '20', border: `2px solid ${step.color}` }}
            >
              <div className="text-lg font-bold" style={{ color: step.color }}>
                {step.value.toLocaleString()}
              </div>
              {index < funnelData.length - 1 && (
                <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  →
                </div>
              )}
            </div>
            <h4 className="text-sm font-medium">{step.name}</h4>
            <p className="text-xs text-muted-foreground">{step.percentage}%</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-500 text-white p-4 rounded-lg">
              <Eye className="w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">10,000</p>
              <p className="text-sm">Total Visitors</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-green-500 text-white p-4 rounded-lg">
              <MousePointer className="w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">15.6%</p>
              <p className="text-sm">Conversion Rate</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-purple-500 text-white p-4 rounded-lg">
              <CheckCircle className="w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">1,560</p>
              <p className="text-sm">Completed Bookings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChannelsChart = () => (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={channelData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            {channelData.map((item, index) => (
              <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
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
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="bookings" 
            radius={[4, 4, 0, 0]}
            name="Bookings"
          >
            {channelData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {channelData.map((channel, index) => (
          <div key={channel.channel} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{channel.channel}</h4>
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: channel.color }}
              />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold" style={{ color: channel.color }}>
                {channel.rate}%
              </p>
              <p className="text-xs text-muted-foreground">
                {channel.bookings} / {channel.visitors} visitors
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDevicesChart = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={deviceData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
            >
              {deviceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="space-y-4">
        <h4 className="font-semibold">Device Breakdown</h4>
        {deviceData.map((device, index) => (
          <div key={device.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: device.color }}
              />
              <span className="font-medium">{device.name}</span>
            </div>
            <div className="text-right">
              <p className="font-bold">{device.value}%</p>
              <p className="text-xs text-muted-foreground">conversion rate</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTrendsChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={monthlyConversion} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0.6}/>
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
        <Bar 
          dataKey="rate" 
          fill="url(#trendGradient)"
          radius={[4, 4, 0, 0]}
          name="Conversion Rate"
        />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Booking Conversion Analysis
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Track conversion funnel and channel performance
            </p>
          </div>
          
          <div className="flex gap-2">
            {[
              { value: 'funnel', label: 'Funnel', icon: Target },
              { value: 'channels', label: 'Channels', icon: Users },
              { value: 'devices', label: 'Devices', icon: MousePointer },
              { value: 'trends', label: 'Trends', icon: TrendingUp }
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

        {/* Overall Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Overall Rate</p>
                <p className="text-2xl font-bold">15.6%</p>
              </div>
              <Target className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Best Channel</p>
                <p className="text-2xl font-bold">21.3%</p>
              </div>
              <Users className="w-8 h-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Mobile Rate</p>
                <p className="text-2xl font-bold">38%</p>
              </div>
              <MousePointer className="w-8 h-8 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Growth</p>
                <p className="text-2xl font-bold">+18%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-200" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {activeView === 'funnel' && renderFunnelChart()}
        {activeView === 'channels' && renderChannelsChart()}
        {activeView === 'devices' && renderDevicesChart()}
        {activeView === 'trends' && renderTrendsChart()}
      </CardContent>
    </Card>
  );
};

export default BookingConversion;