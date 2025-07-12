-- =====================================================
-- BelizeVibes Tourism Platform Database Schema
-- =====================================================
-- Complete database schema for Belize tourism platform
-- Supports tours, bookings, guides, travelers, payments, and safety features

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- ENUM TYPES
-- =====================================================

-- User roles
CREATE TYPE user_role AS ENUM ('traveler', 'guide', 'host', 'admin');

-- Tour categories
CREATE TYPE tour_category AS ENUM (
    'adventure',
    'cultural',
    'wildlife',
    'water_sports',
    'eco_tourism',
    'historical',
    'culinary',
    'photography',
    'wellness',
    'educational',
    'extreme_sports',
    'family_friendly'
);

-- Difficulty levels
CREATE TYPE difficulty_level AS ENUM ('easy', 'moderate', 'challenging', 'extreme');

-- Booking statuses
CREATE TYPE booking_status AS ENUM (
    'draft',
    'pending',
    'confirmed',
    'cancelled',
    'completed',
    'refunded',
    'no_show'
);

-- Payment statuses
CREATE TYPE payment_status AS ENUM (
    'pending',
    'paid',
    'failed',
    'refunded',
    'partially_refunded',
    'disputed'
);

-- Alert types for safety system
CREATE TYPE alert_type AS ENUM (
    'weather',
    'security',
    'health',
    'transportation',
    'missing_person',
    'natural_disaster',
    'political',
    'advisory'
);

-- Alert severity levels
CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high', 'critical');

-- Availability status
CREATE TYPE availability_status AS ENUM ('available', 'limited', 'fully_booked', 'unavailable');

-- Notification types
CREATE TYPE notification_type AS ENUM (
    'booking_confirmed',
    'booking_cancelled',
    'booking_reminder',
    'payment_received',
    'safety_alert',
    'tour_updated',
    'review_received',
    'message_received',
    'weather_alert',
    'emergency_contact'
);

-- =====================================================
-- CORE TABLES
-- =====================================================

