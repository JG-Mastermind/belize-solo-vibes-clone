import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, TrendingDown, DollarSign, Users, Eye, MousePointer, Plus } from 'lucide-react';

const MarketingCampaigns: React.FC = () => {
  const campaignOverview = {
    totalCampaigns: 12,
    activeCampaigns: 8,
    totalBudget: 15000,
    spentBudget: 11250,
    totalImpressions: 245670,
    totalClicks: 12834,
    totalConversions: 486,
    averageCTR: 5.2,
    averageCPC: 0.87,
    averageROAS: 4.2
  };

  const campaigns = [
    {
      id: '1',
      name: 'Belize Cave Exploration - Summer 2024',
      status: 'active',
      budget: 3500,
      spent: 2890,
      impressions: 68420,
      clicks: 3564,
      conversions: 142,
      ctr: 5.2,
      cpc: 0.81,
      roas: 4.8,
      channel: 'Google Ads',
      startDate: '2024-03-01',
      endDate: '2024-08-31'
    },
    {
      id: '2',
      name: 'Maya Ruins Discovery Experience',
      status: 'active',
      budget: 2800,
      spent: 2156,
      impressions: 45230,
      clicks: 2389,
      conversions: 89,
      ctr: 5.3,
      cpc: 0.90,
      roas: 3.9,
      channel: 'Facebook Ads',
      startDate: '2024-02-15',
      endDate: '2024-06-30'
    },
    {
      id: '3',
      name: 'Barrier Reef Snorkeling Adventure',
      status: 'active',
      budget: 4200,
      spent: 3345,
      impressions: 78450,
      clicks: 4123,
      conversions: 167,
      ctr: 5.3,
      cpc: 0.81,
      roas: 5.1,
      channel: 'Instagram Ads',
      startDate: '2024-01-10',
      endDate: '2024-07-10'
    },
    {
      id: '4',
      name: 'Jungle Zip-Line Eco Tours',
      status: 'paused',
      budget: 1500,
      spent: 1200,
      impressions: 28340,
      clicks: 1456,
      conversions: 52,
      ctr: 5.1,
      cpc: 0.82,
      roas: 3.2,
      channel: 'YouTube Ads',
      startDate: '2024-03-01',
      endDate: '2024-05-31'
    },
    {
      id: '5',
      name: 'Placencia Beach Getaway',
      status: 'completed',
      budget: 2200,
      spent: 2200,
      impressions: 52430,
      clicks: 2834,
      conversions: 98,
      ctr: 5.4,
      cpc: 0.78,
      roas: 4.6,
      channel: 'TikTok Ads',
      startDate: '2024-01-01',
      endDate: '2024-03-31'
    }
  ];

  const channelPerformance = [
    { channel: 'Google Ads', campaigns: 3, budget: 8200, spent: 6890, conversions: 234, roas: 4.5 },
    { channel: 'Facebook Ads', campaigns: 3, budget: 4500, spent: 3456, conversions: 156, roas: 4.2 },
    { channel: 'Instagram Ads', campaigns: 2, budget: 5200, spent: 4234, conversions: 189, roas: 4.8 },
    { channel: 'YouTube Ads', campaigns: 2, budget: 2800, spent: 2156, conversions: 78, roas: 3.8 },
    { channel: 'TikTok Ads', campaigns: 2, budget: 3100, spent: 2890, conversions: 134, roas: 4.3 }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const budgetUsagePercentage = (campaignOverview.spentBudget / campaignOverview.totalBudget) * 100;

  return (
    <>
      <Helmet>
        <title>Campaign Performance - BelizeVibes Marketing Dashboard</title>
        <meta name="description" content="Monitor and analyze marketing campaign performance across all channels" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Campaign Performance</h1>
            <p className="text-muted-foreground">
              Track marketing campaigns, budgets, and performance across all channels
            </p>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>

        {/* Campaign Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaignOverview.totalCampaigns}</div>
              <p className="text-xs text-muted-foreground">
                {campaignOverview.activeCampaigns} active
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${campaignOverview.totalBudget.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                ${campaignOverview.spentBudget.toLocaleString()} spent ({budgetUsagePercentage.toFixed(1)}%)
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaignOverview.totalClicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {campaignOverview.averageCTR}% avg CTR
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaignOverview.totalConversions}</div>
              <p className="text-xs text-muted-foreground">
                ${campaignOverview.averageCPC.toFixed(2)} avg CPC
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average ROAS</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaignOverview.averageROAS}x</div>
              <p className="text-xs text-green-600">
                Return on Ad Spend
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Channel Performance */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Channel Performance</CardTitle>
            <CardDescription>
              Performance breakdown by advertising channel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {channelPerformance.map((channel, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{channel.channel}</h3>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {channel.campaigns} campaigns
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          {channel.roas}x ROAS
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Budget:</span>
                        <div className="font-medium">${channel.budget.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Spent:</span>
                        <div className="font-medium">${channel.spent.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Conversions:</span>
                        <div className="font-medium">{channel.conversions}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Usage:</span>
                        <div className="font-medium">{((channel.spent / channel.budget) * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Progress value={(channel.spent / channel.budget) * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Campaigns */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>
              Detailed performance metrics for all campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{campaign.name}</h3>
                      {getStatusBadge(campaign.status)}
                      <Badge variant="outline" className="text-xs">
                        {campaign.channel}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-6 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Budget:</span>
                        <div className="font-medium">${campaign.budget}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Spent:</span>
                        <div className="font-medium">${campaign.spent}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Clicks:</span>
                        <div className="font-medium">{campaign.clicks.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Conversions:</span>
                        <div className="font-medium">{campaign.conversions}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">CTR:</span>
                        <div className="font-medium">{campaign.ctr}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">ROAS:</span>
                        <div className={`font-medium ${campaign.roas >= 4 ? 'text-green-600' : campaign.roas >= 3 ? 'text-orange-600' : 'text-red-600'}`}>
                          {campaign.roas}x
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{campaign.startDate} - {campaign.endDate}</span>
                        <span>CPC: ${campaign.cpc}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {campaign.status === 'active' && (
                          <Button variant="outline" size="sm">
                            Edit Campaign
                          </Button>
                        )}
                      </div>
                    </div>

                    <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
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

export default MarketingCampaigns;