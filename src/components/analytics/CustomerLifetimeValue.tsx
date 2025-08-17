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
  DollarSign, 
  Users,
  TrendingUp,
  TrendingDown,
  Heart,
  Repeat,
  Calendar,
  Target,
  UserCheck,
  Crown,
  Gift
} from 'lucide-react';

interface CustomerLifetimeValueProps {
  dateRange: string;
  compact?: boolean;
}

// Customer segments with CLV data
const customerSegments = [
  { 
    segment: 'VIP Guests', 
    customers: 234, 
    avgCLV: 2850, 
    retention: 92, 
    avgBookings: 5.2, 
    color: '#8B5CF6',
    growthRate: 28.4
  },
  { 
    segment: 'Loyal Customers', 
    customers: 567, 
    avgCLV: 1680, 
    retention: 78, 
    avgBookings: 3.4, 
    color: '#3B82F6',
    growthRate: 18.7
  },
  { 
    segment: 'Regular Visitors', 
    customers: 1243, 
    avgCLV: 950, 
    retention: 52, 
    avgBookings: 2.1, 
    color: '#10B981',
    growthRate: 12.3
  },
  { 
    segment: 'First-Time Guests', 
    customers: 2156, 
    avgCLV: 485, 
    retention: 23, 
    avgBookings: 1.2, 
    color: '#F59E0B',
    growthRate: 8.9
  },
  { 
    segment: 'One-Time Visitors', 
    customers: 1678, 
    avgCLV: 320, 
    retention: 5, 
    avgBookings: 1.0, 
    color: '#EF4444',
    growthRate: -2.1
  },
];

// Monthly CLV trends
const clvTrends = [
  { month: 'Jan', totalCLV: 1.2, newCustomers: 145, returningCLV: 1850, newCLV: 520 },
  { month: 'Feb', totalCLV: 1.4, newCustomers: 162, returningCLV: 1920, newCLV: 580 },
  { month: 'Mar', totalCLV: 1.3, newCustomers: 158, returningCLV: 1890, newCLV: 560 },
  { month: 'Apr', totalCLV: 1.6, newCustomers: 189, returningCLV: 2050, newCLV: 620 },
  { month: 'May', totalCLV: 1.5, newCustomers: 176, returningCLV: 1980, newCLV: 590 },
  { month: 'Jun', totalCLV: 1.3, newCustomers: 156, returningCLV: 1820, newCLV: 540 },
  { month: 'Jul', totalCLV: 1.7, newCustomers: 203, returningCLV: 2180, newCLV: 680 },
  { month: 'Aug', totalCLV: 1.8, newCustomers: 218, returningCLV: 2250, newCLV: 720 },
  { month: 'Sep', totalCLV: 1.6, newCustomers: 195, returningCLV: 2080, newCLV: 640 },
  { month: 'Oct', totalCLV: 1.4, newCustomers: 167, returningCLV: 1950, newCLV: 580 },
  { month: 'Nov', totalCLV: 1.5, newCustomers: 178, returningCLV: 2020, newCLV: 600 },
  { month: 'Dec', totalCLV: 1.9, newCustomers: 234, returningCLV: 2350, newCLV: 750 },
];

// Customer journey stages
const journeyStages = [
  { stage: 'Awareness', customers: 10000, conversion: 35, color: '#F59E0B' },
  { stage: 'Interest', customers: 3500, conversion: 42, color: '#10B981' },
  { stage: 'Consideration', customers: 1470, conversion: 58, color: '#3B82F6' },
  { stage: 'Purchase', customers: 852, conversion: 78, color: '#8B5CF6' },
  { stage: 'Retention', customers: 665, conversion: 65, color: '#EF4444' },
  { stage: 'Advocacy', customers: 432, conversion: 85, color: '#06B6D4' },
];

// Cohort analysis data
const cohortData = [
  { cohort: 'Jan 2024', month1: 100, month3: 68, month6: 45, month12: 32, clv: 1450 },
  { cohort: 'Apr 2024', month1: 100, month3: 72, month6: 52, month12: 38, clv: 1680 },
  { cohort: 'Jul 2024', month1: 100, month3: 75, month6: 58, month12: 42, clv: 1850 },
  { cohort: 'Oct 2024', month1: 100, month3: 78, month6: 62, month12: 45, clv: 1920 },
];

