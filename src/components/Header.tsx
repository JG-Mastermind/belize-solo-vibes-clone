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
      '/adventures': '/fr-ca/aventures',
      '/fr-ca/aventures': '/adventures',
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

  // Dynamic path generation based on current language
  const getLocalizedPath = (englishPath: string): string => {
    const pathMappings = {
      '/adventures': '/fr-ca/aventures',
      '/about': '/fr-ca/a-propos',
      '/blog': '/fr-ca/blog',
      '/safety': '/fr-ca/securite', 
      '/contact': '/fr-ca/contact'
    };
    
    return i18n.language === 'fr-CA' 
      ? pathMappings[englishPath as keyof typeof pathMappings] || englishPath
      : englishPath;
  };

  const handleReviewsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const currentPath = location.pathname;
    const isOnAdventuresPage = currentPath === '/adventures' || currentPath === '/fr-ca/aventures';
    
    if (isOnAdventuresPage) {
      // Already on adventures page, just scroll to testimonials
      const element = document.getElementById('testimonials');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to appropriate adventures page based on current language, then scroll
      const targetAdventuresPage = getLocalizedPath('/adventures');
      navigate(targetAdventuresPage);
      setTimeout(() => {
        const element = document.getElementById('testimonials');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          // Fallback - try again after more time if element not found
          setTimeout(() => {
            const retryElement = document.getElementById('testimonials');
            if (retryElement) {
              retryElement.scrollIntoView({ behavior: 'smooth' });
            }
          }, 200);
        }
      }, 750);
    }
  };
  
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "text-sm font-medium transition-all duration-200 rounded-md px-3 py-2",
      isActive 
        ? "text-primary bg-primary/10" 
        : "text-muted-foreground hover:text-foreground hover:bg-accent md:hover:bg-gray-100 dark:md:hover:bg-gray-800"
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
          <Link to="/" className="flex items-center space-x-2 transition-colors hover:opacity-80">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">BV</span>
            </div>
            <span className="font-playfair font-bold text-xl text-foreground">BelizeVibes</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink to="/" className={navLinkClass} end>{t('navigation:home')}</NavLink>
            <NavLink to={getLocalizedPath('/adventures')} className={navLinkClass}>{t('navigation:adventures')}</NavLink>
            <button onClick={handleReviewsClick} className="text-sm font-medium transition-all duration-200 rounded-md px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent md:hover:bg-gray-100 dark:md:hover:bg-gray-800">{t('navigation:reviews')}</button>
            <NavLink to={getLocalizedPath('/about')} className={navLinkClass}>{t('navigation:about')}</NavLink>
            <NavLink to={getLocalizedPath('/blog')} className={navLinkClass}>{t('navigation:blog')}</NavLink>
            <NavLink to={getLocalizedPath('/safety')} className={navLinkClass}>{t('navigation:safety')}</NavLink>
            <NavLink to={getLocalizedPath('/contact')} className={navLinkClass}>{t('navigation:contact')}</NavLink>
          </nav>

          <div className="flex items-center space-x-2 md:space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "text-foreground transition-all duration-200 px-3 h-10 flex items-center space-x-2",
                    scrolled ? "hover:bg-accent" : "hover:bg-foreground/10"
                  )}
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {i18n.language === 'fr-CA' ? 'FR' : 'EN'}
                  </span>
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