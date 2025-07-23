import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModeToggle } from '@/components/mode-toggle';
import MobileMenu from '@/components/MobileMenu';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "text-sm font-medium transition-colors",
      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
    );

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
      scrolled
        ? "bg-background/95 backdrop-blur-sm border-b border-border/40"
        : "bg-transparent border-transparent"
    )}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl md:text-2xl font-bold transition-colors hover:opacity-80 text-foreground">
            BelizeVibes
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink to="/" className={navLinkClass} end>Home</NavLink>
            <NavLink to="/adventures" className={navLinkClass}>Adventures</NavLink>
            <a href="/adventures#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Reviews</a>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>
            <NavLink to="/blog" className={navLinkClass}>Blog</NavLink>
            <NavLink to="/safety" className={navLinkClass}>Safety</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
          </nav>

          <div className="flex items-center space-x-2 md:space-x-3">
            <Button variant="ghost" size="icon" className={cn("text-foreground", scrolled ? "hover:bg-accent" : "hover:bg-foreground/10")}>
              <Globe className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className={cn("text-foreground", scrolled ? "hover:bg-accent" : "hover:bg-foreground/10")}>
              <User className="h-5 w-5" />
            </Button>
            
            <ModeToggle />
            
            <div className="md:hidden">
              <MobileMenu />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;