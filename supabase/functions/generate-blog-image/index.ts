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
  // Tours support
  entity?: 'post' | 'tour';
  entityId?: string;
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
    // Parse request body first to enable fallbacks
    let request: BlogImageRequest;
    try {
      request = await req.json()
    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid JSON in request body',
          imageUrl: generateFallbackImage({ prompt: 'belize landscape' } as BlogImageRequest).imageUrl
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Validate required fields
    if (!request.prompt) {
      console.warn('Missing prompt in request')
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Missing required field: prompt',
          imageUrl: generateFallbackImage({ prompt: 'belize adventure' } as BlogImageRequest).imageUrl
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.warn('No authorization header provided')
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'No authorization header',
          imageUrl: generateFallbackImage(request).imageUrl
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401,
        }
      )
    }

    // Create Supabase client with proper error handling
    let supabaseClient;
    try {
      supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        {
          global: {
            headers: { Authorization: authHeader },
          },
        }
      )
    } catch (clientError) {
      console.error('Supabase client creation error:', clientError)
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Database connection failed',
          imageUrl: generateFallbackImage(request).imageUrl
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    // Verify the user is authenticated
    try {
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
      if (authError || !user) {
        console.warn('User authentication failed:', authError?.message)
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'User authentication failed',
            imageUrl: generateFallbackImage(request).imageUrl
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401,
          }
        )
      }
    } catch (authCheckError) {
      console.error('Authentication check error:', authCheckError)
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Authentication system error',
          imageUrl: generateFallbackImage(request).imageUrl
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }

    // Get OpenAI API key from environment - critical path
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.warn('OPENAI_API_KEY not configured in Supabase secrets - using fallback')
      const fallbackImage = generateFallbackImage(request)
      return new Response(
        JSON.stringify({ 
          success: true, 
          imageUrl: fallbackImage.imageUrl,
          altText: fallbackImage.altText,
          prompt: fallbackImage.prompt,
          fallbackUsed: true,
          error: 'AI generation temporarily unavailable'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Generate image using OpenAI DALL-E with comprehensive error handling
    let generatedImage: GeneratedImageResponse;
    try {
      generatedImage = await generateWithDALLE(request, openaiApiKey)
    } catch (dalleError) {
      console.error('DALL-E generation failed:', dalleError)
      const fallbackImage = generateFallbackImage(request)
      return new Response(
        JSON.stringify({ 
          success: true,
          imageUrl: fallbackImage.imageUrl,
          altText: fallbackImage.altText,
          prompt: fallbackImage.prompt,
          fallbackUsed: true,
          error: dalleError.message || 'AI image generation failed'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Determine bucket and path based on entity type
    const isTour = request.entity === 'tour';
    const bucketName = isTour ? 'tour_images' : 'blog_images';
    
    // Upload generated image to Supabase Storage for persistence
    try {
      const persistentImageUrl = await uploadToStorage(generatedImage.imageUrl, bucketName, request.entityId, isTour)
      if (persistentImageUrl) {
        generatedImage.imageUrl = persistentImageUrl
        console.log(`✅ Image successfully uploaded to ${bucketName}: ${persistentImageUrl}`)
      } else {
        console.warn('⚠️ Storage upload failed, using temporary DALL-E URL')
      }
    } catch (storageError) {
      console.error('Storage upload error (using temporary URL):', storageError)
      // Continue with temporary URL - don't fail the entire operation
    }

    return new Response(
      JSON.stringify({
        success: true,
        ...generatedImage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Unhandled error in generate-blog-image function:', error)
    
    // Emergency fallback - ensure we always return valid JSON
    const emergencyFallback = generateFallbackImage({ prompt: 'beautiful Belize landscape' } as BlogImageRequest)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Internal server error',
        imageUrl: emergencyFallback.imageUrl,
        altText: emergencyFallback.altText,
        fallbackUsed: true
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
  console.log('🎨 Enhanced DALL-E prompt:', enhancedPrompt)

  // Determine image size based on aspect ratio
  const size = aspectRatio === '16:9' ? '1792x1024' : 
               aspectRatio === '4:3' ? '1024x768' :
               aspectRatio === '1:1' ? '1024x1024' : '1536x1024' // 3:2

  console.log(`🖼️ Requesting DALL-E image with size: ${size}`)

  // Prepare API request with timeout
  const requestBody = {
    model: 'dall-e-3',
    prompt: enhancedPrompt,
    size,
    quality: quality === 'high' ? 'hd' : 'standard',
    n: 1,
  }

  console.log('📡 Making DALL-E API request...')

  // Call OpenAI DALL-E API with timeout and comprehensive error handling
  let response: Response;
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    })

    clearTimeout(timeoutId)
  } catch (fetchError) {
    console.error('DALL-E API network error:', fetchError)
    if (fetchError.name === 'AbortError') {
      throw new Error('DALL-E API request timed out after 30 seconds')
    }
    throw new Error(`DALL-E API network error: ${fetchError.message}`)
  }

  console.log(`📊 DALL-E API response status: ${response.status}`)

  if (!response.ok) {
    let errorData: any = {}
    try {
      errorData = await response.json()
    } catch {
      console.warn('Failed to parse DALL-E error response as JSON')
    }
    
    const errorMessage = errorData.error?.message || 'Unknown DALL-E API error'
    console.error('DALL-E API error:', {
      status: response.status,
      message: errorMessage,
      code: errorData.error?.code
    })
    
    throw new Error(`DALL-E API error (${response.status}): ${errorMessage}`)
  }

  let data: any;
  try {
    data = await response.json()
  } catch (jsonError) {
    console.error('Failed to parse DALL-E success response:', jsonError)
    throw new Error('Invalid JSON response from DALL-E API')
  }

  const imageUrl = data.data?.[0]?.url
  const revisedPrompt = data.data?.[0]?.revised_prompt

  if (!imageUrl) {
    console.error('DALL-E response missing image URL:', data)
    throw new Error('No image URL returned from DALL-E API')
  }

  console.log('✅ DALL-E image generated successfully:', imageUrl)
  if (revisedPrompt) {
    console.log('📝 DALL-E revised prompt:', revisedPrompt)
  }

  return {
    imageUrl,
    altText: generateAltText(revisedPrompt || prompt, belizeContext),
    prompt: revisedPrompt || enhancedPrompt,
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

async function uploadToStorage(imageUrl: string, bucketName: string, entityId?: string, isTour?: boolean): Promise<string | null> {
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
    const fileName = `ai-generated-${Date.now()}-${crypto.randomUUID()}.webp`
    
    // Organize by entity type and ID for better structure
    const filePath = entityId 
      ? `${isTour ? 'tours' : 'posts'}/${entityId}/${fileName}`
      : `public/${fileName}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(filePath, imageBlob, {
        contentType: 'image/webp',
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
    
    const publicUrl = publicUrlData.publicUrl

    // Optional: Server-side DB writeback for tours
    if (entityId && isTour && publicUrl) {
      try {
        await supabaseAdmin.from('tours')
          .update({ ai_generated_image_url: publicUrl })
          .eq('id', entityId);
      } catch (dbError) {
        console.warn('Failed to update tour with AI image URL:', dbError)
        // Don't fail the entire operation for DB update issues
      }
    }
    
    return publicUrl

  } catch (error) {
    console.error('Error uploading to storage:', error)
    return null
  }
}

/* To deploy this function, run:
supabase functions deploy generate-blog-image */