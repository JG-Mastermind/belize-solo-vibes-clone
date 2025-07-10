
-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS get_booking_analytics();
DROP FUNCTION IF EXISTS get_review_analytics();

-- Create proper RPC function for booking analytics
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

-- Create proper RPC function for review analytics
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

-- Ensure the reviews table has the adventure_id column (if not already added)
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS adventure_id UUID REFERENCES public.adventures(id);
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ DEFAULT now();

-- Create some sample adventure data with proper UUIDs to test with
INSERT INTO public.adventures (id, title, location, description, price_per_person, max_participants, difficulty_level, duration_hours, is_active)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Cave Tubing Adventure', 'Belize City', 'Explore ancient caves by tube', 75.00, 10, 'Easy', 4, true),
  ('550e8400-e29b-41d4-a716-446655440002', 'Blue Hole Diving', 'Blue Hole', 'World-famous diving experience', 150.00, 8, 'Advanced', 6, true),
  ('550e8400-e29b-41d4-a716-446655440003', 'Mayan Ruins Tour', 'Caracol', 'Ancient Mayan archaeological site', 90.00, 15, 'Moderate', 8, true)
ON CONFLICT (id) DO NOTHING;
