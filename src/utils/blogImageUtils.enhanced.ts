/**
 * Blog Image Utilities - Enhanced CMS Integration
 * Enterprise-grade image pipeline with AI-first fallbacks, performance optimization, and accessibility
 */

import { aiImageService } from '@/services/aiImageService';

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

interface ImageLoadResult {
  url: string;
  isAI: boolean;
  altText: string;
  loadTime: number;
  source: 'ai' | 'featured' | 'fallback';
  metadata?: {
    priority: number;
    cached: boolean;
  };
}

// Image cache for performance optimization
const imageCache = new Map<string, { url: string; isValid: boolean; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get the best available image URL with enhanced fallback chain and performance optimization
 * Priority: AI Generated > Featured Image > Category-specific Fallback > Default
 */
export async function getBlogPostImageUrlAsync(post: BlogPost): Promise<ImageLoadResult> {
  const startTime = Date.now();
  
  try {
    // Use the enhanced AI service optimization method
    const result = await aiImageService.getOptimizedImage(post);
    
    return {
      url: result.url,
      isAI: result.isAI,
      altText: result.altText,
      loadTime: Date.now() - startTime,
      source: result.isAI ? 'ai' : (post.featured_image_url ? 'featured' : 'fallback'),
      metadata: {
        priority: result.isAI ? 1 : (post.featured_image_url ? 2 : 3),
        cached: false // TODO: Implement actual caching
      }
    };
  } catch (error) {
    console.warn('Error in getBlogPostImageUrlAsync:', error);
    
    // Emergency fallback - use synchronous method for consistency
    const fallbackUrl = getBlogPostImageUrl(post);
    return {
      url: fallbackUrl,
      isAI: false,
      altText: `Travel image for: ${post.title || post.slug}`,
      loadTime: Date.now() - startTime,
      source: 'fallback',
      metadata: {
        priority: 4,
        cached: false
      }
    };
  }
}

/**
 * Synchronous version for backward compatibility - Enhanced
 * Uses cached results or immediate fallback
 */
export function getBlogPostImageUrl(post: BlogPost): string {
  // Priority 1: AI Generated Image (if source is ai_generated and URL exists)
  if (post.image_source === 'ai_generated' && post.ai_generated_image_url) {
    return post.ai_generated_image_url;
  }
  
  // Priority 2: Featured Image (regular uploads or Unsplash)
  if (post.featured_image_url) {
    return post.featured_image_url;
  }
  
  // Priority 3: Category-specific fallback
  return getEmergencyFallback(post.category);
}

/**
 * Get emergency fallback image based on category
 */
function getEmergencyFallback(category?: string): string {
  const fallbacks: Record<string, string> = {
    'adventure-travel': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=675&fit=crop&auto=format',
    'safety-tips': 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=675&fit=crop&auto=format',
    'destinations': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=675&fit=crop&auto=format',
    'solo-travel': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=675&fit=crop&auto=format',
    'budget-travel': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=675&fit=crop&auto=format',
    'wildlife': 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=1200&h=675&fit=crop&auto=format',
    'default': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=675&fit=crop&auto=format'
  };
  
  return fallbacks[category || 'default'] || fallbacks.default;
}

/**
 * Get comprehensive image source analytics
 */
export function getImageSourceType(post: BlogPost): {
  type: 'ai' | 'unsplash' | 'uploaded' | 'fallback';
  confidence: number;
  priority: number;
  metadata: {
    hasMultipleSources: boolean;
    primarySource: string;
    backupAvailable: boolean;
  };
} {
  const hasMultipleSources = !!(post.ai_generated_image_url && post.featured_image_url);
  
  if (post.image_source === 'ai_generated' && post.ai_generated_image_url) {
    return {
      type: 'ai',
      confidence: 0.95,
      priority: 1,
      metadata: {
        hasMultipleSources,
        primarySource: 'AI Generated',
        backupAvailable: !!post.featured_image_url
      }
    };
  }
  
  if (post.featured_image_url) {
    const isUnsplash = post.featured_image_url.includes('unsplash.com');
    return {
      type: isUnsplash ? 'unsplash' : 'uploaded',
      confidence: 0.9,
      priority: 2,
      metadata: {
        hasMultipleSources,
        primarySource: isUnsplash ? 'Unsplash' : 'Uploaded',
        backupAvailable: false
      }
    };
  }
  
  return {
    type: 'fallback',
    confidence: 0.8,
    priority: 3,
    metadata: {
      hasMultipleSources: false,
      primarySource: 'Category Fallback',
      backupAvailable: false
    }
  };
}

/**
 * Advanced AI image generation eligibility check
 */
export function canGenerateAIImage(post: BlogPost, forceRegenerate: boolean = false): {
  eligible: boolean;
  reason: string;
  estimatedCost: number;
  priority: 'low' | 'medium' | 'high';
} {
  // Check if already has AI image and not forcing regeneration
  if (post.image_source === 'ai_generated' && post.ai_generated_image_url && !forceRegenerate) {
    return {
      eligible: false,
      reason: 'Post already has AI-generated image',
      estimatedCost: 0,
      priority: 'low'
    };
  }
  
  // Must have title for meaningful prompt
  if (!post.title || post.title.length < 10) {
    return {
      eligible: false,
      reason: 'Title too short for meaningful prompt generation',
      estimatedCost: 0,
      priority: 'low'
    };
  }
  
  // Determine priority based on content quality indicators
  let priority: 'low' | 'medium' | 'high' = 'medium';
  
  if (post.category && ['adventure-travel', 'destinations'].includes(post.category)) {
    priority = 'high'; // High-value content categories
  } else if (!post.featured_image_url) {
    priority = 'high'; // No existing image - needs AI generation
  }
  
  return {
    eligible: true,
    reason: 'Eligible for AI image generation',
    estimatedCost: priority === 'high' ? 0.04 : 0.02, // DALL-E 3 pricing estimate
    priority
  };
}

/**
 * Generate comprehensive, accessible alt text with source attribution
 */
export function getImageAltText(post: BlogPost, title?: string): string {
  const sourceInfo = getImageSourceType(post);
  const postTitle = title || post.title || post.slug;
  
  // Use existing alt text if available and appropriate
  if (post.featured_image_alt && post.featured_image_alt.length > 10) {
    return post.featured_image_alt;
  }
  
  // Generate contextual alt text based on source and content
  const contextualDescriptions: Record<string, string> = {
    'adventure-travel': 'Adventure travel scene showing',
    'safety-tips': 'Travel safety illustration depicting',
    'destinations': 'Beautiful destination image of',
    'solo-travel': 'Solo traveler experience featuring',
    'budget-travel': 'Budget-friendly travel scene with',
    'wildlife': 'Wildlife photography showing',
    'default': 'Travel photography featuring'
  };
  
  const contextPrefix = contextualDescriptions[post.category || 'default'];
  
  switch (sourceInfo.type) {
    case 'ai':
      return `AI-generated ${contextPrefix.toLowerCase()} ${postTitle}`;
    case 'unsplash':
      return `Professional ${contextPrefix.toLowerCase()} ${postTitle}`;
    case 'uploaded':
      return `${contextPrefix} ${postTitle}`;
    default:
      return `${contextPrefix} ${postTitle}`;
  }
}

/**
 * Enhanced error handling with intelligent fallback progression and analytics
 */
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement>, post: BlogPost): void {
  const img = event.currentTarget;
  const currentSrc = img.src;
  
  // Track the error for analytics
  console.warn(`Image failed to load: ${currentSrc} for post: ${post.slug}`);
  
  // Prevent infinite error loops
  if (img.dataset.errorCount) {
    const errorCount = parseInt(img.dataset.errorCount) + 1;
    if (errorCount > 3) {
      img.style.display = 'none';
      console.error(`Too many image load errors for post: ${post.slug}`);
      return;
    }
    img.dataset.errorCount = errorCount.toString();
  } else {
    img.dataset.errorCount = '1';
  }
  
  // Step 1: If AI image fails, try featured image
  if (post.image_source === 'ai_generated' && 
      currentSrc === post.ai_generated_image_url && 
      post.featured_image_url) {
    img.src = post.featured_image_url;
    img.alt = getImageAltText(post);
    return;
  }
  
  // Step 2: If featured image fails, try category-specific fallback
  if (currentSrc === post.featured_image_url) {
    const categoryFallback = getEmergencyFallback(post.category);
    img.src = categoryFallback;
    img.alt = getImageAltText(post);
    return;
  }
  
  // Step 3: If category fallback fails, use default fallback
  const categoryFallback = getEmergencyFallback(post.category);
  if (currentSrc === categoryFallback && post.category !== 'default') {
    img.src = getEmergencyFallback('default');
    img.alt = getImageAltText(post);
    return;
  }
  
  // Final fallback: Hide image with graceful degradation
  img.style.display = 'none';
  console.error(`All image fallbacks exhausted for post: ${post.slug}`);
  
  // Report error analytics
  reportImageError(post.slug, currentSrc, 'all_fallbacks_exhausted');
}

