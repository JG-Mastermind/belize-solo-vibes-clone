import { supabase } from '@/integrations/supabase/client';

// TODO: rename to popularToursService - using canonical tours table
export interface PopularTour {
  category: string;
  tour: {
    id: string;
    title: string;
    location_name: string;
    price_per_person: number;
    booking_count: number;
    average_rating: number;
    total_reviews: number;
    last_booked_at: string;
    created_at: string;
    is_active: boolean;
    ai_generated_image_url?: string;
    featured_image_url?: string;
  };
  popularity_score: number;
  visits_count: number;
  booking_conversion_rate: number;
  revenue_generated: number;
}

export interface PopularAdventuresResponse {
  success: boolean;
  data: PopularTour[];
  metadata: {
    total_categories: number;
    algorithm_weights: Record<string, number>;
    last_updated: string;
  };
}

class PopularAdventuresService {
  private cache: {
    data: PopularTour[] | null;
    lastFetch: number;
    ttl: number; // Time to live in milliseconds
  } = {
    data: null,
    lastFetch: 0,
    ttl: 5 * 60 * 1000 // 5 minutes cache
  };

  /**
   * Get the most popular tour per category with real-time updates
   */
  async getPopularAdventures(forceRefresh = false): Promise<PopularTour[]> {
    const now = Date.now();
    
    // Return cached data if still valid and not forcing refresh
    if (!forceRefresh && this.cache.data && (now - this.cache.lastFetch) < this.cache.ttl) {
      return this.cache.data;
    }

    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('popular-adventures');

      if (error) {
        console.error('Error fetching popular adventures:', error);
        // Return cached data as fallback, or empty array
        return this.cache.data || [];
      }

      const response: PopularAdventuresResponse = data;
      
      if (!response.success) {
        throw new Error('Popular adventures service returned error');
      }

      // Update cache
      this.cache.data = response.data;
      this.cache.lastFetch = now;

      return response.data;

    } catch (error) {
      console.error('Failed to fetch popular adventures:', error);
      
      // Fallback to direct database query if edge function fails
      return this.getFallbackPopularAdventures();
    }
  }

  /**
   * Fallback method using direct database queries
   */
  private async getFallbackPopularAdventures(): Promise<PopularTour[]> {
    try {
      const { data: tours, error } = await supabase
        .from('tours')
        .select('*')
        .eq('is_active', true)
        .order('booking_count', { ascending: false })
        .limit(6); // Get top 6 most booked tours

      if (error) throw error;

      // Simple categorization for fallback
      const categories = ['adventure', 'marine', 'cultural', 'diving', 'wildlife'];
      const popularByCategory: PopularTour[] = [];

      for (const category of categories) {
        // Find first tour that matches category (simplified mapping)
        const categoryTour = tours?.find(tour => {
          const title = tour.title.toLowerCase();
          switch (category) {
            case 'adventure':
              return title.includes('cave') || title.includes('zip') || title.includes('jungle');
            case 'marine':
              return title.includes('snorkel') || title.includes('fishing') || title.includes('island');
            case 'cultural':
              return title.includes('maya') || title.includes('ruins') || title.includes('cultural') || title.includes('village');
            case 'diving':
              return title.includes('blue hole') || title.includes('diving');
            case 'wildlife':
              return title.includes('manatee') || title.includes('safari') || title.includes('wildlife');
            default:
              return false;
          }
        });

        if (categoryTour) {
          popularByCategory.push({
            category,
            tour: categoryTour,
            popularity_score: categoryTour.booking_count || 0,
            visits_count: 0,
            booking_conversion_rate: 0,
            revenue_generated: 0
          });
        }
      }

      return popularByCategory.slice(0, 6); // Return top 6

    } catch (error) {
      console.error('Fallback popular adventures query failed:', error);
      return [];
    }
  }

  /**
   * Get popular adventures for footer display (simplified)
   */
  async getPopularAdventuresForFooter(): Promise<{ title: string; category: string; id: string }[]> {
    const popular = await this.getPopularAdventures();
    
    return popular.slice(0, 6).map(item => ({
      title: item.tour.title,
      category: item.category,
      id: item.tour.id
    }));
  }

  /**
   * Track that a tour was viewed (this contributes to popularity)
   */
  async trackTourView(tourId: string): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Upsert analytics record - using tour_id instead of adventure_id
      const { error } = await supabase
        .from('booking_analytics')
        .upsert({
          tour_id: tourId,
          date: today,
          views: 1
        }, {
          onConflict: 'tour_id,date'
        });

      if (error) {
        console.error('Error tracking tour view:', error);
      }
    } catch (error) {
      console.error('Failed to track tour view:', error);
    }
  }

  /**
   * Force refresh of popular adventures cache
   */
  async refreshCache(): Promise<PopularTour[]> {
    return this.getPopularAdventures(true);
  }

  /**
   * Get cache status for debugging
   */
  getCacheStatus() {
    const now = Date.now();
    return {
      hasData: !!this.cache.data,
      age: now - this.cache.lastFetch,
      ttl: this.cache.ttl,
      isStale: (now - this.cache.lastFetch) > this.cache.ttl
    };
  }
}

// Export singleton instance
export const popularAdventuresService = new PopularAdventuresService();