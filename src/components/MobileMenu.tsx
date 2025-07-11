
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, Instagram, Youtube, Twitter, Facebook } from 'lucide-react';

const MobileMenu = () => {
  const scrollToAdventures = () => {
    const adventuresSection = document.getElementById('adventures');
    if (adventuresSection) {
      adventuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTestimonials = () => {
    const testimonialsSection = document.querySelector('[data-testimonials]');
    if (testimonialsSection) {
      testimonialsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigationLinks = [
    { name: 'Adventures', action: scrollToAdventures },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Safety', path: '/safety' },
    { name: 'Reviews', action: scrollToTestimonials },
    { name: 'Contact', path: '/contact' },
  ];

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, url: '#', color: 'text-pink-500' },
    { name: 'YouTube', icon: Youtube, url: '#', color: 'text-red-500' },
    { name: 'X', icon: Twitter, url: '#', color: 'text-blue-500' },
    { name: 'Facebook', icon: Facebook, url: '#', color: 'text-blue-600' },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open navigation menu">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="w-full h-full flex flex-col">
        <SheetHeader className="text-left">
          <SheetTitle className="text-2xl font-bold text-primary">
            BelizeVibes
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 flex flex-col justify-between py-8">
          {/* Navigation Links */}
          <nav className="space-y-6">
            {navigationLinks.map((link) => (
              <div key={link.name}>
                {link.path ? (
                  <Link
                    to={link.path}
                    className="block text-2xl font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <button
                    onClick={link.action}
                    className="block text-2xl font-medium text-foreground hover:text-primary transition-colors text-left"
                    aria-label={`Navigate to ${link.name} section`}
                  >
                    {link.name}
                  </button>
                )}
              </div>
            ))}
          </nav>

          {/* Book Next CTA */}
          <div className="my-8">
            <Button 
              size="lg" 
              className="w-full text-lg py-6 rounded-xl"
              onClick={scrollToAdventures}
              aria-label="Book your next adventure"
            >
              Book Your Next Adventure
            </Button>
          </div>

          {/* Social Media Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-muted-foreground">
              Follow Us
            </h3>
            <div className="flex justify-around">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className={`flex flex-col items-center space-y-2 ${social.color} hover:opacity-80 transition-opacity`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${social.name}`}
                >
                  <social.icon className="h-8 w-8" />
                  <span className="text-sm">{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
