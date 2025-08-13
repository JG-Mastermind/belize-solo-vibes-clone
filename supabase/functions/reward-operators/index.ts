import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RewardTier {
  name: string
  min_score: number
  booking_boost: number
  visibility_boost: boolean
  badge: string
}

const REWARD_TIERS: RewardTier[] = [
  {
    name: 'bronze',
    min_score: 50,
    booking_boost: 1.05, // 5% boost
    visibility_boost: false,
    badge: '🥉 Bronze Partner'
  },
  {
    name: 'silver', 
    min_score: 100,
    booking_boost: 1.1, // 10% boost
    visibility_boost: true,
    badge: '🥈 Silver Partner'
  },
  {
    name: 'gold',
    min_score: 200,
    booking_boost: 1.2, // 20% boost
    visibility_boost: true, 
    badge: '🥇 Gold Partner'
  },
  {
    name: 'platinum',
    min_score: 500,
    booking_boost: 1.3, // 30% boost
    visibility_boost: true,
    badge: '💎 Platinum Partner'
  }
]

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get tour performance data for reward calculation
    const { data: tours, error: toursError } = await supabaseClient
      .from('tours')
      .select(`
        id,
        title,
        provider_id,
        booking_count,
        average_rating,
        total_reviews,
        price_per_person,
        created_at,
        last_booked_at
      `)
      .eq('is_active', true)

    if (toursError) throw toursError

    // Calculate rewards for each tour operator
    const operatorRewards = new Map<string, {
      provider_id: string,
      total_score: number,
      tours_count: number,
      total_bookings: number,
      avg_rating: number,
      total_revenue: number,
      current_tier: RewardTier | null,
      reward_multiplier: number,
      achievements: string[]
    }>()

    // Group tours by provider and calculate scores
    for (const tour of tours || []) {
      const providerId = tour.provider_id
      
      if (!operatorRewards.has(providerId)) {
        operatorRewards.set(providerId, {
          provider_id: providerId,
          total_score: 0,
          tours_count: 0,
          total_bookings: 0,
          avg_rating: 0,
          total_revenue: 0,
          current_tier: null,
          reward_multiplier: 1.0,
          achievements: []
        })
      }

      const operator = operatorRewards.get(providerId)!
      
      // Calculate tour score based on multiple factors
      const recencyBonus = tour.last_booked_at 
        ? Math.max(0, 30 - Math.floor((Date.now() - new Date(tour.last_booked_at).getTime()) / (1000 * 60 * 60 * 24))) * 2
        : 0

      const ratingBonus = (tour.average_rating || 0) * 10
      const reviewsBonus = Math.min(tour.total_reviews || 0, 50) * 2 // Cap at 100 points
      const bookingScore = (tour.booking_count || 0) * 5
      const revenueScore = ((tour.price_per_person || 0) * (tour.booking_count || 0)) * 0.01

      const tourScore = bookingScore + ratingBonus + reviewsBonus + recencyBonus + revenueScore

      // Update operator totals
      operator.total_score += tourScore
      operator.tours_count += 1
      operator.total_bookings += tour.booking_count || 0
      operator.avg_rating = ((operator.avg_rating * (operator.tours_count - 1)) + (tour.average_rating || 0)) / operator.tours_count
      operator.total_revenue += (tour.price_per_person || 0) * (tour.booking_count || 0)
    }

    // Assign reward tiers and achievements
    const rewardResults = []
    
    for (const [providerId, operator] of operatorRewards) {
      // Find appropriate tier
      const tier = REWARD_TIERS
        .slice()
        .reverse()
        .find(t => operator.total_score >= t.min_score)

      if (tier) {
        operator.current_tier = tier
        operator.reward_multiplier = tier.booking_boost
        operator.achievements.push(tier.badge)
      }

      // Additional achievement bonuses
      if (operator.avg_rating >= 4.8) {
        operator.achievements.push('⭐ Excellence Award')
        operator.reward_multiplier *= 1.05
      }

      if (operator.total_bookings >= 100) {
        operator.achievements.push('📈 Volume Leader')
        operator.reward_multiplier *= 1.1
      }

      if (operator.tours_count >= 5) {
        operator.achievements.push('🎯 Diverse Portfolio')
        operator.reward_multiplier *= 1.05
      }

      rewardResults.push({
        provider_id: providerId,
        total_score: Math.round(operator.total_score),
        tours_count: operator.tours_count,
        total_bookings: operator.total_bookings,
        avg_rating: Math.round(operator.avg_rating * 10) / 10,
        total_revenue: Math.round(operator.total_revenue),
        tier: tier?.name || 'none',
        tier_badge: tier?.badge || 'Getting Started',
        reward_multiplier: Math.round(operator.reward_multiplier * 100) / 100,
        achievements: operator.achievements,
        visibility_boost: tier?.visibility_boost || false
      })
    }

    // Sort by total score descending
    rewardResults.sort((a, b) => b.total_score - a.total_score)

    // Apply instant rewards to database
    const rewardUpdates = []
    
    for (const result of rewardResults) {
      if (result.tier !== 'none') {
        // Update tour operators with reward multipliers
        rewardUpdates.push({
          provider_id: result.provider_id,
          reward_tier: result.tier,
          reward_multiplier: result.reward_multiplier,
          achievements: result.achievements,
          last_reward_update: new Date().toISOString()
        })
      }
    }

    // Create or update operator rewards table
    if (rewardUpdates.length > 0) {
      const { error: rewardError } = await supabaseClient
        .from('tour_operator_rewards')
        .upsert(rewardUpdates, {
          onConflict: 'provider_id'
        })

      if (rewardError) {
        console.error('Error updating rewards:', rewardError)
        // Don't throw - continue with response
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: rewardResults,
        metadata: {
          total_operators: rewardResults.length,
          reward_tiers: REWARD_TIERS,
          last_updated: new Date().toISOString(),
          rewards_applied: rewardUpdates.length
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
    console.error('Error in reward-operators function:', error)
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