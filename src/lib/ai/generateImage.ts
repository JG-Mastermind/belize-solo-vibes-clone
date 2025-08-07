import { ensureBucketExists } from '@/lib/storage';
import { supabase } from '@/integrations/supabase/client';

// Enhanced AI image generation with Supabase Storage integration
export async function generateAdventureImage(prompt: string): Promise<string> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock implementation - return sample image URLs based on prompt keywords
  const sampleImages = {
    cave: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop&auto=format',
    kayak: 'https://images.unsplash.com/photo-1502780402662-acc01917949e?w=800&h=600&fit=crop&auto=format',
    jungle: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&auto=format',
    river: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format',
    sunset: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format',
    beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&auto=format',
    wildlife: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=800&h=600&fit=crop&auto=format',
    snorkel: 'https://images.unsplash.com/photo-1582845512747-e42001c95638?w=800&h=600&fit=crop&auto=format',
    default: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&auto=format'
  };
  
  // Simple keyword matching for mock
  const lowerPrompt = prompt.toLowerCase();
  let selectedImageUrl = sampleImages.default;
  
  for (const [keyword, imageUrl] of Object.entries(sampleImages)) {
    if (lowerPrompt.includes(keyword)) {
      selectedImageUrl = imageUrl;
      break;
    }
  }
  
  try {
    // Ensure the adventures bucket exists
    const bucketReady = await ensureBucketExists('adventures');
    if (!bucketReady) {
      console.warn('Could not prepare storage bucket, using direct URL');
      return selectedImageUrl;
    }
    
    // Download the image and upload to Supabase Storage
    const response = await fetch(selectedImageUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }
    
    const blob = await response.blob();
    const fileName = `ai-generated-${crypto.randomUUID()}.jpg`;
    const filePath = `adventures/${fileName}`;
    
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('tours')
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.warn('Failed to upload to Supabase Storage, using direct URL:', uploadError);
      return selectedImageUrl;
    }
    
    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('tours')
      .getPublicUrl(filePath);
    
    return publicUrl;
    
  } catch (error) {
    console.warn('Error processing image, using direct URL:', error);
    return selectedImageUrl;
  }
}