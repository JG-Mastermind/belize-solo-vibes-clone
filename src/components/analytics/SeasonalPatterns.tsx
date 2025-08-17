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
  Calendar, 
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Activity
} from 'lucide-react';

interface SeasonalPatternsProps {
  dateRange: string;
}

// Monthly seasonal data
const seasonalData = [
  { 
    month: 'January', 
    bookings: 145, 
    revenue: 87000, 
    avgTemp: 78, 
    rainfall: 3.2, 
    season: 'Dry',
    forecast: 152,
    icon: Sun,
    color: '#F59E0B'
  },
  { 
    month: 'February', 
    bookings: 189, 
    revenue: 113400, 
    avgTemp: 80, 
    rainfall: 2.8, 
    season: 'Dry',
    forecast: 195,
    icon: Sun,
    color: '#F59E0B'
  },
  { 
    month: 'March', 
    bookings: 234, 
    revenue: 140400, 
    avgTemp: 82, 
    rainfall: 2.1, 
    season: 'Dry',
    forecast: 242,
    icon: Sun,
    color: '#F59E0B'
  },
  { 
    month: 'April', 
    bookings: 267, 
    revenue: 160200, 
    avgTemp: 84, 
    rainfall: 1.9, 
    season: 'Dry',
    forecast: 278,
    icon: Sun,
    color: '#F59E0B'
  },
  { 
    month: 'May', 
    bookings: 189, 
    revenue: 113400, 
    avgTemp: 86, 
    rainfall: 5.7, 
    season: 'Transition',
    forecast: 165,
    icon: Cloud,
    color: '#8B5CF6'
  },
  { 
    month: 'June', 
    bookings: 156, 
    revenue: 93600, 
    avgTemp: 84, 
    rainfall: 8.9, 
    season: 'Wet',
    forecast: 134,
    icon: CloudRain,
    color: '#3B82F6'
  },
  { 
    month: 'July', 
    bookings: 123, 
    revenue: 73800, 
    avgTemp: 83, 
    rainfall: 12.4, 
    season: 'Wet',
    forecast: 98,
    icon: CloudRain,
    color: '#3B82F6'
  },
  { 
    month: 'August', 
    bookings: 134, 
    revenue: 80400, 
    avgTemp: 83, 
    rainfall: 11.8, 
    season: 'Wet',
    forecast: 112,
    icon: CloudRain,
    color: '#3B82F6'
  },
  { 
    month: 'September', 
    bookings: 167, 
    revenue: 100200, 
    avgTemp: 82, 
    rainfall: 9.3, 
    season: 'Wet',
    forecast: 145,
    icon: CloudRain,
    color: '#3B82F6'
  },
  { 
    month: 'October', 
    bookings: 198, 
    revenue: 118800, 
    avgTemp: 81, 
    rainfall: 6.7, 
    season: 'Transition',
    forecast: 186,
    icon: Cloud,
    color: '#8B5CF6'
  },
  { 
    month: 'November', 
    bookings: 223, 
    revenue: 133800, 
    avgTemp: 79, 
    rainfall: 4.2, 
    season: 'Dry',
    forecast: 234,
    icon: Sun,
    color: '#F59E0B'
  },
  { 
    month: 'December', 
    bookings: 256, 
    revenue: 153600, 
    avgTemp: 77, 
    rainfall: 3.8, 
    season: 'Dry',
    forecast: 267,
    icon: Sun,
    color: '#F59E0B'
  },
];

// Adventure type seasonal performance
const adventureSeasons = [
  { 
    type: 'Water Sports', 
    peak: 'Dry Season', 
    low: 'Wet Season',
    dryBookings: 1234,
    wetBookings: 567,
    variance: 117.8,
    color: '#3B82F6'
  },
  { 
    type: 'Cave Tours', 
    peak: 'Wet Season', 
    low: 'Dry Season',
    dryBookings: 789,
    wetBookings: 1456,
    variance: 84.5,
    color: '#10B981'
  },
  { 
    type: 'Wildlife Safari', 
    peak: 'Dry Season', 
    low: 'Transition',
    dryBookings: 891,
    wetBookings: 623,
    variance: 43.0,
    color: '#F59E0B'
  },
  { 
    type: 'Cultural Tours', 
    peak: 'Year Round', 
    low: 'None',
    dryBookings: 654,
    wetBookings: 678,
    variance: 3.7,
    color: '#EF4444'
  },
  { 
    type: 'Adventure Hiking', 
    peak: 'Dry Season', 
    low: 'Wet Season',
    dryBookings: 567,
    wetBookings: 234,
    variance: 142.3,
    color: '#8B5CF6'
  },
];

