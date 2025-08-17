import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
  Activity, 
  Star, 
  MapPin,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Trophy,
  Heart
} from 'lucide-react';

interface AdventurePerformanceProps {
  dateRange: string;
  compact?: boolean;
}

// Top performing adventures
const topAdventures = [
  { name: 'Whale Shark Snorkeling', bookings: 189, revenue: 94500, rating: 4.9, reviews: 156, color: '#3B82F6' },
  { name: 'Blue Hole Diving', bookings: 167, revenue: 125250, rating: 4.8, reviews: 142, color: '#10B981' },
  { name: 'Jungle Canopy Zip Line', bookings: 145, revenue: 72500, rating: 4.7, reviews: 128, color: '#F59E0B' },
  { name: 'Mayan Ruins Explorer', bookings: 134, revenue: 80400, rating: 4.6, reviews: 118, color: '#EF4444' },
  { name: 'Cave Tubing Adventure', bookings: 123, revenue: 61500, rating: 4.8, reviews: 105, color: '#8B5CF6' },
  { name: 'Reef Fishing Charter', bookings: 98, revenue: 58800, rating: 4.5, reviews: 87, color: '#06B6D4' },
  { name: 'Howler Monkey Safari', bookings: 87, revenue: 34800, rating: 4.4, reviews: 76, color: '#84CC16' },
  { name: 'Sunset Kayaking', bookings: 76, revenue: 30400, rating: 4.7, reviews: 68, color: '#F97316' },
];

// Adventure categories performance
const categoryData = [
  { category: 'Water Sports', bookings: 456, revenue: 278400, growth: 18.5, color: '#3B82F6' },
  { category: 'Adventure Tours', bookings: 389, revenue: 194500, growth: 12.3, color: '#10B981' },
  { category: 'Cultural Experiences', bookings: 267, revenue: 133500, growth: 8.7, color: '#F59E0B' },
  { category: 'Wildlife Tours', bookings: 198, revenue: 79200, growth: 15.2, color: '#EF4444' },
  { category: 'Relaxation', bookings: 134, revenue: 67000, growth: -2.1, color: '#8B5CF6' },
];

// Monthly performance trends
const monthlyPerformance = [
  { month: 'Jan', bookings: 89, revenue: 44500, satisfaction: 4.5 },
  { month: 'Feb', bookings: 102, revenue: 51000, satisfaction: 4.6 },
  { month: 'Mar', bookings: 95, revenue: 47500, satisfaction: 4.4 },
  { month: 'Apr', bookings: 134, revenue: 67000, satisfaction: 4.7 },
  { month: 'May', bookings: 156, revenue: 78000, satisfaction: 4.8 },
  { month: 'Jun', bookings: 178, revenue: 89000, satisfaction: 4.8 },
  { month: 'Jul', bookings: 198, revenue: 99000, satisfaction: 4.9 },
  { month: 'Aug', bookings: 189, revenue: 94500, satisfaction: 4.8 },
  { month: 'Sep', bookings: 167, revenue: 83500, satisfaction: 4.7 },
  { month: 'Oct', bookings: 145, revenue: 72500, satisfaction: 4.6 },
  { month: 'Nov', bookings: 123, revenue: 61500, satisfaction: 4.7 },
  { month: 'Dec', bookings: 134, revenue: 67000, satisfaction: 4.8 },
];

// Rating distribution
const ratingData = [
  { rating: '5 Stars', count: 847, percentage: 68.2, color: '#10B981' },
  { rating: '4 Stars', count: 289, percentage: 23.3, color: '#3B82F6' },
  { rating: '3 Stars', count: 78, percentage: 6.3, color: '#F59E0B' },
  { rating: '2 Stars', count: 19, percentage: 1.5, color: '#EF4444' },
  { rating: '1 Star', count: 9, percentage: 0.7, color: '#6B7280' },
];

