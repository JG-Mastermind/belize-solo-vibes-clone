import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ModeToggle } from '@/components/mode-toggle';
import { UserProfile } from './UserProfile';
import MobileMenu from './MobileMenu';
import { publicNavigationItems } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from './auth/AuthProvider';
import { SignInModal } from './auth/SignInModal';
import { SignUpModal } from './auth/SignUpModal';

const Header = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const [scrolled, setScrolled] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
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
      "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
      scrolled
        ? "bg-background/95 backdrop-blur-sm border-b border-border/40 text-foreground"
        : "bg-transparent text-white border-transparent"
    )}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl md:text-2xl font-bold transition-colors hover:opacity-80"
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
                  "text-sm font-medium transition-colors hover:opacity-80",
                  isActive(item.path) ? "opacity-100" : "opacity-80"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Language Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "transition-colors",
                scrolled 
                  ? "hover:bg-accent" 
                  : "hover:bg-white/10"
              )}
            >
              <Globe className="h-5 w-5" />
            </Button>
            
            {/* Authentication - Show dropdown for unauthenticated users, UserProfile for authenticated */}
            {!loading && (
              user ? (
                <UserProfile />
              ) : (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={cn(
                          "transition-colors",
                          scrolled 
                            ? "hover:bg-accent" 
                            : "hover:bg-white/10"
                        )}
                      >
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setShowSignIn(true)}>
                        Sign In
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowSignUp(true)}>
                        Sign Up
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <SignInModal
                    isOpen={showSignIn}
                    onClose={() => setShowSignIn(false)}
                    onSwitchToSignUp={() => {
                      setShowSignIn(false);
                      setShowSignUp(true);
                    }}
                  />
                  
                  <SignUpModal
                    isOpen={showSignUp}
                    onClose={() => setShowSignUp(false)}
                    onSwitchToSignIn={() => {
                      setShowSignUp(false);
                      setShowSignIn(true);
                    }}
                  />
                </>
              )
            )}
            
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