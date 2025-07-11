-- Enhanced Booking System Schema
-- This migration adds comprehensive booking system support

-- Create enum for booking status
CREATE TYPE booking_status_enum AS ENUM ('draft', 'pending', 'confirmed', 'cancelled', 'completed', 'refunded');

-- Create enum for payment status  
CREATE TYPE payment_status_enum AS ENUM ('pending', 'processing', 'paid', 'failed', 'refunded', 'partial_refund');

-- Create enum for adventure difficulty
CREATE TYPE difficulty_enum AS ENUM ('easy', 'moderate', 'challenging', 'extreme');

-- Create enum for cancellation policy
CREATE TYPE cancellation_policy_enum AS ENUM ('flexible', 'moderate', 'strict', 'super_strict');

-- Update adventures table with enhanced booking features
ALTER TABLE public.adventures ADD COLUMN IF NOT EXISTS
  base_price DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS group_discount_percentage INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS early_bird_discount_percentage INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS early_bird_days INTEGER DEFAULT 7,
  ADD COLUMN IF NOT EXISTS min_advance_booking_hours INTEGER DEFAULT 24,
  ADD COLUMN IF NOT EXISTS max_advance_booking_days INTEGER DEFAULT 365,
  ADD COLUMN IF NOT EXISTS cancellation_policy cancellation_policy_enum DEFAULT 'moderate',
  ADD COLUMN IF NOT EXISTS meeting_point TEXT,
  ADD COLUMN IF NOT EXISTS what_to_bring TEXT[],
  ADD COLUMN IF NOT EXISTS not_suitable_for TEXT[],
  ADD COLUMN IF NOT EXISTS seasonal_pricing JSONB,
  ADD COLUMN IF NOT EXISTS available_days INTEGER[] DEFAULT ARRAY[1,2,3,4,5,6,7], -- 1=Monday, 7=Sunday
  ADD COLUMN IF NOT EXISTS daily_capacity INTEGER DEFAULT 8,
  ADD COLUMN IF NOT EXISTS booking_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_booked_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS featured_image_url TEXT,
  ADD COLUMN IF NOT EXISTS gallery_images TEXT[],
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS highlights TEXT[],
  ADD COLUMN IF NOT EXISTS itinerary JSONB,
  ADD COLUMN IF NOT EXISTS add_ons JSONB,
  ADD COLUMN IF NOT EXISTS faqs JSONB;

-- Create adventure availability table
CREATE TABLE IF NOT EXISTS public.adventure_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id UUID REFERENCES public.adventures(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    available_spots INTEGER NOT NULL,
    booked_spots INTEGER DEFAULT 0,
    price_adjustment_percentage INTEGER DEFAULT 0,
    is_blocked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(adventure_id, date, start_time)
);

-- Enhanced bookings table
DROP TABLE IF EXISTS public.bookings CASCADE;
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    adventure_id UUID REFERENCES public.adventures(id) ON DELETE CASCADE,
    guide_id UUID REFERENCES public.guides(id) ON DELETE CASCADE,
    
    -- Booking details
    booking_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    participants INTEGER NOT NULL,
    
    -- Pricing
    base_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    add_ons_amount DECIMAL(10,2) DEFAULT 0,
    
    -- Status
    status booking_status_enum DEFAULT 'draft',
    payment_status payment_status_enum DEFAULT 'pending',
    payment_intent_id TEXT,
    
    -- Guest information
    lead_guest_name VARCHAR(200),
    lead_guest_email VARCHAR(255),
    lead_guest_phone VARCHAR(20),
    guest_details JSONB, -- dietary needs, experience level, etc.
    
    -- Additional options
    add_ons JSONB,
    special_requests TEXT,
    
    -- Confirmation
    confirmation_code VARCHAR(20) UNIQUE,
    qr_code_url TEXT,
    
    -- Communication
    whatsapp_notifications BOOLEAN DEFAULT false,
    sms_notifications BOOLEAN DEFAULT false,
    email_notifications BOOLEAN DEFAULT true,
    
    -- Timestamps
    expires_at TIMESTAMP WITH TIME ZONE,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create booking add-ons table
CREATE TABLE public.booking_addons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    addon_name VARCHAR(200) NOT NULL,
    addon_price DECIMAL(10,2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart table for abandoned cart recovery
CREATE TABLE public.booking_cart (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    adventure_id UUID REFERENCES public.adventures(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    
    -- Cart data
    cart_data JSONB NOT NULL,
    step_completed INTEGER DEFAULT 1, -- which step they reached
    
    -- Timestamps
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, adventure_id)
);

-- Create reviews table (enhanced)
DROP TABLE IF EXISTS public.reviews CASCADE;
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    adventure_id UUID REFERENCES public.adventures(id) ON DELETE CASCADE,
    guide_id UUID REFERENCES public.guides(id) ON DELETE CASCADE,
    
    -- Review details
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    photos TEXT[],
    
    -- Review categories
    experience_rating INTEGER CHECK (experience_rating >= 1 AND experience_rating <= 5),
    guide_rating INTEGER CHECK (guide_rating >= 1 AND guide_rating <= 5),
    value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
    
    -- Verification
    is_verified BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create promotions table
CREATE TABLE public.promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Discount details
    discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed_amount')) NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    min_booking_amount DECIMAL(10,2) DEFAULT 0,
    max_discount_amount DECIMAL(10,2),
    
    -- Applicability
    adventure_ids UUID[],
    user_ids UUID[],
    new_users_only BOOLEAN DEFAULT false,
    
    -- Usage limits
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    per_user_limit INTEGER DEFAULT 1,
    
    -- Validity
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create promotion usage tracking
CREATE TABLE public.promotion_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promotion_id UUID REFERENCES public.promotions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    discount_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(promotion_id, user_id, booking_id)
);

