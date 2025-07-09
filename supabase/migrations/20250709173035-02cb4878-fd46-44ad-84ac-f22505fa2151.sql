
-- Create enum for user types
CREATE TYPE user_type_enum AS ENUM ('traveler', 'guide', 'host', 'admin');

-- Create users table (this will work with Supabase Auth)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    country VARCHAR(100),
    user_type user_type_enum DEFAULT 'traveler',
    whatsapp_number VARCHAR(20),
    language_preference VARCHAR(10) DEFAULT 'en',
    emergency_contact JSONB,
    profile_image_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create guides table
CREATE TABLE public.guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    bio TEXT,
    specialties TEXT[],
    languages_spoken TEXT[],
    years_experience INTEGER,
    certifications JSONB,
    hourly_rate DECIMAL(10,2),
    availability_schedule JSONB,
    rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hosts table
CREATE TABLE public.hosts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    property_name VARCHAR(200),
    property_type VARCHAR(50),
    address TEXT,
    description TEXT,
    amenities TEXT[],
    house_rules TEXT,
    max_guests INTEGER,
    price_per_night DECIMAL(10,2),
    rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create adventures table
CREATE TABLE public.adventures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guide_id UUID REFERENCES public.guides(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    location VARCHAR(200),
    duration_hours INTEGER,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('easy', 'moderate', 'challenging', 'extreme')),
    max_participants INTEGER,
    price_per_person DECIMAL(10,2),
    includes TEXT[],
    requirements TEXT[],
    image_urls TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    adventure_id UUID REFERENCES public.adventures(id) ON DELETE CASCADE,
    guide_id UUID REFERENCES public.guides(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    participants INTEGER NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
    payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending',
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    reviewee_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adventures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view public user profiles" ON public.users
    FOR SELECT USING (true);

-- Create RLS policies for guides table
CREATE POLICY "Anyone can view active guides" ON public.guides
    FOR SELECT USING (is_active = true);

CREATE POLICY "Guides can update their own profile" ON public.guides
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Guides can insert their own profile" ON public.guides
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create RLS policies for hosts table
CREATE POLICY "Anyone can view active hosts" ON public.hosts
    FOR SELECT USING (is_active = true);

CREATE POLICY "Hosts can update their own profile" ON public.hosts
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Hosts can insert their own profile" ON public.hosts
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create RLS policies for adventures table
CREATE POLICY "Anyone can view active adventures" ON public.adventures
    FOR SELECT USING (is_active = true);

CREATE POLICY "Guides can manage their own adventures" ON public.adventures
    FOR ALL USING (guide_id IN (SELECT id FROM public.guides WHERE user_id = auth.uid()));

-- Create RLS policies for bookings table
CREATE POLICY "Users can view their own bookings" ON public.bookings
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Guides can view bookings for their adventures" ON public.bookings
    FOR SELECT USING (guide_id IN (SELECT id FROM public.guides WHERE user_id = auth.uid()));

CREATE POLICY "Users can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own bookings" ON public.bookings
    FOR UPDATE USING (user_id = auth.uid());

-- Create RLS policies for reviews table
CREATE POLICY "Anyone can view reviews" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for their bookings" ON public.reviews
    FOR INSERT WITH CHECK (reviewer_id = auth.uid());

-- Create RLS policies for messages table
CREATE POLICY "Users can view their own messages" ON public.messages
    FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_user_type ON public.users(user_type);
CREATE INDEX idx_guides_user_id ON public.guides(user_id);
CREATE INDEX idx_hosts_user_id ON public.hosts(user_id);
CREATE INDEX idx_adventures_guide_id ON public.adventures(guide_id);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_adventure_id ON public.bookings(adventure_id);
CREATE INDEX idx_bookings_booking_date ON public.bookings(booking_date);
CREATE INDEX idx_reviews_booking_id ON public.reviews(booking_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON public.messages(receiver_id);
