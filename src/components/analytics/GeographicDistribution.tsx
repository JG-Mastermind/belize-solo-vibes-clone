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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { 
  MapPin, 
  Globe,
  Users,
  DollarSign,
  TrendingUp,
  Plane,
  Navigation,
  Map
} from 'lucide-react';

interface GeographicDistributionProps {
  dateRange: string;
}

// Country data with booking and revenue information
const countryData = [
  { 
    country: 'United States', 
    bookings: 687, 
    revenue: 412200, 
    growth: 18.5, 
    flag: '🇺🇸',
    color: '#3B82F6',
    avgSpend: 600,
    topCities: ['New York', 'Los Angeles', 'Chicago', 'Houston']
  },
  { 
    country: 'Canada', 
    bookings: 342, 
    revenue: 205200, 
    growth: 22.3, 
    flag: '🇨🇦',
    color: '#10B981',
    avgSpend: 600,
    topCities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary']
  },
  { 
    country: 'United Kingdom', 
    bookings: 234, 
    revenue: 163800, 
    growth: 15.7, 
    flag: '🇬🇧',
    color: '#F59E0B',
    avgSpend: 700,
    topCities: ['London', 'Manchester', 'Birmingham', 'Edinburgh']
  },
  { 
    country: 'Australia', 
    bookings: 156, 
    revenue: 124800, 
    growth: 28.4, 
    flag: '🇦🇺',
    color: '#EF4444',
    avgSpend: 800,
    topCities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth']
  },
  { 
    country: 'Germany', 
    bookings: 143, 
    revenue: 100100, 
    growth: 12.1, 
    flag: '🇩🇪',
    color: '#8B5CF6',
    avgSpend: 700,
    topCities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt']
  },
  { 
    country: 'France', 
    bookings: 98, 
    revenue: 68600, 
    growth: 8.9, 
    flag: '🇫🇷',
    color: '#06B6D4',
    avgSpend: 700,
    topCities: ['Paris', 'Lyon', 'Marseille', 'Toulouse']
  },
  { 
    country: 'Netherlands', 
    bookings: 87, 
    revenue: 60900, 
    growth: 19.2, 
    flag: '🇳🇱',
    color: '#84CC16',
    avgSpend: 700,
    topCities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht']
  },
  { 
    country: 'Sweden', 
    bookings: 65, 
    revenue: 45500, 
    growth: 25.6, 
    flag: '🇸🇪',
    color: '#F97316',
    avgSpend: 700,
    topCities: ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala']
  },
];

// Regional data
const regionData = [
  { region: 'North America', bookings: 1029, revenue: 617400, color: '#3B82F6' },
  { region: 'Europe', bookings: 627, revenue: 438900, color: '#10B981' },
  { region: 'Oceania', bookings: 156, revenue: 124800, color: '#F59E0B' },
  { region: 'Asia', bookings: 89, revenue: 62300, color: '#EF4444' },
  { region: 'South America', bookings: 45, revenue: 31500, color: '#8B5CF6' },
];

// Monthly geographic trends
const monthlyGeo = [
  { month: 'Jan', usa: 45, canada: 28, uk: 18, others: 35 },
  { month: 'Feb', usa: 52, canada: 32, uk: 21, others: 42 },
  { month: 'Mar', usa: 48, canada: 29, uk: 19, others: 38 },
  { month: 'Apr', usa: 65, canada: 38, uk: 25, others: 48 },
  { month: 'May', usa: 72, canada: 42, uk: 28, others: 54 },
  { month: 'Jun', usa: 78, canada: 45, uk: 31, others: 58 },
  { month: 'Jul', usa: 89, canada: 52, uk: 34, others: 67 },
  { month: 'Aug', usa: 85, canada: 49, uk: 32, others: 63 },
  { month: 'Sep', usa: 76, canada: 44, uk: 29, others: 57 },
  { month: 'Oct', usa: 68, canada: 39, uk: 26, others: 51 },
  { month: 'Nov', usa: 59, canada: 34, uk: 23, others: 44 },
  { month: 'Dec', usa: 63, canada: 37, uk: 24, others: 47 },
];

