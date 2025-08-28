import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { BlogForm } from '@/components/admin/BlogForm';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { getUserRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const userRole = getUserRole() || 'blogger';

  const handleSubmit = async (blogData: {
    title: string;
    title_fr: string;
    slug: string;
    slug_fr: string;
    excerpt: string;
    excerpt_fr: string;
    content: string;
    content_fr: string;
    featured_image_url: string;
    author: string;
    category_id: string;
    status: 'draft' | 'published';
    tags?: string;
    meta_description?: string;
    meta_description_fr?: string;
  }) => {
    setLoading(true);

    try {
      // Step 1: Insert the main post data with bilingual support
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert({
          title: blogData.title,
          title_fr: blogData.title_fr,
          slug: blogData.slug,
          slug_fr: blogData.slug_fr || null,
          excerpt: blogData.excerpt,
          excerpt_fr: blogData.excerpt_fr,
          content: blogData.content,
          content_fr: blogData.content_fr,
          featured_image_url: blogData.featured_image_url,
          author: blogData.author,
          category_id: blogData.category_id,
          status: blogData.status || 'draft',
          keywords: blogData.tags ? blogData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : null,
          meta_description: blogData.meta_description || null,
          meta_description_fr: blogData.meta_description_fr || null,
        })
        .select('id')
        .single();

      if (postError) throw postError;

      // Future: Add tag relationships support if needed

      toast.success('Post created successfully!');
      navigate('/dashboard/blog-posts');
    } catch (error) {
      console.error('Error creating post:', error);
      
      // Show specific error message based on error type
      if (error && typeof error === 'object' && 'message' in error) {
        const message = (error as any).message;
        if (message.includes('duplicate key value violates unique constraint')) {
          toast.error('A post with this slug already exists. Please change the URL slug.');
        } else if (message.includes('null value in column')) {
          toast.error('Please fill in all required fields before saving.');
        } else {
          toast.error(`Save failed: ${message}`);
        }
      } else {
        toast.error('Failed to create post. Please check all required fields and try again.');
      }
      
      // Don't re-throw - let the finally block run to reset loading state
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create New Post - BelizeVibes Admin</title>
        <meta name="description" content="Create a new blog post for BelizeVibes" />
      </Helmet>

      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Create New Post</h1>
            <p className="text-muted-foreground">Create a new bilingual blog post with AI-powered translation support</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard/blog-posts')}
          >
            ← Back to Blog Posts
          </Button>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <BlogForm
            onSubmit={handleSubmit}
            isLoading={loading}
            userType={userRole}
            initialData={{
              author: 'BelizeVibes',
              status: 'draft'
            }}
          />
        </div>
      </div>
    </>
  );
};

export default CreatePost;