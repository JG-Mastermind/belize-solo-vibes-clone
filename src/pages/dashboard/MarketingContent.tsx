import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Eye, TrendingUp, Clock, Share2, Heart, MessageSquare, Globe, Zap, Download } from 'lucide-react';

const MarketingContent: React.FC = () => {
  const contentOverview = {
    totalContent: 156,
    totalViews: 234567,
    avgEngagementRate: 7.8,
    totalShares: 12456,
    avgReadTime: 4.2,
    bounceRate: 28.5,
    conversionRate: 3.4,
    seoScore: 85
  };

  const topContent = [
    {
      title: 'Ultimate Guide to Belize Cave Exploration',
      type: 'Blog Post',
      views: 23456,
      engagement: 12.4,
      shares: 567,
      readTime: '6:32',
      conversionRate: 4.8,
      language: 'EN',
      aiGenerated: false,
      publishDate: '2024-02-15'
    },
    {
      title: 'Maya Ruins: Hidden Treasures of Ancient Belize',
      type: 'Blog Post',
      views: 18934,
      engagement: 10.2,
      shares: 423,
      readTime: '5:45',
      conversionRate: 5.2,
      language: 'EN',
      aiGenerated: true,
      publishDate: '2024-03-01'
    },
    {
      title: 'Blue Hole Diving: Complete Adventure Guide',
      type: 'Adventure Page',
      views: 16725,
      engagement: 15.8,
      shares: 734,
      readTime: '4:12',
      conversionRate: 8.9,
      language: 'EN',
      aiGenerated: false,
      publishDate: '2024-01-20'
    },
    {
      title: 'Guide des Grottes du Belize',
      type: 'Blog Post',
      views: 8934,
      engagement: 9.7,
      shares: 234,
      readTime: '6:18',
      conversionRate: 4.1,
      language: 'FR',
      aiGenerated: true,
      publishDate: '2024-02-20'
    },
    {
      title: 'Jungle Zip-Line Adventures',
      type: 'Adventure Page',
      views: 14567,
      engagement: 13.2,
      shares: 445,
      readTime: '3:45',
      conversionRate: 7.3,
      language: 'EN',
      aiGenerated: false,
      publishDate: '2024-01-10'
    }
  ];

  const contentPerformanceByType = [
    { type: 'Adventure Pages', count: 24, avgViews: 15623, avgEngagement: 14.2, avgConversion: 7.8 },
    { type: 'Blog Posts (Manual)', count: 45, avgViews: 8934, avgEngagement: 9.4, avgConversion: 3.8 },
    { type: 'Blog Posts (AI)', count: 67, avgViews: 12456, avgEngagement: 11.2, avgConversion: 4.2 },
    { type: 'Landing Pages', count: 12, avgViews: 6789, avgEngagement: 8.7, avgConversion: 6.4 },
    { type: 'About/Info Pages', count: 8, avgViews: 4523, avgEngagement: 6.1, avgConversion: 2.1 }
  ];

  const aiVsManualContent = {
    ai: {
      count: 89,
      totalViews: 145678,
      avgViews: 1638,
      avgEngagement: 10.8,
      avgConversion: 4.1,
      avgReadTime: 4.6,
      productionTime: '15 min',
      costPerPiece: '$12'
    },
    manual: {
      count: 67,
      totalViews: 88889,
      avgViews: 1327,
      avgEngagement: 8.9,
      avgConversion: 3.7,
      avgReadTime: 5.1,
      productionTime: '3.5 hours',
      costPerPiece: '$150'
    }
  };

  const languagePerformance = [
    { language: 'English', code: 'EN', content: 124, views: 189456, engagement: 8.2, conversion: 3.6, flag: '🇺🇸' },
    { language: 'French (CA)', code: 'FR', content: 32, views: 45111, engagement: 6.8, conversion: 2.9, flag: '🇨🇦' }
  ];

  const seoMetrics = [
    { metric: 'Avg Page Load Speed', value: '2.1s', status: 'good', target: '< 3s' },
    { metric: 'Mobile-Friendly Score', value: '95%', status: 'excellent', target: '> 90%' },
    { metric: 'Core Web Vitals', value: '89%', status: 'good', target: '> 75%' },
    { metric: 'Avg Keyword Ranking', value: '#12', status: 'good', target: 'Top 10' },
    { metric: 'Organic Click Rate', value: '4.2%', status: 'good', target: '> 3%' }
  ];

  const dalleImagePerformance = [
    { content: 'Cave Exploration Blog', views: 23456, engagement: 14.2, aiImages: 4, clickRate: 8.9 },
    { content: 'Maya Ruins Guide', views: 18934, engagement: 12.8, aiImages: 3, clickRate: 7.3 },
    { content: 'Zip-line Adventure', views: 16725, engagement: 15.1, aiImages: 5, clickRate: 9.4 },
    { content: 'Snorkeling Tours', views: 14567, engagement: 11.6, aiImages: 3, clickRate: 6.8 },
    { content: 'Wildlife Safari', views: 12456, engagement: 13.4, aiImages: 4, clickRate: 8.1 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'warning': return 'text-orange-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <>
      <Helmet>
        <title>Content Performance - BelizeVibes Marketing Dashboard</title>
        <meta name="description" content="Analyze content performance, engagement metrics, and AI vs manual content effectiveness" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Content Performance</h1>
            <p className="text-muted-foreground">
              Comprehensive analysis of content engagement, AI vs manual performance, and multilingual effectiveness
            </p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Content Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Content</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contentOverview.totalContent}</div>
              <p className="text-xs text-muted-foreground">
                {contentOverview.totalViews.toLocaleString()} total views
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contentOverview.avgEngagementRate}%</div>
              <div className="flex items-center text-xs">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-green-600">+2.1% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Read Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contentOverview.avgReadTime}min</div>
              <p className="text-xs text-muted-foreground">
                {contentOverview.bounceRate}% bounce rate
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contentOverview.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                {contentOverview.totalShares.toLocaleString()} total shares
              </p>
            </CardContent>
          </Card>
        </div>

        {/* AI vs Manual Content Performance */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>AI vs Manual Content Performance</CardTitle>
            <CardDescription>
              Comparative analysis of AI-generated vs manually created content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-2">
              {/* AI Content Stats */}
              <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-blue-900">AI-Generated Content</h3>
                  <Badge className="bg-blue-100 text-blue-800">{aiVsManualContent.ai.count} pieces</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Total Views:</span>
                    <div className="font-bold text-blue-900">{aiVsManualContent.ai.totalViews.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-blue-700">Avg Engagement:</span>
                    <div className="font-bold text-blue-900">{aiVsManualContent.ai.avgEngagement}%</div>
                  </div>
                  <div>
                    <span className="text-blue-700">Conversion:</span>
                    <div className="font-bold text-blue-900">{aiVsManualContent.ai.avgConversion}%</div>
                  </div>
                  <div>
                    <span className="text-blue-700">Production Time:</span>
                    <div className="font-bold text-blue-900">{aiVsManualContent.ai.productionTime}</div>
                  </div>
                  <div>
                    <span className="text-blue-700">Cost per Piece:</span>
                    <div className="font-bold text-blue-900">{aiVsManualContent.ai.costPerPiece}</div>
                  </div>
                  <div>
                    <span className="text-blue-700">Read Time:</span>
                    <div className="font-bold text-blue-900">{aiVsManualContent.ai.avgReadTime}min</div>
                  </div>
                </div>
              </div>

              {/* Manual Content Stats */}
              <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium text-green-900">Manual Content</h3>
                  <Badge className="bg-green-100 text-green-800">{aiVsManualContent.manual.count} pieces</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-green-700">Total Views:</span>
                    <div className="font-bold text-green-900">{aiVsManualContent.manual.totalViews.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-green-700">Avg Engagement:</span>
                    <div className="font-bold text-green-900">{aiVsManualContent.manual.avgEngagement}%</div>
                  </div>
                  <div>
                    <span className="text-green-700">Conversion:</span>
                    <div className="font-bold text-green-900">{aiVsManualContent.manual.avgConversion}%</div>
                  </div>
                  <div>
                    <span className="text-green-700">Production Time:</span>
                    <div className="font-bold text-green-900">{aiVsManualContent.manual.productionTime}</div>
                  </div>
                  <div>
                    <span className="text-green-700">Cost per Piece:</span>
                    <div className="font-bold text-green-900">{aiVsManualContent.manual.costPerPiece}</div>
                  </div>
                  <div>
                    <span className="text-green-700">Read Time:</span>
                    <div className="font-bold text-green-900">{aiVsManualContent.manual.avgReadTime}min</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Performing Content */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Top Performing Content</CardTitle>
              <CardDescription>
                Best performing content pieces by engagement and conversion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topContent.map((content, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm">{content.title}</h3>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {content.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {content.language}
                        </Badge>
                        {content.aiGenerated && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            AI
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                      <div>
                        <span>Views: </span>
                        <span className="font-medium text-foreground">{content.views.toLocaleString()}</span>
                      </div>
                      <div>
                        <span>Engagement: </span>
                        <span className="font-medium text-foreground">{content.engagement}%</span>
                      </div>
                      <div>
                        <span>Shares: </span>
                        <span className="font-medium text-foreground">{content.shares}</span>
                      </div>
                      <div>
                        <span>Conv: </span>
                        <span className="font-medium text-foreground">{content.conversionRate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Language Performance */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Multilingual Content Performance</CardTitle>
              <CardDescription>
                English vs French Canadian content effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {languagePerformance.map((lang, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <div>
                        <h3 className="font-medium">{lang.language}</h3>
                        <p className="text-sm text-muted-foreground">{lang.content} pieces of content</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Views:</span>
                        <div className="font-medium">{lang.views.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Engagement:</span>
                        <div className="font-medium">{lang.engagement}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Conversion:</span>
                        <div className="font-medium">{lang.conversion}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg/Piece:</span>
                        <div className="font-medium">{Math.round(lang.views / lang.content).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* DALL-E Image Performance */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>DALL-E Generated Image Performance</CardTitle>
            <CardDescription>
              Engagement metrics for AI-generated images vs stock photos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dalleImagePerformance.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{item.content}</span>
                      <Badge className="bg-purple-100 text-purple-800 text-xs">
                        {item.aiImages} AI images
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span>Views: </span>
                        <span className="font-medium text-foreground">{item.views.toLocaleString()}</span>
                      </div>
                      <div>
                        <span>Engagement: </span>
                        <span className="font-medium text-foreground">{item.engagement}%</span>
                      </div>
                      <div>
                        <span>Image Click Rate: </span>
                        <span className="font-medium text-foreground">{item.clickRate}%</span>
                      </div>
                      <div>
                        <span>Performance: </span>
                        <span className={`font-medium ${item.clickRate > 8 ? 'text-green-600' : item.clickRate > 6 ? 'text-orange-600' : 'text-red-600'}`}>
                          {item.clickRate > 8 ? 'Excellent' : item.clickRate > 6 ? 'Good' : 'Poor'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SEO Performance */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>SEO Performance Metrics</CardTitle>
            <CardDescription>
              Technical SEO health and organic search performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {seoMetrics.map((metric, index) => (
                <div key={index} className="text-center p-4 border rounded-lg">
                  <h3 className="font-medium text-sm mb-2">{metric.metric}</h3>
                  <div className={`text-2xl font-bold ${getStatusColor(metric.status)} mb-1`}>
                    {metric.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Target: {metric.target}
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

export default MarketingContent;