
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Define proper TypeScript interfaces for the analytics data
interface BookingAnalytics {
  month: string;
  total_bookings: number;
  total_revenue: number;
  avg_participants: number;
  status: string;
}

interface ReviewAnalytics {
  month: string;
  total_reviews: number;
  avg_rating: number;
  adventure_id: string;
}

interface RecentBooking {
  id: string;
  booking_date: string;
  participants: number;
  total_amount: number;
  status: string;
  created_at: string;
  adventures: {
    title: string;
  } | null;
  users: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
}

export const useDashboardAnalytics = () => {
  const bookingAnalytics = useQuery({
    queryKey: ['booking-analytics'],
    queryFn: async (): Promise<BookingAnalytics[]> => {
      const { data, error } = await supabase
        .rpc('get_booking_analytics');
      
      if (error) {
        console.error('Error fetching booking analytics:', error);
        throw error;
      }
      
      // Transform the data to match our interface
      return (data || []).map((item: any) => ({
        month: item.month,
        total_bookings: Number(item.total_bookings) || 0,
        total_revenue: Number(item.total_revenue) || 0,
        avg_participants: Number(item.avg_participants) || 0,
        status: item.status || 'unknown'
      }));
    }
  });

  const reviewAnalytics = useQuery({
    queryKey: ['review-analytics'],
    queryFn: async (): Promise<ReviewAnalytics[]> => {
      const { data, error } = await supabase
        .rpc('get_review_analytics');
      
      if (error) {
        console.error('Error fetching review analytics:', error);
        throw error;
      }
      
      // Transform the data to match our interface
      return (data || []).map((item: any) => ({
        month: item.month,
        total_reviews: Number(item.total_reviews) || 0,
        avg_rating: Number(item.avg_rating) || 0,
        adventure_id: item.adventure_id || ''
      }));
    }
  });

  const recentBookings = useQuery({
    queryKey: ['recent-bookings'],
    queryFn: async (): Promise<RecentBooking[]> => {
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
      return data || [];
    }
  });

  return {
    bookingAnalytics,
    reviewAnalytics,
    recentBookings
  };
};
