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
    // Create English slug from title for URL
    const englishSlug = tour.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Use existing translation protocol: English base, let i18n system handle French paths
    if (i18n.language === 'fr-CA') {
      const frenchSlug = convertEnglishSlugToFrench(englishSlug);
      return `/fr-ca/tours/${frenchSlug}`;
    }
    
    return `/tours/${englishSlug}`;
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
          // Fallback using English slugs, let translation system handle French paths and text
          <>
            <li><Link to={i18n.language === 'fr-CA' ? '/fr-ca/tours/tube-cave-et-trek-jungle' : '/tours/cave-tubing-and-jungle-trek'} className="text-slate-300 hover:text-green-400 transition-colors">{t('footer:adventures.caveTubing')}</Link></li>
            <li><Link to={i18n.language === 'fr-CA' ? '/fr-ca/tours/plongee-hol-chan-reserve-marine' : '/tours/snorkeling-at-hol-chan-marine-reserve'} className="text-slate-300 hover:text-green-400 transition-colors">{t('footer:adventures.snorkelingTours')}</Link></li>
            <li><Link to={i18n.language === 'fr-CA' ? '/fr-ca/tours/tyrolienne-jungle-et-tour-cascade' : '/tours/jungle-zip-lining-and-waterfall-tour'} className="text-slate-300 hover:text-green-400 transition-colors">{t('footer:adventures.jungleZiplining')}</Link></li>
            <li><Link to={i18n.language === 'fr-CA' ? '/fr-ca/tours/observation-lamantins-et-journee-plage' : '/tours/manatee-watching-and-beach-day'} className="text-slate-300 hover:text-green-400 transition-colors">{t('footer:adventures.wildlifeWatching')}</Link></li>
            <li><Link to={i18n.language === 'fr-CA' ? '/fr-ca/tours/peche-lever-soleil-et-saut-iles' : '/tours/sunrise-fishing-and-island-hopping'} className="text-slate-300 hover:text-green-400 transition-colors">Sunrise Fishing & Island Hopping</Link></li>
            <li><Link to={i18n.language === 'fr-CA' ? '/fr-ca/tours/safari-jungle-nocturne' : '/tours/night-jungle-safari'} className="text-slate-300 hover:text-green-400 transition-colors">Night Jungle Safari</Link></li>
          </>
        )}
      </ul>
    </div>
  );
};