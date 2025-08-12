import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  User, 
  Clock, 
  Share2, 
  Facebook, 
  Twitter, 
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  MessageCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ScrollToTopButton from '@/components/ui/ScrollToTopButton';
import { getTranslatedReadingTime } from '@/utils/translations';

interface BlogPostData {
  id: string;
  title: string;
  title_fr?: string;
  content: string;
  content_fr?: string;
  excerpt: string;
  excerpt_fr?: string;
  author: string;
  published_at: string;
  updated_at: string;
  reading_time: string | null;
  category: {
    name: string;
    name_fr?: string;
  } | null;
  post_tags: Array<{
    tags: {
      name: string;
      name_fr?: string;
    };
  }>;
  featured_image_url: string | null;
  views: number;
  likes: number;
  comments: number;
  slug: string;
}

const BlogPost: React.FC = () => {
  const { slug, frenchSlug } = useParams<{ slug?: string; frenchSlug?: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['blog', 'common']);
  const currentLanguage = i18n.language;
  
  // Convert French title to slug (same function as Blog.tsx)
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
  
  const [blogPost, setBlogPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Fetch blog post from Supabase
  useEffect(() => {
    const searchSlug = frenchSlug || slug;
    if (searchSlug) {
      fetchBlogPost(searchSlug);
    }
  }, [slug, frenchSlug]);

  const fetchBlogPost = async (postSlug: string) => {
    try {
      // First, get all published posts to find match by French slug if needed
      const { data: allPosts, error: allError } = await supabase
        .from('posts')
        .select(`
          *,
          category:categories(name, name_fr),
          post_tags(
            tags(name, name_fr)
          )
        `)
        .eq('status', 'published');
        
      if (allError) throw allError;
      
      // Find post by English slug or French slug
      // If we have frenchSlug param, search by French slug, otherwise search by English slug
      const matchingPost = allPosts?.find((post: any) => 
        frenchSlug 
          ? (post.title_fr && createFrenchSlug(post.title_fr) === postSlug)
          : post.slug === postSlug
      );
      
      if (!matchingPost) {
        throw new Error('Post not found');
      }
      
      setBlogPost(matchingPost);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setBlogPost(null);
    } finally {
      setLoading(false);
    }
  };

  // Scroll progress and scroll-to-top functionality
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      setReadingProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const formatDate = (dateString: string) => {
    const locale = currentLanguage === 'fr-CA' ? 'fr-CA' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = blogPost?.title;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // In a real app, you'd update the database here
  };

  // Helper function to get translated content
  const getTranslatedContent = (post: BlogPostData) => {
    const isFrench = currentLanguage === 'fr-CA';
    return {
      title: (isFrench && post.title_fr) ? post.title_fr : post.title,
      content: (isFrench && post.content_fr) ? post.content_fr : post.content,
      excerpt: (isFrench && post.excerpt_fr) ? post.excerpt_fr : post.excerpt,
      categoryName: post.category ? 
        ((isFrench && post.category.name_fr) ? post.category.name_fr : post.category.name) : null,
      tags: post.post_tags.map(postTag => 
        (isFrench && postTag.tags.name_fr) ? postTag.tags.name_fr : postTag.tags.name
      )
    };
  };

  // Helper function to get translated author info
  const getTranslatedAuthorInfo = (author: string) => {
    const isFrench = currentLanguage === 'fr-CA';
    
    // Author name translations
    const authorTranslations: Record<string, string> = {
      'James Thompson': isFrench ? 'James Thompson' : 'James Thompson', // Keep same for now
    };
    
    return {
      name: authorTranslations[author] || author,
      profession: isFrench ? 'Écrivain de voyage' : 'Travel Writer'
    };
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {t('blog:postNotFound', { defaultValue: 'Post Not Found' })}
            </h1>
            <p className="text-gray-600 mb-8">
              {t('blog:postNotFoundDescription', { defaultValue: 'The blog post you are looking for does not exist or has been removed.' })}
            </p>
            <Button onClick={() => navigate('/blog')} className="bg-blue-600 hover:bg-blue-700">
              <ChevronLeft className="h-4 w-4 mr-2" />
              {t('blog:backToBlog', { defaultValue: 'Back to Blog' })}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const translatedContent = blogPost ? getTranslatedContent(blogPost) : null;

  return (
    <>
      <Helmet>
        <title>{translatedContent?.title || blogPost?.title} - BelizeVibes</title>
        <meta name="description" content={translatedContent?.excerpt || blogPost?.excerpt} />
        <meta property="og:title" content={translatedContent?.title || blogPost?.title} />
        <meta property="og:description" content={translatedContent?.excerpt || blogPost?.excerpt} />
        <meta property="og:image" content={blogPost.featured_image_url || ''} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={translatedContent?.title || blogPost?.title} />
        <meta name="twitter:description" content={translatedContent?.excerpt || blogPost?.excerpt} />
        <meta name="twitter:image" content={blogPost.featured_image_url || ''} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:bg-gradient-to-br dark:from-blue-950/20 dark:via-background dark:to-blue-950/10">
        {/* Reading Progress Bar */}
        <div 
          className="fixed top-0 left-0 h-1 bg-belize-orange-600 dark:bg-belize-orange-700 z-50 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />

        {/* Breadcrumbs */}
        <div className="bg-white dark:bg-card border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-belize-green-600 dark:text-belize-green-400 hover:underline">
                {t('navigation:home', { defaultValue: 'Home' })}
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <Link to="/blog" className="text-belize-green-600 dark:text-belize-green-400 hover:underline">
                {t('navigation:blog', { defaultValue: 'Blog' })}
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground truncate">
                {translatedContent?.title || blogPost.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative py-20 px-4">
          {blogPost.featured_image_url && (
            <div className="absolute inset-0 z-0">
              <img 
                src={blogPost.featured_image_url} 
                alt={translatedContent?.title || blogPost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black opacity-60"></div>
            </div>
          )}
          
          <div className="container mx-auto relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <Button 
                onClick={() => navigate('/blog')}
                variant="ghost"
                className="mb-8 text-white hover:bg-white hover:bg-opacity-20 transition-all duration-300"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                {t('blog:backToBlog', { defaultValue: 'Back to Blog' })}
              </Button>
              
              <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6 leading-tight">
                {translatedContent?.title || blogPost.title}
              </h1>
              
              <div className="flex items-center justify-center space-x-6 text-lg opacity-90">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>{getTranslatedAuthorInfo(blogPost.author).name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>{formatDate(blogPost.published_at)}</span>
                </div>
                {blogPost.reading_time && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>{getTranslatedReadingTime(blogPost.reading_time, currentLanguage)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Main Content */}
              <article className="lg:col-span-3">
                <Card className="shadow-lg">
                  <CardContent className="p-10">
                    {/* Article Meta */}
                    <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b">
                      {blogPost.category && (
                        <Badge className="bg-belize-orange-600 dark:bg-belize-orange-700 text-white hover:bg-belize-orange-700 dark:hover:bg-belize-orange-800 transition-colors duration-300">
                          {translatedContent?.categoryName || blogPost.category.name}
                        </Badge>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        {blogPost.post_tags?.map((tagRelation, index) => {
                          const isFrench = currentLanguage === 'fr-CA';
                          const tagName = (isFrench && tagRelation.tags.name_fr) ? tagRelation.tags.name_fr : tagRelation.tags.name;
                          return (
                            <Badge key={index} className="bg-belize-orange-600 dark:bg-belize-orange-700 text-white hover:bg-belize-orange-700 dark:hover:bg-belize-orange-800 transition-colors duration-300">
                              {tagName}
                            </Badge>
                          );
                        })}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 ml-auto">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{blogPost.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{blogPost.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{blogPost.comments}</span>
                        </div>
                      </div>
                    </div>

                    {/* Article Body */}
                    <div 
                      className="prose prose-xl max-w-none leading-relaxed text-lg"
                      dangerouslySetInnerHTML={{ __html: translatedContent?.content || blogPost.content }}
                    />

                    <Separator className="my-8" />

                    {/* Article Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button
                          onClick={handleLike}
                          variant={isLiked ? "default" : "outline"}
                          size="sm"
                          className={`flex items-center space-x-2 transition-all duration-300 ${
                            isLiked ? 'bg-belize-orange-500 hover:bg-belize-orange-600 dark:bg-belize-orange-600 dark:hover:bg-belize-orange-700' : 'hover:bg-belize-orange-100 dark:hover:bg-belize-orange-900/20'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                          <span>{isLiked ? 'Liked' : 'Like'}</span>
                        </Button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 mr-2">Share:</span>
                        <Button
                          onClick={() => handleShare('facebook')}
                          variant="outline"
                          size="sm"
                          className="hover:bg-belize-green-100 transition-colors duration-300"
                        >
                          <Facebook className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleShare('twitter')}
                          variant="outline"
                          size="sm"
                          className="hover:bg-belize-green-100 transition-colors duration-300"
                        >
                          <Twitter className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleShare('copy')}
                          variant="outline"
                          size="sm"
                          className="hover:bg-belize-green-100 transition-colors duration-300"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </article>

              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  
                  {/* Author Info */}
                  <Card className="p-6">
                    <h3 className="text-xl font-playfair font-semibold text-belize-green-600 dark:text-belize-green-500 mb-4">
                      {t('blog:author.aboutAuthor', { defaultValue: 'About the Author' })}
                    </h3>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-belize-orange-600 dark:bg-belize-orange-700 rounded-full flex items-center justify-center text-white font-bold">
                        {getTranslatedAuthorInfo(blogPost.author).name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold">{getTranslatedAuthorInfo(blogPost.author).name}</h4>
                        <p className="text-sm text-gray-500">{getTranslatedAuthorInfo(blogPost.author).profession}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {t('blog:author.authorBio', { defaultValue: 'Experienced solo traveler sharing authentic adventures and practical tips from Belize.' })}
                    </p>
                  </Card>

                  {/* Related Topics */}
                  {blogPost.post_tags && blogPost.post_tags.length > 0 && (
                    <Card className="p-6">
                      <h3 className="text-xl font-playfair font-semibold text-belize-green-600 dark:text-belize-green-500 mb-4">
                        {t('blog:author.relatedTopics', { defaultValue: 'Related Topics' })}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {blogPost.post_tags.map((tagRelation, index) => (
                          <Badge 
                            key={index}
                            className="bg-belize-orange-600 dark:bg-belize-orange-700 text-white hover:bg-belize-orange-700 dark:hover:bg-belize-orange-800 cursor-pointer transition-colors duration-300"
                          >
                            {tagRelation.tags.name}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <ScrollToTopButton />
      </div>
    </>
  );
};

export default BlogPost;