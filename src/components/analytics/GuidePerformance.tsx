import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { 
  Star, 
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Award,
  Clock,
  MapPin,
  Heart,
  MessageSquare,
  Shield
} from 'lucide-react';

interface GuidePerformanceProps {
  dateRange: string;
}

// Top performing guides
const topGuides = [
  {
    id: '1',
    name: 'Carlos Rodriguez',
    avatar: '/api/placeholder/40/40',
    specialties: ['Diving', 'Water Sports'],
    bookings: 89,
    revenue: 53400,
    rating: 4.9,
    reviews: 87,
    repeatCustomers: 34,
    languages: ['English', 'Spanish'],
    experience: '8 years',
    color: '#3B82F6'
  },
  {
    id: '2',
    name: 'Maya Thompson',
    avatar: '/api/placeholder/40/40',
    specialties: ['Wildlife', 'Cultural'],
    bookings: 76,
    revenue: 38000,
    rating: 4.8,
    reviews: 72,
    repeatCustomers: 28,
    languages: ['English', 'French'],
    experience: '6 years',
    color: '#10B981'
  },
  {
    id: '3',
    name: 'Diego Morales',
    avatar: '/api/placeholder/40/40',
    specialties: ['Adventure', 'Hiking'],
    bookings: 68,
    revenue: 40800,
    rating: 4.7,
    reviews: 65,
    repeatCustomers: 22,
    languages: ['English', 'Spanish', 'German'],
    experience: '5 years',
    color: '#F59E0B'
  },
  {
    id: '4',
    name: 'Sarah Mitchell',
    avatar: '/api/placeholder/40/40',
    specialties: ['Photography', 'Cultural'],
    bookings: 63,
    revenue: 31500,
    rating: 4.8,
    reviews: 58,
    repeatCustomers: 25,
    languages: ['English'],
    experience: '4 years',
    color: '#EF4444'
  },
  {
    id: '5',
    name: 'Roberto Silva',
    avatar: '/api/placeholder/40/40',
    specialties: ['Fishing', 'Boat Tours'],
    bookings: 59,
    revenue: 35400,
    rating: 4.6,
    reviews: 54,
    repeatCustomers: 19,
    languages: ['English', 'Spanish'],
    experience: '12 years',
    color: '#8B5CF6'
  },
];

// Guide performance metrics
const performanceMetrics = [
  { guide: 'Carlos R.', satisfaction: 98, bookings: 89, revenue: 53400, efficiency: 94 },
  { guide: 'Maya T.', satisfaction: 96, bookings: 76, revenue: 38000, efficiency: 91 },
  { guide: 'Diego M.', satisfaction: 94, bookings: 68, revenue: 40800, efficiency: 88 },
  { guide: 'Sarah M.', satisfaction: 96, bookings: 63, revenue: 31500, efficiency: 92 },
  { guide: 'Roberto S.', satisfaction: 92, bookings: 59, revenue: 35400, efficiency: 85 },
];

// Specialty performance
const specialtyData = [
  { specialty: 'Water Sports & Diving', guides: 8, avgRating: 4.8, bookings: 234, color: '#3B82F6' },
  { specialty: 'Wildlife & Nature', guides: 6, avgRating: 4.7, bookings: 189, color: '#10B981' },
  { specialty: 'Adventure & Hiking', guides: 5, avgRating: 4.6, bookings: 156, color: '#F59E0B' },
  { specialty: 'Cultural Experiences', guides: 7, avgRating: 4.7, bookings: 143, color: '#EF4444' },
  { specialty: 'Photography Tours', guides: 4, avgRating: 4.9, bookings: 98, color: '#8B5CF6' },
  { specialty: 'Fishing & Boating', guides: 3, avgRating: 4.5, bookings: 87, color: '#06B6D4' },
];

