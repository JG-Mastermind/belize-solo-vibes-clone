import { supabase } from '@/integrations/supabase/client';
import { 
  Adventure, 
  AdventureAvailability, 
  Booking, 
  BookingCart, 
  BookingFormData,
  PricingBreakdown,
  Promotion,
  Review
} from '@/types/booking';
import { adventures } from '@/data/adventures';
import { addDays, format, isAfter, isBefore, parseISO } from 'date-fns';

export class BookingService {
  // Adventure Methods
  static async getAdventure(id: string): Promise<Adventure | null> {
    try {
      // First try to fetch from Supabase adventures table
      const { data: adventureData, error: adventureError } = await supabase
        .from('adventures')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();
      
      if (!adventureError && adventureData) {
        // Transform adventures table data to Adventure format for booking types
        return {
          id: adventureData.id,
          guide_id: adventureData.guide_id || '',
          title: adventureData.title,
          description: adventureData.description || '',
          location: adventureData.location || '',
          duration_hours: adventureData.duration_hours || 8,
          difficulty_level: (adventureData.difficulty_level as any) || 'moderate',
          max_participants: adventureData.max_participants || 12,
          base_price: adventureData.price_per_person || 0,
          group_discount_percentage: 0,
          early_bird_discount_percentage: 0,
          early_bird_days: 7,
          min_advance_booking_hours: 24,
          max_advance_booking_days: 365,
          cancellation_policy: 'moderate' as any,
          meeting_point: '',
          what_to_bring: [],
          not_suitable_for: [],
          includes: adventureData.includes || [],
          requirements: adventureData.requirements || [],
          featured_image_url: adventureData.image_urls?.[0] || '',
          image_urls: adventureData.image_urls || [],
          gallery_images: adventureData.image_urls || [],
          video_url: '',
          highlights: [],
          itinerary: {},
          add_ons: {},
          faqs: {},
          available_days: [1,2,3,4,5,6,7],
          daily_capacity: adventureData.max_participants || 8,
          seasonal_pricing: {},
          booking_count: 0,
          average_rating: 0,
          total_reviews: 0,
          last_booked_at: '',
          is_active: adventureData.is_active !== false,
          created_at: adventureData.created_at || new Date().toISOString(),
          updated_at: adventureData.updated_at || new Date().toISOString()
        };
      }
      
      // Fallback to local adventures data for numeric IDs
      const numericId = parseInt(id);
      if (!isNaN(numericId)) {
        const localAdventure = adventures.find(adv => adv.id === numericId);
        if (localAdventure) {
          return {
            id: `local-${localAdventure.id}`,
            guide_id: '',
            title: localAdventure.title,
            description: localAdventure.description,
            location: localAdventure.location,
            duration_hours: localAdventure.duration === 'Full Day' ? 8 : 4,
            difficulty_level: 'moderate',
            max_participants: parseInt(localAdventure.groupSize.split('-')[1]) || 12,
            base_price: parseFloat(localAdventure.price.replace('$', '')),
            group_discount_percentage: 0,
            early_bird_discount_percentage: 0,
            early_bird_days: 7,
            min_advance_booking_hours: 24,
            max_advance_booking_days: 365,
            cancellation_policy: 'moderate',
            meeting_point: '',
            what_to_bring: [],
            not_suitable_for: [],
            includes: localAdventure.highlights || [],
            requirements: [],
            featured_image_url: localAdventure.image,
            image_urls: [localAdventure.image],
            gallery_images: [localAdventure.image],
            video_url: '',
            highlights: localAdventure.highlights || [],
            itinerary: {},
            add_ons: {},
            faqs: {},
            available_days: [1,2,3,4,5,6,7],
            daily_capacity: parseInt(localAdventure.groupSize.split('-')[1]) || 8,
            seasonal_pricing: {},
            booking_count: 0,
            average_rating: localAdventure.rating || 0,
            total_reviews: localAdventure.reviews || 0,
            last_booked_at: '',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        }
      }
      
      console.error('Adventure not found in any data source:', id);
      return null;
    } catch (error) {
      console.error('Error fetching adventure:', error);
      return null;
    }
  }

  static async getAdventureAvailability(
    adventureId: string, 
    startDate: string, 
    endDate: string
  ): Promise<AdventureAvailability[]> {
    const { data, error } = await supabase
      .from('adventure_availability')
      .select('*')
      .eq('adventure_id', adventureId)
      .gte('date', startDate)
      .lte('date', endDate)
      .eq('is_blocked', false)
      .order('date', { ascending: true });
    
    if (error) {
      console.error('Error fetching availability:', error);
      return [];
    }
    
    return data || [];
  }

  static async getAvailableSpots(adventureId: string, date: string): Promise<number> {
    const { data, error } = await supabase
      .from('adventure_availability')
      .select('available_spots, booked_spots')
      .eq('adventure_id', adventureId)
      .eq('date', date)
      .single();
    
    if (error || !data) {
      return 0;
    }
    
    return data.available_spots - data.booked_spots;
  }

  // Pricing Methods
  static calculatePricing(
    adventure: Adventure,
    formData: BookingFormData,
    promotion?: Promotion
  ): PricingBreakdown {
    const basePrice = adventure.base_price;
    const participants = formData.participants;
    let subtotal = basePrice * participants;
    
    // Group discount
    let groupDiscount = 0;
    if (participants >= 4 && adventure.group_discount_percentage > 0) {
      groupDiscount = subtotal * (adventure.group_discount_percentage / 100);
    }
    
    // Early bird discount
    let earlyBirdDiscount = 0;
    if (formData.selectedDate) {
      const bookingDate = parseISO(formData.selectedDate);
      const daysInAdvance = Math.ceil(
        (bookingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysInAdvance >= adventure.early_bird_days && adventure.early_bird_discount_percentage > 0) {
        earlyBirdDiscount = subtotal * (adventure.early_bird_discount_percentage / 100);
      }
    }
    
    // Promotion discount
    let promoDiscount = 0;
    if (promotion) {
      if (promotion.discount_type === 'percentage') {
        promoDiscount = subtotal * (promotion.discount_value / 100);
        if (promotion.max_discount_amount) {
          promoDiscount = Math.min(promoDiscount, promotion.max_discount_amount);
        }
      } else {
        promoDiscount = promotion.discount_value;
      }
    }
    
    // Add-ons
    const addOnsTotal = formData.selectedAddOns.reduce(
      (total, addon) => total + (addon.price * addon.quantity), 
      0
    );
    
    // Calculate total after discounts
    const discountedSubtotal = subtotal - groupDiscount - earlyBirdDiscount - promoDiscount;
    const totalBeforeTax = discountedSubtotal + addOnsTotal;
    
    // Tax (assuming 10% tax rate)
    const taxAmount = totalBeforeTax * 0.1;
    const totalAmount = totalBeforeTax + taxAmount;
    
    return {
      basePrice,
      participants,
      subtotal,
      groupDiscount,
      earlyBirdDiscount,
      promoDiscount,
      addOnsTotal,
      taxAmount,
      totalAmount
    };
  }

  // Promotion Methods
  static async validatePromoCode(code: string, adventureId: string): Promise<Promotion | null> {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .lte('starts_at', new Date().toISOString())
      .gte('expires_at', new Date().toISOString())
      .single();
    
    if (error || !data) {
      return null;
    }
    
    // Check if adventure is eligible
    if (data.adventure_ids && data.adventure_ids.length > 0) {
      if (!data.adventure_ids.includes(adventureId)) {
        return null;
      }
    }
    
    // Check usage limits
    if (data.usage_limit && data.usage_count >= data.usage_limit) {
      return null;
    }
    
    return data;
  }

  // Cart Methods
  static async saveToCart(
    userId: string | null,
    adventureId: string,
    formData: BookingFormData,
    stepCompleted: number
  ): Promise<void> {
    const cartData = {
      user_id: userId,
      adventure_id: adventureId,
      session_id: userId ? undefined : this.getSessionId(),
      cart_data: formData,
      step_completed: stepCompleted,
      last_activity_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('booking_cart')
      .upsert(cartData, { 
        onConflict: userId ? 'user_id,adventure_id' : 'session_id,adventure_id' 
      });
    
    if (error) {
      console.error('Error saving to cart:', error);
    }
  }

  static async getCart(userId: string | null, adventureId: string): Promise<BookingCart | null> {
    const query = supabase
      .from('booking_cart')
      .select('*')
      .eq('adventure_id', adventureId);
    
    if (userId) {
      query.eq('user_id', userId);
    } else {
      query.eq('session_id', this.getSessionId());
    }
    
    const { data, error } = await query.single();
    
    if (error || !data) {
      return null;
    }
    
    return data;
  }

  static async clearCart(userId: string | null, adventureId: string): Promise<void> {
    const query = supabase
      .from('booking_cart')
      .delete()
      .eq('adventure_id', adventureId);
    
    if (userId) {
      query.eq('user_id', userId);
    } else {
      query.eq('session_id', this.getSessionId());
    }
    
    const { error } = await query;
    
    if (error) {
      console.error('Error clearing cart:', error);
    }
  }

  // Booking Methods
  static async createBooking(
    userId: string,
    adventureId: string,
    formData: BookingFormData,
    pricing: PricingBreakdown,
    paymentIntentId?: string
  ): Promise<Booking | null> {
    const adventure = await this.getAdventure(adventureId);
    if (!adventure) return null;
    
    const bookingData = {
      user_id: userId,
      adventure_id: adventureId,
      guide_id: adventure.guide_id,
      booking_date: formData.selectedDate,
      start_time: formData.selectedTime,
      participants: formData.participants,
      base_price: pricing.basePrice,
      total_amount: pricing.totalAmount,
      discount_amount: pricing.groupDiscount + pricing.earlyBirdDiscount + pricing.promoDiscount,
      tax_amount: pricing.taxAmount,
      add_ons_amount: pricing.addOnsTotal,
      lead_guest_name: formData.leadGuest.name,
      lead_guest_email: formData.leadGuest.email,
      lead_guest_phone: formData.leadGuest.phone,
      guest_details: formData.guestDetails,
      add_ons: formData.selectedAddOns,
      special_requests: formData.specialRequests,
      whatsapp_notifications: formData.notifications.whatsapp,
      sms_notifications: formData.notifications.sms,
      email_notifications: formData.notifications.email,
      expires_at: addDays(new Date(), 1).toISOString(), // 24 hour expiry
      status: paymentIntentId ? 'confirmed' : 'pending',
      payment_intent_id: paymentIntentId,
      payment_status: paymentIntentId ? 'paid' : 'pending'
    };
    
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating booking:', error);
      return null;
    }
    
    return data;
  }

  static async confirmBooking(bookingId: string, paymentIntentId: string): Promise<Booking | null> {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        payment_status: 'paid',
        payment_intent_id: paymentIntentId,
        confirmed_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single();
    
    if (error) {
      console.error('Error confirming booking:', error);
      return null;
    }
    
    return data;
  }

  static async getUserBookings(userId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        adventures (
          title,
          location,
          featured_image_url,
          duration_hours
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user bookings:', error);
      return [];
    }
    
    return data || [];
  }

  static async cancelBooking(bookingId: string): Promise<boolean> {
    const { error } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString()
      })
      .eq('id', bookingId);
    
    if (error) {
      console.error('Error cancelling booking:', error);
      return false;
    }
    
    return true;
  }

