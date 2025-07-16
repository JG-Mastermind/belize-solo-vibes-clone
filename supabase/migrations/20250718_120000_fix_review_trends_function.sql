-- Fix the review_trends_by_adventure function naming conflict
CREATE OR REPLACE FUNCTION review_trends_by_adventure(filter_adventure_id UUID DEFAULT NULL)
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
    DATE_TRUNC('month', r.created_at) as month,
    COUNT(*) as total_reviews,
    AVG(r.rating) as avg_rating,
    r.adventure_id
  FROM public.reviews r
  WHERE
    r.created_at >= NOW() - INTERVAL '12 months'
    AND (filter_adventure_id IS NULL OR r.adventure_id = filter_adventure_id)
  GROUP BY DATE_TRUNC('month', r.created_at), r.adventure_id
  ORDER BY DATE_TRUNC('month', r.created_at) DESC;
END;
$$;