import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Calendar,
  User,
  Globe
} from 'lucide-react';
import { format } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  title_fr?: string;
  slug: string;
  excerpt: string;
  excerpt_fr?: string;
  featured_image_url?: string;
  author: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  views?: number;
}

const BlogPosts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');

  const { data: posts, isLoading, refetch } = useQuery({
    queryKey: ['blog-posts', searchTerm, statusFilter],
    queryFn: async (): Promise<BlogPost[]> => {
      let query = supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const handleEdit = (postId: string) => {
    navigate(`/dashboard/edit-post/${postId}`);
  };

  const handleView = (slug: string) => {
    window.open(`/blog/${slug}`, '_blank');
  };

  const handleDelete = async (postId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog post deleted successfully"
      });

      refetch();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">Manage your blog content</p>
        </div>
        <Button onClick={() => navigate('/dashboard/create-post')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value: 'all' | 'draft' | 'published') => setStatusFilter(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts Grid */}
      <div className="grid gap-6">
        {posts?.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                {/* Featured Image */}
                {post.featured_image_url && (
                  <div className="flex-shrink-0">
                    <img
                      src={post.featured_image_url}
                      alt={post.title}
                      className="w-24 h-24 object-cover rounded-lg"
                      loading="lazy"
                    />
                  </div>
                )}
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold line-clamp-1">{post.title}</h3>
                      {post.title_fr && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {post.title_fr}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
                    </div>
                    <Badge className={getStatusColor(post.status)}>
                      {post.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.created_at)}
                    </div>
                    {post.views && (
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.views} views
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleView(post.slug)}
                    title="View Post"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(post.id)}
                    title="Edit Post"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(post.id, post.title)}
                    className="text-destructive hover:text-destructive"
                    title="Delete Post"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {posts?.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No blog posts found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first blog post'}
              </p>
              <Button onClick={() => navigate('/dashboard/create-post')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BlogPosts;