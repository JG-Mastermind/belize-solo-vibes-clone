
import { Button } from "@/components/ui/button";
import { Star, Users, Shield, Leaf } from "lucide-react";
import { useEffect, useState } from "react";

const AnimatedCounter = ({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
};

const Hero = () => {
  const scrollToAdventures = () => {
    const adventuresSection = document.getElementById('adventures');
    if (adventuresSection) {
      adventuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTestimonials = () => {
    const testimonialsSection = document.querySelector('[data-testimonials]');
    if (testimonialsSection) {
      testimonialsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1920&h=1080&fit=crop&crop=center')`
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-playfair font-bold mb-6 leading-tight">
            Discover Your Ultimate 
            <span className="block text-belize-orange-500">Belize Adventure</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90 px-4">
            Join solo-friendly adventures through pristine jungles, ancient caves, and crystal-clear waters. 
            Expert guides, sustainable travel, unforgettable memories.
          </p>

          {/* Animated Trust Statistics */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="trust-badge bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[140px]">
              <div className="text-2xl font-bold text-belize-orange-500">
                <AnimatedCounter end={500} suffix="+" />
              </div>
              <div className="text-sm font-semibold">Happy Travelers</div>
            </div>
            <div className="trust-badge bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[140px]">
              <div className="text-2xl font-bold text-belize-green-500">100%</div>
              <div className="text-sm font-semibold">Local Guides</div>
            </div>
            <div className="trust-badge bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[140px]">
              <div className="text-2xl font-bold text-belize-blue-500">
                <AnimatedCounter end={98} suffix="%" />
              </div>
              <div className="text-sm font-semibold">5-Star Reviews</div>
            </div>
          </div>

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
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Button 
              size="lg" 
              onClick={scrollToAdventures}
              className="bg-belize-orange-500 hover:bg-belize-orange-600 text-white px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
              aria-label="Explore available adventures"
            >
              Explore Adventures
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={scrollToTestimonials}
              className="border-white text-white hover:bg-white hover:text-belize-neutral-800 px-8 py-3 text-lg font-semibold transition-all duration-300"
              aria-label="View customer reviews"
            >
              View Reviews
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
