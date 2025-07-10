
CREATE OR REPLACE FUNCTION get_booking_analytics()
RETURNS TABLE (
  month TIMESTAMPTZ,
  total_bookings BIGINT,
  total_revenue NUMERIC,
  avg_participants NUMERIC,
  status TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as total_bookings,
    SUM(total_amount) as total_revenue,
    AVG(participants) as avg_participants,
    b.status
  FROM public.bookings b
  GROUP BY month, b.status
  ORDER BY month DESC
  LIMIT 12;
END;
$$;

CREATE OR REPLACE FUNCTION get_review_analytics()
RETURNS TABLE (
  month TIMESTAMPTZ,
  total_reviews BIGINT,
  avg_rating NUMERIC,
  adventure_id UUID
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as total_reviews,
    AVG(rating) as avg_rating,
    r.adventure_id
  FROM public.reviews r
  GROUP BY month, r.adventure_id
  ORDER BY month DESC
  LIMIT 12;
END;
$$;
