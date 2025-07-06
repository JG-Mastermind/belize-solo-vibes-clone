
import { Button } from "@/components/ui/button";
import { Star, Users, Shield, Leaf } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=1920&h=1080&fit=crop&crop=center')`
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold mb-6 leading-tight">
            Discover Your Ultimate 
            <span className="block text-belize-orange-500">Belize Adventure</span>
          </h1>
          
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join solo-friendly adventures through pristine jungles, ancient caves, and crystal-clear waters. 
            Expert guides, sustainable travel, unforgettable memories.
          </p>

          {/* Trust Elements */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="trust-badge">
              <Star className="h-5 w-5 text-belize-orange-500 mx-auto mb-1" />
              <div className="text-sm font-semibold text-belize-neutral-800">4.9/5 Rating</div>
              <div className="text-xs text-belize-neutral-600">500+ Reviews</div>
            </div>
            <div className="trust-badge">
              <Users className="h-5 w-5 text-belize-green-500 mx-auto mb-1" />
              <div className="text-sm font-semibold text-belize-neutral-800">Solo Friendly</div>
              <div className="text-xs text-belize-neutral-600">Small Groups</div>
            </div>
            <div className="trust-badge">
              <Shield className="h-5 w-5 text-belize-blue-500 mx-auto mb-1" />
              <div className="text-sm font-semibold text-belize-neutral-800">Fully Insured</div>
              <div className="text-xs text-belize-neutral-600">ATOL Protected</div>
            </div>
            <div className="trust-badge">
              <Leaf className="h-5 w-5 text-belize-green-600 mx-auto mb-1" />
              <div className="text-sm font-semibold text-belize-neutral-800">Sustainable</div>
              <div className="text-xs text-belize-neutral-600">Eco-Certified</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-belize-orange-500 hover:bg-belize-orange-600 text-white px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Book Your Adventure
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-belize-neutral-800 px-8 py-3 text-lg font-semibold transition-all duration-300"
            >
              View All Trips
            </Button>
          </div>

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
