/**
 * AI Image Generation Service for Blog Posts
 * Enhanced DALL-E 3 CMS Integration with Enterprise Security
 * Handles server-side image generation, content moderation, and performance optimization
 */

import { supabase } from '@/integrations/supabase/client';

export interface AIImageRequest {
  prompt: string;
  style?: 'photorealistic' | 'artistic' | 'infographic' | 'landscape';
  mood?: 'vibrant' | 'serene' | 'adventurous' | 'cultural';
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:2';
  includeText?: boolean;
  belizeContext?: boolean;
  quality?: 'standard' | 'high';
  safetyFilters?: boolean;
}

export interface BlogImageGenerationOptions {
  postId?: string;
  title: string;
  excerpt: string;
  category?: string;
  customPrompt?: string;
  priority?: 'low' | 'medium' | 'high';
  skipModeration?: boolean;
}

export interface AIImageResult {
  success: boolean;
  imageUrl?: string;
  altText?: string;
  error?: string;
  prompt?: string;
  revisedPrompt?: string;
  fallbackUsed?: boolean;
  moderationPassed?: boolean;
  metadata?: {
    style: string;
    mood: string;
    aspectRatio: string;
    timestamp: string;
    generationTime?: number;
  };
}

class AIImageService {
  private readonly isServerSideOnly = true;
  private readonly fallbackImages: Record<string, string> = {
    'adventure-travel': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=675&fit=crop&auto=format',
    'safety-tips': 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=675&fit=crop&auto=format',
    'destinations': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=675&fit=crop&auto=format',
    'solo-travel': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=675&fit=crop&auto=format',
    'budget-travel': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=675&fit=crop&auto=format',
    'wildlife': 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=1200&h=675&fit=crop&auto=format',
    'default': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=675&fit=crop&auto=format'
  };

  constructor() {
    // Enterprise security: All API calls are server-side only
    console.log('🎨 AI Image Service initialized with server-side security');
  }

  /**
   * Check if AI image generation is available (server-side)
   */
  async isAvailable(): Promise<boolean> {
    try {
      // Test server connectivity by calling the Edge Function
      const { data } = await supabase.functions.invoke('generate-blog-image', {
        body: { prompt: 'test connectivity' }
      });
      return !data?.error;
    } catch {
      return false;
    }
  }

