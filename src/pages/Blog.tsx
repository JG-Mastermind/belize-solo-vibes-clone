import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, Facebook, Instagram, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

const Blog = () => {
  const { t } = useTranslation(['blog']);
  
  const blogPosts = [
    {
      id: 1,
      title: t('blog:posts.post1.title'),
      excerpt: t('blog:posts.post1.excerpt'),
      imgUrl: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800&h=400&fit=crop&crop=center",
      author: "Maya Rodriguez",
      date: "December 15, 2024",
      slug: "10-solo-adventures-belize"
    },
    {
      id: 2,
      title: t('blog:posts.post2.title'),
      excerpt: t('blog:posts.post2.excerpt'),
      imgUrl: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=400&fit=crop&crop=center",
      author: "Carlos Mendez",
      date: "December 10, 2024",
      slug: "solo-travel-safety-belize"
    },
    {
      id: 3,
      title: t('blog:posts.post3.title'),
      excerpt: t('blog:posts.post3.excerpt'),
      imgUrl: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=400&fit=crop&crop=center",
      author: "Sarah Thompson",
      date: "December 5, 2024",
      slug: "san-ignacio-week-guide"
    },
    {
      id: 4,
      title: t('blog:posts.post4.title'),
      excerpt: t('blog:posts.post4.excerpt'),
      imgUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=400&fit=crop&crop=center",
      author: "Elena Castro",
      date: "November 28, 2024",
      slug: "wildlife-watching-solo"
    },
    {
      id: 5,
      title: t('blog:posts.post5.title'),
      excerpt: t('blog:posts.post5.excerpt'),
      imgUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&h=400&fit=crop&crop=center",
      author: "Mike Johnson",
      date: "November 20, 2024",
      slug: "budget-belize-solo-travel"
    },
    {
      id: 6,
      title: t('blog:posts.post6.title'),
      excerpt: t('blog:posts.post6.excerpt'),
      imgUrl: "https://images.unsplash.com/photo-1518495973542-4543c06a5843?w=800&h=400&fit=crop&crop=center",
      author: "Ana Gutierrez",
      date: "November 15, 2024",
      slug: "best-time-visit-belize"
    }
  ];

  const popularTopics = [
    t('blog:topics.wildlife'), t('blog:topics.safety'), t('blog:topics.budgetTravel'), 
    t('blog:topics.groupTours'), t('blog:topics.jungleAdventures'), 
    t('blog:topics.beachActivities'), t('blog:topics.culturalExperiences'), 
    t('blog:topics.soloTips'), t('blog:topics.photography')
  ];

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Future implementation: handle form submission
    console.log('Newsletter form submitted');
  };

  return (
    <React.Fragment>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop&crop=center')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-belize-green-700/80 to-belize-blue-700/80" />
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6 leading-tight">
              {t('blog:hero.title')}
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              {t('blog:hero.subtitle')}
            </p>
            <Button 
              onClick={() => document.getElementById('blog-posts')?.scrollIntoView({ behavior: 'smooth' })}
              size="lg" 
              className="bg-belize-orange-500 hover:bg-belize-orange-600 text-white px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              {t('blog:hero.startReading')}
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-16">
        <div className="lg:grid lg:grid-cols-4 lg:gap-12">
          
          {/* Blog Posts Grid */}
          <main className="lg:col-span-3" id="blog-posts" aria-labelledby="latest-stories-heading">
            <h2 id="latest-stories-heading" className="text-3xl font-playfair font-bold text-belize-neutral-900 mb-8 text-center lg:text-left">
              {t('blog:main.latestStories')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer group">
                  <div className="relative overflow-hidden">
                    <img 
                      src={post.imgUrl} 
                      alt={post.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-playfair text-belize-neutral-900 group-hover:text-belize-green-600 transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-belize-neutral-600 line-clamp-2">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-belize-neutral-500 mb-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-belize-green-500 text-belize-green-600 hover:bg-belize-green-500 hover:text-white transition-all duration-300"
                      onClick={() => console.log(`Maps to: /blog/${post.slug}`)}
                    >
                      {t('blog:main.readMore')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>

          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-8 mt-16 lg:mt-0">
            
            <Card className="p-6" aria-labelledby="popular-topics-heading">
              <h3 id="popular-topics-heading" className="text-xl font-playfair font-semibold text-belize-neutral-900 mb-4">
                {t('blog:sidebar.popularTopics')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTopics.map((topic, index) => (
                  <button
                    key={index}
                    className="px-3 py-1 text-sm bg-belize-green-100 text-belize-green-700 rounded-full hover:bg-belize-green-500 hover:text-white transition-colors duration-300"
                    onClick={() => console.log(`Filter by: ${topic}`)}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-6" aria-labelledby="follow-us-heading">
              <h3 id="follow-us-heading" className="text-xl font-playfair font-semibold text-belize-neutral-900 mb-4">
                {t('blog:sidebar.followUs')}
              </h3>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  aria-label={t('blog:socialMedia.facebookLabel')}
                  className="w-10 h-10 bg-belize-green-500 rounded-full flex items-center justify-center hover:bg-belize-green-600 transition-colors text-white"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  aria-label={t('blog:socialMedia.instagramLabel')}
                  className="w-10 h-10 bg-belize-green-500 rounded-full flex items-center justify-center hover:bg-belize-green-600 transition-colors text-white"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </Card>

            <Card className="p-6" aria-labelledby="newsletter-heading">
              <h3 id="newsletter-heading" className="text-xl font-playfair font-semibold text-belize-neutral-900 mb-4">
                {t('blog:sidebar.stayUpdated')}
              </h3>
              <p className="text-sm text-belize-neutral-600 mb-4">
                {t('blog:sidebar.newsletterDescription')}
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder={t('blog:sidebar.emailPlaceholder')}
                  required
                  className="w-full px-3 py-2 border border-belize-neutral-200 rounded-lg focus:ring-2 focus:ring-belize-green-500 focus:border-transparent outline-none transition-all duration-300"
                />
                <Button 
                  type="submit"
                  className="w-full bg-belize-orange-500 hover:bg-belize-orange-600 text-white"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {t('blog:sidebar.subscribe')}
                </Button>
              </form>
            </Card>
          </aside>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Blog;