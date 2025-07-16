-- Create tours table for adventure tour listings
CREATE TABLE IF NOT EXISTS public.tours (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Basic tour information
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location_name TEXT NOT NULL,
    
    -- Pricing and logistics
    price_per_person DECIMAL(10,2) NOT NULL,
    duration_hours INTEGER NOT NULL,
    max_participants INTEGER NOT NULL,
    
    -- Media and metadata
    images TEXT[] DEFAULT '{}',
    provider_id UUID NOT NULL,
    is_active BOOLEAN DEFAULT true,
    
    -- Constraints
    CONSTRAINT tours_price_positive CHECK (price_per_person > 0),
    CONSTRAINT tours_duration_positive CHECK (duration_hours > 0),
    CONSTRAINT tours_participants_positive CHECK (max_participants > 0)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_tours_is_active ON public.tours(is_active);
CREATE INDEX IF NOT EXISTS idx_tours_location ON public.tours(location_name);
CREATE INDEX IF NOT EXISTS idx_tours_provider ON public.tours(provider_id);
CREATE INDEX IF NOT EXISTS idx_tours_price ON public.tours(price_per_person);

-- Enable Row Level Security
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Tours are viewable by everyone" ON public.tours
    FOR SELECT USING (is_active = true);

-- Create policies for authenticated users to manage tours
CREATE POLICY "Authenticated users can insert tours" ON public.tours
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update their own tours" ON public.tours
    FOR UPDATE TO authenticated USING (auth.uid() = provider_id);

CREATE POLICY "Users can delete their own tours" ON public.tours
    FOR DELETE TO authenticated USING (auth.uid() = provider_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tours_updated_at 
    BEFORE UPDATE ON public.tours 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();