const GeographicDistribution: React.FC<GeographicDistributionProps> = ({ dateRange }) => {
  const [activeView, setActiveView] = useState<'countries' | 'regions' | 'trends' | 'cities'>('countries');

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
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCountries = () => (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={countryData.slice(0, 6)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            {countryData.map((item, index) => (
              <linearGradient key={index} id={`countryGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={item.color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={item.color} stopOpacity={0.6}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="country" 
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
            {countryData.slice(0, 6).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`url(#countryGradient-${index})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {countryData.map((country, index) => (
          <div key={country.country} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{country.flag}</span>
                <div>
                  <h4 className="font-medium">{country.country}</h4>
                  <p className="text-xs text-muted-foreground">#{index + 1} market</p>
                </div>
              </div>
              <Badge 
                variant="outline" 
                className={`${country.growth > 15 ? 'text-green-600 border-green-600' : 'text-blue-600 border-blue-600'}`}
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                +{country.growth}%
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Bookings</p>
                <p className="font-bold text-lg" style={{ color: country.color }}>
                  {country.bookings.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Revenue</p>
                <p className="font-bold text-lg text-green-600">
                  ${(country.revenue / 1000).toFixed(0)}K
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Avg. Spend</p>
                <p className="font-bold">${country.avgSpend}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Top City</p>
                <p className="font-bold">{country.topCities[0]}</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-muted-foreground mb-1">Top Cities:</p>
              <div className="flex flex-wrap gap-1">
                {country.topCities.slice(0, 3).map(city => (
                  <Badge key={city} variant="secondary" className="text-xs">
                    {city}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRegions = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={regionData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="bookings"
            >
              {regionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="space-y-4">
        <h4 className="font-semibold">Regional Breakdown</h4>
        {regionData.map((region, index) => (
          <div key={region.region} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: region.color }}
              />
              <span className="font-medium">{region.region}</span>
            </div>
            <div className="text-right">
              <p className="font-bold">{region.bookings} bookings</p>
              <p className="text-xs text-muted-foreground">
                ${(region.revenue / 1000).toFixed(0)}K revenue
              </p>
            </div>
          </div>
        ))}

        {/* Regional Performance Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <h5 className="font-semibold text-blue-800 dark:text-blue-200">Global Reach</h5>
          </div>
          <p className="text-2xl font-bold text-blue-600">47 Countries</p>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Active bookings from 5 continents
          </p>
        </div>
      </div>
    </div>
  );

  const renderTrends = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={monthlyGeo} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="usaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.6}/>
          </linearGradient>
          <linearGradient id="canadaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#10B981" stopOpacity={0.6}/>
          </linearGradient>
          <linearGradient id="ukGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.6}/>
          </linearGradient>
          <linearGradient id="othersGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#EF4444" stopOpacity={0.6}/>
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
        <Bar 
          dataKey="usa" 
          stackId="a" 
          fill="url(#usaGradient)"
          name="USA"
          radius={[0, 0, 0, 0]}
        />
        <Bar 
          dataKey="canada" 
          stackId="a" 
          fill="url(#canadaGradient)"
          name="Canada"
          radius={[0, 0, 0, 0]}
        />
        <Bar 
          dataKey="uk" 
          stackId="a" 
          fill="url(#ukGradient)"
          name="UK"
          radius={[0, 0, 0, 0]}
        />
        <Bar 
          dataKey="others" 
          stackId="a" 
          fill="url(#othersGradient)"
          name="Others"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderCities = () => {
    const cityList = countryData.flatMap(country => 
      country.topCities.map((city, index) => ({
        city,
        country: country.country,
        flag: country.flag,
        bookings: Math.floor(country.bookings / country.topCities.length * (1 + (3 - index) * 0.3)),
        color: country.color
      }))
    ).sort((a, b) => b.bookings - a.bookings).slice(0, 12);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cityList.map((cityData, index) => (
          <div key={`${cityData.city}-${cityData.country}`} className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{cityData.flag}</span>
                <div>
                  <h4 className="font-medium">{cityData.city}</h4>
                  <p className="text-xs text-muted-foreground">{cityData.country}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                #{index + 1}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Bookings</p>
                <p className="text-xl font-bold" style={{ color: cityData.color }}>
                  {cityData.bookings}
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: cityData.color,
                    width: `${(cityData.bookings / 120) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Geographic Booking Distribution
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Track bookings and revenue by country, region, and city
            </p>
          </div>
          
          <div className="flex gap-2">
            {[
              { value: 'countries', label: 'Countries', icon: Globe },
              { value: 'regions', label: 'Regions', icon: Map },
              { value: 'trends', label: 'Trends', icon: TrendingUp },
              { value: 'cities', label: 'Cities', icon: Navigation }
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
                <p className="text-blue-100 text-sm">Countries</p>
                <p className="text-2xl font-bold">47</p>
              </div>
              <Globe className="w-8 h-8 text-blue-200" />
            </div>
            <div className="flex items-center mt-2">
              <Plane className="w-4 h-4 text-blue-300 mr-1" />
              <span className="text-sm">5 continents</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Top Market</p>
                <p className="text-2xl font-bold">🇺🇸 USA</p>
              </div>
              <Users className="w-8 h-8 text-green-200" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-300 mr-1" />
              <span className="text-sm">687 bookings</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Fastest Growing</p>
                <p className="text-2xl font-bold">🇦🇺 AUS</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-200" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-purple-300 mr-1" />
              <span className="text-sm">+28.4% growth</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Highest Spend</p>
                <p className="text-2xl font-bold">$800</p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-200" />
            </div>
            <div className="flex items-center mt-2">
              <MapPin className="w-4 h-4 text-orange-300 mr-1" />
              <span className="text-sm">Australia avg.</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {activeView === 'countries' && renderCountries()}
        {activeView === 'regions' && renderRegions()}
        {activeView === 'trends' && renderTrends()}
        {activeView === 'cities' && renderCities()}
      </CardContent>
    </Card>
  );
};

export default GeographicDistribution;