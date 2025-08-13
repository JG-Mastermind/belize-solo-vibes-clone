import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import * as Sentry from '@sentry/react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';

interface AdminInvitation {
  id: string;
  email: string;
  role_type: 'admin' | 'blogger';
  expires_at: string;
  used_at: string | null;
  created_at: string;
  is_active: boolean;
  invited_by: string;
}

const InvitationManager = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'blogger'>('admin');
  const [invitations, setInvitations] = useState<AdminInvitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingInvites, setFetchingInvites] = useState(true);

  // Fetch existing invitations
  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_invitations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    } finally {
      setFetchingInvites(false);
    }
  };

  const sendInvite = async () => {
    if (!email.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create_admin_invite', {
        body: { email: email.toLowerCase(), role },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      alert('Invitation sent successfully!');
      setEmail('');
      setRole('admin');
      fetchInvitations();
    } catch (error: any) {
      console.error('Invite error:', error);
      alert(`Error creating invitation: ${error.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const revokeInvite = async (invitationId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('revoke_admin_invite', {
        body: { invitation_id: invitationId },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }
      
      fetchInvitations();
    } catch (error: any) {
      console.error('Error revoking invitation:', error);
      alert(`Error revoking invitation: ${error.message || 'Please try again.'}`);
    }
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (invitation: AdminInvitation) => {
    if (invitation.used_at) {
      return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Accepted</Badge>;
    }
    if (!invitation.is_active) {
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Revoked</Badge>;
    }
    if (new Date(invitation.expires_at) < new Date()) {
      return <Badge variant="secondary">Expired</Badge>;
    }
    return <Badge variant="outline">Pending</Badge>;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <UserPlus className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Manage Invitations</h1>
      </div>

      {/* Send New Invitation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send New Invitation
          </CardTitle>
          <CardDescription>
            Invite new users to join as admins or bloggers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              type="email"
              className="flex-1"
            />
            <Select value={role} onValueChange={(value: 'admin' | 'blogger') => setRole(value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="blogger">Blogger</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={sendInvite} disabled={loading || !email.trim()}>
              {loading ? 'Sending...' : 'Send Invite'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invitations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Invitation History
          </CardTitle>
          <CardDescription>
            View and manage all sent invitations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {fetchingInvites ? (
            <div className="text-center py-4">Loading invitations...</div>
          ) : (
            <Table>
              <TableCaption>All admin and blogger invitations</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">{invitation.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{invitation.role_type}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(invitation)}</TableCell>
                    <TableCell>{formatDate(invitation.created_at)}</TableCell>
                    <TableCell>{formatDate(invitation.expires_at)}</TableCell>
                    <TableCell>
                      {invitation.is_active && !invitation.used_at && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => revokeInvite(invitation.id)}
                        >
                          Revoke
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {invitations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No invitations sent yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Sentry.withErrorBoundary(InvitationManager, {
  fallback: ({ error }) => (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-red-600">Something went wrong</CardTitle>
        <CardDescription>
          There was an error loading the invitation manager. Please refresh the page or contact support.
        </CardDescription>
      </CardHeader>
    </Card>
  ),
  beforeCapture: (scope) => {
    scope.setTag('component', 'InvitationManager');
  }
});