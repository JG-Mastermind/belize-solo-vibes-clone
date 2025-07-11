
-- Add review analytics tracking
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS adventure_id UUID REFERENCES public.adventures(id);
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ DEFAULT now();

-- Create payment sessions table for Stripe integration
CREATE TABLE IF NOT EXISTS public.payment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on payment_sessions
ALTER TABLE public.payment_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for payment_sessions
CREATE POLICY "Users can view their own payment sessions" ON public.payment_sessions
  FOR SELECT USING (
    booking_id IN (
      SELECT id FROM public.bookings WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Allow insert for authenticated users" ON public.payment_sessions
  FOR INSERT WITH CHECK (
    booking_id IN (
      SELECT id FROM public.bookings WHERE user_id = auth.uid()
    )
  );

-- Create analytics view for dashboard
CREATE OR REPLACE VIEW public.booking_analytics AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as total_bookings,
  SUM(total_amount) as total_revenue,
  AVG(participants) as avg_participants,
  status
FROM public.bookings 
GROUP BY month, status
ORDER BY month DESC;

-- Create review analytics view
CREATE OR REPLACE VIEW public.review_analytics AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as total_reviews,
  AVG(rating) as avg_rating,
  adventure_id
FROM public.reviews 
GROUP BY month, adventure_id
ORDER BY month DESC;
