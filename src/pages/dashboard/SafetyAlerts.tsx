import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertTriangle, Plus, Edit, Trash2, MapPin, Clock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Schema for form validation
const alertSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().min(1, 'Description is required'),
  alert_type: z.enum(['weather', 'security', 'health', 'transportation', 'emergency']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  location: z.string().optional(),
  affects_tours: z.boolean().default(false),
  valid_until: z.string().optional(),
});

type AlertFormData = z.infer<typeof alertSchema>;

interface SafetyAlert {
  id: string;
  title: string;
  description: string;
  alert_type: string;
  severity: string;
  status: string;
  location?: string;
  affects_tours: boolean;
  tour_ids?: string[];
  valid_from: string;
  valid_until?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

const SafetyAlerts = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<SafetyAlert | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AlertFormData>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      title: '',
      description: '',
      alert_type: 'weather',
      severity: 'medium',
      location: '',
      affects_tours: false,
      valid_until: '',
    },
  });

  // Fetch safety alerts
  const { data: alerts, isLoading, error } = useQuery({
    queryKey: ['safety-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('safety_alerts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SafetyAlert[];
    },
  });

  // Create alert mutation
  const createAlertMutation = useMutation({
    mutationFn: async (alertData: AlertFormData) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('safety_alerts')
        .insert({
          ...alertData,
          created_by: user.user.id,
          valid_until: alertData.valid_until ? new Date(alertData.valid_until).toISOString() : null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['safety-alerts'] });
      setIsCreateOpen(false);
      form.reset();
      toast({
        title: 'Success',
        description: 'Safety alert created successfully',
      });
    },
    onError: (error) => {
      console.error('Error creating alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to create safety alert',
        variant: 'destructive',
      });
    },
  });

  // Update alert mutation
  const updateAlertMutation = useMutation({
    mutationFn: async ({ id, ...alertData }: AlertFormData & { id: string }) => {
      const { data, error } = await supabase
        .from('safety_alerts')
        .update({
          ...alertData,
          valid_until: alertData.valid_until ? new Date(alertData.valid_until).toISOString() : null,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['safety-alerts'] });
      setEditingAlert(null);
      form.reset();
      toast({
        title: 'Success',
        description: 'Safety alert updated successfully',
      });
    },
    onError: (error) => {
      console.error('Error updating alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to update safety alert',
        variant: 'destructive',
      });
    },
  });

  // Delete alert mutation
  const deleteAlertMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('safety_alerts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['safety-alerts'] });
      toast({
        title: 'Success',
        description: 'Safety alert deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Error deleting alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete safety alert',
        variant: 'destructive',
      });
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('safety_alerts')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['safety-alerts'] });
      toast({
        title: 'Success',
        description: 'Alert status updated successfully',
      });
    },
    onError: (error) => {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update alert status',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: AlertFormData) => {
    if (editingAlert) {
      updateAlertMutation.mutate({ ...data, id: editingAlert.id });
    } else {
      createAlertMutation.mutate(data);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'weather':
        return '🌧️';
      case 'security':
        return '🔒';
      case 'health':
        return '🏥';
      case 'transportation':
        return '🚗';
      case 'emergency':
        return '🚨';
      default:
        return '⚠️';
    }
  };

  const openEditDialog = (alert: SafetyAlert) => {
    setEditingAlert(alert);
    form.reset({
      title: alert.title,
      description: alert.description,
      alert_type: alert.alert_type as 'weather' | 'security' | 'health' | 'transportation' | 'emergency',
      severity: alert.severity as 'low' | 'medium' | 'high' | 'critical',
      location: alert.location || '',
      affects_tours: alert.affects_tours,
      valid_until: alert.valid_until ? format(new Date(alert.valid_until), 'yyyy-MM-dd\'T\'HH:mm') : '',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-sm text-gray-600">Loading safety alerts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 mb-4">
          <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
          <p>Failed to load safety alerts</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Safety Alerts</h1>
          <p className="text-muted-foreground">
            Manage safety notifications and alerts for travelers and guides
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Safety Alert</DialogTitle>
              <DialogDescription>
                Create a new safety alert to notify travelers and guides about important information.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Alert title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Detailed description of the alert" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="alert_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alert Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="weather">Weather</SelectItem>
                            <SelectItem value="security">Security</SelectItem>
                            <SelectItem value="health">Health</SelectItem>
                            <SelectItem value="transportation">Transportation</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="severity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Severity</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select severity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Specific location or area" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="valid_until"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valid Until (Optional)</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="affects_tours"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Affects Tours</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          This alert impacts scheduled tours
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createAlertMutation.isPending}>
                    {createAlertMutation.isPending ? 'Creating...' : 'Create Alert'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingAlert} onOpenChange={() => setEditingAlert(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Safety Alert</DialogTitle>
            <DialogDescription>
              Update the safety alert information.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Alert title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Detailed description of the alert" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="alert_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alert Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="weather">Weather</SelectItem>
                          <SelectItem value="security">Security</SelectItem>
                          <SelectItem value="health">Health</SelectItem>
                          <SelectItem value="transportation">Transportation</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="severity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Severity</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Specific location or area" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="valid_until"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valid Until (Optional)</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="affects_tours"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Affects Tours</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        This alert impacts scheduled tours
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingAlert(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateAlertMutation.isPending}>
                  {updateAlertMutation.isPending ? 'Updating...' : 'Update Alert'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Alerts Grid */}
      <div className="grid gap-4">
        {alerts?.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No safety alerts</h3>
                <p className="text-gray-500">Create your first safety alert to get started.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          alerts?.map((alert) => (
            <Card key={alert.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{getAlertTypeIcon(alert.alert_type)}</span>
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{alert.title}</span>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <Badge variant={alert.status === 'active' ? 'default' : 'secondary'}>
                          {alert.status.toUpperCase()}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {alert.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(alert)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteAlertMutation.mutate(alert.id)}
                      disabled={deleteAlertMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {alert.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{alert.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Created {format(new Date(alert.created_at), 'MMM d, yyyy')}</span>
                  </div>
                  {alert.valid_until && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Valid until {format(new Date(alert.valid_until), 'MMM d, yyyy HH:mm')}</span>
                    </div>
                  )}
                  {alert.affects_tours && (
                    <Badge variant="outline" className="text-xs">
                      Affects Tours
                    </Badge>
                  )}
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  {alert.status === 'active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatusMutation.mutate({ id: alert.id, status: 'resolved' })}
                      disabled={updateStatusMutation.isPending}
                    >
                      Mark Resolved
                    </Button>
                  )}
                  {alert.status === 'resolved' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatusMutation.mutate({ id: alert.id, status: 'active' })}
                      disabled={updateStatusMutation.isPending}
                    >
                      Reactivate
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateStatusMutation.mutate({ id: alert.id, status: 'archived' })}
                    disabled={updateStatusMutation.isPending}
                  >
                    Archive
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SafetyAlerts;