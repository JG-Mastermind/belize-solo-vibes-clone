import { supabase } from '@/integrations/supabase/client';

/**
 * Utility functions for Supabase Storage management
 */

export async function ensureBucketExists(bucketName: string): Promise<boolean> {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (bucketExists) {
      return true;
    }
    
    // Create bucket if it doesn't exist
    const { error: createError } = await supabase.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
      fileSizeLimit: 5242880, // 5MB
    });
    
    if (createError) {
      console.error('Error creating bucket:', createError);
      return false;
    }
    
    console.log(`Bucket '${bucketName}' created successfully`);
    return true;
    
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
    return false;
  }
}

export async function uploadImageToStorage(
  bucketName: string,
  file: File,
  path?: string
): Promise<{ publicUrl: string; error?: string }> {
  try {
    // Ensure bucket exists
    const bucketReady = await ensureBucketExists(bucketName);
    if (!bucketReady) {
      return { publicUrl: '', error: 'Failed to prepare storage bucket' };
    }
    
    // Generate filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;
    
    // Upload file
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      return { publicUrl: '', error: uploadError.message };
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    return { publicUrl };
    
  } catch (error) {
    return { 
      publicUrl: '', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function deleteImageFromStorage(
  bucketName: string,
  filePath: string
): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
    
    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}