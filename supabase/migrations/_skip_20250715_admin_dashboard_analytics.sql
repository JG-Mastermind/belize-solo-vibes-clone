-- Admin Dashboard Analytics Functions
-- Created: 2025-07-15
-- Purpose: Enhanced analytics functions for admin dashboard with proper filtering and 12-month coverage

-- Function 1: Monthly booking analytics with optional status filtering
CREATE OR REPLACE FUNCTION booking_analytics_monthly(status_filter TEXT DEFAULT NULL)
RETURNS TABLE (
  month TIMESTAMPTZ,
  total_bookings BIGINT,
  total_revenue NUMERIC,
  avg_participants NUMERIC,
  status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH month_series AS (
    -- Generate last 12 months to ensure we always return 12 months even if sparse
    SELECT DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month' * generate_series(0, 11)) as month
  ),
  booking_data AS (
    SELECT 
      DATE_TRUNC('month', b.created_at) as month,
      COUNT(*) as total_bookings,
      COALESCE(SUM(b.total_amount), 0) as total_revenue,
      COALESCE(AVG(b.participants), 0) as avg_participants,
      b.status
    FROM public.bookings b
    WHERE 
      b.created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '11 months')
      AND (status_filter IS NULL OR b.status = status_filter)
    GROUP BY DATE_TRUNC('month', b.created_at), b.status
  )
  SELECT 
    ms.month,
    COALESCE(bd.total_bookings, 0) as total_bookings,
    COALESCE(bd.total_revenue, 0) as total_revenue,
    COALESCE(bd.avg_participants, 0) as avg_participants,
    COALESCE(bd.status, 'no_bookings') as status
  FROM month_series ms
  LEFT JOIN booking_data bd ON ms.month = bd.month
  ORDER BY ms.month DESC;
END;
$$;

-- Add function comment
COMMENT ON FUNCTION booking_analytics_monthly(TEXT) IS 'Returns monthly booking analytics for the last 12 months. Accepts optional status filter parameter. Always returns 12 months even if no bookings exist for some months.';

-- Function 2: Review trends by adventure with optional adventure filtering
CREATE OR REPLACE FUNCTION review_trends_by_adventure(adventure_id UUID DEFAULT NULL)
RETURNS TABLE (
  month TIMESTAMPTZ,
  total_reviews BIGINT,
  avg_rating NUMERIC,
  adventure_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE_TRUNC('month', r.created_at) as month,
    COUNT(*) as total_reviews,
    AVG(r.rating) as avg_rating,
    r.adventure_id
  FROM public.reviews r
  WHERE 
    r.created_at >= NOW() - INTERVAL '12 months'
    AND (review_trends_by_adventure.adventure_id IS NULL OR r.adventure_id = review_trends_by_adventure.adventure_id)
  GROUP BY DATE_TRUNC('month', r.created_at), r.adventure_id
  ORDER BY DATE_TRUNC('month', r.created_at) DESC;
END;
$$;

-- Add function comment
COMMENT ON FUNCTION review_trends_by_adventure(UUID) IS 'Returns review trends grouped by month for the last 12 months. Accepts optional adventure_id parameter to filter by specific adventure.';

-- Grant permissions
REVOKE ALL ON FUNCTION booking_analytics_monthly(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION booking_analytics_monthly(TEXT) TO authenticated;

REVOKE ALL ON FUNCTION review_trends_by_adventure(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION review_trends_by_adventure(UUID) TO authenticated;

-- Create helper function for dashboard overview (bonus)
CREATE OR REPLACE FUNCTION dashboard_overview_stats()
RETURNS TABLE (
  total_bookings BIGINT,
  total_revenue NUMERIC,
  avg_rating NUMERIC,
  active_adventures BIGINT,
  this_month_bookings BIGINT,
  last_month_bookings BIGINT,
  revenue_growth_percentage NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_month_start TIMESTAMPTZ := DATE_TRUNC('month', CURRENT_DATE);
  last_month_start TIMESTAMPTZ := DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month');
  this_month_count BIGINT;
  last_month_count BIGINT;
BEGIN
  -- Get this month's bookings
  SELECT COUNT(*) INTO this_month_count
  FROM public.bookings 
  WHERE created_at >= current_month_start;
  
  -- Get last month's bookings
  SELECT COUNT(*) INTO last_month_count
  FROM public.bookings 
  WHERE created_at >= last_month_start 
    AND created_at < current_month_start;
  
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.bookings)::BIGINT as total_bookings,
    (SELECT COALESCE(SUM(total_amount), 0) FROM public.bookings WHERE status = 'confirmed')::NUMERIC as total_revenue,
    (SELECT COALESCE(AVG(rating), 0) FROM public.reviews)::NUMERIC as avg_rating,
    (SELECT COUNT(*) FROM public.adventures WHERE is_active = true)::BIGINT as active_adventures,
    this_month_count as this_month_bookings,
    last_month_count as last_month_bookings,
    (CASE 
      WHEN last_month_count = 0 THEN 0
      ELSE ((this_month_count - last_month_count)::NUMERIC / last_month_count::NUMERIC * 100)
    END)::NUMERIC as revenue_growth_percentage;
END;
$$;

-- Add function comment
COMMENT ON FUNCTION dashboard_overview_stats() IS 'Returns key dashboard overview statistics including totals, growth rates, and month-over-month comparisons.';

-- Grant permissions
REVOKE ALL ON FUNCTION dashboard_overview_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION dashboard_overview_stats() TO authenticated;