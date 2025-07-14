import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, Users, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { adventures } from "@/data/adventures";

const AdventureCards = () => {
  const navigate = useNavigate();

  const handleViewAllAdventures = () => {
    // Could navigate to a dedicated adventures page or show all adventures
    // For now, we'll just scroll to the current section and show a message
    // In a real app, you might navigate to '/adventures' or expand the view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // The 'id' from your data is a number, so we use number here.
  const handleBookNow = (id: number) => {
    navigate(`/booking/${id}`);
  };

  const handleLearnMore = (id: number) => {
    navigate(`/adventure/${id}`);
  };

  return (
    <section id="adventures" className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
            Choose Your Adventure
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From ancient Maya ruins to pristine coral reefs, discover the best of Belize with our carefully curated adventures designed for solo travelers and small groups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {adventures.map((adventure, index) => (
            <Card key={adventure.id} className="adventure-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="relative">
                <img 
                  src={adventure.image} 
                  alt={adventure.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-orange-600 font-bold text-lg">{adventure.price}</span>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-white text-sm font-semibold">{adventure.rating}</span>
                  <span className="text-white/80 text-sm">({adventure.reviews})</span>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {adventure.location}
                </div>
                
                <h3 className="text-xl font-playfair font-semibold text-foreground mb-2">
                  {adventure.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {adventure.description}
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
                  <h4 className="text-sm font-semibold text-foreground mb-2">Highlights:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {adventure.highlights.slice(0, 2).map((highlight, idx) => (
                      <li key={idx} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleBookNow(adventure.id)} 
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Book Now
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-primary text-primary hover:bg-primary/10"
                    onClick={() => handleLearnMore(adventure.id)}
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
            className="border-primary text-primary hover:bg-primary/10"
            onClick={handleViewAllAdventures}
          >
            View All Adventures
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AdventureCards;