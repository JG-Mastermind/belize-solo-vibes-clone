import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopButtonProps {
  className?: string;
  threshold?: number;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ 
  className = '', 
  threshold = 400 
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollTop(scrollTop > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  };

  if (!showScrollTop) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 bg-belize-orange-600 dark:bg-belize-orange-700 hover:bg-belize-orange-700 dark:hover:bg-belize-orange-800 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 ${className}`}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
};

export default ScrollToTopButton;