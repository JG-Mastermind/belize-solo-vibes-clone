-- Create simple testimonials table for public reviews on homepage
-- This is separate from the complex reviews table for adventure bookings

CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read verified testimonials
CREATE POLICY "Anyone can view verified testimonials" ON public.testimonials
    FOR SELECT USING (is_verified = true);

-- Allow anyone to insert testimonials (they'll need verification)
CREATE POLICY "Anyone can submit testimonials" ON public.testimonials
    FOR INSERT WITH CHECK (true);

-- Only admins can update testimonials (for verification)
CREATE POLICY "Admins can update testimonials" ON public.testimonials
    FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_testimonials_verified ON public.testimonials(is_verified, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON public.testimonials(rating DESC);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add some sample verified testimonials
INSERT INTO public.testimonials (user_name, content, rating, is_verified) VALUES
('Sarah Johnson', 'My solo trip to Belize with BelizeVibes was absolutely incredible! The cave tubing experience was magical, and I felt completely safe traveling alone. The guides were knowledgeable and made sure everyone in our small group had an amazing time.', 5, true),
('Michael Chen', 'The Blue Hole diving experience exceeded all expectations! As a solo traveler, I was worried about fitting in, but the group was welcoming and the dive masters were professional. Definitely a once-in-a-lifetime experience.', 5, true),
('Emma Thompson', 'I was nervous about traveling solo, but BelizeVibes made everything seamless. The Caracol Maya ruins tour was fascinating, and I learned so much about Mayan history. The small group size made it feel personal and intimate.', 5, true);