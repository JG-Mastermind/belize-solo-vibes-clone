import React from "react";
import { Shield, Phone, Heart, Droplets, Cloud, Users, AlertTriangle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const Safety = () => {
  const { t } = useTranslation(['safety']);
  
  const safetyTopics = [
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: t('safety:topics.travelInsurance.title'),
      content: t('safety:topics.travelInsurance.content')
    },
    {
      icon: <Phone className="h-8 w-8 text-orange-500" />,
      title: t('safety:topics.emergencyNumbers.title'),
      content: t('safety:topics.emergencyNumbers.content')
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: t('safety:topics.groupSupport.title'),
      content: t('safety:topics.groupSupport.content')
    },
    {
      icon: <Heart className="h-8 w-8 text-green-600" />,
      title: t('safety:topics.localCustoms.title'),
      content: t('safety:topics.localCustoms.content')
    },
    {
      icon: <Cloud className="h-8 w-8 text-blue-600" />,
      title: t('safety:topics.weatherAlerts.title'),
      content: t('safety:topics.weatherAlerts.content')
    },
    {
      icon: <Droplets className="h-8 w-8 text-blue-500" />,
      title: t('safety:topics.healthWater.title'),
      content: t('safety:topics.healthWater.content')
    }
  ];

  const emergencyContacts = [
    { service: t('safety:contacts.policeEmergency'), number: "911 or 90" },
    { service: t('safety:contacts.fireAmbulance'), number: "911" },
    { service: t('safety:contacts.touristPolice'), number: "227-2222" },
    { service: t('safety:contacts.belizeVibes24'), number: "+501-XXX-XXXX" },
    { service: t('safety:contacts.usEmbassy'), number: "822-4011" },
    { service: t('safety:contacts.karlHeusner'), number: "223-1548" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
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
            {t('safety:hero.title')}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            {t('safety:hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            
            {/* Main Safety Information */}
            <div className="lg:col-span-3">
              <div className="grid gap-8">
                {safetyTopics.map((topic, index) => (
                  <div key={index} className="bg-card rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {topic.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-playfair font-semibold text-foreground mb-3">
                          {topic.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
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
                <div className="bg-orange-50 dark:bg-orange-950/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
                  <h3 className="text-lg font-playfair font-semibold text-foreground mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                    {t('safety:sidebar.emergencyContacts')}
                  </h3>
                  <div className="space-y-3">
                    {emergencyContacts.map((contact, index) => (
                      <div key={index} className="text-sm">
                        <div className="font-semibold text-foreground">
                          {contact.service}
                        </div>
                        <div className="text-muted-foreground font-mono">
                          {contact.number}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Travel Alerts */}
                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-playfair font-semibold text-foreground mb-3 flex items-center">
                    <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                    {t('safety:sidebar.travelResources')}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <a href="#" className="block text-blue-600 hover:text-blue-800 transition-colors">
                      {t('safety:sidebar.belizeGovAlerts')}
                    </a>
                    <a href="#" className="block text-blue-600 hover:text-blue-800 transition-colors">
                      {t('safety:sidebar.usStateDept')}
                    </a>
                    <a href="#" className="block text-blue-600 hover:text-blue-800 transition-colors">
                      {t('safety:sidebar.weatherConditions')}
                    </a>
                  </div>
                </div>

                {/* Weather Alert Badge */}
                <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-4 border border-green-200 dark:border-green-800 text-center">
                  <div className="text-2xl mb-2">🌤️</div>
                  <div className="text-sm font-semibold text-green-700 dark:text-green-300">
                    {t('safety:sidebar.currentWeather')}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {t('safety:sidebar.perfectConditions')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-playfair font-bold text-foreground mb-4">
            {t('safety:cta.title')}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('safety:cta.content')}
          </p>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
            <Phone className="h-5 w-5 mr-2" />
            {t('safety:cta.button')}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Safety;