// Pricing optimization data
const pricingSeasons = [
  { season: 'Peak (Dec-Apr)', basePrice: 100, optimizedPrice: 135, demand: 'High', bookings: 1314 },
  { season: 'Shoulder (May, Oct-Nov)', basePrice: 100, optimizedPrice: 115, demand: 'Medium', bookings: 588 },
  { season: 'Low (Jun-Sep)', basePrice: 100, optimizedPrice: 85, demand: 'Low', bookings: 580 },
];

const SeasonalPatterns: React.FC<SeasonalPatternsProps> = ({ dateRange }) => {
  const [activeView, setActiveView] = useState<'patterns' | 'adventures' | 'forecast' | 'pricing'>('patterns');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: {entry.value}
                {entry.name === 'revenue' ? '$' : ''}
                {entry.name === 'avgTemp' ? '°F' : ''}
                {entry.name === 'rainfall' ? '"' : ''}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderPatterns = () => (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={seasonalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            angle={-45}
            textAnchor="end"
            height={80}
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
            dataKey="bookings"
            stroke="#3B82F6"
            fill="url(#bookingsGradient)"
            name="Bookings"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="rainfall"
            stroke="#EF4444"
            strokeWidth={3}
            dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
            name="Rainfall (inches)"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Season Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <Sun className="w-8 h-8 text-orange-500" />
            <div>
              <h4 className="font-semibold text-orange-800 dark:text-orange-200">Dry Season</h4>
              <p className="text-sm text-orange-600 dark:text-orange-300">Dec - Apr</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Avg Bookings</span>
              <span className="font-bold">215/month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Peak Revenue</span>
              <span className="font-bold">$153K</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Weather</span>
              <span className="font-bold">77-84°F</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <CloudRain className="w-8 h-8 text-blue-500" />
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Wet Season</h4>
              <p className="text-sm text-blue-600 dark:text-blue-300">Jun - Sep</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Avg Bookings</span>
              <span className="font-bold">145/month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Revenue</span>
              <span className="font-bold">$87K</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Rainfall</span>
              <span className="font-bold">8-12 inches</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <Cloud className="w-8 h-8 text-purple-500" />
            <div>
              <h4 className="font-semibold text-purple-800 dark:text-purple-200">Transition</h4>
              <p className="text-sm text-purple-600 dark:text-purple-300">May, Oct</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Avg Bookings</span>
              <span className="font-bold">194/month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Revenue</span>
              <span className="font-bold">$119K</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Growth</span>
              <span className="font-bold text-green-600">+12%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdventures = () => (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={adventureSeasons} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            {adventureSeasons.map((item, index) => (
              <linearGradient key={index} id={`advGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={item.color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={item.color} stopOpacity={0.6}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="type" 
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
            dataKey="dryBookings" 
            radius={[4, 4, 0, 0]}
            name="Dry Season Bookings"
          >
            {adventureSeasons.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`url(#advGradient-${index})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adventureSeasons.map((adventure, index) => (
          <div key={adventure.type} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">{adventure.type}</h4>
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: adventure.color }}
              />
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Peak Season</p>
                <p className="font-bold text-sm" style={{ color: adventure.color }}>
                  {adventure.peak}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Dry Season</p>
                  <p className="font-bold">{adventure.dryBookings}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Wet Season</p>
                  <p className="font-bold">{adventure.wetBookings}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-muted-foreground">Variance</span>
                <Badge 
                  variant="outline" 
                  className={`${adventure.variance > 50 ? 'text-orange-600 border-orange-600' : 'text-green-600 border-green-600'}`}
                >
                  {adventure.variance.toFixed(1)}%
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderForecast = () => (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={seasonalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
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
          <Legend />
          <Line
            type="monotone"
            dataKey="bookings"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            name="Actual Bookings"
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#10B981"
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            name="Forecast 2025"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">2024 Total</p>
              <p className="text-2xl font-bold">2,281</p>
            </div>
            <Activity className="w-8 h-8 text-blue-200" />
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-blue-300 mr-1" />
            <span className="text-sm">Actual bookings</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">2025 Forecast</p>
              <p className="text-2xl font-bold">2,462</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-300 mr-1" />
            <span className="text-sm">+7.9% growth</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Peak Forecast</p>
              <p className="text-2xl font-bold">Apr</p>
            </div>
            <Sun className="w-8 h-8 text-purple-200" />
          </div>
          <div className="flex items-center mt-2">
            <Calendar className="w-4 h-4 text-purple-300 mr-1" />
            <span className="text-sm">278 bookings</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Confidence</p>
              <p className="text-2xl font-bold">87%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-200" />
          </div>
          <div className="flex items-center mt-2">
            <Activity className="w-4 h-4 text-orange-300 mr-1" />
            <span className="text-sm">Prediction accuracy</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {pricingSeasons.map((season, index) => (
          <div key={season.season} className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">{season.season}</h4>
              <Badge 
                variant="outline"
                className={`${
                  season.demand === 'High' ? 'text-red-600 border-red-600' :
                  season.demand === 'Medium' ? 'text-orange-600 border-orange-600' :
                  'text-green-600 border-green-600'
                }`}
              >
                {season.demand} Demand
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Base Price</span>
                <span className="font-bold">${season.basePrice}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Optimized Price</span>
                <span className="font-bold text-green-600">${season.optimizedPrice}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Bookings</span>
                <span className="font-bold">{season.bookings.toLocaleString()}</span>
              </div>
              
              <div className="pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Revenue Impact</span>
                  <span className={`font-bold ${season.optimizedPrice > season.basePrice ? 'text-green-600' : 'text-red-600'}`}>
                    {season.optimizedPrice > season.basePrice ? '+' : ''}{((season.optimizedPrice - season.basePrice) / season.basePrice * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg">
        <h4 className="font-semibold mb-4">Dynamic Pricing Recommendations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium mb-2">Increase Prices (+35%)</h5>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• December - February (Holiday season)</li>
              <li>• March - April (Perfect weather)</li>
              <li>• Water sports during dry season</li>
              <li>• Whale shark season (March-June)</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">Reduce Prices (-15%)</h5>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• June - September (Rainy season)</li>
              <li>• Cave tours during wet season</li>
              <li>• Midweek bookings</li>
              <li>• Early bird promotions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Seasonal Patterns & Forecasting
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Analyze seasonal trends, weather impact, and optimize pricing strategies
            </p>
          </div>
          
          <div className="flex gap-2">
            {[
              { value: 'patterns', label: 'Patterns', icon: Activity },
              { value: 'adventures', label: 'Adventures', icon: Sun },
              { value: 'forecast', label: 'Forecast', icon: TrendingUp },
              { value: 'pricing', label: 'Pricing', icon: DollarSign }
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
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Peak Season</p>
                <p className="text-2xl font-bold">Dec-Apr</p>
              </div>
              <Sun className="w-8 h-8 text-orange-200" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-orange-300 mr-1" />
              <span className="text-sm">+67% bookings</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Weather Impact</p>
                <p className="text-2xl font-bold">-32%</p>
              </div>
              <CloudRain className="w-8 h-8 text-blue-200" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingDown className="w-4 h-4 text-blue-300 mr-1" />
              <span className="text-sm">Rain effect</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">2025 Growth</p>
                <p className="text-2xl font-bold">+7.9%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-200" />
            </div>
            <div className="flex items-center mt-2">
              <Activity className="w-4 h-4 text-green-300 mr-1" />
              <span className="text-sm">Forecasted</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Price Optimization</p>
                <p className="text-2xl font-bold">+18%</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-200" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-purple-300 mr-1" />
              <span className="text-sm">Revenue uplift</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {activeView === 'patterns' && renderPatterns()}
        {activeView === 'adventures' && renderAdventures()}
        {activeView === 'forecast' && renderForecast()}
        {activeView === 'pricing' && renderPricing()}
      </CardContent>
    </Card>
  );
};

export default SeasonalPatterns;