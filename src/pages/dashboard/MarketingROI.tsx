import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DollarSign, TrendingUp, Target, Users, Calculator, ArrowUpRight, Download, Zap } from 'lucide-react';

const MarketingROI: React.FC = () => {
  const roiOverview = {
    totalMarketingSpend: 47500,
    totalRevenue: 3804502,
    totalROI: 8.01,
    customerAcquisitionCost: 148,
    customerLifetimeValue: 2340,
    paybackPeriod: 2.3,
    marginContribution: 68.4,
    profitPerCustomer: 1592
  };

  const channelROI = [
    {
      channel: 'Organic Search',
      spend: 0,
      revenue: 1342156,
      roi: '∞',
      cac: 0,
      ltv: 2450,
      customers: 1134,
      roas: '∞',
      paybackPeriod: 0
    },
    {
      channel: 'Direct Traffic',
      spend: 0,
      revenue: 1056489,
      roi: '∞',
      cac: 0,
      ltv: 2380,
      customers: 892,
      roas: '∞',
      paybackPeriod: 0
    },
    {
      channel: 'Google Ads',
      spend: 21400,
      revenue: 813492,
      roi: 3801,
      cac: 31.14,
      ltv: 2290,
      customers: 687,
      roas: 38.01,
      paybackPeriod: 0.8
    },
    {
      channel: 'Facebook Ads',
      spend: 15600,
      revenue: 500439,
      roi: 3209,
      cac: 36.89,
      ltv: 2156,
      customers: 423,
      roas: 32.09,
      paybackPeriod: 1.1
    },
    {
      channel: 'Email Marketing',
      spend: 3200,
      revenue: 92156,
      roi: 2880,
      cac: 41.03,
      ltv: 2089,
      customers: 78,
      roas: 28.80,
      paybackPeriod: 1.3
    },
    {
      channel: 'Content Marketing',
      spend: 7300,
      revenue: 287234,
      roi: 3935,
      cac: 52.14,
      ltv: 2234,
      customers: 140,
      roas: 39.35,
      paybackPeriod: 1.6
    }
  ];

  const monthlyROI = [
    { month: 'Jan', spend: 6800, revenue: 339621, roi: 4994, customers: 287 },
    { month: 'Feb', spend: 7200, revenue: 404586, revenue: 5619, customers: 342 },
    { month: 'Mar', spend: 8100, revenue: 470834, roi: 5814, customers: 398 },
    { month: 'Apr', spend: 8900, revenue: 526635, roi: 5916, customers: 445 },
    { month: 'May', spend: 9200, revenue: 618729, roi: 6726, customers: 523 },
    { month: 'Jun', spend: 7300, revenue: 696787, roi: 9545, customers: 589 }
  ];

  const cohortAnalysis = [
    { cohort: 'Q1 2024', customers: 1027, initialRevenue: 1214981, month3Revenue: 1456789, month6Revenue: 1678923, ltv: 2340 },
    { cohort: 'Q4 2023', customers: 892, initialRevenue: 1056489, month3Revenue: 1267387, month6Revenue: 1489234, ltv: 2450 },
    { cohort: 'Q3 2023', customers: 756, initialRevenue: 894523, month3Revenue: 1073428, month6Revenue: 1267834, ltv: 2380 },
    { cohort: 'Q2 2023', customers: 634, initialRevenue: 750123, month3Revenue: 900148, month6Revenue: 1080177, ltv: 2290 }
  ];

  const campaignROI = [
    { campaign: 'Cave Exploration Summer 2024', spend: 8900, revenue: 156789, roi: 1762, customers: 142, cac: 62.68 },
    { campaign: 'Maya Ruins Discovery', spend: 6700, revenue: 124567, roi: 1859, customers: 89, cac: 75.28 },
    { campaign: 'Barrier Reef Adventures', spend: 7800, revenue: 178234, roi: 2285, customers: 167, cac: 46.71 },
    { campaign: 'Jungle Zip-line Experience', spend: 5400, revenue: 98765, roi: 1829, customers: 52, cac: 103.85 },
    { campaign: 'Placencia Beach Getaway', spend: 4500, revenue: 134567, roi: 2990, customers: 98, cac: 45.92 }
  ];

  const attributionAnalysis = {
    firstTouch: { percentage: 28.5, revenue: 1084723, channels: ['Organic Search', 'Direct', 'Social'] },
    lastTouch: { percentage: 42.3, revenue: 1608304, channels: ['Paid Search', 'Email', 'Direct'] },
    multiTouch: { percentage: 29.2, revenue: 1111475, channels: ['Multiple touchpoints', 'Cross-channel'] }
  };

  const getROIColor = (roi: number | string) => {
    if (roi === '∞') return 'text-green-600';
    const numROI = typeof roi === 'string' ? parseFloat(roi) : roi;
    if (numROI >= 500) return 'text-green-600';
    if (numROI >= 300) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <>
      <Helmet>
        <title>Marketing ROI - BelizeVibes Marketing Dashboard</title>
        <meta name="description" content="Comprehensive ROI analysis and attribution modeling for marketing investments" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Marketing ROI</h1>
            <p className="text-muted-foreground">
              Return on investment analysis and customer lifetime value tracking
            </p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export ROI Report
          </Button>
        </div>

        {/* ROI Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total ROI</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{roiOverview.totalROI}x</div>
              <div className="flex items-center text-xs">
                <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-green-600">{((roiOverview.totalROI - 1) * 100).toFixed(0)}% return</span>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customer LTV</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${roiOverview.customerLifetimeValue}</div>
              <p className="text-xs text-muted-foreground">
                ${roiOverview.customerAcquisitionCost} CAC
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">LTV:CAC Ratio</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {(roiOverview.customerLifetimeValue / roiOverview.customerAcquisitionCost).toFixed(1)}:1
              </div>
              <p className="text-xs text-muted-foreground">
                {roiOverview.paybackPeriod} months payback
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit per Customer</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${roiOverview.profitPerCustomer}</div>
              <p className="text-xs text-muted-foreground">
                {roiOverview.marginContribution}% margin
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Channel ROI Performance */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Channel ROI Performance</CardTitle>
            <CardDescription>
              Return on investment analysis by marketing channel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {channelROI.map((channel, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{channel.channel}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={`${typeof channel.roi === 'string' || channel.roi >= 500 ? 'bg-green-100 text-green-800' : channel.roi >= 300 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
                          {channel.roi === '∞' ? '∞' : `${(channel.roi / 100).toFixed(1)}x`} ROI
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Spend:</span>
                        <div className="font-medium">${channel.spend.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Revenue:</span>
                        <div className="font-medium">${channel.revenue.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Customers:</span>
                        <div className="font-medium">{channel.customers}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">CAC:</span>
                        <div className="font-medium">${channel.cac.toFixed(0)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">LTV:</span>
                        <div className="font-medium">${channel.ltv}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">ROAS:</span>
                        <div className={`font-medium ${getROIColor(channel.roas)}`}>
                          {channel.roas === '∞' ? '∞' : `${channel.roas}x`}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Payback:</span>
                        <div className="font-medium">{channel.paybackPeriod}m</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Campaign ROI Analysis */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Campaign ROI Analysis</CardTitle>
              <CardDescription>
                Individual campaign performance and profitability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaignROI.map((campaign, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm">{campaign.campaign}</h3>
                      <Badge className={`${campaign.roi >= 2000 ? 'bg-green-100 text-green-800' : campaign.roi >= 1500 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'} text-xs`}>
                        {(campaign.roi / 100).toFixed(1)}x ROI
                      </Badge>
                    </div>
                    <div className="grid grid-cols-5 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Spend: </span>
                        <span className="font-medium text-foreground">${campaign.spend.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Revenue: </span>
                        <span className="font-medium text-foreground">${campaign.revenue.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Customers: </span>
                        <span className="font-medium text-foreground">{campaign.customers}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">CAC: </span>
                        <span className="font-medium text-foreground">${campaign.cac.toFixed(0)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Profit: </span>
                        <span className="font-medium text-green-600">${(campaign.revenue - campaign.spend).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Attribution Analysis */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Attribution Analysis</CardTitle>
              <CardDescription>
                Revenue attribution across different touch points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-blue-900">First-Touch Attribution</h3>
                    <Badge className="bg-blue-100 text-blue-800">{attributionAnalysis.firstTouch.percentage}%</Badge>
                  </div>
                  <div className="text-2xl font-bold text-blue-900 mb-1">
                    ${attributionAnalysis.firstTouch.revenue.toLocaleString()}
                  </div>
                  <p className="text-sm text-blue-700">
                    Initial discovery channels driving awareness
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-green-900">Last-Touch Attribution</h3>
                    <Badge className="bg-green-100 text-green-800">{attributionAnalysis.lastTouch.percentage}%</Badge>
                  </div>
                  <div className="text-2xl font-bold text-green-900 mb-1">
                    ${attributionAnalysis.lastTouch.revenue.toLocaleString()}
                  </div>
                  <p className="text-sm text-green-700">
                    Final conversion channels closing sales
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-gradient-to-r from-orange-50 to-red-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-orange-900">Multi-Touch Attribution</h3>
                    <Badge className="bg-orange-100 text-orange-800">{attributionAnalysis.multiTouch.percentage}%</Badge>
                  </div>
                  <div className="text-2xl font-bold text-orange-900 mb-1">
                    ${attributionAnalysis.multiTouch.revenue.toLocaleString()}
                  </div>
                  <p className="text-sm text-orange-700">
                    Cross-channel customer journeys
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Lifetime Value Cohorts */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Customer Lifetime Value Cohorts</CardTitle>
            <CardDescription>
              LTV progression analysis by customer acquisition cohort
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cohortAnalysis.map((cohort, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{cohort.cohort}</h3>
                      <Badge className="bg-purple-100 text-purple-800">
                        {cohort.customers} customers
                      </Badge>
                    </div>
                    <div className="grid grid-cols-5 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Initial:</span>
                        <div className="font-medium">${cohort.initialRevenue.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Month 3:</span>
                        <div className="font-medium">${cohort.month3Revenue.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Month 6:</span>
                        <div className="font-medium">${cohort.month6Revenue.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Projected LTV:</span>
                        <div className="font-medium text-green-600">${cohort.ltv}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Growth:</span>
                        <div className="font-medium">
                          {(((cohort.month6Revenue - cohort.initialRevenue) / cohort.initialRevenue) * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly ROI Trends */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Monthly ROI Performance</CardTitle>
            <CardDescription>
              Historical ROI trends and investment efficiency over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {monthlyROI.map((month, index) => (
                <div key={index} className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-bold text-orange-600 mb-1">{month.month}</div>
                  <div className="text-sm text-muted-foreground mb-2">${month.spend.toLocaleString()} spend</div>
                  <div className="text-xl font-bold text-green-600 mb-1">
                    {(month.roi / 100).toFixed(1)}x
                  </div>
                  <div className="text-xs text-muted-foreground">{month.customers} customers</div>
                  <div className="text-xs text-muted-foreground">${month.revenue.toLocaleString()} revenue</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ROI Optimization Recommendations */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>ROI Optimization Opportunities</CardTitle>
            <CardDescription>
              Strategic recommendations to improve marketing return on investment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Increase Google Ads Budget</h4>
                  <p className="text-sm text-green-700">
                    38x ROAS suggests scaling up paid search investment by 50% could yield ${(813492 * 0.5).toLocaleString()} additional revenue.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Optimize Facebook Campaign Targeting</h4>
                  <p className="text-sm text-blue-700">
                    32x ROAS with opportunity to improve audience targeting and creative testing to reach 35x+ ROAS.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <Zap className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-900">Expand High-LTV Customer Segments</h4>
                  <p className="text-sm text-orange-700">
                    Q4 2023 cohort shows ${attributionAnalysis.firstTouch.revenue.toLocaleString()} higher LTV - target similar demographics for better long-term ROI.
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

export default MarketingROI;