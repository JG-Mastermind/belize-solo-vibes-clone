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

  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="BelizeVibes" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
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