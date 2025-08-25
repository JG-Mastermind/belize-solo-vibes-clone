/**
 * Centralized Database Type Definitions
 * Matches exact Supabase schema for type safety across services
 */

// Posts Table Schema
export interface DatabasePost {
  id: string;
  title: string;
  title_fr?: string | null;
  excerpt: string;
  excerpt_fr?: string | null;
  content: string;
  content_fr?: string | null;
  slug: string;
  author: string;
  category_id?: string | null;
  status: 'draft' | 'published';
  featured_image_url?: string | null;
  ai_generated_image_url?: string | null;
  image_source: 'unsplash' | 'ai_generated' | 'uploaded';
  image_generation_prompt?: string | null;
  ai_tool_used?: string | null;
  featured_image_alt?: string | null;
  reading_time?: string | null;
  views?: number;
  seo_title?: string | null;
  meta_description?: string | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

// Tours Table Schema  
export interface DatabaseTour {
  id: string;
  title: string;
  description: string;
  slug: string;
  seo_title?: string | null;
  meta_description?: string | null;
  featured_image_alt?: string | null;
  price_per_person: number;
  duration_hours: number;
  location_name: string;
  max_participants: number;
  includes?: string[] | null;
  requirements?: string[] | null;
  difficulty_level?: 'easy' | 'moderate' | 'challenging' | null;
  images?: string[] | null;
  ai_generated_image_url?: string | null;
  image_generation_prompt?: string | null;
  provider_id?: string | null;
  guide_id?: string | null;
  is_active: boolean;
  booking_count?: number;
  average_rating?: number;
  total_reviews?: number;
  last_booked_at?: string | null;
  created_at: string;
  updated_at: string;
}

// Users Table Schema
export interface DatabaseUser {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  country?: string | null;
  user_type?: 'traveler' | 'guide' | 'admin' | 'super_admin' | 'blogger' | null;
  whatsapp_number?: string | null;
  language_preference?: string | null;
  emergency_contact?: any; // jsonb
  profile_image_url?: string | null;
  is_verified?: boolean | null;
  created_at: string;
  updated_at: string;
  whatsapp_enabled?: boolean | null;
  notification_preferences?: any; // jsonb
  dark_mode?: boolean | null;
  dietary_restrictions?: string | null;
  saved_payment_methods?: any; // jsonb
  bio?: string | null;
  certifications?: string[] | null;
  operating_region?: string | null;
  languages_spoken?: string[] | null;
  payout_account_status?: string | null;
  profile_updated_at?: string | null;
  settings_version?: number | null;
}

// AI Image Service Types
export interface AIImageRequest {
  prompt: string;
  style?: 'photorealistic' | 'artistic' | 'infographic' | 'landscape';
  mood?: 'vibrant' | 'serene' | 'adventurous' | 'cultural';
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:2';
  includeText?: boolean;
  belizeContext?: boolean;
  quality?: 'standard' | 'high';
  safetyFilters?: boolean;
  // Entity context
  entity?: 'post' | 'tour';
  entityId?: string;
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

// Blog Image Generation Options
export interface BlogImageGenerationOptions {
  postId?: string;
  title: string;
  excerpt: string;
  category?: string;
  customPrompt?: string;
  priority?: 'low' | 'medium' | 'high';
  skipModeration?: boolean;
}

// Supabase Function Response Types
export interface SupabaseFunctionResponse<T = any> {
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: string;
  };
}

// Edge Function Standard Response
export interface EdgeFunctionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}