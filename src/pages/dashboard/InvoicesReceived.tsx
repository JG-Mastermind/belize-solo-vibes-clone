import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, DollarSign, Clock, CheckCircle, AlertTriangle, Plus, Upload } from 'lucide-react';

const InvoicesReceived: React.FC = () => {
  const expenseOverview = {
    totalInvoices: 156,
    approvedInvoices: 134,
    pendingInvoices: 18,
    rejectedInvoices: 4,
    totalValue: 87450,
    approvedValue: 76890,
    pendingValue: 8950,
    rejectedValue: 1610,
    averageProcessingTime: 3.2,
    approvalRate: 85.9
  };

  const receivedInvoices = [
    {
      id: 'RECV-2024-078',
      vendorName: 'Maya Explorer Guides Ltd.',
      category: 'Tour Guide Services',
      amount: 2400,
      taxAmount: 240,
      receiveDate: '2024-08-15',
      dueDate: '2024-09-15',
      status: 'approved',
      approvalDate: '2024-08-16',
      paymentStatus: 'paid',
      paymentDate: '2024-08-17',
      description: 'Guide services for Maya Ruins tours - August 2024',
      approvedBy: 'Admin Manager',
      invoiceNumber: 'MEG-2024-0845',
      paymentTerms: 'Net 30'
    },
    {
      id: 'RECV-2024-079',
      vendorName: 'Belize Cave Adventures Co.',
      category: 'Equipment Rental',
      amount: 1850,
      taxAmount: 185,
      receiveDate: '2024-08-16',
      dueDate: '2024-09-16',
      status: 'pending',
      description: 'Caving equipment rental and maintenance - August 2024',
      invoiceNumber: 'BCA-2024-0234',
      paymentTerms: 'Net 30'
    },
    {
      id: 'RECV-2024-080',
      vendorName: 'Placencia Transport Services',
      category: 'Transportation',
      amount: 3200,
      taxAmount: 320,
      receiveDate: '2024-08-14',
      dueDate: '2024-09-14',
      status: 'approved',
      approvalDate: '2024-08-15',
      paymentStatus: 'scheduled',
      paymentDate: '2024-08-30',
      description: 'Tourist transportation - Belize City to Placencia route',
      approvedBy: 'Finance Manager',
      invoiceNumber: 'PTS-2024-0567',
      paymentTerms: 'Net 15'
    },
    {
      id: 'RECV-2024-081',
      vendorName: 'Caribbean Reef Dive Center',
      category: 'Activity Provider',
      amount: 4200,
      taxAmount: 420,
      receiveDate: '2024-08-12',
      dueDate: '2024-09-12',
      status: 'pending',
      description: 'Snorkeling and diving services - Barrier Reef tours',
      invoiceNumber: 'CRDC-2024-0389',
      paymentTerms: 'Net 30'
    },
    {
      id: 'RECV-2024-082',
      vendorName: 'Jungle Lodge Accommodations',
      category: 'Accommodation',
      amount: 5600,
      taxAmount: 560,
      receiveDate: '2024-08-10',
      dueDate: '2024-09-10',
      status: 'rejected',
      rejectionReason: 'Missing required documentation and receipts',
      description: 'Guest accommodation services - Eco-lodge bookings',
      invoiceNumber: 'JLA-2024-0123',
      paymentTerms: 'Net 30'
    }
  ];

  const expenseCategories = [
    { category: 'Tour Guide Services', invoices: 45, amount: 28450, approved: 42, percentage: 32.5 },
    { category: 'Transportation', invoices: 32, amount: 19800, approved: 30, percentage: 22.7 },
    { category: 'Equipment Rental', invoices: 28, amount: 14600, approved: 25, percentage: 16.7 },
    { category: 'Accommodation', invoices: 24, amount: 15200, approved: 20, percentage: 17.4 },
    { category: 'Activity Provider', invoices: 18, amount: 7200, approved: 14, percentage: 8.2 },
    { category: 'Marketing & Advertising', invoices: 9, amount: 2200, approved: 3, percentage: 2.5 }
  ];

  const monthlyExpenses = [
    { month: 'January', received: 18, approved: 16, pending: 2, rejected: 0, total: 12450 },
    { month: 'February', received: 22, approved: 20, pending: 1, rejected: 1, total: 15800 },
    { month: 'March', received: 20, approved: 18, pending: 2, rejected: 0, total: 13600 },
    { month: 'April', received: 15, approved: 13, pending: 1, rejected: 1, total: 9800 },
    { month: 'May', received: 19, approved: 17, pending: 2, rejected: 0, total: 11950 },
    { month: 'June', received: 17, approved: 15, pending: 1, rejected: 1, total: 10400 },
    { month: 'July', received: 21, approved: 19, pending: 2, rejected: 0, total: 14200 },
    { month: 'August', received: 24, approved: 16, pending: 7, rejected: 1, total: 16250 }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Payment</Badge>;
      default:
        return <Badge variant="outline">Not Paid</Badge>;
    }
  };

  const approvalPercentage = (expenseOverview.approvedInvoices / expenseOverview.totalInvoices) * 100;

  return (
    <>
      <Helmet>
        <title>Invoices Received - BelizeVibes Invoice Management</title>
        <meta name="description" content="Manage vendor invoices, expense tracking, and payment approvals" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invoices Received</h1>
            <p className="text-muted-foreground">
              Manage vendor invoices, expense approvals, and payment tracking for business operations
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload Invoice
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>

        {/* Expense Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{expenseOverview.totalInvoices}</div>
              <p className="text-xs text-muted-foreground">
                {expenseOverview.approvedInvoices} approved ({approvalPercentage.toFixed(1)}%)
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${expenseOverview.totalValue.toLocaleString()}</div>
              <p className="text-xs text-green-600">
                ${expenseOverview.approvedValue.toLocaleString()} approved
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{expenseOverview.pendingInvoices}</div>
              <p className="text-xs text-muted-foreground">
                ${expenseOverview.pendingValue.toLocaleString()} pending
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{expenseOverview.rejectedInvoices}</div>
              <p className="text-xs text-red-600">
                ${expenseOverview.rejectedValue.toLocaleString()} rejected
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{expenseOverview.averageProcessingTime} days</div>
              <p className="text-xs text-muted-foreground">
                {expenseOverview.approvalRate}% approval rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Expense Categories */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
            <CardDescription>
              Breakdown of expenses by category with approval rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{category.category}</h3>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {category.invoices} invoices
                        </span>
                        <span className="text-lg font-bold text-blue-600">
                          {category.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total Amount:</span>
                        <div className="font-medium">${category.amount.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Approved:</span>
                        <div className="font-medium text-green-600">{category.approved}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pending:</span>
                        <div className="font-medium text-yellow-600">{category.invoices - category.approved}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Approval Rate:</span>
                        <div className="font-medium">{((category.approved / category.invoices) * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Progress value={(category.approved / category.invoices) * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Received Invoices */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Recent Invoices Received</CardTitle>
            <CardDescription>
              Latest vendor invoices requiring review and approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {receivedInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{invoice.id}</h3>
                      {getStatusBadge(invoice.status)}
                      {invoice.paymentStatus && getPaymentStatusBadge(invoice.paymentStatus)}
                      <Badge variant="outline" className="text-xs">
                        {invoice.category}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Vendor:</span>
                          <div className="font-medium">{invoice.vendorName}</div>
                        </div>
                        <div className="text-sm mt-2">
                          <span className="text-muted-foreground">Description:</span>
                          <div className="font-medium">{invoice.description}</div>
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

                    {invoice.status === 'rejected' && invoice.rejectionReason && (
                      <div className="bg-red-50 p-2 rounded text-sm">
                        <span className="text-red-700 font-medium">Rejection Reason:</span>
                        <div className="text-red-600">{invoice.rejectionReason}</div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Received: {invoice.receiveDate}</span>
                        <span>Due: {invoice.dueDate}</span>
                        <span>Terms: {invoice.paymentTerms}</span>
                        {invoice.approvedBy && <span>Approved by: {invoice.approvedBy}</span>}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {invoice.status === 'pending' && (
                          <>
                            <Button variant="outline" size="sm" className="text-green-600">
                              Approve
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600">
                              Reject
                            </Button>
                          </>
                        )}
                        {invoice.status === 'approved' && invoice.paymentStatus !== 'paid' && (
                          <Button variant="outline" size="sm" className="text-blue-600">
                            Schedule Payment
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

export default InvoicesReceived;