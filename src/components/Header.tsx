
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ModeToggle } from '@/components/mode-toggle';
import { UserProfile } from './UserProfile';
import MobileMenu from './MobileMenu';
import { publicNavigationItems } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled
        ? "bg-background/95 backdrop-blur-md border-b border-border/40 supports-[backdrop-filter]:bg-background/60"
        : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className={cn(
              "text-xl md:text-2xl font-bold transition-colors",
              isScrolled
                ? "text-primary hover:text-primary/80"
                : "text-white hover:text-white/80"
            )}
          >
            BelizeVibes
          </Link>
          
          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-6">
            {publicNavigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isScrolled
                    ? `hover:text-primary ${
                        isActive(item.path)
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }`
                    : `hover:text-white ${
                        isActive(item.path)
                          ? 'text-white'
                          : 'text-white/80'
                      }`
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Language Toggle */}
            <Button variant="ghost" size="icon" className={cn(
              "transition-colors",
              isScrolled
                ? "hover:bg-accent hover:text-accent-foreground"
                : "hover:bg-white/10 text-white"
            )}>
              <Globe className="h-5 w-5" />
            </Button>
            
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