-- User profiles (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    whatsapp_number VARCHAR(20),
    role user_role NOT NULL DEFAULT 'traveler',
    avatar_url TEXT,
    bio TEXT,
    date_of_birth DATE,
    nationality VARCHAR(100),
    languages TEXT[], -- Array of language codes: ['en', 'es', 'fr']
    emergency_contact JSONB, -- {name, phone, relationship, email}
    preferences JSONB DEFAULT '{}', -- User preferences and settings
    stripe_customer_id VARCHAR(255), -- Stripe customer ID
    stripe_account_id VARCHAR(255), -- For guides/hosts who receive payments
    is_verified BOOLEAN DEFAULT FALSE,
    verification_documents JSONB, -- Array of document URLs and types
    location_preferences JSONB, -- Preferred locations, radius, etc.
    notification_settings JSONB DEFAULT '{"email": true, "sms": false, "whatsapp": false, "push": true}',
    privacy_settings JSONB DEFAULT '{"profile_public": true, "show_reviews": true, "share_location": false}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guide profiles (additional data for guides)
CREATE TABLE guide_profiles (
    id UUID PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
    license_number VARCHAR(100),
    experience_years INTEGER CHECK (experience_years >= 0),
    specializations tour_category[],
    certifications JSONB, -- Array of certification objects
    insurance_info JSONB, -- Insurance details
    equipment_provided TEXT[],
    max_group_size INTEGER DEFAULT 12 CHECK (max_group_size > 0),
    base_rate DECIMAL(10,2) CHECK (base_rate >= 0),
    availability_schedule JSONB, -- Weekly schedule with time slots
    service_areas JSONB, -- Geographic areas they serve
    response_time_hours INTEGER DEFAULT 24,
    cancellation_policy TEXT,
    rating_average DECIMAL(3,2) DEFAULT 0.0 CHECK (rating_average >= 0 AND rating_average <= 5),
    total_reviews INTEGER DEFAULT 0,
    total_tours_completed INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tours/Adventures table
CREATE TABLE tours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guide_id UUID NOT NULL REFERENCES guide_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL, -- URL-friendly version
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    category tour_category NOT NULL,
    subcategory VARCHAR(100),
    difficulty_level difficulty_level NOT NULL,
    duration_hours DECIMAL(4,2) NOT NULL CHECK (duration_hours > 0),
    max_participants INTEGER NOT NULL CHECK (max_participants > 0),
    min_participants INTEGER DEFAULT 1 CHECK (min_participants > 0),
    base_price DECIMAL(10,2) NOT NULL CHECK (base_price >= 0),
    child_price DECIMAL(10,2) CHECK (child_price >= 0),
    infant_price DECIMAL(10,2) DEFAULT 0 CHECK (infant_price >= 0),
    
    -- Location data using PostGIS
    location_name VARCHAR(255) NOT NULL,
    location_point GEOMETRY(POINT, 4326), -- WGS84 coordinate system
    location_area GEOMETRY(POLYGON, 4326), -- Service area polygon
    meeting_point GEOMETRY(POINT, 4326),
    meeting_point_description TEXT,
    
    -- Media
    featured_image_url TEXT,
    image_urls TEXT[],
    video_urls TEXT[],
    
    -- Availability and scheduling
    seasonal_availability JSONB, -- {start_date, end_date, days_of_week}
    time_slots JSONB, -- Available time slots for each day
    advance_booking_days INTEGER DEFAULT 1,
    last_minute_booking_hours INTEGER DEFAULT 2,
    
    -- Inclusions and requirements
    includes TEXT[],
    excludes TEXT[],
    requirements TEXT[],
    restrictions TEXT[],
    what_to_bring TEXT[],
    
    -- Policies
    cancellation_policy TEXT,
    weather_policy TEXT,
    safety_guidelines TEXT,
    
    -- Pricing and discounts
    group_discount_percentage DECIMAL(5,2) DEFAULT 0,
    early_bird_discount JSONB, -- {percentage, days_before}
    seasonal_pricing JSONB, -- Array of seasonal price adjustments
    
    -- Add-ons
    available_addons JSONB, -- Array of addon objects
    
    -- Multi-language support
    translations JSONB, -- {es: {title, description}, fr: {title, description}}
    
    -- Status and metadata
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    tags TEXT[],
    booking_count INTEGER DEFAULT 0,
    rating_average DECIMAL(3,2) DEFAULT 0.0 CHECK (rating_average >= 0 AND rating_average <= 5),
    total_reviews INTEGER DEFAULT 0,
    last_booked_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT min_participants_check CHECK (min_participants <= max_participants)
);

-- Tour availability calendar
CREATE TABLE tour_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time_slot TIME NOT NULL,
    max_participants INTEGER NOT NULL,
    booked_participants INTEGER DEFAULT 0,
    status availability_status NOT NULL DEFAULT 'available',
    price_override DECIMAL(10,2), -- Override base price for specific dates
    special_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(tour_id, date, time_slot),
    CONSTRAINT booked_participants_check CHECK (booked_participants <= max_participants)
);

-- Bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number VARCHAR(20) UNIQUE NOT NULL, -- Human-readable booking reference
    user_id UUID NOT NULL REFERENCES user_profiles(id),
    tour_id UUID NOT NULL REFERENCES tours(id),
    guide_id UUID NOT NULL REFERENCES guide_profiles(id),
    
    -- Booking details
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    adult_participants INTEGER NOT NULL DEFAULT 1 CHECK (adult_participants >= 0),
    child_participants INTEGER DEFAULT 0 CHECK (child_participants >= 0),
    infant_participants INTEGER DEFAULT 0 CHECK (infant_participants >= 0),
    total_participants INTEGER GENERATED ALWAYS AS (adult_participants + child_participants + infant_participants) STORED,
    
    -- Contact information
    lead_guest_name VARCHAR(255) NOT NULL,
    lead_guest_email VARCHAR(255) NOT NULL,
    lead_guest_phone VARCHAR(20),
    lead_guest_whatsapp VARCHAR(20),
    
    -- Special requirements
    special_requests TEXT,
    dietary_restrictions TEXT[],
    accessibility_needs TEXT[],
    emergency_contact JSONB,
    
    -- Add-ons and customizations
    selected_addons JSONB, -- Array of selected addon objects
    
    -- Pricing breakdown
    base_price DECIMAL(10,2) NOT NULL,
    child_price DECIMAL(10,2) DEFAULT 0,
    infant_price DECIMAL(10,2) DEFAULT 0,
    addon_total DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Payment information
    payment_status payment_status NOT NULL DEFAULT 'pending',
    payment_method VARCHAR(50),
    stripe_payment_intent_id VARCHAR(255),
    payment_received_at TIMESTAMP WITH TIME ZONE,
    
    -- Status and tracking
    status booking_status NOT NULL DEFAULT 'pending',
    confirmation_code VARCHAR(10),
    qr_code_url TEXT,
    
    -- Important dates
    booking_expires_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Communication
    last_reminder_sent_at TIMESTAMP WITH TIME ZONE,
    guide_notified_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    booking_source VARCHAR(50) DEFAULT 'web',
    user_agent TEXT,
    referrer TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT total_participants_check CHECK (total_participants > 0)
);

