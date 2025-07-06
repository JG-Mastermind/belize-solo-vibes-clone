
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { useState, useEffect } from "react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "Toronto, Canada",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b630?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "My solo trip to Belize with BelizeVibes was absolutely incredible! The cave tubing experience was magical, and I felt completely safe traveling alone. The guides were knowledgeable and made sure everyone in our small group had an amazing time.",
    trip: "Cave Tubing & Jungle Trek"
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "San Francisco, USA",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "The Blue Hole diving experience exceeded all expectations! As a solo traveler, I was worried about fitting in, but the group was welcoming and the dive masters were professional. Definitely a once-in-a-lifetime experience.",
    trip: "Blue Hole Diving Experience"
  },
  {
    id: 3,
    name: "Emma Thompson",
    location: "London, UK",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "I was nervous about traveling solo, but BelizeVibes made everything seamless. The Caracol Maya ruins tour was fascinating, and I learned so much about Mayan history. The small group size made it feel personal and intimate.",
    trip: "Caracol Maya Ruins Adventure"
  },
  {
    id: 4,
    name: "James Rodriguez",
    location: "Madrid, Spain",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "The snorkeling at Hol Chan was breathtaking! Swimming with nurse sharks and stingrays was surreal. The guides were excellent and made sure everyone felt comfortable in the water. Highly recommend for solo travelers!",
    trip: "Snorkeling at Hol Chan"
  },
  {
    id: 5,
    name: "Lisa Park",
    location: "Seoul, South Korea",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "The zip-lining through the jungle canopy was exhilarating! I traveled alone but never felt lonely thanks to the friendly group and amazing guides. The waterfall swim afterwards was the perfect way to cool down.",
    trip: "Jungle Zip-lining & Waterfall"
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <section id="testimonials" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-belize-neutral-900 mb-4">
            What Solo Travelers Say
          </h2>
          <p className="text-lg text-belize-neutral-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our adventurous solo travelers have to say about their BelizeVibes experiences.
          </p>
        </div>

        {/* Main Testimonial Card */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="bg-gradient-to-br from-belize-green-50 to-belize-blue-50 border-belize-green-200">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                <div className="flex-shrink-0">
                  <img
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <Quote className="h-8 w-8 text-belize-green-400 mb-4 mx-auto md:mx-0" />
                  
                  <p className="text-lg md:text-xl text-belize-neutral-700 mb-6 italic leading-relaxed">
                    "{testimonials[currentIndex].text}"
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-center md:justify-start space-x-1 mb-2">
                      {renderStars(testimonials[currentIndex].rating)}
                    </div>
                    
                    <h4 className="font-semibold text-belize-neutral-900 text-lg">
                      {testimonials[currentIndex].name}
                    </h4>
                    
                    <p className="text-belize-neutral-600">
                      {testimonials[currentIndex].location}
                    </p>
                    
                    <p className="text-sm text-belize-green-600 font-medium">
                      {testimonials[currentIndex].trip}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Testimonial Navigation Dots */}
        <div className="flex justify-center space-x-2 mb-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-belize-green-500' : 'bg-belize-neutral-300 hover:bg-belize-green-300'
              }`}
            />
          ))}
        </div>

        {/* Thumbnail Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-2xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              onClick={() => setCurrentIndex(index)}
              className={`p-3 rounded-lg transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-belize-green-100 border-2 border-belize-green-500' 
                  : 'bg-belize-neutral-50 border-2 border-transparent hover:bg-belize-green-50'
              }`}
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover mx-auto mb-2"
              />
              <p className="text-xs font-medium text-belize-neutral-700 truncate">
                {testimonial.name}
              </p>
            </button>
          ))}
        </div>

        {/* Trust Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-belize-green-600 mb-2">4.9/5</div>
            <div className="text-sm text-belize-neutral-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-belize-green-600 mb-2">500+</div>
            <div className="text-sm text-belize-neutral-600">Happy Travelers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-belize-green-600 mb-2">95%</div>
            <div className="text-sm text-belize-neutral-600">Solo Travelers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-belize-green-600 mb-2">100%</div>
            <div className="text-sm text-belize-neutral-600">Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
