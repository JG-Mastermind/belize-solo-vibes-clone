import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

const ApiCostAnalysis: React.FC = () => {
  const costData = {
    currentMonth: 245.67,
    previousMonth: 198.43,
    yearToDate: 2156.78,
    projectedMonth: 289.12,
    budget: 500.00
  };

  const costBreakdown = [
    { service: 'Supabase Database', cost: 89.50, percentage: 36.4, trend: 'up' },
    { service: 'Storage API', cost: 45.23, percentage: 18.4, trend: 'down' },
    { service: 'Auth Services', cost: 34.12, percentage: 13.9, trend: 'up' },
    { service: 'Edge Functions', cost: 28.67, percentage: 11.7, trend: 'stable' },
    { service: 'Real-time Features', cost: 24.89, percentage: 10.1, trend: 'up' },
    { service: 'Bandwidth', cost: 23.26, percentage: 9.5, trend: 'down' }
  ];

  const monthlyTrend = [
    { month: 'Jan', cost: 187.23 },
    { month: 'Feb', cost: 201.45 },
    { month: 'Mar', cost: 245.67 },
    { month: 'Apr', cost: 0 } // Current month projection
  ];

  const percentageChange = ((costData.currentMonth - costData.previousMonth) / costData.previousMonth * 100);
  const budgetUsage = (costData.currentMonth / costData.budget * 100);

  return (
    <>
      <Helmet>
        <title>API Cost Analysis - BelizeVibes Dashboard</title>
        <meta name="description" content="Analyze and monitor API costs and usage trends" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">API Cost Analysis</h1>
            <p className="text-muted-foreground">
              Monitor spending, analyze trends, and optimize API costs
            </p>
          </div>
          <Badge 
            variant={budgetUsage > 80 ? "destructive" : budgetUsage > 60 ? "secondary" : "default"}
            className="text-sm"
          >
            {budgetUsage.toFixed(1)}% of budget used
          </Badge>
        </div>

        {/* Cost Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Month</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${costData.currentMonth}</div>
              <div className="flex items-center text-xs">
                {percentageChange > 0 ? (
                  <TrendingUp className="w-3 h-3 text-red-500 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-green-500 mr-1" />
                )}
                <span className={percentageChange > 0 ? 'text-red-500' : 'text-green-500'}>
                  {Math.abs(percentageChange).toFixed(1)}% from last month
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Previous Month</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${costData.previousMonth}</div>
              <p className="text-xs text-muted-foreground">
                Final billing amount
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Year to Date</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${costData.yearToDate}</div>
              <p className="text-xs text-muted-foreground">
                Total spending this year
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
              {budgetUsage > 80 && <AlertTriangle className="h-4 w-4 text-orange-500" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${costData.budget}</div>
              <p className="text-xs text-muted-foreground">
                ${(costData.budget - costData.currentMonth).toFixed(2)} remaining
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cost Breakdown */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Cost Breakdown by Service</CardTitle>
            <CardDescription>
              Detailed breakdown of API costs by service category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {costBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{item.service}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">${item.cost}</span>
                        {item.trend === 'up' && <TrendingUp className="w-4 h-4 text-red-500" />}
                        {item.trend === 'down' && <TrendingDown className="w-4 h-4 text-green-500" />}
                        {item.trend === 'stable' && <div className="w-4 h-4 rounded-full bg-gray-400"></div>}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{item.percentage}% of total</span>
                      <span>
                        {item.trend === 'up' && '+'}
                        {item.trend === 'down' && '-'}
                        {item.trend === 'stable' && '='}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Monthly Cost Trend</CardTitle>
            <CardDescription>
              Historical cost data and projections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                {monthlyTrend.map((item, index) => (
                  <div key={index} className="text-center p-4 border rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">{item.month}</div>
                    <div className="text-xl font-bold">
                      {item.cost > 0 ? `$${item.cost}` : 'Projected'}
                    </div>
                    {item.month === 'Apr' && (
                      <div className="text-sm text-orange-600 font-medium">
                        ${costData.projectedMonth}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Optimization Recommendations */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Cost Optimization Recommendations</CardTitle>
            <CardDescription>
              Suggestions to reduce API costs and improve efficiency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Database Query Optimization</h4>
                  <p className="text-sm text-blue-700">
                    Consider optimizing frequent queries to reduce database load and costs by 15-20%.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <TrendingDown className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Storage Cleanup</h4>
                  <p className="text-sm text-green-700">
                    Remove unused files and implement automatic cleanup to reduce storage costs.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <DollarSign className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-900">Rate Limiting</h4>
                  <p className="text-sm text-orange-700">
                    Implement stricter rate limiting to prevent excessive API usage and unexpected costs.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ApiCostAnalysis;