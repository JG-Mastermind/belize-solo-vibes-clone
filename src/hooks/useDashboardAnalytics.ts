
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardAnalytics = () => {
  const bookingAnalytics = useQuery({
    queryKey: ['booking-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_booking_analytics' as any);
      
      if (error) {
        console.error('Error fetching booking analytics:', error);
        throw error;
      }
      return data || [];
    }
  });

  const reviewAnalytics = useQuery({
    queryKey: ['review-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_review_analytics' as any);
      
      if (error) {
        console.error('Error fetching review analytics:', error);
        throw error;
      }
      return data || [];
    }
  });

  const recentBookings = useQuery({
    queryKey: ['recent-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          adventures (title),
          users (first_name, last_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  return {
    bookingAnalytics,
    reviewAnalytics,
    recentBookings
  };
};
