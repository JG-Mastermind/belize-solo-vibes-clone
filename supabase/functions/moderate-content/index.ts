import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ModerationRequest {
  content: string;
  category?: 'text' | 'image-prompt';
}

interface ModerationResponse {
  flagged: boolean;
  categories?: string[];
  categoryScores?: Record<string, number>;
  reason?: string;
  content: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Parse request body
    const request: ModerationRequest = await req.json()
    
    // Validate required fields
    if (!request.content) {
      throw new Error('Missing required field: content')
    }

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.warn('OpenAI API key not found, skipping moderation (fail-safe)')
      return new Response(
        JSON.stringify({
          flagged: false,
          categories: [],
          reason: 'Moderation service unavailable - content allowed',
          content: request.content
        } satisfies ModerationResponse),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Moderate content using OpenAI Moderations API
    const moderationResult = await moderateWithOpenAI(request.content, openaiApiKey)

    return new Response(
      JSON.stringify(moderationResult),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in moderate-content function:', error)
    
    // Fail-safe: Allow content if moderation fails
    return new Response(
      JSON.stringify({ 
        flagged: false,
        categories: [],
        reason: `Moderation error: ${error.message} - content allowed (fail-safe)`,
        content: 'error'
      } satisfies ModerationResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 to allow content through
      }
    )
  }
})

async function moderateWithOpenAI(content: string, apiKey: string): Promise<ModerationResponse> {
  try {
    // Call OpenAI Moderations API
    const response = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: content,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`OpenAI Moderations API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    const result = data.results?.[0]

    if (!result) {
      throw new Error('No moderation result returned from OpenAI')
    }

    // Extract flagged categories
    const flaggedCategories: string[] = []
    const categoryScores: Record<string, number> = {}

    if (result.categories) {
      for (const [category, flagged] of Object.entries(result.categories)) {
        if (flagged && typeof flagged === 'boolean') {
          flaggedCategories.push(category)
        }
      }
    }

    if (result.category_scores) {
      Object.assign(categoryScores, result.category_scores)
    }

    return {
      flagged: result.flagged || false,
      categories: flaggedCategories,
      categoryScores,
      reason: flaggedCategories.length > 0 
        ? `Content flagged for: ${flaggedCategories.join(', ')}`
        : undefined,
      content: content
    }

  } catch (error) {
    console.error('OpenAI Moderation error:', error)
    
    // Fail-safe: Allow content if OpenAI moderation fails
    return {
      flagged: false,
      categories: [],
      reason: `Moderation API error: ${error.message} - content allowed (fail-safe)`,
      content: content
    }
  }
}

/* To deploy this function, run:
supabase functions deploy moderate-content */