/**
 * Report image loading errors for monitoring and optimization
 */
function reportImageError(postSlug: string, failedUrl: string, errorType: string): void {
  // TODO: Implement actual error reporting to analytics service
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'image_load_error', {
      'post_slug': postSlug,
      'failed_url': failedUrl.substring(0, 100), // Limit URL length
      'error_type': errorType,
      'timestamp': new Date().toISOString()
    });
  }
}

/**
 * Advanced image preloading with timeout and performance tracking
 */
export function preloadImage(url: string, timeout: number = 10000): Promise<{
  valid: boolean;
  loadTime: number;
  naturalDimensions?: { width: number; height: number };
  error?: string;
}> {
  const startTime = Date.now();
  
  return new Promise((resolve) => {
    const img = new Image();
    let timeoutId: NodeJS.Timeout;
    
    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
    
    img.onload = () => {
      cleanup();
      resolve({
        valid: true,
        loadTime: Date.now() - startTime,
        naturalDimensions: {
          width: img.naturalWidth,
          height: img.naturalHeight
        }
      });
    };
    
    img.onerror = () => {
      cleanup();
      resolve({
        valid: false,
        loadTime: Date.now() - startTime,
        error: 'Image failed to load'
      });
    };
    
    // Set timeout
    timeoutId = setTimeout(() => {
      resolve({
        valid: false,
        loadTime: Date.now() - startTime,
        error: `Image load timeout after ${timeout}ms`
      });
    }, timeout);
    
    img.src = url;
  });
}

