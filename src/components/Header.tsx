
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ModeToggle } from '@/components/mode-toggle';
import { UserProfile } from './UserProfile';
import MobileMenu from './MobileMenu';
import { publicNavigationItems } from '@/lib/navigation';

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl md:text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
          >
            BelizeVibes
          </Link>
          
          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-6">
            {publicNavigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path)
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* User Profile - Compact and responsive */}
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
