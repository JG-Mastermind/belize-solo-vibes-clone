import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModeToggle } from '@/components/mode-toggle';
import MobileMenu from '@/components/MobileMenu';
import { useAuth } from '@/components/auth/AuthProvider';
import { SignInModal } from '@/components/auth/SignInModal';
import { UserProfile } from '@/components/UserProfile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const { user } = useAuth();
  const { t, i18n } = useTranslation(['navigation', 'common']);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLanguageChange = (newLanguage: string) => {
    console.log('handleLanguageChange called with:', newLanguage);
    console.log('Current i18n language:', i18n.language);
    
    // URL mappings for language switching
    const urlMappings = {
      '/safety': '/fr-ca/securite',
      '/fr-ca/securite': '/safety',
      '/about': '/fr-ca/a-propos', 
      '/fr-ca/a-propos': '/about',
      '/contact': '/fr-ca/contact',
      '/fr-ca/contact': '/contact'
    };
    
    const currentPath = location.pathname;
    const targetPath = urlMappings[currentPath as keyof typeof urlMappings];
    
    i18n.changeLanguage(newLanguage).then(() => {
      console.log('Language changed to:', i18n.language);
      
      // Navigate to appropriate URL if mapping exists
      if (targetPath) {
        navigate(targetPath);
      }
    });
  };

  const handleReviewsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/adventures') {
      // Already on adventures page, just scroll to testimonials
      const element = document.getElementById('testimonials');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to adventures page first, then scroll
      navigate('/adventures');
      setTimeout(() => {
        const element = document.getElementById('testimonials');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };
  
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
            <NavLink to="/" className={navLinkClass} end>{t('navigation:home')}</NavLink>
            <NavLink to="/adventures" className={navLinkClass}>{t('navigation:adventures')}</NavLink>
            <button onClick={handleReviewsClick} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('navigation:reviews')}</button>
            <NavLink to="/about" className={navLinkClass}>{t('navigation:about')}</NavLink>
            <NavLink to="/blog" className={navLinkClass}>{t('navigation:blog')}</NavLink>
            <NavLink to="/safety" className={navLinkClass}>{t('navigation:safety')}</NavLink>
            <NavLink to="/contact" className={navLinkClass}>{t('navigation:contact')}</NavLink>
          </nav>

          <div className="flex items-center space-x-2 md:space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={cn("text-foreground", scrolled ? "hover:bg-accent" : "hover:bg-foreground/10")}>
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => handleLanguageChange('en')}
                  className={i18n.language === 'en' ? 'bg-accent' : ''}
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleLanguageChange('fr-CA')}
                  className={i18n.language === 'fr-CA' ? 'bg-accent' : ''}
                >
                  Français (Canada)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {user ? (
              <UserProfile />
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("text-foreground", scrolled ? "hover:bg-accent" : "hover:bg-foreground/10")}
                onClick={() => setIsSignInModalOpen(true)}
              >
                <User className="h-5 w-5" />
              </Button>
            )}
            
            <ModeToggle />
            
            <div className="md:hidden">
              <MobileMenu />
            </div>
          </div>
        </div>
      </div>
      
      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={() => setIsSignInModalOpen(false)} 
        onSwitchToSignUp={() => {}} 
      />
    </header>
  );
};

export default Header;