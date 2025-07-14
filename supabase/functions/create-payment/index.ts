
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
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

    const { bookingId } = await req.json();

    // Get booking details
    const { data: booking } = await supabaseClient
      .from('bookings')
      .select(`
        *,
        adventures (
          title,
          price_per_person
        )
      `)
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

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${booking.adventures.title} - ${booking.participants} travelers`,
            },
            unit_amount: booking.total_amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/booking/success?booking=${bookingId}`,
      cancel_url: `${req.headers.get("origin")}/booking/${booking.adventure_id}`,
      metadata: {
        booking_id: bookingId,
      },
    });

    // Create payment session record
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    await supabaseService.from("payment_sessions").insert({
      booking_id: bookingId,
      stripe_session_id: session.id,
      amount: booking.total_amount * 100,
      status: "pending",
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
