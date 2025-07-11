
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
          
          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            {/* User Profile - Hidden on small screens */}
            <div className="hidden sm:block">
              <UserProfile />
            </div>
            
            {/* Mode Toggle */}
            <ModeToggle />
            
            {/* Mobile Menu - Now used for all screen sizes */}
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
