import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users2, TrendingUp, DollarSign, Target, UserPlus, Mail, Phone, Download } from 'lucide-react';

const MarketingLeads: React.FC = () => {
  const leadOverview = {
    totalLeads: 2456,
    qualifiedLeads: 1834,
    convertedLeads: 687,
    leadConversionRate: 37.4,
    avgLeadValue: 285,
    costPerLead: 45,
    leadVelocity: 24.5,
    qualificationRate: 74.7
  };

  const leadSources = [
    { source: 'Organic Search', leads: 892, qualified: 734, converted: 287, cost: 0, cpl: 0, conversionRate: 39.1 },
    { source: 'Paid Search', leads: 567, qualified: 445, converted: 189, cost: 12400, cpl: 21.87, conversionRate: 42.5 },
    { source: 'Social Media', leads: 423, qualified: 298, converted: 98, cost: 8900, cpl: 21.04, conversionRate: 32.9 },
    { source: 'Email Campaigns', leads: 287, qualified: 234, converted: 78, cost: 2800, cpl: 9.76, conversionRate: 33.3 },
    { source: 'Content Marketing', leads: 189, qualified: 123, converted: 35, cost: 5600, cpl: 29.63, conversionRate: 28.5 },
    { source: 'Referrals', leads: 98, qualified: 87, converted: 45, cost: 0, cpl: 0, conversionRate: 51.7 }
  ];

  const leadFunnel = [
    { stage: 'Website Visitors', count: 89456, percentage: 100, conversionRate: 2.7 },
    { stage: 'Form Submissions', count: 2456, percentage: 2.7, conversionRate: 74.7 },
    { stage: 'Marketing Qualified Leads', count: 1834, percentage: 74.7, conversionRate: 52.3 },
    { stage: 'Sales Qualified Leads', count: 959, percentage: 52.3, conversionRate: 71.6 },
    { stage: 'Opportunities', count: 687, percentage: 71.6, conversionRate: 45.8 },
    { stage: 'Bookings', count: 314, percentage: 45.8, conversionRate: 100 }
  ];

  const leadQuality = [
    { criteria: 'Budget Qualified', percentage: 78.5, color: 'bg-green-500' },
    { criteria: 'Authority Confirmed', percentage: 65.3, color: 'bg-blue-500' },
    { criteria: 'Need Identified', percentage: 82.1, color: 'bg-orange-500' },
    { criteria: 'Timeline Established', percentage: 71.4, color: 'bg-purple-500' },
    { criteria: 'Complete Profile', percentage: 69.8, color: 'bg-teal-500' }
  ];

  const abandonedBookings = [
    { stage: 'Adventure Selection', count: 456, percentage: 34.2, recoveryRate: 28.5 },
    { stage: 'Guest Information', count: 234, percentage: 17.5, recoveryRate: 42.3 },
    { stage: 'Date Selection', count: 189, percentage: 14.1, recoveryRate: 35.4 },
    { stage: 'Payment Page', count: 167, percentage: 12.5, recoveryRate: 65.8 },
    { stage: 'Final Confirmation', count: 89, percentage: 6.7, recoveryRate: 78.9 }
  ];

  const leadsByDemographic = [
    { demographic: 'Age 25-34', count: 689, percentage: 28.1, avgValue: 320 },
    { demographic: 'Age 35-44', count: 612, percentage: 24.9, avgValue: 385 },
    { demographic: 'Age 45-54', count: 478, percentage: 19.5, avgValue: 290 },
    { demographic: 'Age 18-24', count: 367, percentage: 14.9, avgValue: 245 },
    { demographic: 'Age 55+', count: 310, percentage: 12.6, avgValue: 195 }
  ];

  return (
    <>
      <Helmet>
        <title>Lead Generation - BelizeVibes Marketing Dashboard</title>
        <meta name="description" content="Track lead generation performance and conversion metrics" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lead Generation</h1>
            <p className="text-muted-foreground">
              Monitor lead acquisition, qualification, and conversion performance
            </p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Leads
          </Button>
        </div>

        {/* Lead Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leadOverview.totalLeads.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {leadOverview.qualifiedLeads} qualified ({leadOverview.qualificationRate}%)
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leadOverview.leadConversionRate}%</div>
              <div className="flex items-center text-xs">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-green-600">+5.2% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cost Per Lead</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${leadOverview.costPerLead}</div>
              <p className="text-xs text-muted-foreground">
                ${leadOverview.avgLeadValue} avg lead value
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lead Velocity</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leadOverview.leadVelocity} days</div>
              <p className="text-xs text-muted-foreground">
                Average time to conversion
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lead Sources Performance */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Lead Sources Performance</CardTitle>
            <CardDescription>
              Lead generation and conversion by traffic source
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leadSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{source.source}</h3>
                      <Badge className={`${source.conversionRate >= 40 ? 'bg-green-100 text-green-800' : source.conversionRate >= 30 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
                        {source.conversionRate}% CR
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-6 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Leads:</span>
                        <div className="font-medium">{source.leads}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Qualified:</span>
                        <div className="font-medium">{source.qualified}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Converted:</span>
                        <div className="font-medium">{source.converted}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Spend:</span>
                        <div className="font-medium">${source.cost.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">CPL:</span>
                        <div className="font-medium">${source.cpl.toFixed(2)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">ROI:</span>
                        <div className={`font-medium ${source.cost === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                          {source.cost === 0 ? '∞' : `${((source.converted * 285 - source.cost) / source.cost * 100).toFixed(0)}%`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Lead Conversion Funnel */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Lead Conversion Funnel</CardTitle>
              <CardDescription>
                Step-by-step lead progression and drop-off analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leadFunnel.map((stage, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{stage.stage}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{stage.count.toLocaleString()}</span>
                        {index > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {stage.conversionRate}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Progress value={stage.percentage} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {stage.percentage}% of previous stage
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lead Quality Metrics */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Lead Quality Analysis</CardTitle>
              <CardDescription>
                Quality assessment based on BANT criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leadQuality.map((criteria, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{criteria.criteria}</span>
                      <span className="text-sm">{criteria.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${criteria.color}`}
                        style={{ width: `${criteria.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Abandoned Booking Recovery */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Abandoned Booking Recovery</CardTitle>
            <CardDescription>
              Analysis of booking abandonment and recovery opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {abandonedBookings.map((stage, index) => (
                <div key={index} className="p-4 border rounded-lg text-center">
                  <h3 className="font-medium text-sm mb-2">{stage.stage}</h3>
                  <div className="text-2xl font-bold text-red-600 mb-1">{stage.count}</div>
                  <div className="text-xs text-muted-foreground mb-2">{stage.percentage}% of total</div>
                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    {stage.recoveryRate}% recoverable
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lead Demographics */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Lead Demographics</CardTitle>
            <CardDescription>
              Lead distribution and value by demographic segments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leadsByDemographic.map((demo, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{demo.demographic}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{demo.count} leads</span>
                        <Badge variant="outline" className="text-xs">
                          ${demo.avgValue} avg
                        </Badge>
                      </div>
                    </div>
                    <Progress value={demo.percentage} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      {demo.percentage}% of total leads
                    </div>
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

export default MarketingLeads;