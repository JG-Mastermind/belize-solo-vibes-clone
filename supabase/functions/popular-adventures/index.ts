import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Tour {
  id: string
  title: string
  location_name: string
  price_per_person: number
  booking_count: number
  average_rating: number
  total_reviews: number
  last_booked_at: string
  created_at: string
  is_active: boolean
}

interface PopularTourResult {
  category: string
  tour: Tour
  popularity_score: number
  visits_count: number
  booking_conversion_rate: number
  revenue_generated: number
}

// Tour categorization mapping based on existing tours
const TOUR_CATEGORIES = {
  'Cave Tubing & Jungle Trek': 'adventure',
  'Snorkeling at Hol Chan Marine Reserve': 'marine',
  'Caracol Maya Ruins Adventure': 'cultural',
  'Blue Hole Diving Experience': 'diving',
  'Jungle Zip-lining & Waterfall Tour': 'adventure', 
  'Manatee Watching & Beach Day': 'wildlife',
  'Sunrise Fishing & Island Hopping': 'marine',
  'Night Jungle Safari': 'wildlife',
  'Cultural Village Tour & Chocolate Making': 'cultural'
}

const CATEGORY_WEIGHTS = {
  booking_count: 0.4,      // 40% - actual bookings most important
  views: 0.2,              // 20% - visitor interest
  recent_activity: 0.15,   // 15% - recent bookings boost relevance
  rating_quality: 0.15,    // 15% - high ratings matter
  revenue_impact: 0.1      // 10% - revenue contribution
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get all active tours with analytics data
    const { data: tours, error: toursError } = await supabaseClient
      .from('tours')
      .select(`
        id,
        title,
        location_name,
        price_per_person,
        booking_count,
        average_rating,
        total_reviews,
        last_booked_at,
        created_at,
        is_active
      `)
      .eq('is_active', true)

    if (toursError) throw toursError

    // Get analytics data for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: analytics, error: analyticsError } = await supabaseClient
      .from('booking_analytics')
      .select('*')
      .gte('date', thirtyDaysAgo.toISOString().split('T')[0])

    if (analyticsError) throw analyticsError

    // Calculate popularity scores for each tour
    const tourScores = new Map<string, {
      tour: Tour,
      category: string,
      popularity_score: number,
      visits_count: number,
      booking_conversion_rate: number,
      revenue_generated: number
    }>()

    for (const tour of tours || []) {
      const category = TOUR_CATEGORIES[tour.title as keyof typeof TOUR_CATEGORIES] || 'other'
      
      // Aggregate analytics for this tour
      const tourAnalytics = analytics?.filter(a => a.tour_id === tour.id) || []
      const totalViews = tourAnalytics.reduce((sum, a) => sum + (a.views || 0), 0)
      const totalRevenue = tourAnalytics.reduce((sum, a) => sum + (parseFloat(a.revenue) || 0), 0)
      const totalCompleted = tourAnalytics.reduce((sum, a) => sum + (a.completes_booking || 0), 0)
      
      // Calculate conversion rate
      const conversionRate = totalViews > 0 ? (totalCompleted / totalViews) * 100 : 0
      
      // Calculate recency boost (more recent bookings get higher scores)
      const daysSinceLastBooking = tour.last_booked_at 
        ? Math.floor((Date.now() - new Date(tour.last_booked_at).getTime()) / (1000 * 60 * 60 * 24))
        : 999
      const recencyBoost = Math.max(0, 30 - daysSinceLastBooking) / 30

      // Calculate rating quality score
      const ratingScore = tour.total_reviews > 0 ? (tour.average_rating || 0) / 5 : 0

      // Calculate popularity score using weighted formula
      const popularityScore = 
        (tour.booking_count || 0) * CATEGORY_WEIGHTS.booking_count +
        (totalViews * 0.1) * CATEGORY_WEIGHTS.views +  // Normalize views
        (recencyBoost * 100) * CATEGORY_WEIGHTS.recent_activity +
        (ratingScore * 100) * CATEGORY_WEIGHTS.rating_quality +
        (totalRevenue * 0.01) * CATEGORY_WEIGHTS.revenue_impact  // Normalize revenue

      tourScores.set(tour.id, {
        tour,
        category,
        popularity_score: Math.round(popularityScore * 100) / 100,
        visits_count: totalViews,
        booking_conversion_rate: Math.round(conversionRate * 100) / 100,
        revenue_generated: totalRevenue
      })
    }

    // Group by category and find the most popular tour in each
    const popularByCategory: PopularTourResult[] = []
    const categories = [...new Set(Array.from(tourScores.values()).map(t => t.category))]

    for (const category of categories) {
      const categoryTours = Array.from(tourScores.values())
        .filter(t => t.category === category)
        .sort((a, b) => b.popularity_score - a.popularity_score)

      if (categoryTours.length > 0) {
        const winner = categoryTours[0]
        popularByCategory.push({
          category,
          tour: winner.tour,
          popularity_score: winner.popularity_score,
          visits_count: winner.visits_count,
          booking_conversion_rate: winner.booking_conversion_rate,
          revenue_generated: winner.revenue_generated
        })
      }
    }

    // Sort by popularity score for consistent ordering
    popularByCategory.sort((a, b) => b.popularity_score - a.popularity_score)

    // Update tour operator rewards (increment booking_count for winners)
    const winnerTourIds = popularByCategory.map(p => p.tour.id)
    if (winnerTourIds.length > 0) {
      // Add small reward boost to popular tours (this simulates instant rewards)
      await supabaseClient
        .from('tours')
        .update({ 
          booking_count: supabaseClient.sql`booking_count + 1`,
          updated_at: new Date().toISOString()
        })
        .in('id', winnerTourIds)
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: popularByCategory,
        metadata: {
          total_categories: categories.length,
          algorithm_weights: CATEGORY_WEIGHTS,
          last_updated: new Date().toISOString()
        }
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    )

  } catch (error) {
    console.error('Error in popular-adventures function:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    )
  }
})