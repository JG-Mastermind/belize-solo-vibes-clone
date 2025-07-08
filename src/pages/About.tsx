import React from "react";
import { Users, Shield, Leaf, MapPin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  const valuePillars = [
    {
      icon: <MapPin className="h-8 w-8 text-belize-green-500" />,
      title: "Authenticity",
      description: "Real Belizean experiences crafted by locals who know every hidden gem."
    },
    {
      icon: <Shield className="h-8 w-8 text-belize-blue-500" />,
      title: "Safety",
      description: "Certified guides and comprehensive safety protocols for worry-free adventures."
    },
    {
      icon: <Users className="h-8 w-8 text-belize-orange-500" />,
      title: "Local Expertise",
      description: "Born and raised in Belize, our team shares insider knowledge and cultural insights."
    },
    {
      icon: <Leaf className="h-8 w-8 text-belize-green-600" />,
      title: "Sustainable Travel",
      description: "Eco-certified practices that protect Belize's natural beauty for future generations."
    }
  ];

  const teamMembers = [
    { name: "Dimitre Sleeuw", role: "Founder & Lead Guide", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face" },
    // --- FINAL FIX: This now uses the correct, direct Unsplash image link ---
    { name: "Amber Villafranco", role: "Operations Manager", photo: "https://images.unsplash.com/photo-1611432579699-484f7990b127?w=300&h=300&fit=crop&crop=face" },
    { name: "Carlos Mendez", role: "Cave Tubing Specialist", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face" },
    { name: "Ana Rodriguez", role: "Wildlife Expert", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face" },
    { name: "Diego Santos", role: "Diving Instructor", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face" },
    { name: "Isabella Garcia", role: "Cultural Guide", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face" },
    { name: "Miguel Torres", role: "Adventure Coordinator", photo: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=300&h=300&fit=crop&crop=face" },
    { name: "Sofia Ramirez", role: "Guest Relations", photo: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=300&h=300&fit=crop&crop=face" }
  ];

  return (
    <React.Fragment>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1920&h=1080&fit=crop&crop=center')`
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-4">
            Our Story
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            Meet the people behind Belize's boldest solo travel adventures.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white" aria-labelledby="story-heading">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 id="story-heading" className="text-3xl md:text-4xl font-playfair font-bold text-belize-neutral-900 mb-8">
              Locally Owned. Globally Inspired.
            </h2>
            <p className="text-lg text-belize-neutral-700 leading-relaxed">
              BelizeVibes was founded by Dimitre Sleeuw and a group of young, certified, and passionate Belizeans. Our goal is to empower solo travelers to experience Belize authentically, safely, and sustainably. With deep roots in our culture and training in eco-tourism and hospitality, we offer more than just trips—we create meaningful connections.
            </p>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="py-16 bg-belize-neutral-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valuePillars.map((pillar, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105">
                <div className="flex justify-center mb-4">
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-playfair font-semibold text-belize-neutral-900 mb-3">
                  {pillar.title}
                </h3>
                <p className="text-belize-neutral-600 text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white" aria-labelledby="team-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 id="team-heading" className="text-3xl md:text-4xl font-playfair font-bold text-belize-neutral-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-belize-neutral-600">
              Passionate locals dedicated to showing you the real Belize
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className="relative mb-4 w-full overflow-hidden rounded-xl bg-gray-100">
                  <img 
                    src={member.photo} 
                    alt={`Photo of ${member.name}`}
                    className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-playfair font-semibold text-belize-neutral-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-belize-neutral-600">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-belize-green-50" aria-labelledby="cta-heading">
        <div className="container mx-auto px-4 text-center">
          <h2 id="cta-heading" className="text-3xl font-playfair font-bold text-belize-neutral-900 mb-4">
            Want to Join Us?
          </h2>
          <p className="text-lg text-belize-neutral-700 mb-8 max-w-2xl mx-auto">
            We're always looking for passionate, certified guides who share our vision of sustainable, authentic travel experiences.
          </p>
          <a href="mailto:careers@belizevibes.com">
            <Button className="bg-belize-green-500 hover:bg-belize-green-600 text-white px-8 py-3 text-lg">
              <Mail className="h-5 w-5 mr-2" />
              careers@belizevibes.com
            </Button>
          </a>
        </div>
      </section>
    </React.Fragment>
  );
};

export default About;