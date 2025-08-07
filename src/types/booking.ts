import { z } from 'zod';

// Booking Status Enums
export const BookingStatusEnum = z.enum(['draft', 'pending', 'confirmed', 'cancelled', 'completed', 'refunded']);
export const PaymentStatusEnum = z.enum(['pending', 'processing', 'paid', 'failed', 'refunded', 'partial_refund']);
export const DifficultyEnum = z.enum(['easy', 'moderate', 'challenging', 'extreme']);
export const CancellationPolicyEnum = z.enum(['flexible', 'moderate', 'strict', 'super_strict']);

// Base Types
export type BookingStatus = z.infer<typeof BookingStatusEnum>;
export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;
export type Difficulty = z.infer<typeof DifficultyEnum>;
export type CancellationPolicy = z.infer<typeof CancellationPolicyEnum>;

// Adventure Schema (Enhanced)
export const AdventureSchema = z.object({
  id: z.string().uuid(),
  guide_id: z.string().uuid(),
  title: z.string(),
  slug: z.string().optional(),
  description: z.string(),
  seo_title: z.string().optional(),
  meta_description: z.string().optional(),
  featured_image_alt: z.string().optional(),
  location: z.string(),
  duration_hours: z.number(),
  difficulty_level: DifficultyEnum,
  max_participants: z.number(),
  
  // Pricing
  base_price: z.number(),
  group_discount_percentage: z.number().default(0),
  early_bird_discount_percentage: z.number().default(0),
  early_bird_days: z.number().default(7),
  
  // Booking rules
  min_advance_booking_hours: z.number().default(24),
  max_advance_booking_days: z.number().default(365),
  cancellation_policy: CancellationPolicyEnum.default('moderate'),
  
  // Details
  meeting_point: z.string().optional(),
  what_to_bring: z.array(z.string()).optional(),
  not_suitable_for: z.array(z.string()).optional(),
  includes: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  
  // Media
  featured_image_url: z.string().optional(),
  image_urls: z.array(z.string()).optional(),
  gallery_images: z.array(z.string()).optional(),
  video_url: z.string().optional(),
  
  // Content
  highlights: z.array(z.string()).optional(),
  itinerary: z.record(z.any()).optional(),
  add_ons: z.record(z.any()).optional(),
  faqs: z.record(z.any()).optional(),
  
  // Scheduling
  available_days: z.array(z.number()).default([1,2,3,4,5,6,7]),
  daily_capacity: z.number().default(8),
  seasonal_pricing: z.record(z.any()).optional(),
  
  // Stats
  booking_count: z.number().default(0),
  average_rating: z.number().default(0),
  total_reviews: z.number().default(0),
  last_booked_at: z.string().optional(),
  
  // Status
  is_active: z.boolean().default(true),
  created_at: z.string(),
  updated_at: z.string(),
});

// Adventure Availability Schema
export const AdventureAvailabilitySchema = z.object({
  id: z.string().uuid(),
  adventure_id: z.string().uuid(),
  date: z.string(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  available_spots: z.number(),
  booked_spots: z.number().default(0),
  price_adjustment_percentage: z.number().default(0),
  is_blocked: z.boolean().default(false),
  created_at: z.string(),
  updated_at: z.string(),
});

// Booking Schema
export const BookingSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  adventure_id: z.string().uuid(),
  guide_id: z.string().uuid(),
  
  // Booking details
  booking_date: z.string(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  participants: z.number(),
  
  // Pricing
  base_price: z.number(),
  total_amount: z.number(),
  discount_amount: z.number().default(0),
  tax_amount: z.number().default(0),
  add_ons_amount: z.number().default(0),
  
  // Status
  status: BookingStatusEnum.default('draft'),
  payment_status: PaymentStatusEnum.default('pending'),
  payment_intent_id: z.string().optional(),
  
  // Guest information
  lead_guest_name: z.string().optional(),
  lead_guest_email: z.string().optional(),
  lead_guest_phone: z.string().optional(),
  guest_details: z.record(z.any()).optional(),
  
  // Additional options
  add_ons: z.record(z.any()).optional(),
  special_requests: z.string().optional(),
  
  // Confirmation
  confirmation_code: z.string().optional(),
  qr_code_url: z.string().optional(),
  
  // Communication preferences
  whatsapp_notifications: z.boolean().default(false),
  sms_notifications: z.boolean().default(false),
  email_notifications: z.boolean().default(true),
  
  // Timestamps
  expires_at: z.string().optional(),
  confirmed_at: z.string().optional(),
  cancelled_at: z.string().optional(),
  completed_at: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Booking Cart Schema
export const BookingCartSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid().optional(),
  adventure_id: z.string().uuid(),
  session_id: z.string().optional(),
  cart_data: z.record(z.any()),
  step_completed: z.number().default(1),
  last_activity_at: z.string(),
  created_at: z.string(),
});