/**
 * Get comprehensive image loading state for enhanced UI indicators
 */
export function getImageLoadingState(post: BlogPost): {
  isAI: boolean;
  hasMultipleSources: boolean;
  primarySource: string;
  loadingStrategy: 'eager' | 'lazy';
  priority: 'high' | 'normal' | 'low';
  placeholder: {
    color: string;
    pattern: 'blur' | 'skeleton' | 'gradient';
  };
  performance: {
    preloadHint: boolean;
    criticalResource: boolean;
  };
} {
  const sourceInfo = getImageSourceType(post);
  const isAI = sourceInfo.type === 'ai';
  const hasMultipleSources = sourceInfo.metadata.hasMultipleSources;
  
  // Determine loading strategy based on content priority
  const isAboveTheFold = post.category === 'destinations' || sourceInfo.priority === 1;
  
  return {
    isAI,
    hasMultipleSources,
    primarySource: getBlogPostImageUrl(post),
    loadingStrategy: isAboveTheFold ? 'eager' : 'lazy',
    priority: sourceInfo.priority === 1 ? 'high' : (sourceInfo.priority === 2 ? 'normal' : 'low'),
    placeholder: {
      color: isAI ? '#3b82f6' : '#10b981', // Blue for AI, Green for regular
      pattern: isAI ? 'gradient' : 'blur'
    },
    performance: {
      preloadHint: isAboveTheFold && sourceInfo.confidence > 0.9,
      criticalResource: isAboveTheFold
    }
  };
}

/**
 * Generate responsive image srcSet for performance optimization
 */
export function generateResponsiveImageSrcSet(baseUrl: string): {
  srcSet: string;
  sizes: string;
} {
  // Only apply to Unsplash images that support parameter modification
  if (!baseUrl.includes('unsplash.com')) {
    return {
      srcSet: baseUrl,
      sizes: '100vw'
    };
  }
  
  const breakpoints = [
    { width: 640, size: '100vw' },
    { width: 768, size: '100vw' },
    { width: 1024, size: '75vw' },
    { width: 1280, size: '66vw' },
    { width: 1536, size: '50vw' }
  ];
  
  const srcSet = breakpoints
    .map(bp => `${baseUrl}&w=${bp.width} ${bp.width}w`)
    .join(', ');
    
  const sizes = breakpoints
    .map((bp, index) => 
      index === breakpoints.length - 1 
        ? bp.size 
        : `(max-width: ${bp.width}px) ${bp.size}`
    )
    .reverse()
    .join(', ');
  
  return {
    srcSet,
    sizes
  };
}

/**
 * Preload critical images for performance optimization
 */
export function preloadCriticalImages(posts: BlogPost[]): void {
  if (typeof window === 'undefined') return;
  
  // Preload first 3 images that are likely to be above the fold
  const criticalPosts = posts.slice(0, 3);
  
  criticalPosts.forEach(post => {
    const imageUrl = getBlogPostImageUrl(post);
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imageUrl;
    document.head.appendChild(link);
  });
}

// Type exports for enhanced integration
export type { ImageLoadResult, BlogPost };

// Export enhanced versions while maintaining backward compatibility
export { getBlogPostImageUrl as getBlogPostImageUrlSync };