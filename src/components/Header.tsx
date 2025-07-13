
import React from 'react';
import { Link } from 'react-router-dom';
import { ModeToggle } from '@/components/mode-toggle';
import { UserProfile } from './UserProfile';
import MobileMenu from './MobileMenu';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl md:text-2xl font-bold text-primary">
            BelizeVibes
          </Link>
          
          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-sm font-medium hover:text-primary transition-colors text-muted-foreground"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-sm font-medium hover:text-primary transition-colors text-muted-foreground"
            >
              About
            </Link>
            <Link 
              to="/blog" 
              className="text-sm font-medium hover:text-primary transition-colors text-muted-foreground"
            >
              Blog
            </Link>
            <Link 
              to="/safety" 
              className="text-sm font-medium hover:text-primary transition-colors text-muted-foreground"
            >
              Safety
            </Link>
            <Link 
              to="/contact" 
              className="text-sm font-medium hover:text-primary transition-colors text-muted-foreground"
            >
              Contact
            </Link>
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            {/* User Profile - Now compact and shown on all screens */}
            <UserProfile />
            
            {/* Mode Toggle */}
            <ModeToggle />
            
            {/* Mobile Menu - Only visible on mobile */}
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
