import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, CheckCircle, XCircle, Clock, Smartphone, Wallet, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

const FinancialTransactionsProcessing: React.FC = () => {
  // Mock data for Belize tourism payment processing
  const paymentStats = {
    totalTransactions: 1847,
    successfulPayments: 1785,
    failedPayments: 62,
    totalVolume: 892450.75,
    avgTransactionValue: 483.25,
    dailyGrowth: 12.5
  };

  const paymentMethods = [
    { type: 'Credit Card', count: 1285, percentage: 72, fees: 18750.50 },
    { type: 'Digital Wallet', count: 340, percentage: 19, fees: 4890.25 },
    { type: 'Bank Transfer', count: 160, percentage: 9, fees: 2240.75 }
  ];

  const recentTransactions = [
    {
      id: 'TX_2024_1847',
      customer: 'Sarah M.',
      adventure: 'Blue Hole Diving Experience',
      amount: 285.00,
      method: 'Visa •••• 4532',
      status: 'completed',
      fee: 8.55,
      timestamp: '2024-03-19T14:32:00Z',
      location: 'Belize City'
    },
    {
      id: 'TX_2024_1846',
      customer: 'David L.',
      adventure: 'Caracol Maya Ruins & Cave Tubing',
      amount: 420.00,
      method: 'PayPal',
      status: 'completed',
      fee: 12.60,
      timestamp: '2024-03-19T13:45:00Z',
      location: 'San Ignacio'
    },
    {
      id: 'TX_2024_1845',
      customer: 'Maria G.',
      adventure: 'Hummingbird Highway Wildlife Tour',
      amount: 165.00,
      method: 'Mastercard •••• 8901',
      status: 'failed',
      fee: 0.00,
      timestamp: '2024-03-19T12:18:00Z',
      location: 'Hopkins'
    },
    {
      id: 'TX_2024_1844',
      customer: 'James R.',
      adventure: 'Placencia Peninsula Beach & Snorkel',
      amount: 195.00,
      method: 'Apple Pay',
      status: 'processing',
      fee: 5.85,
      timestamp: '2024-03-19T11:22:00Z',
      location: 'Placencia'
    },
    {
      id: 'TX_2024_1843',
      customer: 'Anna K.',
      adventure: 'ATM Cave Sacred Journey',
      amount: 350.00,
      method: 'Visa •••• 2187',
      status: 'completed',
      fee: 10.50,
      timestamp: '2024-03-19T10:15:00Z',
      location: 'San Ignacio'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Processing</Badge>;
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
        <title>Payment Processing - BelizeVibes Financial Transactions</title>
        <meta name="description" content="Monitor real-time payment processing and transaction status for Belize tourism adventures" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payment Processing</h1>
            <p className="text-muted-foreground">
              Real-time payment status and transaction monitoring for Belize adventures
            </p>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <DollarSign className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Payment Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volume (24h)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(paymentStats.totalVolume)}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3 inline mr-1 text-green-600" />
                +{paymentStats.dailyGrowth}% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful Payments</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{paymentStats.successfulPayments}</div>
              <p className="text-xs text-muted-foreground">
                {((paymentStats.successfulPayments / paymentStats.totalTransactions) * 100).toFixed(1)}% success rate
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{paymentStats.failedPayments}</div>
              <p className="text-xs text-muted-foreground">
                {((paymentStats.failedPayments / paymentStats.totalTransactions) * 100).toFixed(1)}% failure rate
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(paymentStats.avgTransactionValue)}</div>
              <p className="text-xs text-muted-foreground">
                Per Belize adventure booking
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods Breakdown */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Payment Methods & Fees</CardTitle>
            <CardDescription>
              Transaction distribution by payment method and associated processing fees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethods.map((method, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {method.type === 'Credit Card' && <CreditCard className="w-5 h-5 text-blue-600" />}
                      {method.type === 'Digital Wallet' && <Smartphone className="w-5 h-5 text-purple-600" />}
                      {method.type === 'Bank Transfer' && <Wallet className="w-5 h-5 text-green-600" />}
                      <span className="font-medium">{method.type}</span>
                    </div>
                    <Badge variant="outline">{method.percentage}%</Badge>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="font-medium">{method.count} transactions</div>
                      <div className="text-sm text-muted-foreground">Processing fees: {formatCurrency(method.fees)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Latest payment transactions for Belize adventure bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(transaction.status)}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{transaction.customer}</span>
                        {getStatusBadge(transaction.status)}
                      </div>
                      <div className="text-sm text-muted-foreground">{transaction.adventure}</div>
                      <div className="text-xs text-muted-foreground flex items-center space-x-2">
                        <span>{transaction.id}</span>
                        <span>•</span>
                        <span>{transaction.location}</span>
                        <span>•</span>
                        <span>{new Date(transaction.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-medium">{formatCurrency(transaction.amount)}</div>
                    <div className="text-sm text-muted-foreground">{transaction.method}</div>
                    <div className="text-xs text-muted-foreground">
                      Fee: {formatCurrency(transaction.fee)}
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

export default FinancialTransactionsProcessing;