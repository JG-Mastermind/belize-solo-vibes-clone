-- Temporarily allow anonymous users to insert tours for seeding
CREATE POLICY "Allow anonymous insert for seeding" ON public.tours
    FOR INSERT TO anon WITH CHECK (true);