import { supabase } from '@/integrations/supabase/client';

/**
 * Utility to redirect from tour ID to slug-based URL for SEO
 * This function fetches the tour's slug and returns the SEO-friendly URL
 */
export const getSlugUrl = async (tourId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('tours')
      .select('slug')
      .eq('id', tourId)
      .eq('is_active', true)
      .single();

    if (error || !data?.slug) {
      console.warn('Could not find slug for tour ID:', tourId);
      return null;
    }

    return `/tours/${data.slug}`;
  } catch (error) {
    console.error('Error fetching tour slug:', error);
    return null;
  }
};

/**
 * Helper function to determine if a string is a UUID (ID) or slug
 */
export const isUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

/**
 * Generate a slug from a title
 */
export const generateSlugFromTitle = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};