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
  Instagram,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  MessageCircle,
  ArrowUp
} from 'lucide-react';

interface BlogPostData {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishDate: string;
  lastModified: string;
  readingTime: string;
  category: string;
  tags: string[];
  featuredImage: string;
  metaDescription: string;
  keywords: string[];
  views: number;
  likes: number;
  comments: number;
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['blog', 'common']);
  
  const [blogPost, setBlogPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Blog post data mapping
  const blogPostMap: Record<string, BlogPostData> = {
    '10-solo-adventures-belize': {
      id: 1,
      title: t('blog:posts.post1.title'),
      content: t('blog:posts.post1.fullContent'),
      excerpt: t('blog:posts.post1.excerpt'),
      author: 'Maya Rodriguez',
      publishDate: '2024-12-15',
      lastModified: '2024-12-15',
      readingTime: '8 min read',
      category: 'Adventures',
      tags: ['Solo Travel', 'Adventure', 'Belize', 'Travel Tips'],
      featuredImage: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=1200&h=600&fit=crop&crop=center',
      metaDescription: t('blog:posts.post1.metaDescription'),
      keywords: ['solo travel belize', 'belize adventures', 'solo adventures', 'belize travel guide'],
      views: 1247,
      likes: 89,
      comments: 23
    },
    'solo-travel-safety-belize': {
      id: 2,
      title: t('blog:posts.post2.title'),
      content: t('blog:posts.post2.fullContent'),
      excerpt: t('blog:posts.post2.excerpt'),
      author: 'Carlos Mendez',
      publishDate: '2024-12-10',
      lastModified: '2024-12-10',
      readingTime: '6 min read',
      category: 'Safety',
      tags: ['Safety', 'Solo Travel', 'Travel Tips', 'Belize'],
      featuredImage: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1200&h=600&fit=crop&crop=center',
      metaDescription: t('blog:posts.post2.metaDescription'),
      keywords: ['belize safety', 'solo travel safety', 'travel safety tips', 'belize travel guide'],
      views: 987,
      likes: 76,
      comments: 18
    },
    'san-ignacio-week-guide': {
      id: 3,
      title: t('blog:posts.post3.title'),
      content: t('blog:posts.post3.fullContent'),
      excerpt: t('blog:posts.post3.excerpt'),
      author: 'Sarah Thompson',
      publishDate: '2024-12-05',
      lastModified: '2024-12-05',
      readingTime: '10 min read',
      category: 'Destinations',
      tags: ['San Ignacio', 'Budget Travel', 'Luxury Travel', 'Belize'],
      featuredImage: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200&h=600&fit=crop&crop=center',
      metaDescription: t('blog:posts.post3.metaDescription'),
      keywords: ['san ignacio belize', 'belize budget travel', 'belize luxury travel', 'san ignacio guide'],
      views: 1156,
      likes: 94,
      comments: 31
    }
  };

  useEffect(() => {
    if (slug) {
      const post = blogPostMap[slug];
      if (post) {
        setBlogPost(post);
        // Simulate loading time
        setTimeout(() => setLoading(false), 500);
      } else {
        // Post not found
        setLoading(false);
      }
    }
  }, [slug, i18n.language]);

  // Scroll progress and scroll-to-top functionality
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setReadingProgress(scrollPercent);
      setShowScrollTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    // In real app, this would update the database
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-foreground">Blog Post Not Found</h1>
          <Button onClick={() => navigate('/blog')}>Back to Blog</Button>
        </div>
      </div>
    );
  }

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blogPost.title,
    "description": blogPost.metaDescription,
    "image": blogPost.featuredImage,
    "author": {
      "@type": "Person",
      "name": blogPost.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "BelizeVibes",
      "logo": {
        "@type": "ImageObject",
        "url": "https://belizevibes.com/logo.png"
      }
    },
    "datePublished": blogPost.publishDate,
    "dateModified": blogPost.lastModified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    }
  };

  return (
    <>
      {/* SEO Meta Tags with React Helmet */}
      <Helmet>
        <title>{blogPost.title} | BelizeVibes</title>
        <meta name="description" content={blogPost.metaDescription} />
        <meta name="keywords" content={blogPost.keywords.join(', ')} />
        <meta name="author" content={blogPost.author} />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blogPost.title} />
        <meta property="og:description" content={blogPost.metaDescription} />
        <meta property="og:image" content={blogPost.featuredImage} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="BelizeVibes" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blogPost.title} />
        <meta name="twitter:description" content={blogPost.metaDescription} />
        <meta name="twitter:image" content={blogPost.featuredImage} />
        
        {/* Article specific */}
        <meta property="article:author" content={blogPost.author} />
        <meta property="article:published_time" content={blogPost.publishDate} />
        <meta property="article:modified_time" content={blogPost.lastModified} />
        <meta property="article:section" content={blogPost.category} />
        {blogPost.tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
        
        {/* Canonical URL */}
        <link rel="canonical" href={window.location.href} />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-blue-600 z-50 transition-all duration-300"
        style={{ width: `${readingProgress}%` }}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Breadcrumbs */}
        <div className="bg-white dark:bg-gray-800 border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-blue-600 hover:underline">{t('common:navigation.home')}</Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <Link to="/blog" className="text-blue-600 hover:underline">{t('common:navigation.blog')}</Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300 truncate">{blogPost.title}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative h-96 lg:h-[500px] overflow-hidden">
          <img 
            src={blogPost.featuredImage} 
            alt={blogPost.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
            <div className="container mx-auto">
              <div className="max-w-4xl">
                <Badge className="mb-4 bg-blue-600 text-white">{blogPost.category}</Badge>
                <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  {blogPost.title}
                </h1>
                <p className="text-xl text-white/90 mb-6 line-clamp-2">
                  {blogPost.excerpt}
                </p>
                
                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-4 text-white/80">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{blogPost.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(blogPost.publishDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{blogPost.readingTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{blogPost.views.toLocaleString()} views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Article Content */}
            <main className="lg:col-span-3">
              <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 lg:p-12">
                
                {/* Article Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {blogPost.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Article Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ __html: blogPost.content }}
                    className="text-gray-700 dark:text-gray-300 leading-relaxed"
                  />
                </div>

                <Separator className="my-8" />

                {/* Article Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant={isLiked ? "default" : "outline"}
                      size="sm"
                      onClick={handleLike}
                      className="flex items-center gap-2"
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      {blogPost.likes + (isLiked ? 1 : 0)}
                    </Button>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MessageCircle className="w-4 h-4" />
                      <span>{blogPost.comments}</span>
                    </div>
                  </div>

                  {/* Social Share */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 mr-2">Share:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('facebook')}
                    >
                      <Facebook className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('twitter')}
                    >
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('copy')}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Author Bio */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{blogPost.author}</h3>
                      <p className="text-gray-600 dark:text-gray-300">Travel Writer & Belize Expert</p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {blogPost.author} is a passionate travel writer with over 10 years of experience exploring Central America. 
                    Specializing in solo travel and sustainable tourism, she has visited Belize numerous times and shares 
                    insider knowledge to help fellow travelers discover the magic of this incredible destination.
                  </p>
                </div>
              </article>
            </main>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                
                {/* Table of Contents - Placeholder */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Table of Contents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <nav className="space-y-2">
                      <a href="#introduction" className="block text-sm text-blue-600 hover:underline">Introduction</a>
                      <a href="#section1" className="block text-sm text-blue-600 hover:underline">Getting Started</a>
                      <a href="#section2" className="block text-sm text-blue-600 hover:underline">Best Practices</a>
                      <a href="#conclusion" className="block text-sm text-blue-600 hover:underline">Conclusion</a>
                    </nav>
                  </CardContent>
                </Card>

                {/* Related Posts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Related Posts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* We'll populate this with actual related posts */}
                    <div className="text-sm text-gray-600">
                      Related posts coming soon...
                    </div>
                  </CardContent>
                </Card>

                {/* Newsletter Signup */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Stay Updated</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Get the latest travel tips and Belize guides delivered to your inbox.
                    </p>
                    <div className="space-y-3">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <Button className="w-full">Subscribe</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 rounded-full w-12 h-12 shadow-lg"
          size="icon"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
};

export default BlogPost;