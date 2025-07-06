
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";

const Contact = () => {
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
    
    // Mock form submission - replace with actual API call later
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
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden mt-16">
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
              Let's Connect
            </h1>
            
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Questions about your Belize adventure? We're here to help with booking inquiries, safety concerns, and everything in between.
            </p>

            <Button 
              onClick={scrollToForm}
              size="lg" 
              className="bg-belize-orange-500 hover:bg-belize-orange-600 text-white px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Get In Touch
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 bg-belize-neutral-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Details */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-playfair font-bold text-belize-neutral-900 mb-6">
                  How to Reach Us
                </h2>
                <p className="text-belize-neutral-600 mb-8">
                  We're based in beautiful Belize and ready to help plan your perfect adventure. 
                  Our local expertise ensures you get the most authentic experience possible.
                </p>
              </div>

              <div className="space-y-6">
                {/* Office Address */}
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-belize-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-belize-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-belize-neutral-900 mb-1">Belize Office</h3>
                        <p className="text-belize-neutral-600">
                          San Pedro, Ambergris Caye<br />
                          Belize, Central America
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Phone Numbers */}
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-belize-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-belize-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-belize-neutral-900 mb-1">Phone</h3>
                        <p className="text-belize-neutral-600">
                          Toll-Free: +1-800-XXX-XXXX<br />
                          Belize Local: +501-XXX-XXXX
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Email */}
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-belize-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-belize-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-belize-neutral-900 mb-1">Email</h3>
                        <p className="text-belize-neutral-600">
                          hello@belizevibes.com<br />
                          booking@belizevibes.com
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Office Hours */}
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-belize-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-belize-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-belize-neutral-900 mb-1">Office Hours</h3>
                        <p className="text-belize-neutral-600">
                          Monday - Friday: 8:00 AM - 6:00 PM (Belize Time)<br />
                          Saturday: 9:00 AM - 4:00 PM<br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="lg:order-last">
              <div className="bg-belize-neutral-200 rounded-lg h-96 lg:h-full min-h-[400px] flex items-center justify-center">
                <div className="text-center text-belize-neutral-600">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-belize-green-500" />
                  <p className="text-lg font-semibold mb-2">Interactive Map</p>
                  <p className="text-sm">Google Maps integration coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-playfair font-bold text-belize-neutral-900 mb-4">
                Send Us a Message
              </h2>
              <p className="text-belize-neutral-600">
                Whether you're planning your first Belize adventure or have specific questions about safety and solo travel, we're here to help.
              </p>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="mb-8 p-4 bg-belize-green-100 border border-belize-green-300 rounded-lg animate-fade-in">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-belize-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="text-belize-green-800 font-semibold">
                    Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
                  </p>
                </div>
              </div>
            )}

            <Card className="p-8 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-belize-neutral-800 font-semibold">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 rounded-lg border border-belize-neutral-300 focus:ring-2 focus:ring-belize-green-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-belize-neutral-800 font-semibold">
                    Email Address *
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 rounded-lg border border-belize-neutral-300 focus:ring-2 focus:ring-belize-green-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-belize-neutral-800 font-semibold">
                    Subject
                  </Label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-belize-neutral-300 focus:ring-2 focus:ring-belize-green-500 focus:border-transparent bg-white"
                  >
                    <option value="General">General Inquiry</option>
                    <option value="Booking">Booking Question</option>
                    <option value="Press">Press & Media</option>
                    <option value="Safety">Safety Concerns</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-belize-neutral-800 font-semibold">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full p-3 rounded-lg border border-belize-neutral-300 focus:ring-2 focus:ring-belize-green-500 focus:border-transparent resize-vertical"
                    placeholder="Tell us about your Belize adventure plans, any questions you have, or how we can help..."
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-belize-orange-500 hover:bg-belize-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? 'Sending Message...' : 'Send Message'}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
