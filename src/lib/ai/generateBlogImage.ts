// Real AI-powered blog image generation for Belize Solo Vibes
import { supabase } from '@/integrations/supabase/client';
import { ensureBucketExists } from '@/lib/storage';

export interface BlogImageRequest {
  title: string;
  content: string;
  style?: 'photorealistic' | 'artistic' | 'infographic' | 'landscape';
  mood?: 'vibrant' | 'serene' | 'adventurous' | 'cultural';
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:2';
  includeText?: boolean;
  keywords?: string[];
}

export interface GeneratedBlogImage {
  url: string;
  altText: string;
  caption: string;
  seoFilename: string;
  metadata: {
    style: string;
    mood: string;
    aspectRatio: string;
    keywords: string[];
  };
}

// Enhanced AI image generation specifically for blog content
export async function generateBlogImage(request: BlogImageRequest): Promise<GeneratedBlogImage> {
  const {
    title,
    content,
    style = 'photorealistic',
    mood = 'vibrant',
    aspectRatio = '16:9',
    includeText = false,
    keywords = []
  } = request;

  try {
    // Extract image context from blog content
    const imageContext = extractImageContext(title, content, keywords);
    
    // Call Supabase Edge Function for AI image generation
    const { data, error } = await supabase.functions.invoke('generate-blog-image', {
      body: {
        prompt: buildImagePrompt(imageContext, style, mood),
        style,
        mood,
        aspectRatio,
        includeText,
        belizeContext: true, // Ensure Belize-specific imagery
        quality: 'high',
        safetyFilters: true
      }
    });

    if (error) {
      throw new Error(`AI image generation failed: ${error.message}`);
    }

    if (!data || !data.imageUrl) {
      throw new Error('Invalid response from AI image generation service');
    }

    // Store the generated image in Supabase Storage
    const storedImageUrl = await storeGeneratedImage(data.imageUrl, title);
    
    return {
      url: storedImageUrl,
      altText: generateAltText(title, imageContext),
      caption: generateCaption(title, imageContext),
      seoFilename: generateSEOFilename(title),
      metadata: {
        style,
        mood,
        aspectRatio,
        keywords: [...keywords, ...imageContext.extractedKeywords]
      }
    };

  } catch (error) {
    console.error('Error generating blog image:', error);
    
    // Fallback to curated Unsplash images
    return generateFallbackImage(request);
  }
}

// Extract relevant visual context from blog content
function extractImageContext(title: string, content: string, keywords: string[]) {
  const combinedText = `${title} ${content}`.toLowerCase();
  
  // Belize-specific visual elements
  const belizeElements = {
    nature: ['jungle', 'rainforest', 'reef', 'ocean', 'beach', 'cave', 'waterfall', 'river'],
    wildlife: ['jaguar', 'toucan', 'howler monkey', 'manatee', 'dolphin', 'bird', 'fish'],
    culture: ['maya', 'temple', 'garifuna', 'drum', 'dance', 'market', 'festival'],
    adventure: ['kayak', 'snorkel', 'dive', 'hike', 'zip-line', 'cave', 'explore'],
    food: ['rice and beans', 'fry jacks', 'ceviche', 'tropical fruit', 'coconut'],
    landscape: ['caribbean', 'tropical', 'palm trees', 'sunset', 'sunrise', 'mountains']
  };

  const extractedKeywords: string[] = [];
  const visualElements: string[] = [];
  
  Object.entries(belizeElements).forEach(([category, elements]) => {
    elements.forEach(element => {
      if (combinedText.includes(element)) {
        extractedKeywords.push(element);
        visualElements.push(`${category}:${element}`);
      }
    });
  });

  return {
    primarySubject: extractPrimarySubject(title),
    visualElements,
    extractedKeywords: [...new Set([...extractedKeywords, ...keywords])],
    setting: extractSetting(combinedText),
    timeOfDay: extractTimeOfDay(combinedText)
  };
}

function buildImagePrompt(context: any, style: string, mood: string): string {
  const belizePrefix = "Beautiful Belize landscape showing";
  const styleModifier = {
    photorealistic: "hyper-realistic, professional photography",
    artistic: "artistic interpretation, painterly style",
    infographic: "clean, informative visual design",
    landscape: "sweeping landscape photography"
  }[style];

  const moodModifier = {
    vibrant: "vibrant colors, energetic atmosphere",
    serene: "peaceful, tranquil, soft lighting",
    adventurous: "dynamic, exciting, action-oriented",
    cultural: "authentic, traditional, culturally rich"
  }[mood];

  const elements = context.visualElements.length > 0 
    ? context.visualElements.map((e: string) => e.split(':')[1]).join(', ')
    : context.primarySubject;

  return `${belizePrefix} ${elements}, ${styleModifier}, ${moodModifier}, ${context.setting}, ${context.timeOfDay}, high quality, professional composition, tropical paradise`;
}