-- Booking guests (for multi-participant bookings)
CREATE TABLE booking_guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    guest_type VARCHAR(20) NOT NULL CHECK (guest_type IN ('adult', 'child', 'infant')),
    full_name VARCHAR(255),
    age INTEGER CHECK (age >= 0 AND age <= 150),
    dietary_restrictions TEXT[],
    medical_conditions TEXT[],
    emergency_contact JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews and ratings
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_profiles(id),
    tour_id UUID NOT NULL REFERENCES tours(id),
    guide_id UUID NOT NULL REFERENCES guide_profiles(id),
    
    -- Ratings (1-5 scale)
    overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    guide_rating INTEGER CHECK (guide_rating >= 1 AND guide_rating <= 5),
    value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
    safety_rating INTEGER CHECK (safety_rating >= 1 AND safety_rating <= 5),
    
    -- Review content
    title VARCHAR(255),
    review_text TEXT,
    pros TEXT[],
    cons TEXT[],
    
    -- Media
    photo_urls TEXT[],
    video_urls TEXT[],
    
    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Status
    is_public BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    helpful_votes INTEGER DEFAULT 0,
    
    -- Response from guide
    guide_response TEXT,
    guide_response_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(booking_id, user_id) -- One review per booking per user
);

-- Safety alerts system
CREATE TABLE safety_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_type alert_type NOT NULL,
    severity alert_severity NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    -- Location (can be point or area)
    affected_area GEOMETRY(POLYGON, 4326),
    affected_point GEOMETRY(POINT, 4326),
    location_description TEXT,
    
    -- Alert details
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Affected entities
    affected_tours UUID[], -- Array of tour IDs
    affected_locations TEXT[], -- Array of location names
    
    -- Communication
    notification_sent BOOLEAN DEFAULT FALSE,
    notification_sent_at TIMESTAMP WITH TIME ZONE,
    
    -- Multi-language support
    translations JSONB,
    
    -- Metadata
    source VARCHAR(100), -- weather service, government, etc.
    external_id VARCHAR(255),
    contact_info JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications system
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Related entities
    booking_id UUID REFERENCES bookings(id),
    tour_id UUID REFERENCES tours(id),
    review_id UUID REFERENCES reviews(id),
    alert_id UUID REFERENCES safety_alerts(id),
    
    -- Delivery channels
    send_email BOOLEAN DEFAULT TRUE,
    send_sms BOOLEAN DEFAULT FALSE,
    send_whatsapp BOOLEAN DEFAULT FALSE,
    send_push BOOLEAN DEFAULT TRUE,
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    
    -- Scheduling
    scheduled_for TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    data JSONB, -- Additional data for the notification
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences and settings
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    -- Preferred tour categories
    preferred_categories tour_category[],
    preferred_difficulty_levels difficulty_level[],
    preferred_duration_min INTEGER,
    preferred_duration_max INTEGER,
    preferred_group_size_max INTEGER,
    preferred_price_range NUMRANGE,
    
    -- Location preferences
    preferred_locations TEXT[],
    travel_radius_km INTEGER DEFAULT 50,
    
    -- Accessibility and requirements
    accessibility_needs TEXT[],
    dietary_restrictions TEXT[],
    fitness_level VARCHAR(50),
    
    -- Communication preferences
    preferred_language VARCHAR(10) DEFAULT 'en',
    communication_preferences JSONB,
    
    -- Privacy settings
    share_reviews BOOLEAN DEFAULT TRUE,
    share_location BOOLEAN DEFAULT FALSE,
    allow_guide_contact BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User profiles indexes
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_phone ON user_profiles(phone);
CREATE INDEX idx_user_profiles_whatsapp ON user_profiles(whatsapp_number);
CREATE INDEX idx_user_profiles_created_at ON user_profiles(created_at);

-- Guide profiles indexes
CREATE INDEX idx_guide_profiles_specializations ON guide_profiles USING GIN(specializations);
CREATE INDEX idx_guide_profiles_rating ON guide_profiles(rating_average DESC);
CREATE INDEX idx_guide_profiles_active ON guide_profiles(is_active);
CREATE INDEX idx_guide_profiles_location ON guide_profiles USING GIN(service_areas);