// Monthly guide performance trends
const monthlyPerformance = [
  { month: 'Jan', avgRating: 4.6, bookings: 45, revenue: 27000 },
  { month: 'Feb', avgRating: 4.7, bookings: 52, revenue: 31200 },
  { month: 'Mar', avgRating: 4.7, bookings: 48, revenue: 28800 },
  { month: 'Apr', avgRating: 4.8, bookings: 61, revenue: 36600 },
  { month: 'May', avgRating: 4.8, bookings: 58, revenue: 34800 },
  { month: 'Jun', avgRating: 4.7, bookings: 52, revenue: 31200 },
  { month: 'Jul', avgRating: 4.8, bookings: 67, revenue: 40200 },
  { month: 'Aug', avgRating: 4.9, bookings: 73, revenue: 43800 },
  { month: 'Sep', avgRating: 4.8, bookings: 65, revenue: 39000 },
  { month: 'Oct', avgRating: 4.7, bookings: 58, revenue: 34800 },
  { month: 'Nov', avgRating: 4.8, bookings: 62, revenue: 37200 },
  { month: 'Dec', avgRating: 4.9, bookings: 69, revenue: 41400 },
];

const GuidePerformance: React.FC<GuidePerformanceProps> = ({ dateRange }) => {
  const [activeView, setActiveView] = useState<'top' | 'metrics' | 'specialties' | 'trends'>('top');

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
                {entry.name.includes('Rating') || entry.name.includes('satisfaction') ? '/5.0' : ''}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderTopGuides = () => (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topGuides.slice(0, 5)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            {topGuides.map((guide, index) => (
              <linearGradient key={index} id={`guideGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={guide.color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={guide.color} stopOpacity={0.6}/>
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
            {topGuides.slice(0, 5).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`url(#guideGradient-${index})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topGuides.map((guide, index) => (
          <div key={guide.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={guide.avatar} alt={guide.name} />
                  <AvatarFallback>{guide.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{guide.name}</h4>
                  <p className="text-xs text-muted-foreground">{guide.experience} experience</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-sm font-bold">{guide.rating}</span>
                    <span className="text-xs text-muted-foreground">({guide.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                #{index + 1}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-muted-foreground">Bookings</p>
                <p className="font-bold text-lg" style={{ color: guide.color }}>
                  {guide.bookings}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Revenue</p>
                <p className="font-bold text-lg text-green-600">
                  ${(guide.revenue / 1000).toFixed(0)}K
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Repeat Rate</p>
                <p className="font-bold">{Math.round((guide.repeatCustomers / guide.bookings) * 100)}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Languages</p>
                <p className="font-bold">{guide.languages.length}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Specialties:</p>
                <div className="flex flex-wrap gap-1">
                  {guide.specialties.map(specialty => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground mb-1">Languages:</p>
                <div className="flex flex-wrap gap-1">
                  {guide.languages.map(language => (
                    <Badge key={language} variant="outline" className="text-xs">
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMetrics = () => (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={performanceMetrics} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis dataKey="guide" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
          />
          <Radar
            name="Satisfaction"
            dataKey="satisfaction"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name="Efficiency"
            dataKey="efficiency"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {performanceMetrics.map((guide, index) => (
          <div key={guide.guide} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">{guide.guide}</h4>
              <Badge 
                variant="outline"
                className={`${guide.satisfaction >= 95 ? 'text-green-600 border-green-600' : 'text-blue-600 border-blue-600'}`}
              >
                {guide.satisfaction >= 95 ? 'Excellent' : 'Good'}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Customer Satisfaction</span>
                  <span className="font-bold">{guide.satisfaction}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${guide.satisfaction}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Operational Efficiency</span>
                  <span className="font-bold">{guide.efficiency}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${guide.efficiency}%` }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 pt-2 border-t text-sm">
                <div>
                  <p className="text-muted-foreground">Bookings</p>
                  <p className="font-bold">{guide.bookings}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Revenue</p>
                  <p className="font-bold">${(guide.revenue / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSpecialties = () => (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={specialtyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            {specialtyData.map((item, index) => (
              <linearGradient key={index} id={`specialtyGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={item.color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={item.color} stopOpacity={0.6}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="specialty" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            angle={-45}
            textAnchor="end"
            height={120}
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
            {specialtyData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`url(#specialtyGradient-${index})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {specialtyData.map((specialty, index) => (
          <div key={specialty.specialty} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-sm">{specialty.specialty}</h4>
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: specialty.color }}
              />
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Active Guides</p>
                  <p className="font-bold text-lg" style={{ color: specialty.color }}>
                    {specialty.guides}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Bookings</p>
                  <p className="font-bold text-lg text-green-600">
                    {specialty.bookings}
                  </p>
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-bold">{specialty.avgRating}</span>
                  <span className="text-xs text-muted-foreground">avg rating</span>
                </div>
              </div>
              
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Performance</span>
                <Badge 
                  variant="outline"
                  className={`${specialty.avgRating >= 4.7 ? 'text-green-600 border-green-600' : 'text-blue-600 border-blue-600'}`}
                >
                  {specialty.avgRating >= 4.7 ? 'Excellent' : 'Good'}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg">
        <h4 className="font-semibold mb-4">Specialty Insights & Recommendations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium mb-2 text-green-600">High Performing</h5>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Water Sports & Diving (4.8★ avg)</li>
              <li>• Photography Tours (4.9★ avg)</li>
              <li>• Cultural Experiences (4.7★ avg)</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2 text-orange-600">Growth Opportunities</h5>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Expand fishing guide team (high demand)</li>
              <li>• Cross-train guides in multiple specialties</li>
              <li>• Language training for international guests</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTrends = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={monthlyPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="bookingTrendGradient" x1="0" y1="0" x2="0" y2="1">
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
          dataKey="avgRating"
          stroke="#3B82F6"
          strokeWidth={3}
          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
          name="Avg Rating"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="bookings"
          stroke="#10B981"
          strokeWidth={3}
          dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
          name="Total Bookings"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-600" />
              Guide Performance & Analytics
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Track individual guide performance, specialties, and customer satisfaction
            </p>
          </div>
          
          <div className="flex gap-2">
            {[
              { value: 'top', label: 'Top Guides', icon: Award },
              { value: 'metrics', label: 'Metrics', icon: TrendingUp },
              { value: 'specialties', label: 'Specialties', icon: MapPin },
              { value: 'trends', label: 'Trends', icon: Activity }
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
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Active Guides</p>
                <p className="text-2xl font-bold">33</p>
              </div>
              <Users className="w-8 h-8 text-yellow-200" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-yellow-300 mr-1" />
              <span className="text-sm">+3 this quarter</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Avg Rating</p>
                <p className="text-2xl font-bold">4.7</p>
              </div>
              <Star className="w-8 h-8 text-blue-200" />
            </div>
            <div className="flex items-center mt-2">
              <Heart className="w-4 h-4 text-blue-300 mr-1" />
              <span className="text-sm">96% satisfaction</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Top Performer</p>
                <p className="text-2xl font-bold">Carlos</p>
              </div>
              <Award className="w-8 h-8 text-green-200" />
            </div>
            <div className="flex items-center mt-2">
              <DollarSign className="w-4 h-4 text-green-300 mr-1" />
              <span className="text-sm">$53.4K revenue</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Specialties</p>
                <p className="text-2xl font-bold">6</p>
              </div>
              <MapPin className="w-8 h-8 text-purple-200" />
            </div>
            <div className="flex items-center mt-2">
              <Shield className="w-4 h-4 text-purple-300 mr-1" />
              <span className="text-sm">Certified areas</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {activeView === 'top' && renderTopGuides()}
        {activeView === 'metrics' && renderMetrics()}
        {activeView === 'specialties' && renderSpecialties()}
        {activeView === 'trends' && renderTrends()}
      </CardContent>
    </Card>
  );
};

export default GuidePerformance;