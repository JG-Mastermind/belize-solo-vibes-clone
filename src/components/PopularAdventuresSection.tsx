import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { popularAdventuresService, PopularTour } from '@/services/popularAdventuresService';
import { convertEnglishSlugToFrench } from '@/utils/frenchSlugs';

export const PopularAdventuresSection: React.FC = () => {
  const { t, i18n } = useTranslation(['footer']);
  const [popularTours, setPopularTours] = useState<PopularTour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPopularAdventures();
  }, []);

  const loadPopularAdventures = async () => {
    try {
      const tours = await popularAdventuresService.getPopularAdventures();
      setPopularTours(tours.slice(0, 6)); // Show top 6
    } catch (error) {
      console.error('Failed to load popular adventures:', error);
      // Fallback to static adventures if dynamic fails
      setPopularTours([]);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedPath = (englishPath: string) => {
    if (i18n.language === 'fr-CA') {
      const pathMappings = {
        '/adventures': '/fr-ca/aventures',
      };
      return pathMappings[englishPath as keyof typeof pathMappings] || englishPath;
    }
    return englishPath;
  };

  const getTourUrl = (tour: PopularTour['tour']) => {
    // Create slug from title for URL
    const slug = tour.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const baseUrl = i18n.language === 'fr-CA' ? '/fr-ca/tours' : '/tours';
    const finalSlug = i18n.language === 'fr-CA' ? convertEnglishSlugToFrench(slug) : slug;
    
    return `${baseUrl}/${finalSlug}`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="font-playfair font-semibold text-lg">{t('footer:sections.popularAdventures')}</h3>
        <ul className="space-y-2 text-sm">
          {[...Array(6)].map((_, i) => (
            <li key={i} className="animate-pulse">
              <div className="h-4 bg-slate-600 rounded w-3/4"></div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-playfair font-semibold text-lg">{t('footer:sections.popularAdventures')}</h3>
      <ul className="space-y-2 text-sm">
        {popularTours.length > 0 ? (
          popularTours.map((item, index) => (
            <li key={item.tour.id || index}>
              <Link 
                to={getTourUrl(item.tour)} 
                className="text-slate-300 hover:text-green-400 transition-colors flex items-center space-x-2"
              >
                <span>{item.tour.title}</span>
                {item.tour.average_rating > 4.5 && (
                  <span className="text-yellow-400 text-xs">⭐</span>
                )}
              </Link>
            </li>
          ))
        ) : (
          // Fallback to real tour links using actual tour IDs
          <>
            <li><Link to="/tours/d64bf45d-254a-422f-97fb-7fa42f3f05e7" className="text-slate-300 hover:text-green-400 transition-colors">Cave Tubing & Jungle Trek</Link></li>
            <li><Link to="/tours/74995372-350c-4e6f-b812-30de5af8fc44" className="text-slate-300 hover:text-green-400 transition-colors">Snorkeling at Hol Chan Marine Reserve</Link></li>
            <li><Link to="/tours/f900d2c6-a691-4fd7-9914-52bcc0982cbc" className="text-slate-300 hover:text-green-400 transition-colors">Jungle Zip-lining & Waterfall Tour</Link></li>
            <li><Link to="/tours/781ebb5d-5b7d-40b5-bdf5-561fcdb5e9db" className="text-slate-300 hover:text-green-400 transition-colors">Manatee Watching & Beach Day</Link></li>
            <li><Link to="/tours/467fbd12-3869-40ff-a951-d2420ffb7ab5" className="text-slate-300 hover:text-green-400 transition-colors">Sunrise Fishing & Island Hopping</Link></li>
            <li><Link to="/tours/7e72e421-9d43-4bd7-8c30-0bbffceeb84e" className="text-slate-300 hover:text-green-400 transition-colors">Night Jungle Safari</Link></li>
          </>
        )}
      </ul>
    </div>
  );
};