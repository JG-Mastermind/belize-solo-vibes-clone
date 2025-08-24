/**
 * Example: Rate Limited Payment Intent Creation
 * 
 * This file demonstrates how to integrate the rate limiting middleware
 * with an existing Edge Function. This is for reference only - the
 * actual integration should be done by updating the original function.
 * 
 * Key Integration Points:
 * 1. Import the rate limiting wrapper
 * 2. Wrap the handler function
 * 3. Specify the route for configuration matching
 * 4. Preserve existing CORS and error handling
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { withRateLimit } from "../_middleware.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Original handler function (unchanged business logic)
const paymentIntentHandler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight - rate limiting automatically skips OPTIONS requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user?.email) {
      throw new Error("User not authenticated");
    }

    const { bookingId, amount, currency = 'usd' } = await req.json();

    // Get booking details
    const { data: booking } = await supabaseClient
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .single();

    if (!booking) {
      throw new Error("Booking not found");
    }

    // Environment-based Stripe secret key selection
    const isProduction = Deno.env.get("NODE_ENV") === "production" || 
                        Deno.env.get("DENO_ENV") === "production";
    
    const stripeSecretKey = isProduction 
      ? Deno.env.get("STRIPE_SECRET_KEY_LIVE")
      : Deno.env.get("STRIPE_SECRET_KEY_TEST") || Deno.env.get("STRIPE_SECRET_KEY");
    
    if (!stripeSecretKey) {
      throw new Error("Stripe secret key not configured for current environment");
    }
    
    // Validate key format to prevent test keys in production
    const isTestKey = stripeSecretKey.startsWith("sk_test_");
    const isLiveKey = stripeSecretKey.startsWith("sk_live_");
    
    if (isProduction && isTestKey) {
      throw new Error("Test Stripe key detected in production environment");
    }
    
    if (!isTestKey && !isLiveKey) {
      throw new Error("Invalid Stripe secret key format");
    }
    
    console.log(`Using ${isTestKey ? 'test' : 'live'} Stripe key in ${isProduction ? 'production' : 'development'} mode`);
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      customer_email: user.email,
      metadata: {
        booking_id: bookingId,
        user_id: user.id,
      },
    });

    return new Response(JSON.stringify({ 
      clientSecret: paymentIntent.client_secret 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

// Serve with rate limiting protection
// The route matches the configuration in _rateLimit.config.json
serve(withRateLimit(paymentIntentHandler, "/create-payment-intent"));