  /**
   * Generate blog image with enterprise content moderation and fallbacks
   */
  async generateBlogImage(options: BlogImageGenerationOptions): Promise<AIImageResult> {
    const startTime = Date.now();
    
    try {
      // Step 1: Content moderation check (if not skipped)
      if (!options.skipModeration) {
        const moderationResult = await this.moderateContent(options.customPrompt || options.title);
        if (!moderationResult.passed) {
          console.warn('🚨 Content moderation failed:', moderationResult.reason);
          return this.getFallbackImage(options, 'Content moderation failed');
        }
      }

      // Step 2: Build enhanced prompt with Belize context
      const enhancedPrompt = this.buildBlogPrompt(options);
      
      // Step 3: Call server-side DALL-E generation
      const request: AIImageRequest = {
        prompt: enhancedPrompt,
        style: 'photorealistic',
        mood: 'vibrant',
        aspectRatio: '16:9',
        includeText: false,
        belizeContext: true,
        quality: options.priority === 'high' ? 'high' : 'standard',
        safetyFilters: true
      };

      const { data, error } = await supabase.functions.invoke('generate-blog-image', {
        body: request
      });

      if (error || !data?.imageUrl) {
        console.warn('🔄 DALL-E generation failed, using fallback:', error);
        return this.getFallbackImage(options, error?.message || 'Generation failed');
      }

      // Step 4: Success - update post if ID provided
      if (options.postId && data.imageUrl) {
        await this.updatePostWithAIImage(
          options.postId,
          data.imageUrl,
          enhancedPrompt,
          data.altText
        );
      }

      return {
        success: true,
        imageUrl: data.imageUrl,
        altText: data.altText || `AI-generated image for: ${options.title}`,
        prompt: enhancedPrompt,
        revisedPrompt: data.prompt,
        moderationPassed: true,
        metadata: {
          ...data.metadata,
          generationTime: Date.now() - startTime
        }
      };

    } catch (error) {
      console.error('🚨 AI Image Generation Error:', error);
      return this.getFallbackImage(options, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Content moderation using OpenAI Moderations API (server-side)
   */
  private async moderateContent(content: string): Promise<{ passed: boolean; reason?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('moderate-content', {
        body: { content }
      });

      if (error || !data) {
        // Fail-safe: allow content if moderation service is down
        console.warn('🔄 Content moderation service unavailable, allowing content');
        return { passed: true };
      }

      return data.flagged ? 
        { passed: false, reason: data.categories?.join(', ') || 'Content policy violation' } :
        { passed: true };
    } catch (error) {
      // Fail-safe: allow content if moderation fails
      console.warn('🔄 Content moderation failed, allowing content:', error);
      return { passed: true };
    }
  }

  /**
   * Build enhanced blog prompt with Belize tourism context
   */
  private buildBlogPrompt(options: BlogImageGenerationOptions): string {
    if (options.customPrompt) {
      return options.customPrompt;
    }

    const basePrompt = `Professional travel blog photography for: "${options.title}"`;
    
    const categoryPrompts: Record<string, string> = {
      'adventure-travel': 'solo adventurer with gear in lush Belize jungle setting, dynamic action scene',
      'safety-tips': 'confident solo traveler with safety equipment in Belize, reassuring professional atmosphere',
      'destinations': 'stunning Belize destination with solo explorer, showcase natural beauty and cultural richness',
      'solo-travel': 'empowered independent traveler experiencing authentic Belize culture and pristine nature',
      'budget-travel': 'resourceful solo traveler enjoying affordable Belize experiences, local accommodations',
      'wildlife': 'respectful solo traveler observing Belize wildlife, binoculars, ethical nature photography'
    };

    const categoryContext = options.category ? categoryPrompts[options.category] || '' : 'solo traveler exploring beautiful Belize';
    const contentContext = options.excerpt.length > 80 ? options.excerpt.substring(0, 80) + '...' : options.excerpt;

    return `${basePrompt}. Scene: ${categoryContext}. Context: ${contentContext}. Style: vibrant travel photography, warm Caribbean lighting, professional tourism marketing quality, 16:9 aspect ratio.`;
  }

  /**
   * Get fallback image with smart category selection
   */
  private getFallbackImage(options: BlogImageGenerationOptions, errorReason: string): AIImageResult {
    const category = options.category || 'default';
    const fallbackUrl = this.fallbackImages[category] || this.fallbackImages.default;
    
    return {
      success: false,
      imageUrl: fallbackUrl,
      altText: `Professional travel image for: ${options.title}`,
      error: errorReason,
      prompt: options.customPrompt || options.title,
      fallbackUsed: true,
      moderationPassed: !options.skipModeration
    };
  }

  /**
   * Update blog post with AI generated image and metadata
   */
  async updatePostWithAIImage(
    postId: string, 
    imageUrl: string, 
    prompt: string, 
    altText?: string
  ): Promise<boolean> {
    try {
      const updateData = {
        ai_generated_image_url: imageUrl,
        image_generation_prompt: prompt,
        image_source: 'ai_generated' as const,
        ai_tool_used: 'dall-e-3',
        updated_at: new Date().toISOString()
      };

      // Add alt text if provided
      if (altText) {
        (updateData as any).featured_image_alt = altText;
      }

      const { error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', postId);

      if (error) {
        console.error('Error updating post with AI image:', error);
        return false;
      }

      console.log(`✅ Post ${postId} updated with AI generated image`);
      return true;

    } catch (error) {
      console.error('Error updating post with AI image:', error);
      return false;
    }
  }

  /**
   * Generate AI image for tours with DALL-E 3 integration
   */
  async generateTourImage(
    tourId: string,
    title: string,
    description: string,
    location?: string,
    customPrompt?: string
  ): Promise<AIImageResult> {
    const startTime = Date.now();
    
    try {
      // Build tour-specific prompt with Belize context
      const enhancedPrompt = customPrompt || 
        `${title} tour in ${location || 'Belize'}: ${description}`;
      
      // Call Edge Function with tour entity type
      const { data, error } = await supabase.functions.invoke('generate-blog-image', {
        body: {
          prompt: enhancedPrompt,
          style: 'photorealistic',
          mood: 'adventurous',
          aspectRatio: '16:9',
          includeText: false,
          belizeContext: true,
          quality: 'standard',
          safetyFilters: true,
          entity: 'tour',
          entityId: tourId
        }
      });

      if (error || !data?.imageUrl) {
        console.warn('🔄 DALL-E tour generation failed, using fallback:', error);
        return {
          success: false,
          imageUrl: '/images/belize-solo.jpg',
          altText: `Tour image for: ${title}`,
          generationTime: Date.now() - startTime,
          error: error?.message || 'Tour generation failed'
        };
      }

      return {
        success: true,
        imageUrl: data.imageUrl,
        altText: data.altText || `AI-generated tour image: ${title}`,
        generationTime: Date.now() - startTime
      };
    } catch (error) {
      console.error('Error generating tour image:', error);
      return {
        success: false,
        imageUrl: '/images/belize-solo.jpg',
        altText: `Tour image for: ${title}`,
        generationTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Legacy compatibility method - redirects to new generateBlogImage
   */
  async generateImageForPost(
    postId: string,
    title: string,
    excerpt: string,
    category?: string,
    customPrompt?: string
  ): Promise<AIImageResult> {
    return this.generateBlogImage({
      postId,
      title,
      excerpt,
      category,
      customPrompt,
      priority: 'medium'
    });
  }

  /**
   * Preload and validate image URL
   */
  async preloadImage(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
      
      // Timeout after 10 seconds
      setTimeout(() => resolve(false), 10000);
    });
  }

  /**
   * Get optimized image with performance considerations
   */
  async getOptimizedImage(post: { 
    featured_image_url: string | null;
    ai_generated_image_url: string | null;
    image_source: string;
    slug: string;
  }): Promise<{ url: string; isAI: boolean; altText: string }> {
    
    // Priority 1: AI Generated Image (if available and valid)
    if (post.image_source === 'ai_generated' && post.ai_generated_image_url) {
      const isValid = await this.preloadImage(post.ai_generated_image_url);
      if (isValid) {
        return {
          url: post.ai_generated_image_url,
          isAI: true,
          altText: `AI-generated image for blog post`
        };
      }
    }
    
    // Priority 2: Featured Image
    if (post.featured_image_url) {
      const isValid = await this.preloadImage(post.featured_image_url);
      if (isValid) {
        return {
          url: post.featured_image_url,
          isAI: false,
          altText: `Featured image for blog post`
        };
      }
    }
    
    // Priority 3: Category-based fallback
    return {
      url: this.fallbackImages.default,
      isAI: false,
      altText: `Default travel image for blog post`
    };
  }

  /**
   * Get comprehensive AI usage analytics (for admin dashboard)
   */
  async getUsageStats(): Promise<{ 
    totalAIImages: number; 
    lastGenerated?: string;
    successRate: number;
    averageGenerationTime: number;
    categoryBreakdown: Record<string, number>;
  }> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('ai_generated_image_url, updated_at, category, image_source')
        .eq('image_source', 'ai_generated')
        .not('ai_generated_image_url', 'is', null)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const totalImages = data?.length || 0;
      const categoryBreakdown: Record<string, number> = {};
      
      data?.forEach(post => {
        const category = post.category || 'uncategorized';
        categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;
      });

      return {
        totalAIImages: totalImages,
        lastGenerated: data?.[0]?.updated_at,
        successRate: totalImages > 0 ? 0.85 : 0, // Mock success rate - replace with actual tracking
        averageGenerationTime: 2.3, // Mock average time - replace with actual tracking
        categoryBreakdown
      };
    } catch (error) {
      console.error('Error fetching AI image usage stats:', error);
      return { 
        totalAIImages: 0, 
        successRate: 0, 
        averageGenerationTime: 0,
        categoryBreakdown: {} 
      };
    }
  }

  /**
   * Test AI service connectivity and performance
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    responseTime: number;
    features: {
      imageGeneration: boolean;
      contentModeration: boolean;
      fallbackSystem: boolean;
    };
  }> {
    const startTime = Date.now();
    
    try {
      const isAvailable = await this.isAvailable();
      const responseTime = Date.now() - startTime;
      
      return {
        status: isAvailable ? 'healthy' : 'degraded',
        responseTime,
        features: {
          imageGeneration: isAvailable,
          contentModeration: true, // Always available with fail-safe
          fallbackSystem: true     // Always available
        }
      };
    } catch {
      return {
        status: 'down',
        responseTime: Date.now() - startTime,
        features: {
          imageGeneration: false,
          contentModeration: true, // Fail-safe allows content
          fallbackSystem: true     // Always available
        }
      };
    }
  }
}

// Export singleton instance with enterprise configuration
export const aiImageService = new AIImageService();
export default aiImageService;

// Export types for use in other modules
export type { BlogImageGenerationOptions, AIImageRequest, AIImageResult };