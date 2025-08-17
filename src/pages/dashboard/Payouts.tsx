import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Calendar, Download, CreditCard, Clock } from 'lucide-react';

const Payouts = () => {
  // Mock data - in real implementation this would come from Stripe/payment processor
  const mockPayouts = [
    {
      id: 'payout_1',
      amount: 2450.00,
      currency: 'BZD',
      status: 'paid',
      date: '2024-01-15',
      description: 'Weekly payout for tours completed Jan 8-14',
      bookings: 12,
    },
    {
      id: 'payout_2',
      amount: 1890.00,
      currency: 'BZD',
      status: 'pending',
      date: '2024-01-22',
      description: 'Weekly payout for tours completed Jan 15-21',
      bookings: 9,
    },
    {
      id: 'payout_3',
      amount: 3125.50,
      currency: 'BZD',
      status: 'processing',
      date: '2024-01-29',
      description: 'Weekly payout for tours completed Jan 22-28',
      bookings: 15,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'BZD') => {
    return new Intl.NumberFormat('en-BZ', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const totalPaid = mockPayouts
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = mockPayouts
    .filter(p => p.status === 'pending' || p.status === 'processing')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payouts</h1>
          <p className="text-muted-foreground">
            Track your earnings and payout history
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalPaid)}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(totalPending)}
            </div>
            <p className="text-xs text-muted-foreground">
              Expected in 2-3 business days
            </p>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(mockPayouts.reduce((sum, p) => sum + p.amount, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              From {mockPayouts.reduce((sum, p) => sum + p.bookings, 0)} bookings
            </p>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Payout</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(mockPayouts.reduce((sum, p) => sum + p.amount, 0) / mockPayouts.length)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per payout period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payout Schedule Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Payout Schedule</span>
          </CardTitle>
          <CardDescription>
            Understanding when you get paid
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">Weekly</div>
              <p className="text-sm text-muted-foreground">Payout Frequency</p>
              <p className="text-xs text-muted-foreground mt-1">
                Every Monday for previous week's tours
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">2-3 Days</div>
              <p className="text-sm text-muted-foreground">Processing Time</p>
              <p className="text-xs text-muted-foreground mt-1">
                From payout to bank account
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">85%</div>
              <p className="text-sm text-muted-foreground">Your Share</p>
              <p className="text-xs text-muted-foreground mt-1">
                15% platform fee deducted
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payout History */}
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
          <CardDescription>
            Your recent payouts and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPayouts.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">{formatCurrency(payout.amount, payout.currency)}</p>
                    <p className="text-sm text-muted-foreground">{payout.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {payout.bookings} bookings • {payout.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className={getStatusColor(payout.status)}>
                    {payout.status.toUpperCase()}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bank Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Bank Account</span>
          </CardTitle>
          <CardDescription>
            Where your payouts are sent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Belize Bank</p>
                <p className="text-sm text-muted-foreground">Account ending in ••••4567</p>
                <p className="text-xs text-muted-foreground">Primary payout method</p>
              </div>
              <Button variant="outline" size="sm">
                Update Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payouts;