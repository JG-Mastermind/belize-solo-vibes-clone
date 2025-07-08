import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, Facebook, Instagram, Mail } from "lucide-react";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "10 Solo Adventures to Take in Belize",
      excerpt: "From cave tubing to jungle zip-lining, discover the best solo-friendly adventures that Belize has to offer.",
      imgUrl: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800&h=400&fit=crop&crop=center",
      author: "Maya Rodriguez",
      date: "December 15, 2024",
      slug: "10-solo-adventures-belize"
    },
    {
      id: 2,
      title: "How to Stay Safe While Traveling Alone",
      excerpt: "Essential safety tips and precautions for solo travelers exploring Belize's beautiful landscapes.",
      imgUrl: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=400&fit=crop&crop=center",
      author: "Carlos Mendez",
      date: "December 10, 2024",
      slug: "solo-travel-safety-belize"
    },
    {
      id: 3,
      title: "A Week in San Ignacio: Budget & Luxury Picks",
      excerpt: "Whether you're backpacking or splurging, here's how to make the most of San Ignacio's adventure scene.",
      imgUrl: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=400&fit=crop&crop=center",
      author: "Sarah Thompson",
      date: "December 5, 2024",
      slug: "san-ignacio-week-guide"
    },
    {
      id: 4,
      title: "Wildlife Watching: A Solo Traveler's Guide",
      excerpt: "Spot jaguars, howler monkeys, and exotic birds on your own terms with these wildlife watching tips.",
      imgUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=400&fit=crop&crop=center",
      author: "Elena Castro",
      date: "November 28, 2024",
      slug: "wildlife-watching-solo"
    },
    {
      id: 5,
      title: "Budget-Friendly Belize: Solo Travel on $50/Day",
      excerpt: "Discover how to experience Belize's wonders without breaking the bank, from hostels to street food.",
      imgUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&h=400&fit=crop&crop=center",
      author: "Mike Johnson",
      date: "November 20, 2024",
      slug: "budget-belize-solo-travel"
    },
    {
      id: 6,
      title: "The Best Time to Visit Belize for Solo Travelers",
      excerpt: "Weather, crowds, and costs - everything you need to know about timing your solo Belize adventure.",
      imgUrl: "https://images.unsplash.com/photo-1518495973542-4543c06a5843?w=800&h=400&fit=crop&crop=center",
      author: "Ana Gutierrez",
      date: "November 15, 2024",
      slug: "best-time-visit-belize"
    }
  ];

  const popularTopics = [
    "Wildlife", "Safety", "Budget Travel", "Group Tours", "Jungle Adventures", 
    "Beach Activities", "Cultural Experiences", "Solo Tips", "Photography"
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
              Solo Travel Guide
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Tips, stories, and inspiration for your Belize journey.
            </p>
            <Button 
              onClick={() => document.getElementById('blog-posts')?.scrollIntoView({ behavior: 'smooth' })}
              size="lg" 
              className="bg-belize-orange-500 hover:bg-belize-orange-600 text-white px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Start Reading
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
              Latest Stories
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
                      Read More
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
                Popular Topics
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
                Follow Us
              </h3>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  aria-label="Follow us on Facebook"
                  className="w-10 h-10 bg-belize-green-500 rounded-full flex items-center justify-center hover:bg-belize-green-600 transition-colors text-white"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  aria-label="Follow us on Instagram"
                  className="w-10 h-10 bg-belize-green-500 rounded-full flex items-center justify-center hover:bg-belize-green-600 transition-colors text-white"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </Card>

            <Card className="p-6" aria-labelledby="newsletter-heading">
              <h3 id="newsletter-heading" className="text-xl font-playfair font-semibold text-belize-neutral-900 mb-4">
                Stay Updated
              </h3>
              <p className="text-sm text-belize-neutral-600 mb-4">
                Get the latest travel tips and adventure stories delivered to your inbox.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full px-3 py-2 border border-belize-neutral-200 rounded-lg focus:ring-2 focus:ring-belize-green-500 focus:border-transparent outline-none transition-all duration-300"
                />
                <Button 
                  type="submit"
                  className="w-full bg-belize-orange-500 hover:bg-belize-orange-600 text-white"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Subscribe
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