import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, Users, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { adventures } from "@/data/adventures";

// Now using adventures from data file - single source of truth!

const AdventureCards = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['adventureCards', 'common']);

  // Helper function to get translated adventure content
  const getAdventureContent = (adventure: any) => {
    const translatedContent = t(`adventureCards:adventures.${adventure.id}`, { returnObjects: true });
    
    // If translation exists, use it; otherwise fallback to original content
    if (translatedContent && typeof translatedContent === 'object') {
      return {
        title: translatedContent.title || adventure.title,
        description: translatedContent.description || adventure.description,
        highlights: translatedContent.highlights || adventure.highlights,
      };
    }
    
    // Fallback to original content
    return {
      title: adventure.title,
      description: adventure.description,
      highlights: adventure.highlights,
    };
  };

  return (
    <section id="adventures" className="py-16 bg-blue-50 dark:bg-blue-950/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
            {t('adventureCards:title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('adventureCards:subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {adventures.map((adventure, index) => {
            const content = getAdventureContent(adventure);
            return (
            <Card key={adventure.id} className="adventure-card animate-fade-in bg-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden group" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="relative overflow-hidden rounded-t-xl">
                <img 
                  src={adventure.image} 
                  alt={adventure.title}
                  className="w-full h-48 object-cover transition-all duration-300 group-hover:brightness-110 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-md">
                  <span className="text-orange-600 font-bold text-lg">{adventure.price}</span>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center space-x-1 bg-black/70 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-white text-sm font-semibold">{adventure.rating}</span>
                  <span className="text-white/90 text-sm">({adventure.reviews})</span>
                </div>
              </div>
              
              <CardContent className="p-6 bg-white dark:bg-card">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {adventure.location}
                </div>
                
                <h3 className="text-xl font-playfair font-semibold text-foreground mb-2">
                  {content.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {content.description}
                </p>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
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
                  <h4 className="text-sm font-semibold text-foreground mb-2">{t('adventureCards:highlights')}</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {content.highlights.slice(0, 2).map((highlight, idx) => (
                      <li key={idx} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    onClick={() => navigate(`/booking/${adventure.id}`)}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white transition-colors duration-300"
                  >
                    {t('common:bookNow')}
                  </Button>
                  <Button 
                    onClick={() => navigate(`/adventure/${adventure.id}`)}
                    variant="outline" 
                    className="flex-1 border-orange-600 text-orange-600 hover:bg-orange-50 transition-colors duration-300"
                  >
                    {t('common:learnMore')}
                  </Button>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            {t('adventureCards:viewAllAdventures')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AdventureCards;