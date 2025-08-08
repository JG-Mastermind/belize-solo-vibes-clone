import React from 'react';
import { Helmet } from 'react-helmet-async';

interface GlobalMetaProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  lang?: 'en' | 'fr-ca';
  keywords?: string;
  type?: 'website' | 'article' | 'product';
}

export const GlobalMeta: React.FC<GlobalMetaProps> = ({
  title = "BelizeVibes",
  description = "Authentic Belize adventures with expert local guides",
  path = "/",
  image = "/images/belize-default.jpg",
  lang = "en",
  keywords = "Belize tours, adventure travel, solo travel, guided tours",
  type = "website"
}) => {
  const fullTitle = title.includes('BelizeVibes') ? title : `${title} - BelizeVibes`;
  const fullImageUrl = image.startsWith('http') ? image : `https://belizevibes.com${image}`;
  const canonicalUrl = `https://belizevibes.com${path}`;

  // Generate hreflang URLs for static pages
  const getAlternateUrls = () => {
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
    
    const alternatePath = urlMappings[path as keyof typeof urlMappings];
    if (!alternatePath) return null;
    
    const isCurrentlyFrench = path.startsWith('/fr-ca');
    return {
      current: { lang: isCurrentlyFrench ? 'fr-ca' : 'en', url: canonicalUrl },
      alternate: { 
        lang: isCurrentlyFrench ? 'en' : 'fr-ca', 
        url: `https://belizevibes.com${alternatePath}` 
      }
    };
  };

  const alternateUrls = getAlternateUrls();

  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="BelizeVibes" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang Tags */}
      {alternateUrls && (
        <>
          <link rel="alternate" hrefLang={alternateUrls.current.lang} href={alternateUrls.current.url} />
          <link rel="alternate" hrefLang={alternateUrls.alternate.lang} href={alternateUrls.alternate.url} />
          <link rel="alternate" hrefLang="x-default" href={alternateUrls.current.lang === 'en' ? alternateUrls.current.url : alternateUrls.alternate.url} />
        </>
      )}
      
      {/* Language */}
      <html lang={lang} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="BelizeVibes" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@belizevibes" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
    </Helmet>
  );
};

export default GlobalMeta;