-- Create referral system
CREATE TABLE public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    referee_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    referral_code VARCHAR(50) UNIQUE NOT NULL,
    
    -- Rewards
    referrer_reward_amount DECIMAL(10,2) DEFAULT 0,
    referee_reward_amount DECIMAL(10,2) DEFAULT 0,
    
    -- Status
    is_claimed BOOLEAN DEFAULT false,
    claimed_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create booking analytics
CREATE TABLE public.booking_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adventure_id UUID REFERENCES public.adventures(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Metrics
    views INTEGER DEFAULT 0,
    starts_booking INTEGER DEFAULT 0,
    completes_booking INTEGER DEFAULT 0,
    abandons_cart INTEGER DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(adventure_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.adventure_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for adventure_availability
CREATE POLICY "Anyone can view adventure availability" ON public.adventure_availability
    FOR SELECT USING (true);

CREATE POLICY "Guides can manage their adventure availability" ON public.adventure_availability
    FOR ALL USING (
        adventure_id IN (
            SELECT a.id FROM public.adventures a
            JOIN public.guides g ON a.guide_id = g.id
            WHERE g.user_id = auth.uid()
        )
    );

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Guides can view bookings for their adventures" ON public.bookings
    FOR SELECT USING (
        guide_id IN (
            SELECT id FROM public.guides WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own bookings" ON public.bookings
    FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for booking_cart
CREATE POLICY "Users can manage their own cart" ON public.booking_cart
    FOR ALL USING (user_id = auth.uid());

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for their bookings" ON public.reviews
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reviews" ON public.reviews
    FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for promotions
CREATE POLICY "Anyone can view active promotions" ON public.promotions
    FOR SELECT USING (is_active = true AND starts_at <= NOW() AND expires_at >= NOW());

-- Create indexes for performance
CREATE INDEX idx_adventure_availability_date ON public.adventure_availability(adventure_id, date);
CREATE INDEX idx_bookings_user_status ON public.bookings(user_id, status);
CREATE INDEX idx_bookings_adventure_date ON public.bookings(adventure_id, booking_date);
CREATE INDEX idx_bookings_confirmation_code ON public.bookings(confirmation_code);
CREATE INDEX idx_booking_cart_user_activity ON public.booking_cart(user_id, last_activity_at);
CREATE INDEX idx_reviews_adventure_rating ON public.reviews(adventure_id, rating);
CREATE INDEX idx_promotions_code ON public.promotions(code);
CREATE INDEX idx_analytics_adventure_date ON public.booking_analytics(adventure_id, date);

-- Create functions for business logic
CREATE OR REPLACE FUNCTION update_adventure_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
        UPDATE public.adventures 
        SET booking_count = booking_count + 1,
            last_booked_at = NOW()
        WHERE id = NEW.adventure_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for adventure stats
CREATE TRIGGER update_adventure_stats_trigger
    AFTER INSERT OR UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_adventure_stats();

-- Create function to generate confirmation codes
CREATE OR REPLACE FUNCTION generate_confirmation_code()
RETURNS TRIGGER AS $$
BEGIN
    NEW.confirmation_code = UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for confirmation codes
CREATE TRIGGER generate_confirmation_code_trigger
    BEFORE INSERT ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION generate_confirmation_code();

-- Create function to update availability
CREATE OR REPLACE FUNCTION update_availability_on_booking()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
        UPDATE public.adventure_availability 
        SET booked_spots = booked_spots + NEW.participants
        WHERE adventure_id = NEW.adventure_id 
        AND date = NEW.booking_date;
    ELSIF TG_OP = 'UPDATE' AND OLD.status != 'confirmed' AND NEW.status = 'confirmed' THEN
        UPDATE public.adventure_availability 
        SET booked_spots = booked_spots + NEW.participants
        WHERE adventure_id = NEW.adventure_id 
        AND date = NEW.booking_date;
    ELSIF TG_OP = 'UPDATE' AND OLD.status = 'confirmed' AND NEW.status != 'confirmed' THEN
        UPDATE public.adventure_availability 
        SET booked_spots = booked_spots - OLD.participants
        WHERE adventure_id = OLD.adventure_id 
        AND date = OLD.booking_date;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for availability updates
CREATE TRIGGER update_availability_trigger
    AFTER INSERT OR UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_availability_on_booking();

-- Insert sample data for testing
INSERT INTO public.adventure_availability (adventure_id, date, start_time, available_spots)
SELECT 
    a.id,
    CURRENT_DATE + INTERVAL '1 day' * generate_series(1, 30),
    '09:00:00',
    8
FROM public.adventures a
WHERE a.is_active = true;

-- Insert sample promotions
INSERT INTO public.promotions (code, name, description, discount_type, discount_value, starts_at, expires_at)
VALUES 
    ('WELCOME10', 'Welcome Discount', 'Get 10% off your first adventure', 'percentage', 10, NOW(), NOW() + INTERVAL '30 days'),
    ('EARLY20', 'Early Bird Special', 'Book 7 days in advance for 20% off', 'percentage', 20, NOW(), NOW() + INTERVAL '60 days'),
    ('GROUPSAVE', 'Group Discount', 'Save $25 when booking for 4+ people', 'fixed_amount', 25, NOW(), NOW() + INTERVAL '90 days');