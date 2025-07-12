# Setup Review Photos Storage Bucket

To enable image uploads for testimonials, you need to create a storage bucket in Supabase.

## Steps:

1. **Go to Supabase Dashboard**
   - Visit https://supabase.com/dashboard
   - Select your BelizeVibes project

2. **Create Storage Bucket**
   - Navigate to Storage > Buckets
   - Click "Create a new bucket"
   - Name: `review-photos`
   - Public: `Yes` (for public image access)
   - Click "Create bucket"

3. **Set Storage Policies (Optional)**
   The migration already includes proper RLS policies, but you can customize them in:
   - Storage > review-photos > Settings > Policies

## SQL Alternative:

If you prefer using SQL, run this in the SQL Editor:

```sql
-- Create the review-photos storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-photos',
  'review-photos', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Create storage policy for public read access
CREATE POLICY "Public read access for review photos" ON storage.objects
FOR SELECT USING (bucket_id = 'review-photos');

-- Create storage policy for authenticated uploads
CREATE POLICY "Authenticated users can upload review photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'review-photos' AND
  (storage.foldername(name))[1] = 'review-photos'
);
```

## Testing:

After setup, the image upload feature will:
- ✅ Allow up to 5 images per review
- ✅ Validate file types (PNG, JPG, GIF, WebP)
- ✅ Enforce 5MB per file limit
- ✅ Show upload progress
- ✅ Store public URLs in the database
- ✅ Display images in testimonials

The system includes fallback placeholder images if storage is not configured.