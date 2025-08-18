import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle, Bell, BellOff, Plus, Settings, Mail, MessageSquare, Smartphone } from 'lucide-react';

const ApiAlertsManagement: React.FC = () => {
  const [alerts, setAlerts] = React.useState([
    {
      id: '1',
      name: 'High Error Rate',
      description: 'Alert when error rate exceeds 5% for 5 minutes',
      threshold: '5%',
      type: 'error_rate',
      enabled: true,
      channels: ['email', 'slack'],
      lastTriggered: '2024-03-10 14:23',
      status: 'active'
    },
    {
      id: '2', 
      name: 'Slow Response Time',
      description: 'Alert when average response time exceeds 500ms',
      threshold: '500ms',
      type: 'response_time',
      enabled: true,
      channels: ['email'],
      lastTriggered: '2024-03-08 09:15',
      status: 'active'
    },
    {
      id: '3',
      name: 'API Rate Limit Approaching',
      description: 'Alert when API usage reaches 80% of rate limit',
      threshold: '80%',
      type: 'rate_limit',
      enabled: false,
      channels: ['email', 'sms'],
      lastTriggered: 'Never',
      status: 'disabled'
    },
    {
      id: '4',
      name: 'Database Connection Issues',
      description: 'Alert when database connection failures occur',
      threshold: '1 failure',
      type: 'database',
      enabled: true,
      channels: ['email', 'slack', 'sms'],
      lastTriggered: '2024-03-05 16:42',
      status: 'active'
    },
    {
      id: '5',
      name: 'High Cost Alert',
      description: 'Alert when daily API costs exceed $50',
      threshold: '$50/day',
      type: 'cost',
      enabled: true,
      channels: ['email'],
      lastTriggered: 'Never',
      status: 'active'
    }
  ]);

  const alertTypes = [
    { type: 'error_rate', label: 'Error Rate', icon: AlertTriangle, color: 'red' },
    { type: 'response_time', label: 'Response Time', icon: Bell, color: 'orange' },
    { type: 'rate_limit', label: 'Rate Limit', icon: Settings, color: 'blue' },
    { type: 'database', label: 'Database', icon: AlertTriangle, color: 'purple' },
    { type: 'cost', label: 'Cost', icon: Bell, color: 'green' }
  ];

  const notificationChannels = [
    { id: 'email', label: 'Email', icon: Mail, enabled: true },
    { id: 'slack', label: 'Slack', icon: MessageSquare, enabled: true },
    { id: 'sms', label: 'SMS', icon: Smartphone, enabled: false }
  ];

  const recentAlerts = [
    {
      time: '2024-03-10 14:23',
      type: 'High Error Rate',
      message: 'Error rate reached 6.2% on /api/payments endpoint',
      severity: 'critical',
      resolved: false
    },
    {
      time: '2024-03-10 12:15',
      type: 'Slow Response Time',
      message: 'Average response time: 785ms on /api/bookings',
      severity: 'warning',
      resolved: true
    },
    {
      time: '2024-03-09 18:30',
      type: 'Database Connection',
      message: 'Connection timeout to primary database',
      severity: 'critical',
      resolved: true
    },
    {
      time: '2024-03-09 16:45',
      type: 'High Error Rate',
      message: 'Error rate reached 5.8% on /api/auth endpoint',
      severity: 'warning',
      resolved: true
    }
  ];

  const toggleAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, enabled: !alert.enabled, status: !alert.enabled ? 'active' : 'disabled' }
        : alert
    ));
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      case 'warning':
        return <Badge className="bg-orange-100 text-orange-800">Warning</Badge>;
      case 'info':
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'slack':
        return <MessageSquare className="w-4 h-4" />;
      case 'sms':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>API Alerts Management - BelizeVibes Dashboard</title>
        <meta name="description" content="Configure and manage API monitoring alerts and notifications" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">API Alerts Management</h1>
            <p className="text-muted-foreground">
              Configure monitoring alerts and notification channels for API health
            </p>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            Create Alert
          </Button>
        </div>

        {/* Alert Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {alerts.filter(a => a.enabled).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {alerts.length} total configured
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Triggered Today</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">3</div>
              <p className="text-xs text-muted-foreground">
                2 resolved, 1 active
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.3min</div>
              <p className="text-xs text-muted-foreground">
                Alert to resolution
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Channels Active</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {notificationChannels.filter(c => c.enabled).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Notification channels
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alert Rules */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Alert Rules</CardTitle>
            <CardDescription>
              Configure and manage your API monitoring alert rules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{alert.name}</h3>
                      <Badge
                        variant={alert.enabled ? 'default' : 'secondary'}
                        className={alert.enabled ? 'bg-green-100 text-green-800' : ''}
                      >
                        {alert.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Threshold: {alert.threshold}</span>
                      <span>Last triggered: {alert.lastTriggered}</span>
                      <div className="flex items-center gap-1">
                        <span>Channels:</span>
                        {alert.channels.map((channel, idx) => (
                          <span key={idx} className="flex items-center gap-1">
                            {getChannelIcon(channel)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={alert.enabled}
                      onCheckedChange={() => toggleAlert(alert.id)}
                    />
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notification Channels */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Notification Channels</CardTitle>
            <CardDescription>
              Configure how you receive alert notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {notificationChannels.map((channel) => (
                <div key={channel.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <channel.icon className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">{channel.label}</h4>
                      <p className="text-xs text-muted-foreground">
                        {channel.enabled ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                  <Switch checked={channel.enabled} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Recent Alert Activity</CardTitle>
            <CardDescription>
              History of recent alert triggers and resolutions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-mono text-muted-foreground">
                      {alert.time.split(' ')[1]}
                    </div>
                    <div>
                      <div className="font-medium">{alert.type}</div>
                      <div className="text-sm text-muted-foreground">{alert.message}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getSeverityBadge(alert.severity)}
                    <Badge variant={alert.resolved ? 'default' : 'destructive'}>
                      {alert.resolved ? 'Resolved' : 'Active'}
                    </Badge>
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

export default ApiAlertsManagement;