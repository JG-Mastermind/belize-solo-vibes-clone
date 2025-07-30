import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, Users, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// NOTE: Adventure data is unchanged
const adventures = [
  {
    id: 1,
    title: "Blue Hole Diving Experience",
    location: "Blue Hole, Belize",
    price: "$299",
    rating: 4.9,
    reviews: 127,
    duration: "Full Day",
    groupSize: "Max 8",
    image: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Dive into the world-famous Blue Hole, a giant marine sinkhole that's considered one of the top diving destinations on Earth.",
    highlights: [
      "World Heritage Site diving experience",
      "Professional dive guides included",
      "Equipment and lunch provided"
    ]
  },
  {
    id: 2,
    title: "Caracol Maya Ruins Adventure",
    location: "Cayo District, Belize",
    price: "$199",
    rating: 4.8,
    reviews: 95,
    duration: "8 Hours",
    groupSize: "Max 12",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Explore the largest Maya archaeological site in Belize, hidden deep in the Chiquibul Forest Reserve.",
    highlights: [
      "Climb the 143-foot tall Canaa pyramid",
      "Expert archaeological guide",
      "Jungle wildlife spotting opportunities"
    ]
  },
  {
    id: 3,
    title: "Sunrise Fishing & Island Hopping",
    location: "Ambergris Caye, Belize",
    price: "$149",
    rating: 4.7,
    reviews: 203,
    duration: "6 Hours",
    groupSize: "Max 6",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Start your day with sunrise fishing followed by snorkeling and exploring pristine cayes around Ambergris.",
    highlights: [
      "Early morning departure for best fishing",
      "Snorkeling gear included",
      "Fresh ceviche lunch on the boat"
    ]
  },
  {
    id: 4,
    title: "Cave Tubing & Jungle Trek",
    location: "Cayo District, Belize",
    price: "$89",
    rating: 4.6,
    reviews: 156,
    duration: "5 Hours",
    groupSize: "Max 10",
    image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Float through ancient Maya caves on inner tubes while exploring the mystical underground river systems.",
    highlights: [
      "Ancient Maya cave system exploration",
      "Jungle hiking and wildlife spotting",
      "Swimming in crystal-clear cenotes"
    ]
  },
  {
    id: 5,
    title: "Mountain Biking & Beach Day",
    location: "Hopkins, Belize",
    price: "$125",
    rating: 4.5,
    reviews: 78,
    duration: "7 Hours",
    groupSize: "Max 8",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Cycle through Garifuna villages and jungle trails, ending with relaxation on pristine Caribbean beaches.",
    highlights: [
      "Cultural village interactions",
      "Mountain bike through jungle trails",
      "Traditional Garifuna lunch included"
    ]
  },
  {
    id: 6,
    title: "Jungle Zip-lining & Waterfall Tour",
    location: "Toledo District, Belize",
    price: "$169",
    rating: 4.8,
    reviews: 134,
    duration: "6 Hours",
    groupSize: "Max 12",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Soar through the rainforest canopy on zip lines and discover hidden waterfalls in the Maya Mountains.",
    highlights: [
      "Multi-level zip line course",
      "Swimming in natural pools",
      "Rainforest wildlife spotting"
    ]
  },
  {
    id: 7,
    title: "Night Jungle Safari",
    location: "Cockscomb Basin, Belize",
    price: "$95",
    rating: 4.7,
    reviews: 89,
    duration: "4 Hours",
    groupSize: "Max 8",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Experience the jungle come alive at night with guided tours through jaguar preserve territory.",
    highlights: [
      "Nocturnal wildlife spotting",
      "Professional night vision equipment",
      "Jaguar preserve exploration"
    ]
  },
  {
    id: 8,
    title: "Snorkeling at Hol Chan Marine Reserve",
    location: "Hol Chan Marine Reserve, Belize",
    price: "$75",
    rating: 4.9,
    reviews: 267,
    duration: "4 Hours",
    groupSize: "Max 15",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Snorkel in Belize's most famous marine reserve, home to nurse sharks, stingrays, and vibrant coral reefs.",
    highlights: [
      "Swimming with nurse sharks and rays",
      "Vibrant coral reef exploration",
      "Marine biologist guide included"
    ]
  },
  {
    id: 9,
    title: "Cultural Village Tour & Chocolate Making",
    location: "Toledo District, Belize",
    price: "$110",
    rating: 4.6,
    reviews: 102,
    duration: "5 Hours",
    groupSize: "Max 10",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Visit authentic Maya villages and learn traditional chocolate-making techniques from cacao bean to bar.",
    highlights: [
      "Authentic Maya village experience",
      "Traditional chocolate making workshop",
      "Cultural exchange with local families"
    ]
  }
];

const AdventureCards = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['adventureCards', 'common']);

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
          {adventures.map((adventure, index) => (
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
                  <h4 className="text-sm font-semibold text-foreground mb-2">{t('adventureCards:highlights')}</h4>
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
          ))}
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