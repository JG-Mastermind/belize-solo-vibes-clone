import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('stripe-signature');
    
    if (!signature) {
      console.error('Missing stripe-signature header');
      return new Response('Missing stripe-signature header', { 
        status: 400,
        headers: corsHeaders 
      });
    }

    const body = await req.text();
    
    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response('Webhook signature verification failed', { 
        status: 400,
        headers: corsHeaders 
      });
    }

    console.log('Received webhook event:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(paymentIntent);
        break;
      }
      
      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentCanceled(paymentIntent);
        break;
      }
      
      case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute;
        await handleChargeDispute(dispute);
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Internal server error', { 
      status: 500,
      headers: corsHeaders 
    });
  }
});

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded for PaymentIntent:', paymentIntent.id);
  
  try {
    // Update booking status to confirmed
    const { data, error } = await supabase
      .from('bookings')
      .update({ 
        status: 'confirmed',
        payment_status: 'paid',
        payment_intent_id: paymentIntent.id,
        confirmed_at: new Date().toISOString()
      })
      .eq('payment_intent_id', paymentIntent.id)
      .select();

    if (error) {
      console.error('Error updating booking:', error);
      return;
    }

    if (data && data.length > 0) {
      const booking = data[0];
      console.log('Booking confirmed:', booking.id);
      
      // TODO: Send confirmation email
      // TODO: Send notification to guide
      // TODO: Update availability
      
    } else {
      console.warn('No booking found for payment intent:', paymentIntent.id);
    }
    
  } catch (error) {
    console.error('Error in handlePaymentIntentSucceeded:', error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed for PaymentIntent:', paymentIntent.id);
  
  try {
    // Update booking status to failed
    const { error } = await supabase
      .from('bookings')
      .update({ 
        status: 'cancelled',
        payment_status: 'failed',
        payment_intent_id: paymentIntent.id
      })
      .eq('payment_intent_id', paymentIntent.id);

    if (error) {
      console.error('Error updating booking after payment failure:', error);
    }
    
  } catch (error) {
    console.error('Error in handlePaymentIntentFailed:', error);
  }
}

async function handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment canceled for PaymentIntent:', paymentIntent.id);
  
  try {
    // Update booking status to cancelled
    const { error } = await supabase
      .from('bookings')
      .update({ 
        status: 'cancelled',
        payment_status: 'cancelled',
        payment_intent_id: paymentIntent.id
      })
      .eq('payment_intent_id', paymentIntent.id);

    if (error) {
      console.error('Error updating booking after payment cancellation:', error);
    }
    
  } catch (error) {
    console.error('Error in handlePaymentIntentCanceled:', error);
  }
}

async function handleChargeDispute(dispute: Stripe.Dispute) {
  console.log('Charge dispute created:', dispute.id);
  
  try {
    // Find the booking associated with this charge
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('payment_intent_id', dispute.payment_intent)
      .single();

    if (error || !booking) {
      console.error('Error finding booking for dispute:', error);
      return;
    }

    // Update booking status to disputed
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ 
        status: 'disputed',
        payment_status: 'disputed'
      })
      .eq('id', booking.id);

    if (updateError) {
      console.error('Error updating booking for dispute:', updateError);
    }
    
    // TODO: Send notification to admin
    // TODO: Create dispute record in database
    
  } catch (error) {
    console.error('Error in handleChargeDispute:', error);
  }
}