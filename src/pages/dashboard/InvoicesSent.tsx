import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Receipt, DollarSign, Users, Eye, CheckCircle, XCircle, Plus, Download } from 'lucide-react';

const InvoicesSent: React.FC = () => {
  const invoiceOverview = {
    totalInvoices: 284,
    paidInvoices: 256,
    pendingInvoices: 23,
    overdueInvoices: 5,
    totalValue: 145670,
    paidValue: 131420,
    pendingValue: 12450,
    overdueValue: 1800,
    averagePaymentTime: 12,
    conversionRate: 90.1
  };

  const sentInvoices = [
    {
      id: 'INV-2024-001',
      customerName: 'John & Sarah Miller',
      tourName: 'Belize Cave Exploration Package',
      amount: 1250,
      issueDate: '2024-08-10',
      dueDate: '2024-08-25',
      status: 'paid',
      paymentDate: '2024-08-18',
      bookingId: 'BK-2024-145',
      taxAmount: 125,
      customerEmail: 'john.miller@email.com',
      paymentMethod: 'Credit Card'
    },
    {
      id: 'INV-2024-002',
      customerName: 'Emma Thompson',
      tourName: 'Maya Ruins Discovery Tour',
      amount: 850,
      issueDate: '2024-08-12',
      dueDate: '2024-08-27',
      status: 'pending',
      bookingId: 'BK-2024-156',
      taxAmount: 85,
      customerEmail: 'emma.thompson@email.com',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 'INV-2024-003',
      customerName: 'Rodriguez Family',
      tourName: 'Barrier Reef Snorkeling Adventure',
      amount: 2100,
      issueDate: '2024-08-05',
      dueDate: '2024-08-20',
      status: 'overdue',
      bookingId: 'BK-2024-134',
      taxAmount: 210,
      customerEmail: 'carlos.rodriguez@email.com',
      paymentMethod: 'PayPal'
    },
    {
      id: 'INV-2024-004',
      customerName: 'Michael Chen',
      tourName: 'Jungle Zip-Line Eco Adventure',
      amount: 680,
      issueDate: '2024-08-14',
      dueDate: '2024-08-29',
      status: 'viewed',
      bookingId: 'BK-2024-167',
      taxAmount: 68,
      customerEmail: 'michael.chen@email.com',
      paymentMethod: 'Credit Card'
    },
    {
      id: 'INV-2024-005',
      customerName: 'Lisa & James Wilson',
      tourName: 'Placencia Beach & Culture Package',
      amount: 1450,
      issueDate: '2024-08-08',
      dueDate: '2024-08-23',
      status: 'paid',
      paymentDate: '2024-08-20',
      bookingId: 'BK-2024-142',
      taxAmount: 145,
      customerEmail: 'lisa.wilson@email.com',
      paymentMethod: 'Credit Card'
    }
  ];

  const monthlyInvoicing = [
    { month: 'January', sent: 45, paid: 42, pending: 3, overdue: 0, revenue: 28450 },
    { month: 'February', sent: 52, paid: 48, pending: 4, overdue: 0, revenue: 34200 },
    { month: 'March', sent: 48, paid: 45, pending: 2, overdue: 1, revenue: 31800 },
    { month: 'April', sent: 38, paid: 36, pending: 2, overdue: 0, revenue: 24650 },
    { month: 'May', sent: 42, paid: 39, pending: 3, overdue: 0, revenue: 27890 },
    { month: 'June', sent: 35, paid: 33, pending: 2, overdue: 0, revenue: 23450 },
    { month: 'July', sent: 41, paid: 38, pending: 2, overdue: 1, revenue: 26780 },
    { month: 'August', sent: 24, paid: 13, pending: 9, overdue: 2, revenue: 15650 }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
      case 'viewed':
        return <Badge className="bg-yellow-100 text-yellow-800">Viewed</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      case 'sent':
        return <Badge className="bg-gray-100 text-gray-800">Sent</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const paidPercentage = (invoiceOverview.paidInvoices / invoiceOverview.totalInvoices) * 100;

  return (
    <>
      <Helmet>
        <title>Invoices Sent - BelizeVibes Invoice Management</title>
        <meta name="description" content="Manage customer invoices, track payments, and monitor billing performance" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invoices Sent</h1>
            <p className="text-muted-foreground">
              Track customer invoices, payment status, and billing performance for tour bookings
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </div>
        </div>

        {/* Invoice Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{invoiceOverview.totalInvoices}</div>
              <p className="text-xs text-muted-foreground">
                {invoiceOverview.paidInvoices} paid ({paidPercentage.toFixed(1)}%)
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${invoiceOverview.totalValue.toLocaleString()}</div>
              <p className="text-xs text-green-600">
                ${invoiceOverview.paidValue.toLocaleString()} collected
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{invoiceOverview.pendingInvoices}</div>
              <p className="text-xs text-muted-foreground">
                ${invoiceOverview.pendingValue.toLocaleString()} pending
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{invoiceOverview.overdueInvoices}</div>
              <p className="text-xs text-red-600">
                ${invoiceOverview.overdueValue.toLocaleString()} overdue
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{invoiceOverview.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                {invoiceOverview.averagePaymentTime} days avg
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Invoicing Performance */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Monthly Invoicing Performance</CardTitle>
            <CardDescription>
              Invoice volume and payment performance by month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyInvoicing.map((month, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{month.month} 2024</h3>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {month.sent} invoices sent
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          ${month.revenue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Paid:</span>
                        <div className="font-medium text-green-600">{month.paid}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pending:</span>
                        <div className="font-medium text-blue-600">{month.pending}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Overdue:</span>
                        <div className="font-medium text-red-600">{month.overdue}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Success Rate:</span>
                        <div className="font-medium">{((month.paid / month.sent) * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Progress value={(month.paid / month.sent) * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>
              Latest customer invoices with payment tracking and status updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{invoice.id}</h3>
                      {getStatusBadge(invoice.status)}
                      <Badge variant="outline" className="text-xs">
                        {invoice.bookingId}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Customer:</span>
                          <div className="font-medium">{invoice.customerName}</div>
                        </div>
                        <div className="text-sm mt-2">
                          <span className="text-muted-foreground">Tour:</span>
                          <div className="font-medium">{invoice.tourName}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Amount:</span>
                          <div className="font-medium text-lg">${invoice.amount.toLocaleString()}</div>
                        </div>
                        <div className="text-sm mt-2">
                          <span className="text-muted-foreground">Tax:</span>
                          <div className="font-medium">${invoice.taxAmount}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Issued: {invoice.issueDate}</span>
                        <span>Due: {invoice.dueDate}</span>
                        {invoice.paymentDate && <span>Paid: {invoice.paymentDate}</span>}
                        <span>Method: {invoice.paymentMethod}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Invoice
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-3 h-3 mr-1" />
                          PDF
                        </Button>
                        {invoice.status === 'overdue' && (
                          <Button variant="outline" size="sm" className="text-red-600">
                            Send Reminder
                          </Button>
                        )}
                      </div>
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

export default InvoicesSent;