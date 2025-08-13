/**
 * AI Image Generation Service for Blog Posts
 * Handles OpenAI DALL-E 3 integration with error handling and fallbacks
 */

import { supabase } from '@/integrations/supabase/client';

export interface AIImageRequest {
  prompt: string;
  size?: '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
}

export interface AIImageResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
  prompt?: string;
  revisedPrompt?: string;
}

class AIImageService {
  private readonly apiKey: string;
  private readonly organizationId?: string;
  private readonly baseUrl = 'https://api.openai.com/v1/images/generations';

  constructor() {
    // Check for API key - graceful degradation if not available
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.organizationId = import.meta.env.VITE_OPENAI_ORGANIZATION;
    
    if (!this.apiKey) {
      console.warn('⚠️  OpenAI API key not found. AI image generation will be disabled.');
    }
  }

  /**
   * Check if AI image generation is available
   */
  isAvailable(): boolean {
    return !!this.apiKey && this.apiKey.startsWith('sk-');
  }

  /**
   * Generate AI image using DALL-E 3
   */
  async generateImage(request: AIImageRequest): Promise<AIImageResult> {
    if (!this.isAvailable()) {
      return {
        success: false,
        error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.'
      };
    }

    try {
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };

      if (this.organizationId) {
        headers['OpenAI-Organization'] = this.organizationId;
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: request.prompt,
          n: 1,
          size: request.size || '1024x1024',
          quality: request.quality || 'standard',
          style: request.style || 'natural'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.data || !data.data[0] || !data.data[0].url) {
        throw new Error('Invalid response from OpenAI API');
      }

      return {
        success: true,
        imageUrl: data.data[0].url,
        prompt: request.prompt,
        revisedPrompt: data.data[0].revised_prompt
      };

    } catch (error) {
      console.error('AI Image Generation Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        prompt: request.prompt
      };
    }
  }

  /**
   * Generate image prompt based on blog post content
   */
  generatePromptFromContent(title: string, excerpt: string, category?: string): string {
    const basePrompt = `Professional travel photography for blog post: "${title}". `;
    
    const categoryPrompts: Record<string, string> = {
      'adventure-travel': 'Show solo traveler with adventure gear in Belize jungle/outdoor setting, action-oriented scene',
      'safety-tips': 'Show confident solo female traveler with safety gear in Belize, reassuring and prepared atmosphere',
      'destinations': 'Show beautiful Belize destination with solo traveler exploring, highlighting location features',
      'solo-travel': 'Show empowered solo traveler experiencing Belize culture and nature, inspiring independence',
      'budget-travel': 'Show budget-conscious solo traveler enjoying affordable Belize experiences, hostels, local food',
      'wildlife': 'Show solo traveler observing Belize wildlife from respectful distance, binoculars, natural setting'
    };

    const categoryContext = category ? categoryPrompts[category] || '' : '';
    const contentContext = excerpt.length > 100 ? excerpt.substring(0, 100) + '...' : excerpt;

    return `${basePrompt}${categoryContext}. ${contentContext}. Style: vibrant travel photography, warm Caribbean lighting, authentic Belize atmosphere. Aspect ratio 2:1. High quality, professional composition.`;
  }

  /**
   * Update blog post with AI generated image
   */
  async updatePostWithAIImage(
    postId: string, 
    imageUrl: string, 
    prompt: string, 
    revisedPrompt?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          ai_generated_image_url: imageUrl,
          image_generation_prompt: prompt,
          image_source: 'ai_generated',
          ai_tool_used: 'dall-e-3',
          updated_at: new Date().toISOString()
        })
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
   * Generate image for blog post (complete workflow)
   */
  async generateImageForPost(
    postId: string,
    title: string,
    excerpt: string,
    category?: string,
    customPrompt?: string
  ): Promise<AIImageResult> {
    const prompt = customPrompt || this.generatePromptFromContent(title, excerpt, category);
    
    console.log(`🎨 Generating AI image for post: ${title}`);
    console.log(`📝 Prompt: ${prompt}`);

    const result = await this.generateImage({
      prompt,
      size: '1792x1024', // 2:1 aspect ratio for blog headers
      quality: 'standard', // Start with standard to save costs
      style: 'natural'
    });

    if (result.success && result.imageUrl) {
      const updated = await this.updatePostWithAIImage(
        postId, 
        result.imageUrl, 
        prompt, 
        result.revisedPrompt
      );

      if (!updated) {
        return {
          success: false,
          error: 'Failed to update post in database',
          prompt
        };
      }
    }

    return result;
  }

  /**
   * Get current usage stats (for admin dashboard)
   */
  async getUsageStats(): Promise<{ totalAIImages: number; lastGenerated?: string }> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('ai_generated_image_url, updated_at')
        .eq('image_source', 'ai_generated')
        .not('ai_generated_image_url', 'is', null);

      if (error) throw error;

      return {
        totalAIImages: data?.length || 0,
        lastGenerated: data?.[0]?.updated_at
      };
    } catch (error) {
      console.error('Error fetching AI image usage stats:', error);
      return { totalAIImages: 0 };
    }
  }
}

// Export singleton instance
export const aiImageService = new AIImageService();
export default aiImageService;