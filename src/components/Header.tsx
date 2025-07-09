
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { UserProfile } from './UserProfile';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            BelizeVibes
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-medium hover:text-primary transition-colors ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium hover:text-primary transition-colors ${
                isActive('/about') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              About
            </Link>
            <Link 
              to="/blog" 
              className={`text-sm font-medium hover:text-primary transition-colors ${
                isActive('/blog') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Blog
            </Link>
            <Link 
              to="/safety" 
              className={`text-sm font-medium hover:text-primary transition-colors ${
                isActive('/safety') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Safety
            </Link>
            <Link 
              to="/contact" 
              className={`text-sm font-medium hover:text-primary transition-colors ${
                isActive('/contact') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <UserProfile />
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
