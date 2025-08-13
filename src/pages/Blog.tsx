import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, Facebook, Instagram, Mail, CheckCircle, AlertCircle } from "lucide-react";
import ScrollToTopButton from '@/components/ui/ScrollToTopButton';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GlobalMeta } from "@/components/SEO/GlobalMeta";
import { getTranslatedReadingTime } from '@/utils/translations';
import { trackListingInteraction } from '@/utils/blogAnalytics';
import { getBlogPostImageUrl, handleImageError, getImageAltText } from '@/utils/blogImageUtils';

interface BlogPost {
  id: string;
  title: string;
  title_fr?: string;
  excerpt: string;
  excerpt_fr?: string;
  slug: string;
  featured_image_url: string | null;
  ai_generated_image_url: string | null;
  image_source: 'unsplash' | 'ai_generated' | 'uploaded';
  author: string;
  published_at: string;
  reading_time: string | null;
}

const Blog = () => {
  const { t, i18n } = useTranslation(['blog']);
  const navigate = useNavigate();
  const currentLanguage = i18n.language;
  
  // Convert French title to slug
  const createFrenchSlug = (frenchTitle: string): string => {
    return frenchTitle
      .toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[ñ]/g, 'n')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };
  
  // Blog posts state
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Newsletter subscription state
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  
  // Scroll to top functionality

  // Fetch blog posts from Supabase
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, title_fr, excerpt, excerpt_fr, slug, featured_image_url, ai_generated_image_url, image_source, author, published_at, reading_time')
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



  const formatDate = (dateString: string) => {
    const locale = currentLanguage === 'fr-CA' ? 'fr-CA' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to get translated content
  const getTranslatedContent = (post: BlogPost) => {
    const isFrench = currentLanguage.includes('fr');
    return {
      title: (isFrench && post.title_fr) ? post.title_fr : post.title,
      excerpt: (isFrench && post.excerpt_fr) ? post.excerpt_fr : post.excerpt
    };
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
    <>
      <GlobalMeta 
        title={t('blog:meta.title')}
        description="Discover Belize solo travel stories, tips and adventures"
        path="/blog"
        keywords="Belize blog, solo travel stories, adventure tips"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:bg-gradient-to-br dark:from-blue-950/20 dark:via-background dark:to-blue-950/10">
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
          <Button 
            onClick={() => document.getElementById('blog-posts')?.scrollIntoView({ behavior: 'smooth' })}
            size="lg" 
            className="bg-belize-orange-500 hover:bg-belize-orange-600 text-white px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            {t('blog:hero.startReading', { defaultValue: 'Start Reading' })}
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="lg:grid lg:grid-cols-4 lg:gap-12">
          
          {/* Blog Posts Grid */}
          <main className="lg:col-span-3" id="blog-posts" aria-labelledby="latest-stories-heading">
            <h2 id="latest-stories-heading" className="text-3xl font-playfair font-bold text-belize-neutral-900 dark:text-foreground mb-8 text-center lg:text-left">
              {t('blog:latestPosts', { defaultValue: 'Latest Stories' })}
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
                <h3 className="text-xl text-muted-foreground mb-4">
                  {t('blog:noPosts', { defaultValue: 'No blog posts available yet.' })}
                </h3>
                <p className="text-muted-foreground">
                  {t('blog:noPostsSubtext', { defaultValue: 'Check back soon for inspiring solo travel stories from Belize!' })}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {blogPosts.map((post) => {
                  const translatedContent = getTranslatedContent(post);
                  return (
                  <Card 
                    key={post.id} 
                    className="overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer group h-full min-h-[480px] flex flex-col bg-card dark:bg-card"
                    onClick={() => {
                      // Track blog listing click
                      trackListingInteraction(post.slug, 'click');
                      
                      const url = i18n.language === 'fr-CA' 
                        ? `/fr-ca/blog/${post.title_fr ? createFrenchSlug(post.title_fr) : post.slug}`
                        : `/blog/${post.slug}`;
                      navigate(url);
                    }}
                  >
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img 
                        src={getBlogPostImageUrl(post)} 
                        alt={getImageAltText(post, translatedContent.title)}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => handleImageError(e, post)}
                        onLoad={() => {
                          // Track blog listing impression
                          trackListingInteraction(post.slug, 'impression');
                        }}
                      />
                      {post.image_source === 'ai_generated' && post.ai_generated_image_url && (
                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          ✨ AI
                        </div>
                      )}
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-lg group-hover:text-belize-green-600 dark:group-hover:text-belize-green-400 transition-colors text-foreground">
                        {translatedContent.title}
                      </CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground space-x-4">
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
                    
                    <CardContent className="flex-1 flex flex-col justify-between">
                      <CardDescription className="text-muted-foreground leading-relaxed flex-1">
                        {translatedContent.excerpt}
                      </CardDescription>
                      {post.reading_time && (
                        <div className="mt-4 text-sm text-belize-green-600 font-medium">
                          {getTranslatedReadingTime(post.reading_time, currentLanguage)}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  );
                })}
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-8">
            <div className="sticky top-24 space-y-8 mt-16">
            
            {/* Newsletter Subscription */}
            <Card className="p-6 bg-card dark:bg-card" aria-labelledby="newsletter-heading">
              <CardHeader>
                <CardTitle id="newsletter-heading" className="text-xl font-playfair font-semibold text-belize-green-600 dark:text-belize-green-500 mb-4">
                  <Mail className="h-5 w-5 inline mr-2" />
                  {t('blog:sidebar.newsletter', { defaultValue: 'Stay Connected' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {t('blog:sidebar.newsletterDescription', { defaultValue: 'Get the latest solo travel tips and stories delivered to your inbox.' })}
                </p>
                
                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('blog:sidebar.emailPlaceholder', { defaultValue: 'Enter your email' })}
                      className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-belize-orange-500 hover:bg-belize-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t('blog:sidebar.subscribing', { defaultValue: 'Subscribing...' })}
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        {t('blog:sidebar.subscribe', { defaultValue: 'Subscribe' })}
                      </>
                    )}
                  </Button>
                  
                  {statusMessage && (
                    <div className={`flex items-center gap-2 text-sm p-3 rounded-lg ${
                      submitStatus === 'success' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
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
            <Card className="p-6 bg-card dark:bg-card" aria-labelledby="popular-topics-heading">
              <h3 id="popular-topics-heading" className="text-xl font-playfair font-semibold text-belize-green-600 dark:text-belize-green-500 mb-4">
                {t('blog:sidebar.popularTopics', { defaultValue: 'Popular Topics' })}
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTopics.map((topic, index) => (
                  <button
                    key={index}
                    className="px-3 py-1 text-sm bg-belize-green-600 text-gray-100 rounded-full hover:bg-belize-green-100 hover:text-belize-green-700 transition-colors duration-300"
                    onClick={() => console.log(`Filter by: ${topic}`)}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </Card>

            {/* Social Links */}
            <Card className="p-6 bg-card dark:bg-card" aria-labelledby="follow-us-heading">
              <h3 id="follow-us-heading" className="text-xl font-playfair font-semibold text-belize-green-600 dark:text-belize-green-500 mb-4">
                {t('blog:sidebar.followUs', { defaultValue: 'Follow Us' })}
              </h3>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm" className="flex items-center space-x-2 hover:bg-belize-green-500 hover:text-white transition-colors duration-300">
                  <Facebook className="h-4 w-4" />
                  <span>Facebook</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center space-x-2 hover:bg-belize-green-500 hover:text-white transition-colors duration-300">
                  <Instagram className="h-4 w-4" />  
                  <span>Instagram</span>
                </Button>
              </div>
            </Card>
            
            </div>
          </aside>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
    </>
  );
};

export default Blog;