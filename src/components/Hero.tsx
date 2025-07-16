import { Button } from "@/components/ui/button";
import { Star, Users, Shield, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

// Tour type for prop
type Tour = {
  id: string;
  title: string;
  description: string;
  location_name: string;
  price_per_person: number;
  duration_hours: number;
  max_participants: number;
  images: string[];
  provider_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

interface HeroProps {
  featuredTour?: Tour | null;
}

const Hero = ({ featuredTour }: HeroProps) => {
  const handleLearnMore = () => {
    document.getElementById('adventures')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewReviews = () => {
    const testimonialsElement = document.getElementById('testimonials');
    if (testimonialsElement) {
      testimonialsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/belize-solo.jpg')`
        }}
      />
      
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold mb-6 leading-tight">
            Discover Your Ultimate 
            <span className="block text-orange-500">Belize Adventure</span>
          </h1>
          
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join solo-friendly adventures through pristine jungles, ancient caves, and crystal-clear waters. 
            Expert guides, sustainable travel, unforgettable memories.
          </p>

          {/* Trust Elements */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div 
              className="bg-black/40 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20 cursor-pointer hover:bg-black/60 transition-colors duration-200"
              onClick={handleViewReviews}
            >
              <Star className="h-5 w-5 text-orange-400 mx-auto mb-1" />
              <div className="text-sm font-semibold text-white">4.9/5 Rating</div>
              <div className="text-xs text-white/80">500+ Reviews</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
              <Users className="h-5 w-5 text-green-400 mx-auto mb-1" />
              <div className="text-sm font-semibold text-white">Solo Friendly</div>
              <div className="text-xs text-white/80">Small Groups</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
              <Shield className="h-5 w-5 text-blue-400 mx-auto mb-1" />
              <div className="text-sm font-semibold text-white">Fully Insured</div>
              <div className="text-xs text-white/80">ATOL Protected</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
              <Leaf className="h-5 w-5 text-green-400 mx-auto mb-1" />
              <div className="text-sm font-semibold text-white">Sustainable</div>
              <div className="text-xs text-white/80">Eco-Certified</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {/* Book Now Button */}
            {featuredTour ? (
              <Button 
                asChild
                size="lg" 
                variant="default"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                aria-label={`Book ${featuredTour.title} for $${featuredTour.price_per_person}`}
              >
                <Link to={`/AdventureDetail/${featuredTour.id}`}>
                  Book Now - ${featuredTour.price_per_person}
                </Link>
              </Button>
            ) : (
              <Button 
                size="lg" 
                variant="default"
                className="bg-gray-500 text-white px-8 py-3 text-lg font-semibold opacity-50 cursor-not-allowed"
                disabled
                aria-label="Loading tours..."
              >
                Loading Tours...
              </Button>
            )}

            {/* Learn More Button */}
            <Button 
              size="lg" 
              variant="ghost" 
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg font-semibold transition-all duration-300 backdrop-blur-sm"
              onClick={handleLearnMore}
              aria-label="Learn more about our adventures"
            >
              Learn More
            </Button>
          </div>

          {/* Featured Tour Info */}
          {featuredTour && (
            <div className="mb-8 text-center">
              <p className="text-sm text-white/80 mb-2">Featured Adventure:</p>
              <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20 inline-block">
                <h3 className="text-lg font-semibold text-white mb-1">{featuredTour.title}</h3>
                <p className="text-sm text-white/90">
                  📍 {featuredTour.location_name} • ⏰ {featuredTour.duration_hours}h • 👥 Up to {featuredTour.max_participants}
                </p>
              </div>
            </div>
          )}

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 opacity-30 animate-float hidden lg:block">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Leaf className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <div className="absolute bottom-32 right-10 opacity-30 animate-float hidden lg:block" style={{ animationDelay: '1s' }}>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Star className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;