function extractPrimarySubject(title: string): string {
  const subjects = {
    'adventure': 'adventure activities',
    'culture': 'cultural experiences',
    'food': 'local cuisine',
    'wildlife': 'tropical wildlife',
    'beach': 'caribbean beaches',
    'jungle': 'rainforest',
    'maya': 'mayan ruins',
    'diving': 'underwater scenes',
    'cave': 'cave exploration'
  };

  const titleLower = title.toLowerCase();
  for (const [key, subject] of Object.entries(subjects)) {
    if (titleLower.includes(key)) {
      return subject;
    }
  }
  
  return 'belize landscape';
}

function extractSetting(text: string): string {
  const settings = {
    'beach': 'on pristine caribbean beach',
    'jungle': 'in lush tropical rainforest',
    'ocean': 'in crystal clear ocean waters',
    'cave': 'in mysterious limestone caves',
    'river': 'along winding jungle rivers',
    'ruins': 'at ancient mayan archaeological sites',
    'town': 'in charming belizean village'
  };

  for (const [key, setting] of Object.entries(settings)) {
    if (text.includes(key)) {
      return setting;
    }
  }
  
  return 'in tropical belize setting';
}

function extractTimeOfDay(text: string): string {
  if (text.includes('sunset') || text.includes('evening')) return 'during golden hour sunset';
  if (text.includes('sunrise') || text.includes('morning')) return 'during peaceful sunrise';
  if (text.includes('night') || text.includes('dark')) return 'under starlit tropical sky';
  return 'during optimal natural lighting';
}

// Store generated image in Supabase Storage
async function storeGeneratedImage(imageUrl: string, title: string): Promise<string> {
  try {
    // Ensure the blog-images bucket exists
    const bucketReady = await ensureBucketExists('blog-images');
    if (!bucketReady) {
      console.warn('Could not prepare storage bucket, using direct URL');
      return imageUrl;
    }

    // Download the generated image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch generated image');
    }

    const blob = await response.blob();
    const fileName = `${generateSEOFilename(title)}-${Date.now()}.jpg`;
    const filePath = `blog-images/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('tours')
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.warn('Failed to upload to Supabase Storage:', uploadError);
      return imageUrl;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('tours')
      .getPublicUrl(filePath);

    return publicUrl;

  } catch (error) {
    console.warn('Error storing generated image:', error);
    return imageUrl;
  }
}

// Fallback to curated Unsplash images with Belize themes
function generateFallbackImage(request: BlogImageRequest): GeneratedBlogImage {
  const { title, content, keywords = [] } = request;
  
  // Curated high-quality Belize-themed images from Unsplash
  const belizeImages = {
    adventure: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=675&fit=crop&auto=format',
    culture: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=675&fit=crop&auto=format',
    wildlife: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=1200&h=675&fit=crop&auto=format',
    beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=675&fit=crop&auto=format',
    jungle: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=675&fit=crop&auto=format',
    food: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1200&h=675&fit=crop&auto=format',
    diving: 'https://images.unsplash.com/photo-1582845512747-e42001c95638?w=1200&h=675&fit=crop&auto=format',
    sunset: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=675&fit=crop&auto=format',
    default: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=675&fit=crop&auto=format'
  };

  // Select image based on content analysis
  const contentLower = `${title} ${content}`.toLowerCase();
  let selectedImage = belizeImages.default;
  
  for (const [category, imageUrl] of Object.entries(belizeImages)) {
    if (contentLower.includes(category)) {
      selectedImage = imageUrl;
      break;
    }
  }

  const imageContext = extractImageContext(title, content, keywords);
  
  return {
    url: selectedImage,
    altText: generateAltText(title, imageContext),
    caption: generateCaption(title, imageContext),
    seoFilename: generateSEOFilename(title),
    metadata: {
      style: request.style || 'photorealistic',
      mood: request.mood || 'vibrant',
      aspectRatio: request.aspectRatio || '16:9',
      keywords: imageContext.extractedKeywords
    }
  };
}

function generateAltText(title: string, context: any): string {
  const elements = context.extractedKeywords.slice(0, 3).join(', ');
  return `${title} - featuring ${elements} in Belize`;
}

function generateCaption(title: string, context: any): string {
  const setting = context.setting.replace('in ', '').replace('at ', '').replace('on ', '');
  return `Experience ${title.toLowerCase()} ${setting} with Belize Solo Vibes`;
}

function generateSEOFilename(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}