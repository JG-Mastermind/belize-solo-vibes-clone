import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, Copy, Eye, EyeOff, RotateCcw, Trash2 } from 'lucide-react';

const ApiKeysManagement: React.FC = () => {
  const [showKey, setShowKey] = React.useState<string | null>(null);

  const apiKeys = [
    {
      id: '1',
      name: 'Production API Key',
      key: 'prod_1234567890abcdef1234567890abcdef',
      created: '2024-01-15',
      lastUsed: '2024-03-10',
      status: 'active',
      permissions: ['read', 'write']
    },
    {
      id: '2',
      name: 'Development API Key',
      key: 'dev_abcdef1234567890abcdef1234567890',
      created: '2024-02-01',
      lastUsed: '2024-03-08',
      status: 'active',
      permissions: ['read']
    },
    {
      id: '3',
      name: 'Legacy API Key',
      key: 'legacy_9876543210fedcba9876543210fedcba',
      created: '2023-11-20',
      lastUsed: '2024-01-15',
      status: 'inactive',
      permissions: ['read', 'write']
    }
  ];

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    // In a real app, you'd show a toast notification here
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKey(showKey === keyId ? null : keyId);
  };

  return (
    <>
      <Helmet>
        <title>API Keys Management - BelizeVibes Dashboard</title>
        <meta name="description" content="Manage and monitor API keys for BelizeVibes platform" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">API Keys Management</h1>
            <p className="text-muted-foreground">
              Create, manage, and monitor API keys for secure platform access
            </p>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Key className="w-4 h-4 mr-2" />
            Generate New Key
          </Button>
        </div>

        {/* API Keys Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total API Keys</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{apiKeys.length}</div>
              <p className="text-xs text-muted-foreground">
                {apiKeys.filter(k => k.status === 'active').length} active
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
              <Badge variant="outline" className="text-green-600 border-green-600">
                {apiKeys.filter(k => k.status === 'active').length}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {apiKeys.filter(k => k.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently in use
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive Keys</CardTitle>
              <Badge variant="outline" className="text-gray-600 border-gray-600">
                {apiKeys.filter(k => k.status === 'inactive').length}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {apiKeys.filter(k => k.status === 'inactive').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Disabled or revoked
              </p>
            </CardContent>
          </Card>
        </div>

        {/* API Keys List */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>
              Manage your API keys and their permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{key.name}</h3>
                      <Badge
                        variant={key.status === 'active' ? 'default' : 'secondary'}
                        className={key.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {key.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-sm">
                      <span>
                        {showKey === key.id ? key.key : key.key.replace(/./g, '•')}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility(key.id)}
                      >
                        {showKey === key.id ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyKey(key.key)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Created: {key.created}</span>
                      <span>Last used: {key.lastUsed}</span>
                      <span>Permissions: {key.permissions.join(', ')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Rotate
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Revoke
                    </Button>
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

export default ApiKeysManagement;