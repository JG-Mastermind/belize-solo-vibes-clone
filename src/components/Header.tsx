// src/components/Header.tsx
import { Button } from "@/components/ui/button";
import { Menu, Phone } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleScrollToSection = (sectionId: string) => {
    navigate('/');
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm fixed w-full top-0 z-50 border-b border-belize-green-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-belize-green-500 to-belize-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">BV</span>
            </div>
            <span className="font-playfair font-bold text-xl text-belize-neutral-900">BelizeVibes</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => handleScrollToSection('adventures')} className="text-belize-neutral-800 hover:text-belize-green-600 transition-colors">Adventures</button>
            <Link to="/about" className="text-belize-neutral-800 hover:text-belize-green-600 transition-colors">About</Link>
            <Link to="/blog" className="text-belize-neutral-800 hover:text-belize-green-600 transition-colors">Blog</Link>
            <Link to="/safety" className="text-belize-neutral-800 hover:text-belize-green-600 transition-colors">Safety</Link>
            <button onClick={() => handleScrollToSection('testimonials')} className="text-belize-neutral-800 hover:text-belize-green-600 transition-colors">Reviews</button>
            <Link to="/contact" className="text-belize-neutral-800 hover:text-belize-green-600 transition-colors">Contact</Link>
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-belize-neutral-600">
              <Phone className="h-4 w-4" />
              <span>+501-XXX-XXXX</span>
            </div>
            <Button onClick={() => handleScrollToSection('adventures')} className="bg-belize-orange-500 hover:bg-belize-orange-600 text-white">
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6 text-belize-neutral-800" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-belize-green-100 py-4">
            <nav className="flex flex-col space-y-3">
              <button onClick={() => handleScrollToSection('adventures')} className="text-left text-belize-neutral-800 hover:text-belize-green-600 transition-colors py-2">Adventures</button>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-belize-neutral-800 hover:text-belize-green-600 transition-colors py-2">About</Link>
              <Link to="/blog" onClick={() => setIsMenuOpen(false)} className="text-belize-neutral-800 hover:text-belize-green-600 transition-colors py-2">Blog</Link>
              <Link to="/safety" onClick={() => setIsMenuOpen(false)} className="text-belize-neutral-800 hover:text-belize-green-600 transition-colors py-2">Safety</Link>
              <button onClick={() => handleScrollToSection('testimonials')} className="text-left text-belize-neutral-800 hover:text-belize-green-600 transition-colors py-2">Reviews</button>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-belize-neutral-800 hover:text-belize-green-600 transition-colors py-2">Contact</Link>
              <div className="pt-4 border-t border-belize-green-100">
                <div className="flex items-center space-x-2 text-sm text-belize-neutral-600 mb-3">
                  <Phone className="h-4 w-4" />
                  <span>+501-XXX-XXXX</span>
                </div>
                <Button className="w-full bg-belize-orange-500 hover:bg-belize-orange-600 text-white">
                  Book Now
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;