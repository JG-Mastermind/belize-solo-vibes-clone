import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BlogImageRequest {
  prompt: string;
  style: 'photorealistic' | 'artistic' | 'infographic' | 'landscape';
  mood: 'vibrant' | 'serene' | 'adventurous' | 'cultural';
  aspectRatio: '16:9' | '4:3' | '1:1' | '3:2';
  includeText: boolean;
  belizeContext: boolean;
  quality: 'standard' | 'high';
  safetyFilters: boolean;
}

interface GeneratedImageResponse {
  imageUrl: string;
  altText: string;
  prompt: string;
  metadata: {
    style: string;
    mood: string;
    aspectRatio: string;
    timestamp: string;
  };
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
    const request: BlogImageRequest = await req.json()
    
    // Validate required fields
    if (!request.prompt) {
      throw new Error('Missing required field: prompt')
    }

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.warn('OpenAI API key not found, using fallback image')
      return new Response(
        JSON.stringify(generateFallbackImage(request)),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Generate image using OpenAI DALL-E
    const generatedImage = await generateWithDALLE(request, openaiApiKey)

    // Upload generated image to Supabase Storage for persistence
    const persistentImageUrl = await uploadToStorage(generatedImage.imageUrl, 'blog_images')
    if (persistentImageUrl) {
      generatedImage.imageUrl = persistentImageUrl
    }

    return new Response(
      JSON.stringify(generatedImage),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in generate-blog-image function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        fallback: generateFallbackImage({ prompt: 'belize landscape' } as BlogImageRequest)
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

async function generateWithDALLE(request: BlogImageRequest, apiKey: string): Promise<GeneratedImageResponse> {
  const {
    prompt,
    style,
    mood,
    aspectRatio,
    includeText,
    belizeContext,
    quality,
    safetyFilters
  } = request

  // Build the enhanced prompt for DALL-E
  const enhancedPrompt = buildDALLEPrompt(request)

  // Determine image size based on aspect ratio
  const size = aspectRatio === '16:9' ? '1792x1024' : 
               aspectRatio === '4:3' ? '1024x768' :
               aspectRatio === '1:1' ? '1024x1024' : '1536x1024' // 3:2

  // Call OpenAI DALL-E API
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      size,
      quality: quality === 'high' ? 'hd' : 'standard',
      n: 1,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(`OpenAI DALL-E API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
  }

  const data = await response.json()
  const imageUrl = data.data?.[0]?.url

  if (!imageUrl) {
    throw new Error('No image URL returned from DALL-E')
  }

  return {
    imageUrl,
    altText: generateAltText(prompt, belizeContext),
    prompt: enhancedPrompt,
    metadata: {
      style,
      mood,
      aspectRatio,
      timestamp: new Date().toISOString()
    }
  }
}

function buildDALLEPrompt(request: BlogImageRequest): string {
  const {
    prompt,
    style,
    mood,
    includeText,
    belizeContext
  } = request

  // Base prompt with Belize context
  let enhancedPrompt = belizeContext ? 
    `Beautiful Belize, Central America: ${prompt}` : 
    prompt

  // Add style modifiers
  const styleModifiers = {
    photorealistic: 'hyper-realistic photography, professional quality, sharp details',
    artistic: 'artistic interpretation, painterly style, creative composition',
    infographic: 'clean infographic style, informative visual design, modern layout',
    landscape: 'sweeping landscape photography, natural lighting, scenic composition'
  }

  // Add mood modifiers
  const moodModifiers = {
    vibrant: 'vibrant colors, energetic atmosphere, bright and lively',
    serene: 'peaceful, tranquil, soft lighting, calming atmosphere',
    adventurous: 'dynamic, exciting, action-oriented, thrilling',
    cultural: 'authentic, traditional, culturally rich, heritage focused'
  }

  // Combine modifiers
  enhancedPrompt += `, ${styleModifiers[style]}, ${moodModifiers[mood]}`

  // Add Belize-specific elements if context is enabled
  if (belizeContext) {
    enhancedPrompt += ', tropical Caribbean setting, lush vegetation, crystal clear waters'
  }

  // Add technical quality specifications
  enhancedPrompt += ', high quality, professional composition, excellent lighting'

  // Add text restriction
  if (!includeText) {
    enhancedPrompt += ', no text, no words, no writing'
  }

  return enhancedPrompt
}

function generateFallbackImage(request: BlogImageRequest): GeneratedImageResponse {
  // Curated high-quality Belize-themed fallback images from Unsplash
  const fallbackImages = {
    adventure: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=675&fit=crop&auto=format',
    culture: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=675&fit=crop&auto=format',
    wildlife: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=1200&h=675&fit=crop&auto=format',
    beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=675&fit=crop&auto=format',
    jungle: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=675&fit=crop&auto=format',
    food: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1200&h=675&fit=crop&auto=format',
    diving: 'https://images.unsplash.com/photo-1582845512747-e42001c95638?w=1200&h=675&fit=crop&auto=format',
    sunset: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=675&fit=crop&auto=format',
    ruins: 'https://images.unsplash.com/photo-1539650116574-75c0c6d0cd5e?w=1200&h=675&fit=crop&auto=format',
    default: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=675&fit=crop&auto=format'
  }

  // Select image based on prompt keywords
  const promptLower = request.prompt.toLowerCase()
  let selectedImage = fallbackImages.default

  for (const [category, imageUrl] of Object.entries(fallbackImages)) {
    if (promptLower.includes(category)) {
      selectedImage = imageUrl
      break
    }
  }

  return {
    imageUrl: selectedImage,
    altText: generateAltText(request.prompt, request.belizeContext),
    prompt: request.prompt,
    metadata: {
      style: request.style || 'photorealistic',
      mood: request.mood || 'vibrant',
      aspectRatio: request.aspectRatio || '16:9',
      timestamp: new Date().toISOString()
    }
  }
}

function generateAltText(prompt: string, belizeContext: boolean): string {
  const baseAlt = prompt.replace(/[^a-zA-Z0-9\s]/g, '').trim()
  return belizeContext ? 
    `${baseAlt} in Belize, Central America` : 
    baseAlt
}

async function uploadToStorage(imageUrl: string, bucketName: string): Promise<string | null> {
  try {
    // Create Supabase admin client for storage operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Fetch the image from DALL-E temporary URL
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      console.error('Failed to fetch generated image from DALL-E')
      return null
    }

    const imageBlob = await imageResponse.blob()
    const fileName = `ai-generated-${Date.now()}-${crypto.randomUUID()}.png`
    const filePath = `public/${fileName}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(filePath, imageBlob, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Failed to upload image to storage:', uploadError.message)
      return null
    }

    // Get the public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(filePath)
    
    return publicUrlData.publicUrl

  } catch (error) {
    console.error('Error uploading to storage:', error)
    return null
  }
}

/* To deploy this function, run:
supabase functions deploy generate-blog-image */