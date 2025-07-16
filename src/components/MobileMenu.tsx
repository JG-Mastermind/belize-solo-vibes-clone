
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, Instagram, Youtube, Twitter, Facebook } from 'lucide-react';
import { useAuth } from './auth/AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { publicNavigationItems, socialLinks } from '@/lib/navigation';

const MobileMenu = () => {
  const { user, signOut, getUserRole } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const socialIcons = {
    Instagram,
    YouTube: Youtube,
    X: Twitter,
    Facebook,
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="w-full h-full flex flex-col bg-background">
        <SheetHeader className="text-left">
          <SheetTitle className="text-2xl font-bold text-primary">
            BelizeVibes
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 flex flex-col justify-between py-8">
          {/* User Profile Section (Mobile) */}
          {user && (
            <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user.user_metadata?.first_name?.charAt(0)}{user.user_metadata?.last_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {getUserRole()?.charAt(0).toUpperCase()}{getUserRole()?.slice(1)}
                </Badge>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-6">
            {publicNavigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`block text-2xl font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-primary'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Book Next CTA */}
          <div className="my-8">
            <Button 
              size="lg" 
              className="w-full text-lg py-6 rounded-xl"
              onClick={handleLinkClick}
              asChild
            >
              <Link to="/tours">Book Your Next Adventure</Link>
            </Button>
          </div>

          {/* Social Media Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-muted-foreground">
              Follow Us
            </h3>
            <div className="flex justify-around">
              {socialLinks.map((social) => {
                const IconComponent = socialIcons[social.name as keyof typeof socialIcons];
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    className={`flex flex-col items-center space-y-2 ${social.color} hover:opacity-80 transition-opacity`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconComponent className="h-8 w-8" />
                    <span className="text-sm">{social.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