// Review Schema
export const ReviewSchema = z.object({
  id: z.string().uuid(),
  booking_id: z.string().uuid(),
  user_id: z.string().uuid(),
  adventure_id: z.string().uuid(),
  guide_id: z.string().uuid(),
  
  // Review details
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().optional(),
  photos: z.array(z.string()).optional(),
  
  // Category ratings
  experience_rating: z.number().min(1).max(5).optional(),
  guide_rating: z.number().min(1).max(5).optional(),
  value_rating: z.number().min(1).max(5).optional(),
  
  // Status
  is_verified: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  
  // Timestamps
  created_at: z.string(),
  updated_at: z.string(),
});

// Promotion Schema
export const PromotionSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  description: z.string().optional(),
  
  // Discount details
  discount_type: z.enum(['percentage', 'fixed_amount']),
  discount_value: z.number(),
  min_booking_amount: z.number().default(0),
  max_discount_amount: z.number().optional(),
  
  // Applicability
  adventure_ids: z.array(z.string().uuid()).optional(),
  user_ids: z.array(z.string().uuid()).optional(),
  new_users_only: z.boolean().default(false),
  
  // Usage limits
  usage_limit: z.number().optional(),
  usage_count: z.number().default(0),
  per_user_limit: z.number().default(1),
  
  // Validity
  starts_at: z.string(),
  expires_at: z.string(),
  
  // Status
  is_active: z.boolean().default(true),
  
  // Timestamps
  created_at: z.string(),
  updated_at: z.string(),
});

// Infer Types
export type Adventure = z.infer<typeof AdventureSchema>;
export type AdventureAvailability = z.infer<typeof AdventureAvailabilitySchema>;
export type Booking = z.infer<typeof BookingSchema>;
export type BookingCart = z.infer<typeof BookingCartSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type Promotion = z.infer<typeof PromotionSchema>;

// Booking Flow Types
export interface BookingStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export interface BookingFormData {
  // Step 1: Date & Time
  selectedDate: string;
  selectedTime: string;
  
  // Step 2: Group Details
  participants: number;
  
  // Step 3: Guest Information
  leadGuest: {
    name: string;
    email: string;
    phone: string;
  };
  guestDetails: {
    dietaryRestrictions: string[];
    experienceLevel: string;
    emergencyContact: {
      name: string;
      phone: string;
    };
  };
  
  // Step 4: Add-ons
  selectedAddOns: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  
  // Step 5: Special Requests
  specialRequests: string;
  
  // Communication preferences
  notifications: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
  
  // Promotion
  promoCode: string;
  appliedPromotion?: Promotion;
}

// Pricing Breakdown
export interface PricingBreakdown {
  basePrice: number;
  participants: number;
  subtotal: number;
  groupDiscount: number;
  earlyBirdDiscount: number;
  promoDiscount: number;
  addOnsTotal: number;
  taxAmount: number;
  totalAmount: number;
}

// Booking Analytics
export interface BookingAnalytics {
  views: number;
  bookingStarts: number;
  bookingCompletions: number;
  conversionRate: number;
  abandonmentRate: number;
  averageBookingValue: number;
  totalRevenue: number;
}