
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Users } from "lucide-react";
import { adventures } from "@/data/adventures";

const AdventureCards = () => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [imagesLoaded, setImagesLoaded] = useState<{ [key: number]: boolean }>({});

  const handleImageLoad = (id: number) => {
    setImagesLoaded(prev => ({ ...prev, [id]: true }));
  };

  const getDifficultyLevel = (adventure: any) => {
    // Map difficulty or provide default
    if (adventure.difficulty) return adventure.difficulty;
    if (adventure.title?.toLowerCase().includes('extreme')) return 'extreme';
    if (adventure.title?.toLowerCase().includes('challenging')) return 'challenging';
    if (adventure.title?.toLowerCase().includes('easy')) return 'easy';
    return 'moderate'; // default
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'challenging': return 'bg-orange-500';
      case 'extreme': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const formatPrice = (price: string | undefined) => {
    if (!price) return 'From $99';
    return price.startsWith('From') ? price : `From ${price}`;
  };

  const getDuration = (adventure: any) => {
    if (adventure.duration) return adventure.duration;
    return '3-4 hours'; // default duration
  };

  return (
    <section id="adventures" className="py-16 bg-gradient-to-b from-white to-belize-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-belize-neutral-900 mb-4">
            Popular Adventures
          </h2>
          <p className="text-lg text-belize-neutral-600 max-w-2xl mx-auto">
            Discover Belize's most exciting experiences, curated for solo travelers and small groups
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {adventures.slice(0, visibleCount).map((adventure, index) => {
            const difficulty = getDifficultyLevel(adventure);
            
            return (
              <Card 
                key={adventure.id} 
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden hover:scale-105 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <div className="aspect-video bg-belize-neutral-200 relative">
                    {adventure.image && (
                      <img
                        src={adventure.image}
                        alt={adventure.title}
                        loading="lazy"
                        className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                          imagesLoaded[adventure.id || 0] ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => handleImageLoad(adventure.id || 0)}
                      />
                    )}
                    {!imagesLoaded[adventure.id || 0] && (
                      <div className="absolute inset-0 bg-belize-neutral-200 animate-pulse" />
                    )}
                  </div>
                  
                  {/* Difficulty Badge */}
                  <Badge 
                    className={`absolute top-3 left-3 ${getDifficultyColor(difficulty)} text-white border-0 text-xs font-medium`}
                  >
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </Badge>

                  {/* Rating Badge */}
                  {adventure.rating && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium text-belize-neutral-900">
                        {adventure.rating}
                      </span>
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="space-y-3">
                    <h3 className="text-xl font-playfair font-semibold text-belize-neutral-900 group-hover:text-belize-green-600 transition-colors">
                      {adventure.title}
                    </h3>
                    
                    <div className="flex items-center text-sm text-belize-neutral-600 space-x-4">
                      {adventure.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{adventure.location}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{getDuration(adventure)}</span>
                      </div>
                    </div>

                    {adventure.groupSize && (
                      <div className="flex items-center space-x-1 text-sm text-belize-neutral-600">
                        <Users className="h-4 w-4" />
                        <span>Max {adventure.groupSize} people</span>
                      </div>
                    )}

                    <p className="text-belize-neutral-700 text-sm line-clamp-2">
                      {adventure.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-belize-neutral-200">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-belize-green-600">
                          {formatPrice(adventure.price)}
                        </div>
                        <div className="text-xs text-belize-neutral-500">per person</div>
                      </div>
                      
                      <Button 
                        className="bg-belize-green-600 hover:bg-belize-green-700 text-white px-6 py-2 rounded-full transition-all duration-300"
                        onClick={() => {
                          const adventuresSection = document.getElementById('adventures');
                          if (adventuresSection) {
                            adventuresSection.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {visibleCount < adventures.length && (
          <div className="text-center">
            <Button
              onClick={() => setVisibleCount(prev => prev + 6)}
              variant="outline"
              className="border-belize-green-600 text-belize-green-600 hover:bg-belize-green-600 hover:text-white px-8 py-3 rounded-full"
            >
              View All Adventures
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdventureCards;
