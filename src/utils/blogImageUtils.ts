/**
 * Blog Image Utilities - Enhanced CMS Integration (Backward Compatible)
 * Re-exports from enhanced version for seamless transition
 */

// Re-export enhanced functionality for backward compatibility
export * from './blogImageUtils.enhanced';

interface BlogPost {
  id: string;
  title?: string;
  featured_image_url: string | null;
  ai_generated_image_url: string | null;
  image_source: 'unsplash' | 'ai_generated' | 'uploaded';
  slug: string;
  category?: string;
  featured_image_alt?: string;
}

/**
 * Get the best available image URL for a blog post
 * Priority: AI Generated > Featured Image > Default Fallback
 */
export function getBlogPostImageUrl(post: BlogPost): string {
  const defaultFallback = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center';
  
  // Priority 1: AI Generated Image (if source is ai_generated and URL exists)
  if (post.image_source === 'ai_generated' && post.ai_generated_image_url) {
    return post.ai_generated_image_url;
  }
  
  // Priority 2: Featured Image (regular uploads or Unsplash)
  if (post.featured_image_url) {
    return post.featured_image_url;
  }
  
  // Priority 3: Default fallback
  return defaultFallback;
}

/**
 * Get image source type for analytics and UI indicators
 */
export function getImageSourceType(post: BlogPost): 'ai' | 'unsplash' | 'uploaded' | 'fallback' {
  if (post.image_source === 'ai_generated' && post.ai_generated_image_url) {
    return 'ai';
  }
  
  if (post.featured_image_url) {
    if (post.featured_image_url.includes('unsplash.com')) {
      return 'unsplash';
    }
    return 'uploaded';
  }
  
  return 'fallback';
}

/**
 * Check if a post can have AI image generated
 */
export function canGenerateAIImage(post: BlogPost): boolean {
  // Don't regenerate if already has AI image
  if (post.image_source === 'ai_generated' && post.ai_generated_image_url) {
    return false;
  }
  
  // Must have title and content to generate meaningful prompt
  return true;
}

/**
 * Get image alt text with AI indicator if applicable
 */
export function getImageAltText(post: BlogPost, title: string): string {
  const sourceType = getImageSourceType(post);
  
  if (sourceType === 'ai') {
    return `AI-generated image for: ${title}`;
  }
  
  return title;
}

/**
 * Handle image loading errors with graceful fallback
 */
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement>, post: BlogPost): void {
  const img = event.currentTarget;
  const currentSrc = img.src;
  
  // If AI image fails, try featured image
  if (post.image_source === 'ai_generated' && currentSrc === post.ai_generated_image_url && post.featured_image_url) {
    img.src = post.featured_image_url;
    return;
  }
  
  // If featured image fails, use fallback
  if (currentSrc === post.featured_image_url) {
    img.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center';
    return;
  }
  
  // Already at fallback, nothing more to do
  console.warn('All image sources failed for post:', post.slug);
}

/**
 * Preload image to check if it's valid before using
 */
export function preloadImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * Get image loading indicator for UI
 */
export function getImageLoadingState(post: BlogPost): {
  isAI: boolean;
  hasMultipleSources: boolean;
  primarySource: string;
} {
  const isAI = post.image_source === 'ai_generated' && !!post.ai_generated_image_url;
  const hasMultipleSources = !!(post.ai_generated_image_url && post.featured_image_url);
  const primarySource = getBlogPostImageUrl(post);
  
  return {
    isAI,
    hasMultipleSources,
    primarySource
  };
}