const AdventurePerformance: React.FC<AdventurePerformanceProps> = ({ dateRange, compact = false }) => {
  const [activeView, setActiveView] = useState<'top' | 'categories' | 'trends' | 'ratings'>('top');

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
                {entry.name === 'satisfaction' ? '/5.0' : ''}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderTopAdventures = () => (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topAdventures.slice(0, 6)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            {topAdventures.map((item, index) => (
              <linearGradient key={index} id={`topGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={item.color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={item.color} stopOpacity={0.6}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="name" 
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
            dataKey="bookings" 
            radius={[4, 4, 0, 0]}
            name="Bookings"
          >
            {topAdventures.slice(0, 6).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`url(#topGradient-${index})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topAdventures.slice(0, 8).map((adventure, index) => (
          <div key={adventure.name} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: adventure.color }}
                />
                <h4 className="font-medium text-sm">{adventure.name}</h4>
              </div>
              <Badge variant="outline" className="text-xs">
                #{index + 1}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Bookings</p>
                <p className="font-bold text-lg" style={{ color: adventure.color }}>
                  {adventure.bookings}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Revenue</p>
                <p className="font-bold text-lg text-green-600">
                  ${(adventure.revenue / 1000).toFixed(0)}K
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-bold">{adventure.rating}</span>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">Reviews</p>
                <p className="font-bold">{adventure.reviews}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            {categoryData.map((item, index) => (
              <linearGradient key={index} id={`catGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={item.color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={item.color} stopOpacity={0.6}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="category" 
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
            dataKey="bookings" 
            radius={[4, 4, 0, 0]}
            name="Bookings"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`url(#catGradient-${index})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categoryData.map((category, index) => (
          <div key={category.category} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm">{category.category}</h4>
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Bookings</p>
                <p className="text-lg font-bold" style={{ color: category.color }}>
                  {category.bookings}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className="text-sm font-bold text-green-600">
                  ${(category.revenue / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="flex items-center gap-1">
                {category.growth > 0 ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span className={`text-xs ${category.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {category.growth > 0 ? '+' : ''}{category.growth}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTrends = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={monthlyPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="trendGradient1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="trendGradient2" x1="0" y1="0" x2="0" y2="1">
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
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="bookings"
          stroke="#3B82F6"
          strokeWidth={3}
          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
          name="Bookings"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="satisfaction"
          stroke="#10B981"
          strokeWidth={3}
          dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
          name="Satisfaction"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderRatings = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={ratingData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="count"
            >
              {ratingData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="space-y-4">
        <h4 className="font-semibold">Rating Distribution</h4>
        {ratingData.map((rating, index) => (
          <div key={rating.rating} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: rating.color }}
              />
              <span className="font-medium">{rating.rating}</span>
            </div>
            <div className="text-right">
              <p className="font-bold">{rating.count.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{rating.percentage}%</p>
            </div>
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-green-600" />
            <h5 className="font-semibold text-green-800 dark:text-green-200">Customer Satisfaction</h5>
          </div>
          <p className="text-3xl font-bold text-green-600">4.7/5.0</p>
          <p className="text-sm text-green-700 dark:text-green-300">
            91.5% of customers rate us 4+ stars
          </p>
        </div>
      </div>
    </div>
  );

  if (compact) {
    return (
      <Card className="dashboard-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Adventure Performance</CardTitle>
            <Badge variant="outline" className="text-green-600 border-green-600">
              <Star className="w-3 h-3 mr-1" />
              4.7/5.0
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">1.8K</p>
              <p className="text-xs text-muted-foreground">Total Bookings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">$895K</p>
              <p className="text-xs text-muted-foreground">Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">189</p>
              <p className="text-xs text-muted-foreground">Top Adventure</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topAdventures.slice(0, 4)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <Bar 
                dataKey="bookings" 
                radius={[2, 2, 0, 0]}
              >
                {topAdventures.slice(0, 4).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
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
              <Activity className="w-5 h-5 text-blue-600" />
              Adventure Performance Analytics
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Track popularity, revenue, and customer satisfaction by adventure and category
            </p>
          </div>
          
          <div className="flex gap-2">
            {[
              { value: 'top', label: 'Top Adventures', icon: Trophy },
              { value: 'categories', label: 'Categories', icon: MapPin },
              { value: 'trends', label: 'Trends', icon: TrendingUp },
              { value: 'ratings', label: 'Ratings', icon: Star }
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
                <p className="text-blue-100 text-sm">Total Bookings</p>
                <p className="text-2xl font-bold">1,810</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-blue-300 mr-1" />
              <span className="text-sm">+12.8% this month</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold">$895K</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-200" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-300 mr-1" />
              <span className="text-sm">+15.3% revenue growth</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Avg. Rating</p>
                <p className="text-2xl font-bold">4.7</p>
              </div>
              <Star className="w-8 h-8 text-purple-200" />
            </div>
            <div className="flex items-center mt-2">
              <Heart className="w-4 h-4 text-purple-300 mr-1" />
              <span className="text-sm">91.5% satisfaction</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Avg. Booking</p>
                <p className="text-2xl font-bold">$495</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-200" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-orange-300 mr-1" />
              <span className="text-sm">+8.2% per booking</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {activeView === 'top' && renderTopAdventures()}
        {activeView === 'categories' && renderCategories()}
        {activeView === 'trends' && renderTrends()}
        {activeView === 'ratings' && renderRatings()}
      </CardContent>
    </Card>
  );
};

export default AdventurePerformance;