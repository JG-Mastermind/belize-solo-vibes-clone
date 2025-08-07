export interface Tour {
  id: string;
  title: string;
  description: string;
  guide_id?: string;
  slug: string;
  seo_title?: string;
  meta_description?: string;
  featured_image_alt?: string;
  price_per_person: number;
  duration_hours: number;
  location_name: string;
  max_participants: number;
  includes?: string[];
  requirements?: string[];
  difficulty_level?: 'easy' | 'moderate' | 'challenging';
  images: string[];
  provider_id?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Legacy compatibility - maps to provider_id in database
export interface TourWithGuide extends Tour {
  guide?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    whatsapp_number?: string;
    profile_image_url?: string;
    user_type: string;
    bio?: string;
    rating?: number;
    experience_years?: number;
  } | null;
}

export interface TourFormData {
  title: string;
  description: string;
  location_name: string;
  price_per_person: number;
  duration_hours: number;
  max_participants: number;
  difficulty_level?: 'easy' | 'moderate' | 'challenging';
  includes?: string[];
  requirements?: string[];
  images: string[];
  provider_id?: string;
  is_active: boolean;
  seo_title?: string;
  meta_description?: string;
  featured_image_alt?: string;
}