const CustomerLifetimeValue: React.FC<CustomerLifetimeValueProps> = ({ dateRange, compact = false }) => {
  const [activeView, setActiveView] = useState<'segments' | 'trends' | 'journey' | 'cohorts'>('segments');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: {entry.name.includes('CLV') || entry.name.includes('Value') ? '$' : ''}{entry.value}
                {entry.name.includes('retention') ? '%' : ''}
                {entry.name.includes('CLV') && entry.value > 100 ? '' : entry.name.includes('CLV') ? 'K' : ''}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderSegments = () => (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={customerSegments} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            {customerSegments.map((item, index) => (
              <linearGradient key={index} id={`clvGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={item.color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={item.color} stopOpacity={0.6}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="segment" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="avgCLV" 
            radius={[4, 4, 0, 0]}
            name="Avg CLV"
          >
            {customerSegments.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`url(#clvGradient-${index})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customerSegments.map((segment, index) => (
          <div key={segment.segment} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <div>
                  <h4 className="font-medium">{segment.segment}</h4>
                  <p className="text-xs text-muted-foreground">{segment.customers.toLocaleString()} customers</p>
                </div>
              </div>
              <Badge 
                variant="outline" 
                className={`${segment.growthRate > 15 ? 'text-green-600 border-green-600' : 
                  segment.growthRate > 0 ? 'text-blue-600 border-blue-600' : 
                  'text-red-600 border-red-600'}`}
              >
                {segment.growthRate > 0 ? '+' : ''}{segment.growthRate}%
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Average CLV</p>
                <p className="text-2xl font-bold" style={{ color: segment.color }}>
                  ${segment.avgCLV.toLocaleString()}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Retention</p>
                  <p className="font-bold">{segment.retention}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Avg Bookings</p>
                  <p className="font-bold">{segment.avgBookings}</p>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Total Value</span>
                  <span className="font-bold text-green-600">
                    ${((segment.customers * segment.avgCLV) / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={clvTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="totalCLVGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="returningGradient" x1="0" y1="0" x2="0" y2="1">
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
            yAxisId="left"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="totalCLV"
            stroke="#3B82F6"
            fill="url(#totalCLVGradient)"
            name="Total CLV (M)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="returningCLV"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            name="Returning Customer CLV"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="newCLV"
            stroke="#F59E0B"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
            name="New Customer CLV"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total CLV</p>
              <p className="text-2xl font-bold">$18.5M</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200" />
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-blue-300 mr-1" />
            <span className="text-sm">+12.8% this year</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Avg Customer CLV</p>
              <p className="text-2xl font-bold">$1,285</p>
            </div>
            <Users className="w-8 h-8 text-green-200" />
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-300 mr-1" />
            <span className="text-sm">+8.4% vs last year</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">VIP CLV</p>
              <p className="text-2xl font-bold">$2,850</p>
            </div>
            <Crown className="w-8 h-8 text-purple-200" />
          </div>
          <div className="flex items-center mt-2">
            <Heart className="w-4 h-4 text-purple-300 mr-1" />
            <span className="text-sm">Top segment</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Growth Rate</p>
              <p className="text-2xl font-bold">+15%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-200" />
          </div>
          <div className="flex items-center mt-2">
            <Target className="w-4 h-4 text-orange-300 mr-1" />
            <span className="text-sm">Annual improvement</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderJourney = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {journeyStages.map((stage, index) => (
          <div key={stage.stage} className="text-center relative">
            <div 
              className="h-20 flex items-center justify-center rounded-lg mb-3 relative"
              style={{ backgroundColor: stage.color + '20', border: `2px solid ${stage.color}` }}
            >
              <div>
                <div className="text-lg font-bold" style={{ color: stage.color }}>
                  {stage.customers.toLocaleString()}
                </div>
                <div className="text-xs" style={{ color: stage.color }}>
                  {stage.conversion}% convert
                </div>
              </div>
              {index < journeyStages.length - 1 && (
                <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hidden lg:block">
                  →
                </div>
              )}
            </div>
            <h4 className="text-sm font-medium">{stage.stage}</h4>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={journeyStages} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            {journeyStages.map((item, index) => (
              <linearGradient key={index} id={`journeyGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={item.color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={item.color} stopOpacity={0.6}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="stage" 
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
            dataKey="customers" 
            radius={[4, 4, 0, 0]}
            name="Customers"
          >
            {journeyStages.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`url(#journeyGradient-${index})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg">
        <h4 className="font-semibold mb-4">Customer Journey Optimization</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium mb-2 text-green-600">Strong Performance</h5>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Advocacy stage: 85% conversion</li>
              <li>• Purchase stage: 78% conversion</li>
              <li>• Retention is solid at 65%</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2 text-orange-600">Improvement Areas</h5>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Awareness to Interest: Only 35% convert</li>
              <li>• Focus on lead nurturing campaigns</li>
              <li>• Implement referral program for advocates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCohorts = () => (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={cohortData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="cohort" 
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
          <Line
            type="monotone"
            dataKey="month3"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            name="3-Month Retention %"
          />
          <Line
            type="monotone"
            dataKey="month6"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            name="6-Month Retention %"
          />
          <Line
            type="monotone"
            dataKey="month12"
            stroke="#F59E0B"
            strokeWidth={3}
            dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
            name="12-Month Retention %"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cohortData.map((cohort, index) => (
          <div key={cohort.cohort} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">{cohort.cohort}</h4>
              <Badge variant="outline" className="text-xs">
                Cohort {index + 1}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">CLV</p>
                <p className="text-lg font-bold text-green-600">
                  ${cohort.clv.toLocaleString()}
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">3 months</span>
                  <span className="font-bold">{cohort.month3}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">6 months</span>
                  <span className="font-bold">{cohort.month6}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">12 months</span>
                  <span className="font-bold">{cohort.month12}%</span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">
                    {index > 0 ? `+${((cohort.clv - cohortData[index-1].clv) / cohortData[index-1].clv * 100).toFixed(1)}%` : 'Baseline'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Repeat className="w-5 h-5 text-purple-600" />
          <h4 className="font-semibold text-purple-800 dark:text-purple-200">Cohort Insights</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium text-purple-700 dark:text-purple-300">Improving Retention</p>
            <p className="text-purple-600 dark:text-purple-400">
              Latest cohorts show 32% higher 12-month retention
            </p>
          </div>
          <div>
            <p className="font-medium text-purple-700 dark:text-purple-300">Rising CLV</p>
            <p className="text-purple-600 dark:text-purple-400">
              Oct 2024 cohort CLV is $470 higher than Jan 2024
            </p>
          </div>
          <div>
            <p className="font-medium text-purple-700 dark:text-purple-300">Best Performers</p>
            <p className="text-purple-600 dark:text-purple-400">
              Q4 cohorts show strongest engagement patterns
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (compact) {
    return (
      <Card className="dashboard-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Customer Lifetime Value</CardTitle>
            <Badge variant="outline" className="text-green-600 border-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +15.2%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">$1.3K</p>
              <p className="text-xs text-muted-foreground">Avg CLV</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">$2.9K</p>
              <p className="text-xs text-muted-foreground">VIP CLV</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">65%</p>
              <p className="text-xs text-muted-foreground">Retention</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={clvTrends.slice(-6)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="compactCLVGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="totalCLV"
                stroke="#8B5CF6"
                fill="url(#compactCLVGradient)"
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
              <DollarSign className="w-5 h-5 text-green-600" />
              Customer Lifetime Value Analytics
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Track customer value, segments, retention, and cohort performance
            </p>
          </div>
          
          <div className="flex gap-2">
            {[
              { value: 'segments', label: 'Segments', icon: Users },
              { value: 'trends', label: 'Trends', icon: TrendingUp },
              { value: 'journey', label: 'Journey', icon: Target },
              { value: 'cohorts', label: 'Cohorts', icon: Calendar }
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
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total CLV</p>
                <p className="text-2xl font-bold">$18.5M</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-200" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-300 mr-1" />
              <span className="text-sm">+12.8% growth</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Average CLV</p>
                <p className="text-2xl font-bold">$1,285</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
            <div className="flex items-center mt-2">
              <UserCheck className="w-4 h-4 text-blue-300 mr-1" />
              <span className="text-sm">Per customer</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">VIP Segment</p>
                <p className="text-2xl font-bold">$2,850</p>
              </div>
              <Crown className="w-8 h-8 text-purple-200" />
            </div>
            <div className="flex items-center mt-2">
              <Heart className="w-4 h-4 text-purple-300 mr-1" />
              <span className="text-sm">Top performers</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Retention Rate</p>
                <p className="text-2xl font-bold">65%</p>
              </div>
              <Repeat className="w-8 h-8 text-orange-200" />
            </div>
            <div className="flex items-center mt-2">
              <Gift className="w-4 h-4 text-orange-300 mr-1" />
              <span className="text-sm">12-month average</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {activeView === 'segments' && renderSegments()}
        {activeView === 'trends' && renderTrends()}
        {activeView === 'journey' && renderJourney()}
        {activeView === 'cohorts' && renderCohorts()}
      </CardContent>
    </Card>
  );
};

export default CustomerLifetimeValue;