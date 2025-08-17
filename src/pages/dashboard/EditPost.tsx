import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { BlogForm } from '@/components/admin/BlogForm';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BlogPostData {
  id: string;
  title: string;
  title_fr: string;
  slug: string;
  excerpt: string;
  excerpt_fr: string;
  content: string;
  content_fr: string;
  featured_image_url: string;
  author: string;
  category_id: string;
  status: 'draft' | 'published';
}

const EditPost: React.FC = () => {
  const navigate = useNavigate();
  const { getUserRole } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [postData, setPostData] = useState<BlogPostData | null>(null);
  const userRole = getUserRole() || 'blogger';

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setFetchLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPostData(data);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast.error('Failed to load blog post');
      navigate('/dashboard/admin');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (blogData: {
    title: string;
    title_fr: string;
    slug: string;
    excerpt: string;
    excerpt_fr: string;
    content: string;
    content_fr: string;
    featured_image_url: string;
    author: string;
    category_id: string;
    status: 'draft' | 'published';
  }) => {
    if (!id) return;
    
    setLoading(true);

    try {
      const { error } = await supabase
        .from('posts')
        .update({
          title: blogData.title,
          title_fr: blogData.title_fr,
          slug: blogData.slug,
          excerpt: blogData.excerpt,
          excerpt_fr: blogData.excerpt_fr,
          content: blogData.content,
          content_fr: blogData.content_fr,
          featured_image_url: blogData.featured_image_url,
          author: blogData.author,
          category_id: blogData.category_id,
          status: blogData.status,
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Post updated successfully!');
      navigate('/dashboard/admin');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post. Please try again.');
      throw error; // Re-throw so BlogForm can handle it
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading blog post...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!postData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4 text-foreground">Post Not Found</h1>
          <Button onClick={() => navigate('/dashboard/admin')}>
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Post - {postData.title} - BelizeVibes Admin</title>
        <meta name="description" content={`Edit blog post: ${postData.title}`} />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Edit Post</h1>
            <p className="text-muted-foreground">
              Edit bilingual blog post with AI-powered translation support
            </p>
          </div>
          
          <BlogForm
            onSubmit={handleSubmit}
            isLoading={loading}
            userType={userRole}
            initialData={{
              title: postData.title,
              title_fr: postData.title_fr || '',
              excerpt: postData.excerpt,
              excerpt_fr: postData.excerpt_fr || '',
              content: postData.content,
              content_fr: postData.content_fr || '',
              slug: postData.slug,
              author: postData.author,
              category_id: postData.category_id,
              featured_image_url: postData.featured_image_url || '',
              status: postData.status,
            }}
          />
          
          <div className="flex justify-center mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard/admin')}
            >
              ← Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPost;