import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, Facebook, Instagram, Mail } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";

const popularTopics = [
  "Wildlife", "Safety", "Budget Travel", "Group Tours", "Jungle Adventures", 
  "Beach Activities", "Cultural Experiences", "Solo Tips", "Photography"
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-16 min-h-[60vh] flex items-center justify-center overflow-hidden">
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
          <div className="lg:col-span-3" id="blog-posts">
            <h2 className="text-3xl font-playfair font-bold text-belize-neutral-900 mb-8 text-center lg:text-left">
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
                      onClick={() => console.log(`Navigate to: /blog/${post.slug}`)}
                    >
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:col-span-1 space-y-8">
            
            {/* Popular Topics */}
            <Card className="p-6">
              <h3 className="text-xl font-playfair font-semibold text-belize-neutral-900 mb-4">
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

            {/* Social Links */}
            <Card className="p-6">
              <h3 className="text-xl font-playfair font-semibold text-belize-neutral-900 mb-4">
                Follow Us
              </h3>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-belize-green-500 rounded-full flex items-center justify-center hover:bg-belize-green-600 transition-colors text-white"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-belize-green-500 rounded-full flex items-center justify-center hover:bg-belize-green-600 transition-colors text-white"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </Card>

            {/* Newsletter Signup */}
            <Card className="p-6">
              <h3 className="text-xl font-playfair font-semibold text-belize-neutral-900 mb-4">
                Stay Updated
              </h3>
              <p className="text-sm text-belize-neutral-600 mb-4">
                Get the latest travel tips and adventure stories delivered to your inbox.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-belize-neutral-200 rounded-lg focus:ring-2 focus:ring-belize-green-500 focus:border-transparent outline-none transition-all duration-300"
                />
                <Button 
                  className="w-full bg-belize-orange-500 hover:bg-belize-orange-600 text-white"
                  onClick={() => console.log('Newsletter signup - future implementation')}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Subscribe
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
