
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "Toronto, Canada",
    rating: 5,
    text: "BelizeVibes made my solo trip to Belize absolutely incredible! The Blue Hole dive was a dream come true, and the guides were so knowledgeable and friendly. Perfect for solo travelers who want adventure without the hassle of planning.",
    adventure: "Blue Hole Diving Experience",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Marcus Chen",
    location: "San Francisco, USA",
    rating: 5,
    text: "The Caracol Maya ruins tour was mind-blowing! Our guide shared so many fascinating stories about Maya civilization. As a solo traveler, I felt completely safe and welcomed. The small group size made it feel like a private tour.",
    adventure: "Caracol Maya Ruins Explorer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    location: "Madrid, Spain",
    rating: 5,
    text: "Snorkeling at Hol Chan was like swimming in an aquarium! The marine life was spectacular, and I loved how eco-conscious the tour was. BelizeVibes really cares about sustainable tourism. Highly recommend for nature lovers!",
    adventure: "Hol Chan Marine Reserve",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop&crop=face"
  }
];

const Testimonials = () => {
  return (
    <section data-testimonials className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-belize-neutral-900 mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-lg text-belize-neutral-600 max-w-2xl mx-auto">
            Real experiences from solo travelers who discovered the magic of Belize with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              className="testimonial-card animate-fade-in hover:shadow-lg transition-shadow duration-300"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <Quote className="h-8 w-8 text-belize-orange-500 mb-4 opacity-50" />
                
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-belize-neutral-700 mb-4 leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Adventure */}
                <div className="text-sm text-belize-green-600 font-semibold mb-4">
                  {testimonial.adventure}
                </div>

                {/* User Info */}
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-belize-neutral-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-belize-neutral-600">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-lg text-belize-neutral-600 mb-4">
            Ready to create your own adventure story?
          </p>
          <button 
            onClick={() => {
              const adventuresSection = document.getElementById('adventures');
              if (adventuresSection) {
                adventuresSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-belize-orange-500 hover:bg-belize-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            aria-label="Start booking your adventure"
          >
            Start Your Adventure
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
