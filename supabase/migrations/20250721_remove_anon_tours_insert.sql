-- Remove the temporary anonymous insert policy for security
DROP POLICY IF EXISTS "Allow anonymous insert for seeding" ON public.tours;