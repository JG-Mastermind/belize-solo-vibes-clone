import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PieChart, TrendingUp, TrendingDown, DollarSign, Calendar, FileText, Download, Calculator } from 'lucide-react';

const FinancialReports: React.FC = () => {
  const financialOverview = {
    totalRevenue: 245670,
    totalExpenses: 134580,
    netProfit: 111090,
    profitMargin: 45.2,
    cashFlow: 87450,
    quarterlyGrowth: 23.8,
    yearlyGrowth: 156.7,
    taxesOwed: 28890
  };

  const profitLossData = {
    revenue: {
      tourBookings: 198450,
      accommodationBookings: 32150,
      equipmentRental: 8970,
      guideServices: 6100
    },
    expenses: {
      guidePayments: 45600,
      transportation: 28900,
      equipmentMaintenance: 15200,
      accommodationCosts: 18700,
      marketing: 12800,
      insurance: 8900,
      utilities: 4480
    }
  };

  const monthlyPerformance = [
    {
      month: 'January',
      revenue: 28450,
      expenses: 16200,
      netProfit: 12250,
      profitMargin: 43.1,
      bookings: 45,
      seasonality: 'Low Season'
    },
    {
      month: 'February',
      revenue: 34200,
      expenses: 18900,
      netProfit: 15300,
      profitMargin: 44.7,
      bookings: 52,
      seasonality: 'Low Season'
    },
    {
      month: 'March',
      revenue: 31800,
      expenses: 17600,
      netProfit: 14200,
      profitMargin: 44.7,
      bookings: 48,
      seasonality: 'Shoulder Season'
    },
    {
      month: 'April',
      revenue: 24650,
      expenses: 14200,
      netProfit: 10450,
      profitMargin: 42.4,
      bookings: 38,
      seasonality: 'Shoulder Season'
    },
    {
      month: 'May',
      revenue: 27890,
      expenses: 15800,
      netProfit: 12090,
      profitMargin: 43.4,
      bookings: 42,
      seasonality: 'Shoulder Season'
    },
    {
      month: 'June',
      revenue: 23450,
      expenses: 13900,
      netProfit: 9550,
      profitMargin: 40.7,
      bookings: 35,
      seasonality: 'Low Season'
    },
    {
      month: 'July',
      revenue: 26780,
      expenses: 15100,
      netProfit: 11680,
      profitMargin: 43.6,
      bookings: 41,
      seasonality: 'High Season'
    },
    {
      month: 'August',
      revenue: 48450,
      expenses: 24880,
      netProfit: 23570,
      profitMargin: 48.7,
      bookings: 78,
      seasonality: 'Peak Season'
    }
  ];

  const cashFlowAnalysis = {
    operatingActivities: 89650,
    investingActivities: -12400,
    financingActivities: -8900,
    netCashFlow: 68350,
    accountsReceivable: 18950,
    accountsPayable: 12600,
    currentRatio: 2.1
  };

  const taxReporting = {
    quarterlyTaxes: [
      { quarter: 'Q1 2024', revenue: 94450, taxableIncome: 41900, taxOwed: 10475, status: 'paid' },
      { quarter: 'Q2 2024', revenue: 75990, taxableIncome: 32090, taxOwed: 8023, status: 'paid' },
      { quarter: 'Q3 2024', revenue: 75230, taxableIncome: 35250, taxOwed: 8813, status: 'pending' },
      { quarter: 'Q4 2024', revenue: 0, taxableIncome: 0, taxOwed: 0, status: 'upcoming' }
    ],
    annualProjection: {
      estimatedRevenue: 280000,
      estimatedTaxableIncome: 126000,
      estimatedTaxOwed: 31500,
      deductionsApplied: 18900
    }
  };

  const getSeasonalityBadge = (seasonality: string) => {
    switch (seasonality) {
      case 'Peak Season':
        return <Badge className="bg-red-100 text-red-800">Peak Season</Badge>;
      case 'High Season':
        return <Badge className="bg-orange-100 text-orange-800">High Season</Badge>;
      case 'Shoulder Season':
        return <Badge className="bg-yellow-100 text-yellow-800">Shoulder Season</Badge>;
      case 'Low Season':
        return <Badge className="bg-blue-100 text-blue-800">Low Season</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTaxStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'upcoming':
        return <Badge className="bg-gray-100 text-gray-800">Upcoming</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Financial Reports - BelizeVibes Invoice Management</title>
        <meta name="description" content="Comprehensive financial reporting, P&L analysis, and tax preparation for tourism business" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
            <p className="text-muted-foreground">
              Comprehensive financial analysis, profit & loss statements, and tax reporting for tourism operations
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Select Period
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Download className="w-4 h-4 mr-2" />
              Export Reports
            </Button>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${financialOverview.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{financialOverview.yearlyGrowth}% YoY
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${financialOverview.netProfit.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {financialOverview.profitMargin}% profit margin
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${financialOverview.cashFlow.toLocaleString()}</div>
              <p className="text-xs text-blue-600">
                Operating activities positive
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quarterly Growth</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+{financialOverview.quarterlyGrowth}%</div>
              <p className="text-xs text-muted-foreground">
                Strong seasonal performance
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Profit & Loss Breakdown */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>
                Revenue sources and their contribution to total income
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tour Bookings</span>
                  <div className="text-right">
                    <div className="font-bold">${profitLossData.revenue.tourBookings.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {((profitLossData.revenue.tourBookings / financialOverview.totalRevenue) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <Progress value={(profitLossData.revenue.tourBookings / financialOverview.totalRevenue) * 100} className="h-2" />

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Accommodation</span>
                  <div className="text-right">
                    <div className="font-bold">${profitLossData.revenue.accommodationBookings.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {((profitLossData.revenue.accommodationBookings / financialOverview.totalRevenue) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <Progress value={(profitLossData.revenue.accommodationBookings / financialOverview.totalRevenue) * 100} className="h-2" />

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Equipment Rental</span>
                  <div className="text-right">
                    <div className="font-bold">${profitLossData.revenue.equipmentRental.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {((profitLossData.revenue.equipmentRental / financialOverview.totalRevenue) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <Progress value={(profitLossData.revenue.equipmentRental / financialOverview.totalRevenue) * 100} className="h-2" />

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Guide Services</span>
                  <div className="text-right">
                    <div className="font-bold">${profitLossData.revenue.guideServices.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {((profitLossData.revenue.guideServices / financialOverview.totalRevenue) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <Progress value={(profitLossData.revenue.guideServices / financialOverview.totalRevenue) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>
                Operating expenses and their impact on profitability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Guide Payments</span>
                  <div className="text-right">
                    <div className="font-bold">${profitLossData.expenses.guidePayments.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {((profitLossData.expenses.guidePayments / financialOverview.totalExpenses) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <Progress value={(profitLossData.expenses.guidePayments / financialOverview.totalExpenses) * 100} className="h-2" />

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Transportation</span>
                  <div className="text-right">
                    <div className="font-bold">${profitLossData.expenses.transportation.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {((profitLossData.expenses.transportation / financialOverview.totalExpenses) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <Progress value={(profitLossData.expenses.transportation / financialOverview.totalExpenses) * 100} className="h-2" />

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Accommodation Costs</span>
                  <div className="text-right">
                    <div className="font-bold">${profitLossData.expenses.accommodationCosts.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {((profitLossData.expenses.accommodationCosts / financialOverview.totalExpenses) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <Progress value={(profitLossData.expenses.accommodationCosts / financialOverview.totalExpenses) * 100} className="h-2" />

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Equipment & Maintenance</span>
                  <div className="text-right">
                    <div className="font-bold">${profitLossData.expenses.equipmentMaintenance.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {((profitLossData.expenses.equipmentMaintenance / financialOverview.totalExpenses) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <Progress value={(profitLossData.expenses.equipmentMaintenance / financialOverview.totalExpenses) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Performance Analysis */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Monthly Performance Analysis</CardTitle>
            <CardDescription>
              Monthly profit & loss with seasonal tourism patterns for Belize operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyPerformance.map((month, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium">{month.month} 2024</h3>
                        {getSeasonalityBadge(month.seasonality)}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {month.bookings} bookings
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          ${month.netProfit.toLocaleString()} profit
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Revenue:</span>
                        <div className="font-medium">${month.revenue.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Expenses:</span>
                        <div className="font-medium">${month.expenses.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Net Profit:</span>
                        <div className="font-medium text-green-600">${month.netProfit.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Margin:</span>
                        <div className="font-medium">{month.profitMargin.toFixed(1)}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Season:</span>
                        <div className="font-medium">{month.seasonality}</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Progress value={month.profitMargin} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tax Reporting & Compliance */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Tax Reporting & Compliance</CardTitle>
            <CardDescription>
              Quarterly tax calculations and annual projections for Belize business operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Quarterly Tax Summary */}
              <div>
                <h4 className="font-medium mb-3">Quarterly Tax Filings</h4>
                <div className="space-y-3">
                  {taxReporting.quarterlyTaxes.map((quarter, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{quarter.quarter}</span>
                        {getTaxStatusBadge(quarter.status)}
                      </div>
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="text-muted-foreground">Revenue:</span>
                          <span className="ml-1 font-medium">${quarter.revenue.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Taxable:</span>
                          <span className="ml-1 font-medium">${quarter.taxableIncome.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tax Owed:</span>
                          <span className="ml-1 font-medium">${quarter.taxOwed.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Annual Projections */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">2024 Annual Projections</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Est. Revenue:</span>
                    <div className="font-bold">${taxReporting.annualProjection.estimatedRevenue.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Taxable Income:</span>
                    <div className="font-bold">${taxReporting.annualProjection.estimatedTaxableIncome.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Est. Tax:</span>
                    <div className="font-bold">${taxReporting.annualProjection.estimatedTaxOwed.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Deductions:</span>
                    <div className="font-bold text-green-600">${taxReporting.annualProjection.deductionsApplied.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default FinancialReports;