-- Tours indexes
CREATE INDEX idx_tours_guide_id ON tours(guide_id);
CREATE INDEX idx_tours_category ON tours(category);
CREATE INDEX idx_tours_difficulty ON tours(difficulty_level);
CREATE INDEX idx_tours_active ON tours(is_active);
CREATE INDEX idx_tours_featured ON tours(is_featured);
CREATE INDEX idx_tours_price ON tours(base_price);
CREATE INDEX idx_tours_rating ON tours(rating_average DESC);
CREATE INDEX idx_tours_location_point ON tours USING GIST(location_point);
CREATE INDEX idx_tours_location_area ON tours USING GIST(location_area);
CREATE INDEX idx_tours_slug ON tours(slug);
CREATE INDEX idx_tours_tags ON tours USING GIN(tags);
CREATE INDEX idx_tours_search ON tours USING GIN(to_tsvector('english', title || ' ' || description));

-- Tour availability indexes
CREATE INDEX idx_tour_availability_tour_date ON tour_availability(tour_id, date);
CREATE INDEX idx_tour_availability_date ON tour_availability(date);
CREATE INDEX idx_tour_availability_status ON tour_availability(status);

-- Bookings indexes
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_tour_id ON bookings(tour_id);
CREATE INDEX idx_bookings_guide_id ON bookings(guide_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);
CREATE INDEX idx_bookings_number ON bookings(booking_number);
CREATE INDEX idx_bookings_confirmation_code ON bookings(confirmation_code);

-- Reviews indexes
CREATE INDEX idx_reviews_tour_id ON reviews(tour_id);
CREATE INDEX idx_reviews_guide_id ON reviews(guide_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(overall_rating DESC);
CREATE INDEX idx_reviews_public ON reviews(is_public);
CREATE INDEX idx_reviews_featured ON reviews(is_featured);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- Safety alerts indexes
CREATE INDEX idx_safety_alerts_type ON safety_alerts(alert_type);
CREATE INDEX idx_safety_alerts_severity ON safety_alerts(severity);
CREATE INDEX idx_safety_alerts_active ON safety_alerts(is_active);
CREATE INDEX idx_safety_alerts_dates ON safety_alerts(start_date, end_date);
CREATE INDEX idx_safety_alerts_area ON safety_alerts USING GIST(affected_area);
CREATE INDEX idx_safety_alerts_point ON safety_alerts USING GIST(affected_point);
CREATE INDEX idx_safety_alerts_tours ON safety_alerts USING GIN(affected_tours);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_for);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to generate booking numbers
CREATE OR REPLACE FUNCTION generate_booking_number() RETURNS TEXT AS $$
BEGIN
    RETURN 'BV' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 9999)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to generate confirmation codes
CREATE OR REPLACE FUNCTION generate_confirmation_code() RETURNS TEXT AS $$
BEGIN
    RETURN UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
END;
$$ LANGUAGE plpgsql;

-- Function to calculate distance between two points
CREATE OR REPLACE FUNCTION calculate_distance(point1 GEOMETRY, point2 GEOMETRY) 
RETURNS DECIMAL AS $$
BEGIN
    RETURN ST_Distance(point1::geography, point2::geography) / 1000; -- Returns distance in kilometers
END;
$$ LANGUAGE plpgsql;

