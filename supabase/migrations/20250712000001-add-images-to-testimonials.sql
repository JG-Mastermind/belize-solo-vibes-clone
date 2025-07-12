-- Add images column to testimonials table for photo uploads
-- This supports up to 5 image URLs per review

-- Add images column to existing testimonials table (using the table we created earlier)
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS images TEXT[];

-- Add constraint to limit array size to 5 images maximum
ALTER TABLE public.testimonials ADD CONSTRAINT testimonials_images_max_5 
    CHECK (array_length(images, 1) <= 5 OR images IS NULL);

-- Add comment to document the column
COMMENT ON COLUMN public.testimonials.images IS 'Array of image URLs for review photos (max 5)';

-- Create index for better performance when querying reviews with images
CREATE INDEX IF NOT EXISTS idx_testimonials_has_images ON public.testimonials 
    USING btree ((CASE WHEN images IS NOT NULL AND array_length(images, 1) > 0 THEN true ELSE false END));

-- Also add the same column to the main reviews table for consistency
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS images TEXT[];
ALTER TABLE public.reviews ADD CONSTRAINT reviews_images_max_5 
    CHECK (array_length(images, 1) <= 5 OR images IS NULL);
COMMENT ON COLUMN public.reviews.images IS 'Array of image URLs for review photos (max 5)';
CREATE INDEX IF NOT EXISTS idx_reviews_has_images ON public.reviews 
    USING btree ((CASE WHEN images IS NOT NULL AND array_length(images, 1) > 0 THEN true ELSE false END));