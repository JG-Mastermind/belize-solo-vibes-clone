import { supabase } from '@/integrations/supabase/client';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  priority?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

const generateXML = (urls: SitemapUrl[]): string => {
  const urlsXML = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlsXML}
</urlset>`;
};

export const generateSitemap = async (): Promise<string> => {
  try {
    // Static pages with priorities
    const staticUrls: SitemapUrl[] = [
      { 
        loc: 'https://belizevibes.com/', 
        priority: '1.0',
        changefreq: 'weekly'
      },
      { 
        loc: 'https://belizevibes.com/adventures', 
        priority: '0.9',
        changefreq: 'daily'
      },
      { 
        loc: 'https://belizevibes.com/about', 
        priority: '0.7',
        changefreq: 'monthly'
      },
      { 
        loc: 'https://belizevibes.com/contact', 
        priority: '0.7',
        changefreq: 'monthly'
      },
      { 
        loc: 'https://belizevibes.com/safety', 
        priority: '0.6',
        changefreq: 'monthly'
      },
      { 
        loc: 'https://belizevibes.com/fr-ca/securite', 
        priority: '0.6',
        changefreq: 'monthly'
      },
      { 
        loc: 'https://belizevibes.com/fr-ca/a-propos', 
        priority: '0.7',
        changefreq: 'monthly'
      },
      { 
        loc: 'https://belizevibes.com/fr-ca/contact', 
        priority: '0.7',
        changefreq: 'monthly'
      },
      { 
        loc: 'https://belizevibes.com/blog', 
        priority: '0.8',
        changefreq: 'weekly'
      }
    ];

    // Dynamic tours - only fetch active tours with slugs
    const { data: tours, error: toursError } = await supabase
      .from('tours')
      .select('slug, updated_at')
      .eq('is_active', true)
      .not('slug', 'is', null);

    if (toursError) {
      console.warn('Error fetching tours for sitemap:', toursError);
    }

    // Dynamic blog posts - only fetch published posts with slugs
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('slug, updated_at')
      .eq('published', true)
      .not('slug', 'is', null);

    if (postsError) {
      console.warn('Error fetching posts for sitemap:', postsError);
    }

    // Transform tour data to sitemap URLs
    const tourUrls: SitemapUrl[] = tours?.map(tour => ({
      loc: `https://belizevibes.com/tours/${tour.slug}`,
      lastmod: tour.updated_at ? tour.updated_at.split('T')[0] : undefined,
      priority: '0.8',
      changefreq: 'weekly' as const
    })) || [];

    // Transform blog post data to sitemap URLs
    const blogUrls: SitemapUrl[] = posts?.map(post => ({
      loc: `https://belizevibes.com/blog/${post.slug}`,
      lastmod: post.updated_at ? post.updated_at.split('T')[0] : undefined,
      priority: '0.6',
      changefreq: 'monthly' as const
    })) || [];

    // Combine all URLs
    const allUrls = [...staticUrls, ...tourUrls, ...blogUrls];
    
    return generateXML(allUrls);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return minimal sitemap as fallback
    return generateXML([
      { loc: 'https://belizevibes.com/', priority: '1.0' }
    ]);
  }
};

// Export a function to save sitemap to public directory (for build-time generation)
export const saveSitemap = async (outputPath: string = '/public/sitemap.xml'): Promise<void> => {
  try {
    const sitemapXML = await generateSitemap();
    // This would need to be implemented based on the deployment strategy
    console.log('Sitemap generated:', sitemapXML.substring(0, 200) + '...');
  } catch (error) {
    console.error('Error saving sitemap:', error);
  }
};