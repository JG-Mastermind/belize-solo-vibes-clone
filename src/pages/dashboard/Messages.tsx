import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, User, Clock, Reply, Star } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  is_read: boolean;
  message_type: string;
  priority: string;
  created_at: string;
  sender: {
    id: string;
    email: string;
    full_name?: string;
  };
  recipient: {
    id: string;
    email: string;
    full_name?: string;
  };
}

const Messages = () => {
  const { data: messages, isLoading, error } = useQuery({
    queryKey: ['dashboard-messages'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id (
            id,
            email,
            full_name
          ),
          recipient:recipient_id (
            id,
            email,
            full_name
          )
        `)
        .or(`sender_id.eq.${user.user.id},recipient_id.eq.${user.user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Message[];
    },
  });

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'inquiry':
        return '❓';
      case 'booking':
        return '📅';
      case 'feedback':
        return '💭';
      case 'support':
        return '🆘';
      default:
        return '📧';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-sm text-gray-600">Loading messages...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 mb-4">
          <MessageSquare className="h-12 w-12 mx-auto mb-2" />
          <p>Failed to load messages</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  const unreadCount = messages?.filter(m => !m.is_read).length || 0;
  const inquiries = messages?.filter(m => m.message_type === 'inquiry').length || 0;
  const bookingMessages = messages?.filter(m => m.message_type === 'booking').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            Manage customer inquiries and communications
          </p>
        </div>
        <Button>
          <MessageSquare className="h-4 w-4 mr-2" />
          Compose Message
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Badge variant="destructive">
              {unreadCount}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
            <Badge className="bg-blue-100 text-blue-800">
              {inquiries}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inquiries}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Booking Related</CardTitle>
            <Badge className="bg-green-100 text-green-800">
              {bookingMessages}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{bookingMessages}</div>
          </CardContent>
        </Card>
      </div>

      {/* Messages List */}
      <div className="grid gap-4">
        {messages?.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages</h3>
                <p className="text-gray-500">Messages from customers will appear here.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          messages?.map((message) => (
            <Card key={message.id} className={`relative ${!message.is_read ? 'border-l-4 border-l-blue-500' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{getMessageTypeIcon(message.message_type)}</span>
                    <div className="flex-1">
                      <CardTitle className="flex items-center space-x-2">
                        <span>{message.subject}</span>
                        {!message.is_read && (
                          <Badge variant="destructive" className="text-xs">
                            NEW
                          </Badge>
                        )}
                        <Badge className={getPriorityColor(message.priority)}>
                          {message.priority.toUpperCase()}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        From: {message.sender?.full_name || message.sender?.email}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Reply className="h-4 w-4" />
                    </Button>
                    {message.message_type === 'feedback' && (
                      <Button variant="ghost" size="sm">
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-4">
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {message.content}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>To: {message.recipient?.full_name || message.recipient?.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{format(new Date(message.created_at), 'MMM d, yyyy HH:mm')}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {message.message_type}
                  </Badge>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  <Button variant="outline" size="sm">
                    View Full Message
                  </Button>
                  <Button size="sm">
                    <Reply className="h-4 w-4 mr-2" />
                    Reply
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

export default Messages;