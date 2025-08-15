import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Shield, Users, Calendar, AlertTriangle, Trash2 } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

interface User {
  id: string;
  email: string;
  user_type: string;
  created_at: string;
  first_name?: string;
  last_name?: string;
  profile_image?: string;
}

interface BookingConflict {
  type: 'imminent' | 'future';
  count: number;
  bookings: Array<{
    id: string;
    booking_date: string;
    start_time?: string;
    participants: number;
    status: string;
  }>;
  message: string;
}

const UserManager = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    user: User | null;
    bookingConflict?: BookingConflict;
  }>({ open: false, user: null });
  const { user: currentUser, getUserRole } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, user_type, created_at, first_name, last_name, profile_image')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    if (userId === currentUser?.id) {
      alert('You cannot change your own role');
      return;
    }

    setUpdating(userId);
    try {
      const { error } = await supabase
        .from('users')
        .update({ user_type: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error updating user role. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteUser = async (user: User) => {
    // Only super_admin can delete users
    if (getUserRole() !== 'super_admin') {
      alert('Unauthorized: Super admin access required');
      return;
    }

    if (user.id === currentUser?.id) {
      alert('You cannot delete your own account');
      return;
    }

    setDeleteDialog({ open: true, user });
  };

  const confirmDeleteUser = async () => {
    const user = deleteDialog.user;
    if (!user) return;

    setDeleting(user.id);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/delete-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.session.access_token}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.bookingConflict) {
          // Show booking conflict dialog
          setDeleteDialog({
            open: true,
            user,
            bookingConflict: result.bookingConflict
          });
          return;
        }
        throw new Error(result.error || 'Failed to delete user');
      }

      alert(`User ${result.deletedUser.name} deleted successfully`);
      fetchUsers();
      setDeleteDialog({ open: false, user: null });
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error instanceof Error ? error.message : 'Error deleting user. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, user: null });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'destructive';
      case 'admin':
        return 'default';
      case 'blogger':
        return 'secondary';
      case 'guide':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDisplayName = (user: User) => {
    if (user.first_name || user.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user.email.split('@')[0];
  };

  const availableRoles = ['traveler', 'host', 'guide', 'blogger', 'admin'];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Manage Users</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>
            View and manage user roles across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : (
            <Table>
              <TableCaption>All registered users and their roles</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.profile_image ? (
                          <img
                            src={user.profile_image}
                            alt={getDisplayName(user)}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-medium">
                              {getDisplayName(user).charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{getDisplayName(user)}</p>
                          {user.id === currentUser?.id && (
                            <p className="text-xs text-muted-foreground">(You)</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.user_type)}>
                        {user.user_type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.user_type !== 'super_admin' && user.id !== currentUser?.id ? (
                          <>
                            <Select
                              value={user.user_type}
                              onValueChange={(value) => updateUserRole(user.id, value)}
                              disabled={updating === user.id}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {availableRoles.map((role) => (
                                  <SelectItem key={role} value={role}>
                                    {role.replace('_', ' ')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {getUserRole() === 'super_admin' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteUser(user)}
                                disabled={deleting === user.id}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {user.user_type === 'super_admin' && (
                              <>
                                <AlertTriangle className="w-3 h-3" />
                                Protected
                              </>
                            )}
                            {user.id === currentUser?.id && user.user_type !== 'super_admin' && (
                              <>
                                <AlertTriangle className="w-3 h-3" />
                                Self
                              </>
                            )}
                          </div>
                        )}
                        {(updating === user.id || deleting === user.id) && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {updating === user.id ? 'Updating...' : 'Deleting...'}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            User Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['traveler', 'host', 'guide', 'blogger', 'admin', 'super_admin'].map((role) => {
              const count = users.filter(user => user.user_type === role).length;
              return (
                <div key={role} className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm text-muted-foreground">
                    {role.replace('_', ' ')}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={closeDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteDialog.bookingConflict ? 'Cannot Delete User' : 'Delete User'}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                {deleteDialog.bookingConflict ? (
                  <div>
                    <p className="mb-2">{deleteDialog.bookingConflict.message}</p>
                    {deleteDialog.bookingConflict.type === 'imminent' ? (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span className="font-medium text-red-800">
                            Blocked: Imminent Bookings ({deleteDialog.bookingConflict.count})
                          </span>
                        </div>
                        <p className="text-sm text-red-700">
                          This guide has bookings within the next 48 hours. Deletion is blocked for customer safety.
                          Please contact customers directly to reschedule or assign a replacement guide.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <span className="font-medium text-yellow-800">
                            Warning: Future Bookings ({deleteDialog.bookingConflict.count})
                          </span>
                        </div>
                        <p className="text-sm text-yellow-700 mb-3">
                          This guide has {deleteDialog.bookingConflict.count} future booking(s). 
                          You must handle refunds or reassignments before deletion.
                        </p>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-yellow-800">Required actions:</p>
                          <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• Contact customers to arrange refunds or reschedule with another guide</li>
                            <li>• Cancel or reassign all future bookings</li>
                            <li>• Process any necessary refunds through Stripe</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <p>
                      Are you sure you want to delete{' '}
                      <span className="font-semibold">
                        {deleteDialog.user ? getDisplayName(deleteDialog.user) : ''}
                      </span>{' '}
                      ({deleteDialog.user?.email})?
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      This action cannot be undone. The user will be permanently removed from the system.
                    </p>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {deleteDialog.bookingConflict ? 'Close' : 'Cancel'}
            </AlertDialogCancel>
            {!deleteDialog.bookingConflict && (
              <AlertDialogAction
                onClick={confirmDeleteUser}
                disabled={deleting === deleteDialog.user?.id}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting === deleteDialog.user?.id ? 'Deleting...' : 'Delete User'}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManager;