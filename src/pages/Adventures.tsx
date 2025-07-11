
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Adventures = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-belize-neutral-50">
      <div className="container mx-auto px-4 py-16">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-8 hover:bg-belize-neutral-200"
          aria-label="Go back to homepage"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-belize-neutral-900 mb-4">
            All Adventures
          </h1>
          <p className="text-xl text-belize-neutral-600 max-w-3xl mx-auto">
            Adventures coming soon. In the meantime, check our top tours on the homepage.
          </p>
        </div>

        {/* Placeholder Content */}
        <div className="bg-white rounded-lg p-8 md:p-12 text-center shadow-sm">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="w-20 h-20 bg-belize-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-10 w-10 text-belize-orange-500" />
              </div>
              <h2 className="text-2xl font-playfair font-bold text-belize-neutral-900 mb-4">
                More Adventures Coming Soon!
              </h2>
              <p className="text-belize-neutral-600 mb-6 leading-relaxed">
                We're working hard to bring you even more incredible Belize adventures. 
                Our expanded catalog will feature over 50 unique experiences across the country, 
                from jungle expeditions to underwater explorations.
              </p>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-belize-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-belize-green-600" />
                </div>
                <h3 className="font-semibold text-belize-neutral-900 mb-2">50+ Locations</h3>
                <p className="text-sm text-belize-neutral-600">Explore hidden gems across Belize</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-belize-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-belize-blue-600" />
                </div>
                <h3 className="font-semibold text-belize-neutral-900 mb-2">Flexible Timing</h3>
                <p className="text-sm text-belize-neutral-600">Half-day to multi-day adventures</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-belize-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-belize-orange-600" />
                </div>
                <h3 className="font-semibold text-belize-neutral-900 mb-2">Small Groups</h3>
                <p className="text-sm text-belize-neutral-600">Personal experiences with expert guides</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/')}
                className="bg-belize-orange-500 hover:bg-belize-orange-600 text-white px-8 py-3"
                aria-label="View current adventures on homepage"
              >
                View Current Adventures
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/contact')}
                className="border-belize-green-500 text-belize-green-600 hover:bg-belize-green-50 px-8 py-3"
                aria-label="Contact us for custom adventures"
              >
                Request Custom Adventure
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adventures;