  // Review Methods
  static async getAdventureReviews(adventureId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        users (
          first_name,
          last_name,
          profile_image_url
        )
      `)
      .eq('adventure_id', adventureId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
    
    return data || [];
  }

  static async createReview(
    userId: string,
    bookingId: string,
    adventureId: string,
    guideId: string,
    reviewData: {
      rating: number;
      title?: string;
      comment?: string;
      experienceRating?: number;
      guideRating?: number;
      valueRating?: number;
    }
  ): Promise<Review | null> {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        user_id: userId,
        booking_id: bookingId,
        adventure_id: adventureId,
        guide_id: guideId,
        ...reviewData
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating review:', error);
      return null;
    }
    
    return data;
  }

  // Analytics Methods
  static async trackBookingView(adventureId: string): Promise<void> {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    const { error } = await supabase
      .from('booking_analytics')
      .upsert({
        adventure_id: adventureId,
        date: today,
        views: 1
      }, {
        onConflict: 'adventure_id,date',
        ignoreDuplicates: false
      });
    
    if (error) {
      console.error('Error tracking booking view:', error);
    }
  }

  static async trackBookingStart(adventureId: string): Promise<void> {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    const { error } = await supabase
      .from('booking_analytics')
      .upsert({
        adventure_id: adventureId,
        date: today,
        starts_booking: 1
      }, {
        onConflict: 'adventure_id,date',
        ignoreDuplicates: false
      });
    
    if (error) {
      console.error('Error tracking booking start:', error);
    }
  }

  static async trackBookingComplete(adventureId: string, revenue: number): Promise<void> {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    const { error } = await supabase
      .from('booking_analytics')
      .upsert({
        adventure_id: adventureId,
        date: today,
        completes_booking: 1,
        revenue: revenue
      }, {
        onConflict: 'adventure_id,date',
        ignoreDuplicates: false
      });
    
    if (error) {
      console.error('Error tracking booking complete:', error);
    }
  }

  // Utility Methods
  static getSessionId(): string {
    let sessionId = localStorage.getItem('bookingSessionId');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('bookingSessionId', sessionId);
    }
    return sessionId;
  }

  static generateQRCode(bookingId: string): string {
    // In a real app, this would generate an actual QR code
    // For now, return a placeholder URL
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${bookingId}`;
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}