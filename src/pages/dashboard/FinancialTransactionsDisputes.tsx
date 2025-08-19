import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldAlert, AlertTriangle, CheckCircle, Clock, XCircle, RefreshCw, Eye, MessageSquare, DollarSign, Shield, Bell } from 'lucide-react';

const FinancialTransactionsDisputes: React.FC = () => {
  // Mock data for Belize tourism dispute management
  const disputeStats = {
    totalDisputes: 23,
    activeChargebacks: 8,
    resolvedDisputes: 15,
    pendingRefunds: 12,
    fraudAlerts: 3,
    disputeRate: 0.46, // percentage
    avgResolutionTime: 4.2 // days
  };

  const chargebacks = [
    {
      id: 'CB_2024_0008',
      customer: 'Jennifer W.',
      adventure: 'Blue Hole Diving Experience',
      amount: 285.00,
      reason: 'Service Not Provided',
      status: 'disputed',
      filed: '2024-03-15',
      deadline: '2024-03-29',
      evidence: 'submitted',
      riskLevel: 'medium'
    },
    {
      id: 'CB_2024_0007',
      customer: 'Michael R.',
      adventure: 'ATM Cave Sacred Journey',
      amount: 350.00,
      reason: 'Unauthorized Transaction',
      status: 'investigating',
      filed: '2024-03-14',
      deadline: '2024-03-28',
      evidence: 'pending',
      riskLevel: 'high'
    },
    {
      id: 'CB_2024_0006',
      customer: 'Lisa M.',
      adventure: 'Caracol Maya Ruins Tour',
      amount: 420.00,
      reason: 'Duplicate Charge',
      status: 'won',
      filed: '2024-03-10',
      deadline: '2024-03-24',
      evidence: 'accepted',
      riskLevel: 'low'
    }
  ];

  const refundRequests = [
    {
      id: 'RF_2024_0012',
      customer: 'Sarah J.',
      adventure: 'Hummingbird Highway Wildlife Tour',
      amount: 165.00,
      reason: 'Weather Cancellation',
      status: 'approved',
      requested: '2024-03-18',
      processed: null,
      method: 'original',
      priority: 'normal'
    },
    {
      id: 'RF_2024_0011',
      customer: 'David L.',
      adventure: 'Placencia Beach Snorkel',
      amount: 195.00,
      reason: 'Medical Emergency',
      status: 'processing',
      requested: '2024-03-17',
      processed: null,
      method: 'original',
      priority: 'high'
    },
    {
      id: 'RF_2024_0010',
      customer: 'Emma K.',
      adventure: 'Lamanai Temple Safari',
      amount: 270.00,
      reason: 'Booking Error',
      status: 'review',
      requested: '2024-03-16',
      processed: null,
      method: 'store_credit',
      priority: 'low'
    }
  ];

  const fraudAlerts = [
    {
      id: 'FR_2024_0003',
      type: 'Suspicious Pattern',
      description: 'Multiple failed attempts from same IP',
      severity: 'high',
      ipAddress: '192.168.1.100',
      attempts: 12,
      timestamp: '2024-03-19T09:15:00Z',
      action: 'blocked'
    },
    {
      id: 'FR_2024_0002',
      type: 'Velocity Check Failed',
      description: 'Multiple bookings in short timeframe',
      severity: 'medium',
      ipAddress: '10.0.0.45',
      attempts: 6,
      timestamp: '2024-03-18T14:22:00Z',
      action: 'monitoring'
    },
    {
      id: 'FR_2024_0001',
      type: 'Geographic Mismatch',
      description: 'Card issued in US, booking from suspicious location',
      severity: 'low',
      ipAddress: '203.45.67.89',
      attempts: 1,
      timestamp: '2024-03-17T11:08:00Z',
      action: 'flagged'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'won':
      case 'approved':
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'disputed':
      case 'investigating':
      case 'review':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'lost':
      case 'denied':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'won':
      case 'approved':
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Resolved</Badge>;
      case 'disputed':
      case 'investigating':
      case 'review':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'lost':
      case 'denied':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Lost</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Processing</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 border-red-200">High Risk</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium Risk</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Low Risk</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <>
      <Helmet>
        <title>Dispute Management - BelizeVibes Financial Transactions</title>
        <meta name="description" content="Manage chargebacks, refunds, and fraud detection for Belize tourism operations" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dispute Management</h1>
            <p className="text-muted-foreground">
              Chargeback monitoring, refund processing, and fraud detection for Belize adventures
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Bell className="w-4 h-4 mr-2" />
              Alert Settings
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Shield className="w-4 h-4 mr-2" />
              Security Report
            </Button>
          </div>
        </div>

        {/* Dispute Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Chargebacks</CardTitle>
              <ShieldAlert className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{disputeStats.activeChargebacks}</div>
              <p className="text-xs text-muted-foreground">
                {disputeStats.disputeRate}% of total transactions
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Refunds</CardTitle>
              <RefreshCw className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{disputeStats.pendingRefunds}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting processing
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fraud Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{disputeStats.fraudAlerts}</div>
              <p className="text-xs text-muted-foreground">
                Suspicious activity detected
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{disputeStats.avgResolutionTime} days</div>
              <p className="text-xs text-muted-foreground">
                Industry average: 7.5 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Active Chargebacks */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Active Chargebacks</CardTitle>
            <CardDescription>
              Current chargeback cases requiring attention and evidence submission
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chargebacks.map((chargeback) => (
                <div
                  key={chargeback.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(chargeback.status)}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{chargeback.customer}</span>
                        {getStatusBadge(chargeback.status)}
                        {getRiskBadge(chargeback.riskLevel)}
                      </div>
                      <div className="text-sm text-muted-foreground">{chargeback.adventure}</div>
                      <div className="text-xs text-muted-foreground">
                        {chargeback.reason} • Filed: {chargeback.filed} • Deadline: {chargeback.deadline}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right space-y-1">
                      <div className="font-medium">{formatCurrency(chargeback.amount)}</div>
                      <div className="text-sm text-muted-foreground">Evidence: {chargeback.evidence}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Respond
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Refund Requests */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Refund Requests</CardTitle>
              <CardDescription>
                Pending and processed refund requests from customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {refundRequests.map((refund) => (
                  <div
                    key={refund.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(refund.status)}
                      <div>
                        <div className="font-medium">{refund.customer}</div>
                        <div className="text-sm text-muted-foreground">{refund.adventure}</div>
                        <div className="text-xs text-muted-foreground">
                          {refund.reason} • {refund.requested}
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-medium">{formatCurrency(refund.amount)}</div>
                      <div className="text-xs text-muted-foreground">{refund.method}</div>
                      <Badge 
                        variant="outline"
                        className={
                          refund.priority === 'high' ? 'border-red-600 text-red-600' :
                          refund.priority === 'normal' ? 'border-yellow-600 text-yellow-600' :
                          'border-green-600 text-green-600'
                        }
                      >
                        {refund.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fraud Detection */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Fraud Alerts</CardTitle>
              <CardDescription>
                Recent suspicious activity and fraud prevention alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fraudAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className={`w-4 h-4 ${
                        alert.severity === 'high' ? 'text-red-600' :
                        alert.severity === 'medium' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`} />
                      <div>
                        <div className="font-medium">{alert.type}</div>
                        <div className="text-sm text-muted-foreground">{alert.description}</div>
                        <div className="text-xs text-muted-foreground">
                          IP: {alert.ipAddress} • {alert.attempts} attempts
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge 
                        variant="outline"
                        className={
                          alert.severity === 'high' ? 'border-red-600 text-red-600' :
                          alert.severity === 'medium' ? 'border-yellow-600 text-yellow-600' :
                          'border-blue-600 text-blue-600'
                        }
                      >
                        {alert.severity}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        Action: {alert.action}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Recovery Analysis */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Payment Recovery Analysis</CardTitle>
            <CardDescription>
              Failed payment recovery attempts and success rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">18</div>
                <div className="text-sm text-muted-foreground">Failed Payments</div>
                <div className="text-xs text-muted-foreground mt-1">Last 7 days</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-sm text-muted-foreground">Recovered</div>
                <div className="text-xs text-muted-foreground mt-1">66.7% success rate</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(3240)}</div>
                <div className="text-sm text-muted-foreground">Recovered Value</div>
                <div className="text-xs text-muted-foreground mt-1">Additional revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default FinancialTransactionsDisputes;