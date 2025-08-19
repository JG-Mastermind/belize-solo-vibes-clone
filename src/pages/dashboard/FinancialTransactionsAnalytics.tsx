import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, Users, MapPin, Calendar, Target, Award, Percent } from 'lucide-react';

const FinancialTransactionsAnalytics: React.FC = () => {
  // Mock data for Belize tourism revenue analytics
  const revenueMetrics = {
    totalRevenue: 2456780.50,
    monthlyGrowth: 18.7,
    yearlyGrowth: 142.3,
    avgBookingValue: 485.20,
    totalBookings: 5063,
    conversionRate: 12.4
  };

  const revenueByAdventure = [
    { name: 'Blue Hole Diving Experience', revenue: 445600, bookings: 1562, avgValue: 285, growth: 24.5 },
    { name: 'ATM Cave Sacred Journey', revenue: 392750, bookings: 1122, avgValue: 350, growth: 19.8 },
    { name: 'Caracol Maya Ruins & Cave Tubing', revenue: 378000, bookings: 900, avgValue: 420, growth: 15.2 },
    { name: 'Hummingbird Highway Wildlife Tour', revenue: 231000, bookings: 1400, avgValue: 165, growth: 22.1 },
    { name: 'Placencia Peninsula Beach & Snorkel', revenue: 195000, bookings: 1000, avgValue: 195, growth: 8.9 },
    { name: 'Lamanai Maya Temple & River Safari', revenue: 168430, bookings: 623, avgValue: 270, growth: 31.4 }
  ];

  const revenueByGuide = [
    { name: 'Carlos Martinez', revenue: 289500, tours: 156, avgRating: 4.9, commission: 43425 },
    { name: 'Maya Thompson', revenue: 267800, tours: 142, avgRating: 4.8, commission: 40170 },
    { name: 'Diego Rodriguez', revenue: 245200, tours: 138, avgRating: 4.7, commission: 36780 },
    { name: 'Elena Garcia', revenue: 198600, tours: 109, avgRating: 4.8, commission: 29790 },
    { name: 'Roberto Santos', revenue: 176400, tours: 98, avgRating: 4.6, commission: 26460 }
  ];

  const monthlyTrends = [
    { month: 'Jan', revenue: 185400, bookings: 382, avgValue: 485 },
    { month: 'Feb', revenue: 198750, bookings: 410, avgValue: 485 },
    { month: 'Mar', revenue: 234500, bookings: 483, avgValue: 485 },
    { month: 'Apr', revenue: 289200, bookings: 596, avgValue: 485 },
    { month: 'May', revenue: 325600, bookings: 671, avgValue: 485 },
    { month: 'Jun', revenue: 378900, bookings: 781, avgValue: 485 }
  ];

  const upselMetrics = [
    { service: 'Equipment Rental', revenue: 45600, conversions: 912, rate: 18.0 },
    { service: 'Photo Package', revenue: 38400, conversions: 768, rate: 15.2 },
    { service: 'Transportation Upgrade', revenue: 34200, conversions: 456, rate: 9.0 },
    { service: 'Meal Add-on', revenue: 28800, conversions: 576, rate: 11.4 },
    { service: 'Extended Tour', revenue: 22500, conversions: 225, rate: 4.4 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <>
      <Helmet>
        <title>Revenue Analytics - BelizeVibes Financial Transactions</title>
        <meta name="description" content="Comprehensive revenue analytics and forecasting for Belize tourism operations" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Revenue Analytics</h1>
            <p className="text-muted-foreground">
              Revenue trends, forecasting, and performance analysis for Belize adventures
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              Forecast Report
            </Button>
          </div>
        </div>

        {/* Revenue Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue (YTD)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(revenueMetrics.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                +{revenueMetrics.yearlyGrowth}% from last year
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+{revenueMetrics.monthlyGrowth}%</div>
              <p className="text-xs text-muted-foreground">
                Consistent growth trajectory
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Booking Value</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(revenueMetrics.avgBookingValue)}</div>
              <p className="text-xs text-muted-foreground">
                Across {revenueMetrics.totalBookings.toLocaleString()} bookings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue by Adventure Type */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Revenue by Adventure Type</CardTitle>
            <CardDescription>
              Performance breakdown of different Belize adventure experiences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueByAdventure.map((adventure, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="font-medium">{adventure.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {adventure.bookings} bookings • {formatCurrency(adventure.avgValue)} avg
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-medium">{formatCurrency(adventure.revenue)}</div>
                    <div className="flex items-center text-sm">
                      <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                      <span className="text-green-600">+{adventure.growth}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue by Guide */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Top Performing Guides</CardTitle>
              <CardDescription>
                Revenue generation and commission tracking by guide
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueByGuide.map((guide, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-medium text-sm">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{guide.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center space-x-2">
                          <span>{guide.tours} tours</span>
                          <Award className="w-3 h-3" />
                          <span>{guide.avgRating} rating</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(guide.revenue)}</div>
                      <div className="text-sm text-muted-foreground">
                        Commission: {formatCurrency(guide.commission)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upsell Performance */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Upsell Revenue</CardTitle>
              <CardDescription>
                Additional services and conversion rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upselMetrics.map((upsell, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Percent className="w-4 h-4 text-purple-600" />
                      <div>
                        <div className="font-medium">{upsell.service}</div>
                        <div className="text-sm text-muted-foreground">
                          {upsell.conversions} conversions • {upsell.rate}% rate
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(upsell.revenue)}</div>
                      <Badge 
                        variant="outline"
                        className={upsell.rate > 15 ? 'border-green-600 text-green-600' : 'border-blue-600 text-blue-600'}
                      >
                        {upsell.rate}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Revenue Trends */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Monthly Revenue Trends</CardTitle>
            <CardDescription>
              Revenue progression and seasonal patterns for Belize tourism
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyTrends.map((month, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium">{month.month}</span>
                    </div>
                    <div>
                      <div className="font-medium">{formatCurrency(month.revenue)}</div>
                      <div className="text-sm text-muted-foreground">
                        {month.bookings} bookings at {formatCurrency(month.avgValue)} avg
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {index > 0 && (
                      <div className="flex items-center">
                        {month.revenue > monthlyTrends[index - 1].revenue ? (
                          <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 mr-1 text-red-600" />
                        )}
                        <span className={`text-sm ${month.revenue > monthlyTrends[index - 1].revenue ? 'text-green-600' : 'text-red-600'}`}>
                          {((month.revenue - monthlyTrends[index - 1].revenue) / monthlyTrends[index - 1].revenue * 100).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default FinancialTransactionsAnalytics;