
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, Users, MapPin, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { adventures } from "@/data/adventures";
import { useState } from "react";

const DifficultyBadge = ({ level }: { level: string }) => {
  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'easy':
        return 'bg-belize-green-500 text-white';
      case 'moderate':
        return 'bg-belize-orange-500 text-white';
      case 'challenging':
        return 'bg-red-500 text-white';
      default:
        return 'bg-belize-neutral-200 text-belize-neutral-800';
    }
  };

  return (
    <div className={`absolute top-4 left-4 px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(level)}`}>
      <Award className="h-3 w-3 inline mr-1" />
      {level}
    </div>
  );
};

const LazyImage = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-belize-neutral-200 animate-pulse rounded-t-lg" />
      )}
      <img 
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        loading="lazy"
      />
      {hasError && (
        <div className="absolute inset-0 bg-belize-neutral-200 flex items-center justify-center text-belize-neutral-500 text-sm">
          Image unavailable
        </div>
      )}
    </div>
  );
};

const AdventureCards = () => {
  const navigate = useNavigate();

  const handleBookNow = (id: number) => {
    navigate(`/booking/${id}`);
  };

  const handleLearnMore = (id: number) => {
    navigate(`/adventure/${id}`);
  };

  return (
    <section id="adventures" className="py-16 bg-belize-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-belize-neutral-900 mb-4">
            Choose Your Adventure
          </h2>
          <p className="text-lg text-belize-neutral-600 max-w-2xl mx-auto">
            From ancient Maya ruins to pristine coral reefs, discover the best of Belize with our carefully curated adventures designed for solo travelers and small groups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {adventures.map((adventure, index) => (
            <Card 
              key={adventure.id} 
              className="adventure-card animate-fade-in group hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <LazyImage
                  src={adventure.image} 
                  alt={adventure.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                
                {/* Difficulty Badge */}
                <DifficultyBadge level={adventure.difficulty || 'Easy'} />
                
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-belize-orange-600 font-bold text-sm">
                    From {adventure.price}
                  </span>
                  <span className="text-belize-neutral-600 text-xs block">
                    / person
                  </span>
                </div>
                
                {/* Rating Badge */}
                <div className="absolute bottom-4 left-4 flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-white text-sm font-semibold">{adventure.rating}</span>
                  <span className="text-white/80 text-sm">({adventure.reviews})</span>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center text-sm text-belize-neutral-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {adventure.location}
                </div>
                
                <h3 className="text-xl font-playfair font-semibold text-belize-neutral-900 mb-2 group-hover:text-belize-orange-600 transition-colors">
                  {adventure.title}
                </h3>
                
                <p className="text-belize-neutral-600 mb-4 line-clamp-2">
                  {adventure.description}
                </p>

                <div className="flex items-center justify-between text-sm text-belize-neutral-600 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {adventure.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {adventure.groupSize}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-belize-neutral-800 mb-2">Highlights:</h4>
                  <ul className="text-sm text-belize-neutral-600 space-y-1">
                    {adventure.highlights.slice(0, 2).map((highlight, idx) => (
                      <li key={idx} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-belize-green-500 rounded-full mr-2" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleBookNow(adventure.id)} 
                    className="flex-1 bg-belize-green-500 hover:bg-belize-green-600 text-white transition-all duration-200 hover:scale-105"
                    aria-label={`Book ${adventure.title} now`}
                  >
                    Book Now
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-belize-green-500 text-belize-green-600 hover:bg-belize-green-50 transition-all duration-200"
                    onClick={() => handleLearnMore(adventure.id)}
                    aria-label={`Learn more about ${adventure.title}`}
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline" 
            className="border-belize-green-500 text-belize-green-600 hover:bg-belize-green-50 hover:scale-105 transition-all duration-200"
            onClick={() => navigate('/adventures')}
            aria-label="View all available adventures"
          >
            View All Adventures
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AdventureCards;