-- Function to find tours within radius
CREATE OR REPLACE FUNCTION find_tours_within_radius(
    center_lat DECIMAL,
    center_lng DECIMAL,
    radius_km INTEGER DEFAULT 50
) RETURNS TABLE(
    tour_id UUID,
    title VARCHAR(255),
    distance_km DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.title,
        ST_Distance(
            ST_MakePoint(center_lng, center_lat)::geography,
            t.location_point::geography
        ) / 1000 as distance_km
    FROM tours t
    WHERE ST_DWithin(
        ST_MakePoint(center_lng, center_lat)::geography,
        t.location_point::geography,
        radius_km * 1000
    )
    AND t.is_active = TRUE
    ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_guide_profiles_updated_at BEFORE UPDATE ON guide_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tours_updated_at BEFORE UPDATE ON tours FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tour_availability_updated_at BEFORE UPDATE ON tour_availability FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_safety_alerts_updated_at BEFORE UPDATE ON safety_alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to generate booking number
CREATE OR REPLACE FUNCTION set_booking_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.booking_number IS NULL THEN
        NEW.booking_number := generate_booking_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_booking_number_trigger BEFORE INSERT ON bookings FOR EACH ROW EXECUTE FUNCTION set_booking_number();

-- Trigger to generate confirmation code
CREATE OR REPLACE FUNCTION set_confirmation_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.confirmation_code IS NULL THEN
        NEW.confirmation_code := generate_confirmation_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_confirmation_code_trigger BEFORE INSERT ON bookings FOR EACH ROW EXECUTE FUNCTION set_confirmation_code();

-- Trigger to update tour booking count and rating
CREATE OR REPLACE FUNCTION update_tour_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update booking count
    UPDATE tours SET 
        booking_count = (SELECT COUNT(*) FROM bookings WHERE tour_id = NEW.tour_id AND status = 'confirmed'),
        last_booked_at = NOW()
    WHERE id = NEW.tour_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tour_stats_trigger AFTER INSERT OR UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_tour_stats();

-- Trigger to update guide and tour ratings when reviews are added
CREATE OR REPLACE FUNCTION update_ratings_on_review()
RETURNS TRIGGER AS $$
BEGIN
    -- Update tour rating
    UPDATE tours SET 
        rating_average = (SELECT AVG(overall_rating) FROM reviews WHERE tour_id = NEW.tour_id AND is_public = true),
        total_reviews = (SELECT COUNT(*) FROM reviews WHERE tour_id = NEW.tour_id AND is_public = true)
    WHERE id = NEW.tour_id;
    
    -- Update guide rating
    UPDATE guide_profiles SET 
        rating_average = (SELECT AVG(guide_rating) FROM reviews WHERE guide_id = NEW.guide_id AND is_public = true),
        total_reviews = (SELECT COUNT(*) FROM reviews WHERE guide_id = NEW.guide_id AND is_public = true)
    WHERE id = NEW.guide_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ratings_on_review_trigger AFTER INSERT OR UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_ratings_on_review();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone" ON user_profiles
    FOR SELECT USING (
        (privacy_settings->>'profile_public')::boolean = true
    );

-- Guide profiles policies
CREATE POLICY "Anyone can view active guide profiles" ON guide_profiles
    FOR SELECT USING (is_active = true);

CREATE POLICY "Guides can update their own profile" ON guide_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Tours policies
CREATE POLICY "Anyone can view active tours" ON tours
    FOR SELECT USING (is_active = true);

CREATE POLICY "Guides can manage their own tours" ON tours
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM guide_profiles 
            WHERE guide_profiles.id = tours.guide_id 
            AND guide_profiles.id = auth.uid()
        )
    );

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON bookings
    FOR SELECT USING (
        user_id = auth.uid() OR 
        guide_id = auth.uid()
    );

CREATE POLICY "Users can create bookings" ON bookings
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own bookings" ON bookings
    FOR UPDATE USING (
        user_id = auth.uid() OR 
        guide_id = auth.uid()
    );

-- Reviews policies
CREATE POLICY "Anyone can view public reviews" ON reviews
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create reviews for their bookings" ON reviews
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM bookings 
            WHERE bookings.id = reviews.booking_id 
            AND bookings.user_id = auth.uid()
            AND bookings.status = 'completed'
        )
    );

-- Safety alerts policies
CREATE POLICY "Anyone can view active safety alerts" ON safety_alerts
    FOR SELECT USING (is_active = true);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert sample enum values would go here in a production setup
-- This schema is now ready for the BelizeVibes tourism platform!

COMMENT ON SCHEMA public IS 'BelizeVibes Tourism Platform Database Schema';
COMMENT ON TABLE user_profiles IS 'Extended user profiles with tourism-specific fields';
COMMENT ON TABLE guide_profiles IS 'Additional profile data for tour guides';
COMMENT ON TABLE tours IS 'Tour/adventure offerings with location and pricing data';
COMMENT ON TABLE tour_availability IS 'Calendar-based availability for tours';
COMMENT ON TABLE bookings IS 'Complete booking records with participant and payment data';
COMMENT ON TABLE booking_guests IS 'Individual guest details for multi-participant bookings';
COMMENT ON TABLE reviews IS 'Customer reviews and ratings for tours and guides';
COMMENT ON TABLE safety_alerts IS 'Location-based safety alerts and advisories';
COMMENT ON TABLE notifications IS 'Multi-channel notification system';
COMMENT ON TABLE user_preferences IS 'User preferences for personalization';