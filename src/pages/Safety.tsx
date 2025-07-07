import React from "react";
import { Shield, Phone, Heart, Droplets, Cloud, Users, AlertTriangle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Safety = () => {
  const safetyTopics = [
    {
      icon: <Shield className="h-8 w-8 text-belize-blue-500" />,
      title: "Travel Insurance",
      content: "We strongly recommend comprehensive travel insurance covering medical emergencies, trip cancellation, and adventure activities. Many standard policies exclude cave tubing and diving—ensure your policy covers all planned activities."
    },
    {
      icon: <Phone className="h-8 w-8 text-belize-orange-500" />,
      title: "Local Emergency Numbers",
      content: "Police: 911 or 90 • Fire/Ambulance: 911 • Tourist Police: 227-2222 • Our 24/7 Emergency Line: +501-XXX-XXXX. Save these numbers in your phone and keep a physical copy in your wallet."
    },
    {
      icon: <Users className="h-8 w-8 text-belize-green-500" />,
      title: "Group Support for Solo Travelers",
      content: "Never feel alone on your adventure. Our small group sizes (max 8 people) ensure personalized attention. Each group has certified guides with wilderness first aid training and satellite communication devices."
    },
    {
      icon: <Heart className="h-8 w-8 text-belize-green-600" />,
      title: "Respecting Local Customs",
      content: "Belize is welcoming and diverse. Dress modestly when visiting villages or religious sites. Learn basic Creole greetings. Tip guides and service staff appropriately. Ask permission before photographing people."
    },
    {
      icon: <Cloud className="h-8 w-8 text-belize-blue-600" />,
      title: "Weather Alerts",
      content: "Hurricane season runs June-November. Dry season (December-May) is ideal for most activities. We monitor weather constantly and will reschedule or modify trips for safety. Flash floods can occur during rainy season."
    },
    {
      icon: <Droplets className="h-8 w-8 text-belize-blue-500" />,
      title: "Health and Water Safety",
      content: "Tap water is generally safe in tourist areas, but bottled water is recommended. Bring insect repellent for jungle excursions. No special vaccinations required, but consult your doctor. Sunscreen is essential year-round."
    }
  ];

  const emergencyContacts = [
    { service: "Police Emergency", number: "911 or 90" },
    { service: "Fire/Ambulance", number: "911" },
    { service: "Tourist Police", number: "227-2222" },
    { service: "BelizeVibes 24/7", number: "+501-XXX-XXXX" },
    { service: "US Embassy Belize", number: "822-4011" },
    { service: "Karl Heusner Memorial Hospital", number: "223-1548" }
  ];

  return (
    <React.Fragment>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop&crop=center')`
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-4">
            Your Safety, Our Priority
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            Everything you need to know to travel confidently in Belize.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            
            {/* Main Safety Information */}
            <div className="lg:col-span-3">
              <div className="grid gap-8">
                {safetyTopics.map((topic, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {topic.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-playfair font-semibold text-belize-neutral-900 mb-3">
                          {topic.title}
                        </h3>
                        <p className="text-belize-neutral-700 leading-relaxed">
                          {topic.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar - Desktop Only */}
            <div className="lg:col-span-1 mt-8 lg:mt-0">
              <div className="sticky top-8 space-y-6">
                
                {/* Emergency Contacts */}
                <div className="bg-belize-orange-50 rounded-xl p-6 border border-belize-orange-200">
                  <h3 className="text-lg font-playfair font-semibold text-belize-neutral-900 mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-belize-orange-500 mr-2" />
                    Emergency Contacts
                  </h3>
                  <div className="space-y-3">
                    {emergencyContacts.map((contact, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-semibold text-belize-neutral-800">
                          {contact.service}
                        </div>
                        <div className="text-belize-neutral-600 font-mono">
                          {contact.number}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Travel Alerts */}
                <div className="bg-belize-blue-50 rounded-xl p-6 border border-belize-blue-200">
                  <h3 className="text-lg font-playfair font-semibold text-belize-neutral-900 mb-3 flex items-center">
                    <MapPin className="h-5 w-5 text-belize-blue-500 mr-2" />
                    Travel Resources
                  </h3>
                  <div className="space-y-3 text-sm">
                    <a href="#" className="block text-belize-blue-600 hover:text-belize-blue-800 transition-colors">
                      Belize Government Travel Alerts
                    </a>
                    <a href="#" className="block text-belize-blue-600 hover:text-belize-blue-800 transition-colors">
                      US State Department - Belize
                    </a>
                    <a href="#" className="block text-belize-blue-600 hover:text-belize-blue-800 transition-colors">
                      Current Weather Conditions
                    </a>
                  </div>
                </div>

                {/* Weather Alert Badge */}
                <div className="bg-belize-green-50 rounded-xl p-4 border border-belize-green-200 text-center">
                  <div className="text-2xl mb-2">🌤️</div>
                  <div className="text-sm font-semibold text-belize-green-700">
                    Current Weather: Clear
                  </div>
                  <div className="text-xs text-belize-green-600 mt-1">
                    Perfect conditions for adventures
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-belize-neutral-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-playfair font-bold text-belize-neutral-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-lg text-belize-neutral-700 mb-8 max-w-2xl mx-auto">
            Our team is available 24/7 during your trip and happy to answer any safety concerns before you book.
          </p>
          <Button className="bg-belize-orange-500 hover:bg-belize-orange-600 text-white px-8 py-3 text-lg">
            <Phone className="h-5 w-5 mr-2" />
            Contact Us Anytime
          </Button>
        </div>
      </section>
    </React.Fragment>
  );
};

export default Safety;