import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, Facebook, Instagram, Mail, CheckCircle, AlertCircle, ArrowUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  featured_image_url: string | null;
  author: string;
  published_at: string;
  reading_time: string | null;
}

const Blog = () => {
  const { t } = useTranslation(['blog']);
  const navigate = useNavigate();
  
  // Blog posts state
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Newsletter subscription state
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  
  // Scroll to top functionality
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Fetch blog posts from Supabase
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, excerpt, slug, featured_image_url, author, published_at, reading_time')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      // Fallback to empty array if tables don't exist yet
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const popularTopics = [
    t('blog:topics.wildlife'), t('blog:topics.safety'), t('blog:topics.budgetTravel'), 
    t('blog:topics.groupTours'), t('blog:topics.jungleAdventures'), 
    t('blog:topics.beachActivities'), t('blog:topics.culturalExperiences'), 
    t('blog:topics.soloTips'), t('blog:topics.photography')
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setSubmitStatus('error');
      setStatusMessage(t('blog:sidebar.invalidEmail', { defaultValue: 'Please enter a valid email address' }));
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setStatusMessage('');
    
    try {
      // Simulate API call - Replace with your actual newsletter service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success (replace with actual API logic)
      const success = Math.random() > 0.1; // 90% success rate for demo
      
      if (success) {
        setSubmitStatus('success');
        setStatusMessage(t('blog:sidebar.subscriptionSuccess', { defaultValue: 'Successfully subscribed! Welcome to our newsletter.' }));
        setEmail(''); // Clear form
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      setSubmitStatus('error');
      setStatusMessage(t('blog:sidebar.subscriptionError', { defaultValue: 'Something went wrong. Please try again.' }));
    } finally {
      setIsSubmitting(false);
      // Clear status message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
        setStatusMessage('');
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 text-white">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="container mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {t('blog:hero.title', { defaultValue: 'Solo Travel Stories from Belize' })}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            {t('blog:hero.subtitle', { defaultValue: 'Authentic experiences, practical tips, and inspiring adventures from fellow solo travelers exploring the heart of Central America.' })}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Blog Posts Grid */}
          <main className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">
              {t('blog:latestPosts', { defaultValue: 'Latest Posts' })}
            </h2>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl text-gray-600 mb-4">
                  {t('blog:noPosts', { defaultValue: 'No blog posts available yet.' })}
                </h3>
                <p className="text-gray-500">
                  {t('blog:noPostsSubtext', { defaultValue: 'Check back soon for inspiring solo travel stories from Belize!' })}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogPosts.map((post) => (
                  <Card 
                    key={post.id} 
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    onClick={() => navigate(`/blog/${post.slug}`)}
                  >
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img 
                        src={post.featured_image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center'} 
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center';
                        }}
                      />
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </CardTitle>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(post.published_at)}</span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <CardDescription className="text-gray-600 leading-relaxed">
                        {post.excerpt}
                      </CardDescription>
                      {post.reading_time && (
                        <div className="mt-4 text-sm text-blue-600 font-medium">
                          {post.reading_time}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="space-y-8">
            
            {/* Newsletter Subscription */}
            <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-800">
                  <Mail className="h-5 w-5" />
                  <span>{t('blog:sidebar.newsletter', { defaultValue: 'Stay Connected' })}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {t('blog:sidebar.newsletterDescription', { defaultValue: 'Get the latest solo travel tips and stories delivered to your inbox.' })}
                </p>
                
                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('blog:sidebar.emailPlaceholder', { defaultValue: 'Enter your email' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('blog:sidebar.subscribing', { defaultValue: 'Subscribing...' }) : t('blog:sidebar.subscribe', { defaultValue: 'Subscribe' })}
                  </Button>
                  
                  {statusMessage && (
                    <div className={`flex items-center space-x-2 text-sm ${
                      submitStatus === 'success' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {submitStatus === 'success' ? 
                        <CheckCircle className="h-4 w-4" /> : 
                        <AlertCircle className="h-4 w-4" />
                      }
                      <span>{statusMessage}</span>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Popular Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-800">
                  {t('blog:sidebar.popularTopics', { defaultValue: 'Popular Topics' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularTopics.map((topic, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 cursor-pointer transition-colors"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-800">
                  {t('blog:sidebar.followUs', { defaultValue: 'Follow Us' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Facebook className="h-4 w-4" />
                    <span>Facebook</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Instagram className="h-4 w-4" />  
                    <span>Instagram</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 rounded-full w-12 h-12 bg-blue-600 hover:bg-blue-700 shadow-lg z-50"
          size="sm"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default Blog;