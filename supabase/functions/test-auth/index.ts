import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { email, password } = await req.json()

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Missing email or password' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Test sign in
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    })

    if (error) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message,
          errorCode: error.name
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get user details
    const { data: userData, error: userError } = await supabaseClient.auth.getUser()

    return new Response(
      JSON.stringify({ 
        success: true,
        user: {
          id: data.user?.id,
          email: data.user?.email,
          userMetadata: data.user?.user_metadata,
          appMetadata: data.user?.app_metadata
        },
        session: data.session ? 'present' : 'missing'
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})