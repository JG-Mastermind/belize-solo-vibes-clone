
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, Users, MapPin } from "lucide-react";

const adventures = [
  {
    id: 1,
    title: "Cave Tubing & Jungle Trek",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&h=400&fit=crop",
    price: "$149",
    duration: "Full Day",
    groupSize: "4-8 people",
    rating: 4.9,
    reviews: 127,
    location: "Cayo District",
    description: "Float through ancient underground cave systems and explore pristine jungle trails.",
    highlights: ["Ancient Maya caves", "Jungle wildlife spotting", "Professional guide", "Equipment included"]
  },
  {
    id: 2,
    title: "Snorkeling at Hol Chan",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=600&h=400&fit=crop",
    price: "$89",
    duration: "Half Day",
    groupSize: "6-12 people",
    rating: 4.8,
    reviews: 89,
    location: "Ambergris Caye",
    description: "Discover vibrant coral reefs and tropical marine life in Belize's premier marine reserve.",
    highlights: ["Hol Chan Marine Reserve", "Shark Ray Alley", "Colorful coral gardens", "All gear provided"]
  },
  {
    id: 3,
    title: "Caracol Maya Ruins Adventure",
    image: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=600&h=400&fit=crop",
    price: "$199",
    duration: "Full Day",
    groupSize: "4-10 people",
    rating: 4.9,
    reviews: 156,
    location: "Chiquibul Forest",
    description: "Explore Belize's largest Maya archaeological site hidden deep in the jungle.",
    highlights: ["Ancient Maya temples", "Jungle canopy views", "Historical insights", "Lunch included"]
  },
  {
    id: 4,
    title: "Blue Hole Diving Experience",
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=600&h=400&fit=crop",
    price: "$299",
    duration: "Full Day",
    groupSize: "4-8 people",
    rating: 5.0,
    reviews: 73,
    location: "Lighthouse Reef",
    description: "Dive into the world-famous Blue Hole, a UNESCO World Heritage site.",
    highlights: ["UNESCO World Heritage", "Unique geological formation", "Expert dive guides", "Certificate required"]
  },
  {
    id: 5,
    title: "Jungle Zip-lining & Waterfall",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&h=400&fit=crop",
    price: "$119",
    duration: "Half Day",
    groupSize: "6-12 people",
    rating: 4.7,
    reviews: 98,
    location: "Mountain Pine Ridge",
    description: "Soar through the jungle canopy and cool off in natural swimming holes.",
    highlights: ["Canopy zip-lining", "Natural waterfalls", "Swimming opportunities", "Safety certified"]
  },
  {
    id: 6,
    title: "Manatee Watching & Beach Day",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=600&h=400&fit=crop",
    price: "$129",
    duration: "Full Day",
    groupSize: "4-10 people",
    rating: 4.8,
    reviews: 112,
    location: "Placencia",
    description: "Gentle manatee encounters followed by relaxation on pristine beaches.",
    highlights: ["Manatee sanctuary visit", "Pristine beaches", "Beach lunch", "Conservation focus"]
  }
];

const AdventureCards = () => {
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
            <Card key={adventure.id} className="adventure-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="relative">
                <img 
                  src={adventure.image} 
                  alt={adventure.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-belize-orange-600 font-bold text-lg">{adventure.price}</span>
                </div>
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
                
                <h3 className="text-xl font-playfair font-semibold text-belize-neutral-900 mb-2">
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
                  <Button className="flex-1 bg-belize-green-500 hover:bg-belize-green-600 text-white">
                    Book Now
                  </Button>
                  <Button variant="outline" className="flex-1 border-belize-green-500 text-belize-green-600 hover:bg-belize-green-50">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="border-belize-green-500 text-belize-green-600 hover:bg-belize-green-50">
            View All Adventures
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AdventureCards;
