import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { GlobalMeta } from "@/components/SEO/GlobalMeta";

const Contact = () => {
  const { t } = useTranslation(['contact']);
  const location = useLocation();
  
  const isFrench = location.pathname.startsWith('/fr-ca');
  const currentPath = isFrench ? '/fr-ca/contact' : '/contact';
  const currentLang = isFrench ? 'fr-ca' : 'en';
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: 'General',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock form submission
    console.log('Form submitted:', formData);
    
    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({ fullName: '', email: '', subject: 'General', message: '' });
      
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1000);
  };

  const scrollToForm = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <GlobalMeta 
        title="Contact Us"
        description="Get in touch with BelizeVibes for authentic Belize adventure tours. Contact our expert local guides for personalized travel experiences."
        path={currentPath}
        lang={currentLang}
        keywords="contact BelizeVibes, Belize tours contact, adventure travel inquiry, local guides contact"
      />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&h=1080&fit=crop&crop=center')`
          }}
        />
        <div className="absolute inset-0 hero-gradient" />
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6 leading-tight">
              {t('contact:hero.title')}
            </h1>
            
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
              {t('contact:hero.subtitle')}
            </p>

            <Button 
              onClick={scrollToForm}
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              {t('contact:hero.buttonText')}
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 bg-muted/20" aria-labelledby="reach-us-heading">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Details */}
            <div className="space-y-8">
              <div>
                <h2 id="reach-us-heading" className="text-3xl font-playfair font-bold text-foreground mb-6">
                  {t('contact:info.title')}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {t('contact:info.subtitle')}
                </p>
              </div>

              <div className="space-y-6">
                <Card className="p-6 hover:shadow-lg transition-shadow bg-card">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{t('contact:info.belizeOffice')}</h3>
                        <p className="text-muted-foreground">
                          {t('contact:info.address1')}<br />
                          {t('contact:info.address2')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow bg-card">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{t('contact:info.phone')}</h3>
                        <p className="text-muted-foreground">
                          {t('contact:info.tollFree')}<br />
                          {t('contact:info.belizeLocal')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow bg-card">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{t('contact:info.email')}</h3>
                        <p className="text-muted-foreground">
                          {t('contact:info.emailGeneral')}<br />
                          {t('contact:info.emailBooking')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow bg-card">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{t('contact:info.officeHours')}</h3>
                        <p className="text-muted-foreground">
                          {t('contact:info.hoursWeekday')}<br />
                          {t('contact:info.hoursSaturday')}<br />
                          {t('contact:info.hoursSunday')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="lg:order-last">
              <div className="bg-muted rounded-lg h-96 lg:h-full min-h-[400px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <p className="text-lg font-semibold mb-2">{t('contact:map.title')}</p>
                  <p className="text-sm">{t('contact:map.subtitle')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-16 bg-background" aria-labelledby="form-heading">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 id="form-heading" className="text-3xl font-playfair font-bold text-foreground mb-4">
                {t('contact:form.title')}
              </h2>
              <p className="text-muted-foreground">
                {t('contact:form.subtitle')}
              </p>
            </div>

            {showSuccess && (
              <div role="alert" className="mb-8 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg animate-fade-in">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-green-800 dark:text-green-200 font-semibold">
                    {t('contact:form.successMessage')}
                  </p>
                </div>
              </div>
            )}

            <Card className="p-8 shadow-lg bg-card">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-foreground font-semibold">
                    {t('contact:form.fullName')}
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={t('contact:form.fullNamePlaceholder')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-semibold">
                    {t('contact:form.emailAddress')}
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={t('contact:form.emailPlaceholder')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-foreground font-semibold">
                    {t('contact:form.subject')}
                  </Label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                  >
                    <option value="General">{t('contact:subjects.general')}</option>
                    <option value="Booking">{t('contact:subjects.booking')}</option>
                    <option value="Press">{t('contact:subjects.press')}</option>
                    <option value="Safety">{t('contact:subjects.safety')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-foreground font-semibold">
                    {t('contact:form.message')}
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full p-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                    placeholder={t('contact:form.messagePlaceholder')}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? t('contact:form.sendingMessage') : t('contact:form.sendMessage')}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;