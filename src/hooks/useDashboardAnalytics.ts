
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardAnalytics = () => {
  const bookingAnalytics = useQuery({
    queryKey: ['booking-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_analytics')
        .select('*')
        .order('month', { ascending: false })
        .limit(12);
      
      if (error) throw error;
      return data;
    }
  });

  const reviewAnalytics = useQuery({
    queryKey: ['review-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('review_analytics')
        .select('*')
        .order('month', { ascending: false })
        .limit(12);
      
      if (error) throw error;
      return data;
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
