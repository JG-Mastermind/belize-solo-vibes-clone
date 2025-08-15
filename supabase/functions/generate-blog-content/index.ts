import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BlogContentRequest {
  topic: string;
  tone: 'professional' | 'casual' | 'educational' | 'promotional';
  targetAudience: 'travelers' | 'adventure-seekers' | 'families' | 'solo-travelers';
  keywords: string[];
  language: 'en' | 'fr';
  contentLength: 'short' | 'medium' | 'long';
  context?: {
    business: string;
    location: string;
    specialty: string;
    seoFocus: boolean;
  };
}

interface GeneratedBlogContent {
  title: string;
  excerpt: string;
  content: string;
  seoKeywords: string[];
  metaDescription: string;
  readabilityScore: number;
  suggestedTags: string[];
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
    const request: BlogContentRequest = await req.json()
    
    // Validate required fields
    if (!request.topic || !request.tone || !request.targetAudience) {
      throw new Error('Missing required fields: topic, tone, targetAudience')
    }

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.warn('OpenAI API key not found, using fallback generation')
      return new Response(
        JSON.stringify(generateFallbackContent(request)),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Generate content using OpenAI
    const generatedContent = await generateWithOpenAI(request, openaiApiKey)

    return new Response(
      JSON.stringify(generatedContent),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in generate-blog-content function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        fallback: true
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

async function generateWithOpenAI(request: BlogContentRequest, apiKey: string): Promise<GeneratedBlogContent> {
  const {
    topic,
    tone,
    targetAudience,
    keywords,
    language,
    contentLength,
    context
  } = request

  // Build the prompt for OpenAI
  const prompt = buildOpenAIPrompt(request)

  // Call OpenAI API
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional travel blogger and SEO expert specializing in Belize tourism. Create engaging, SEO-optimized blog content that converts readers into customers for ${context?.business || 'Belize Solo Vibes'}.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: contentLength === 'long' ? 2000 : contentLength === 'medium' ? 1200 : 800,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const data = await response.json()
  const generatedText = data.choices[0]?.message?.content

  if (!generatedText) {
    throw new Error('No content generated from OpenAI')
  }

  // Parse the generated content (assuming structured JSON response)
  try {
    const parsed = JSON.parse(generatedText)
    return {
      title: parsed.title || generateFallbackTitle(topic, language),
      excerpt: parsed.excerpt || generateFallbackExcerpt(topic, language),
      content: parsed.content || generateFallbackContent(request).content,
      seoKeywords: parsed.seoKeywords || keywords,
      metaDescription: parsed.metaDescription || parsed.excerpt?.substring(0, 160),
      readabilityScore: parsed.readabilityScore || 75,
      suggestedTags: parsed.suggestedTags || generateDefaultTags(topic)
    }
  } catch {
    // If JSON parsing fails, treat as plain text content
    const lines = generatedText.split('\n').filter(line => line.trim())
    const title = lines[0] || generateFallbackTitle(topic, language)
    const content = lines.slice(1).join('\n\n') || generateFallbackContent(request).content
    const excerpt = content.substring(0, 200) + '...'

    return {
      title,
      excerpt,
      content,
      seoKeywords: keywords,
      metaDescription: excerpt.substring(0, 160),
      readabilityScore: 75,
      suggestedTags: generateDefaultTags(topic)
    }
  }
}

function buildOpenAIPrompt(request: BlogContentRequest): string {
  const {
    topic,
    tone,
    targetAudience,
    keywords,
    language,
    contentLength,
    context
  } = request

  const langText = language === 'fr' ? 'French' : 'English'
  const lengthText = contentLength === 'long' ? '1500-2000 words' : 
                    contentLength === 'medium' ? '800-1200 words' : '400-600 words'

  return `Create a ${tone} blog post in ${langText} about "${topic}" for ${targetAudience} visiting Belize.

Requirements:
- Length: ${lengthText}
- Include these SEO keywords naturally: ${keywords.join(', ')}
- Focus on ${context?.location || 'Belize'} experiences
- Promote ${context?.business || 'adventure tours'} authentically
- Match ${tone} tone throughout
- Target audience: ${targetAudience}

Please respond with a JSON object containing:
{
  "title": "SEO-optimized title (50-60 characters)",
  "excerpt": "Compelling excerpt (150-200 characters)",
  "content": "Full blog post content with proper formatting",
  "seoKeywords": ["extracted", "keywords", "from", "content"],
  "metaDescription": "Meta description (150-160 characters)",
  "readabilityScore": 75,
  "suggestedTags": ["relevant", "tags"]
}

Make the content engaging, informative, and conversion-focused while maintaining authentic voice and local expertise.`
}

function generateFallbackContent(request: BlogContentRequest): GeneratedBlogContent {
  const { topic, language, keywords, tone, targetAudience } = request
  
  const isFrenh = language === 'fr'
  
  const templates = {
    title: isFrenh ? 
      `Découvrez ${topic}: Guide Complet pour Votre Aventure au Belize` :
      `Discover ${topic}: Your Complete Guide to Belize Adventures`,
    
    excerpt: isFrenh ?
      `Explorez ${topic} au Belize avec notre guide expert. Des expériences authentiques vous attendent dans ce paradis tropical unique.` :
      `Explore ${topic} in Belize with our expert guide. Authentic experiences await in this unique tropical paradise.`,
    
    content: isFrenh ?
      `Le Belize offre des expériences extraordinaires pour ${topic}. Ce guide complet vous aidera à planifier votre aventure parfaite.\n\nQue vous soyez ${targetAudience === 'families' ? 'en famille' : 'un voyageur aventurier'}, ${topic} au Belize propose des activités adaptées à tous les niveaux. Nos guides expérimentés vous accompagneront dans cette découverte unique.\n\nRéservez dès maintenant votre expérience ${topic} et créez des souvenirs inoubliables au cœur de l'Amérique centrale.` :
      `Belize offers extraordinary experiences for ${topic}. This comprehensive guide will help you plan your perfect adventure.\n\nWhether you're ${targetAudience === 'families' ? 'traveling with family' : 'an adventure seeker'}, ${topic} in Belize offers activities suitable for all levels. Our experienced guides will accompany you on this unique discovery.\n\nBook your ${topic} experience now and create unforgettable memories in the heart of Central America.`
  }

  return {
    title: templates.title,
    excerpt: templates.excerpt,
    content: templates.content,
    seoKeywords: keywords.length > 0 ? keywords : [topic, 'belize', 'adventure', 'travel'],
    metaDescription: templates.excerpt.substring(0, 160),
    readabilityScore: 75,
    suggestedTags: generateDefaultTags(topic)
  }
}

function generateFallbackTitle(topic: string, language: string): string {
  return language === 'fr' ? 
    `Guide Complet: ${topic} au Belize` :
    `Complete Guide: ${topic} in Belize`
}

function generateFallbackExcerpt(topic: string, language: string): string {
  return language === 'fr' ?
    `Découvrez ${topic} au Belize avec notre guide expert. Expériences authentiques garanties.` :
    `Discover ${topic} in Belize with our expert guide. Authentic experiences guaranteed.`
}

function generateDefaultTags(topic: string): string[] {
  const baseTags = ['belize', 'travel', 'adventure', 'central-america']
  const topicTags = topic.toLowerCase().split(' ').filter(word => word.length > 3)
  return [...baseTags, ...topicTags].slice(0, 8)
}

/* To deploy this function, run:
supabase functions deploy generate-blog-content */