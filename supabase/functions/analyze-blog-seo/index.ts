import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SEOAnalysisRequest {
  title: string;
  content: string;
  excerpt: string;
  targetKeywords: string[];
  language: 'en' | 'fr';
  competitorUrls?: string[];
  belizeContext?: boolean;
  industryFocus?: string;
}

interface SEOAnalysisResult {
  score: number;
  recommendations: SEORecommendation[];
  keywordAnalysis: KeywordAnalysis;
  readabilityAnalysis: ReadabilityAnalysis;
  technicalSEO: TechnicalSEOAnalysis;
  optimizedContent: OptimizedContent;
}

interface SEORecommendation {
  type: 'critical' | 'warning' | 'suggestion';
  category: 'keywords' | 'content' | 'technical' | 'readability';
  issue: string;
  solution: string;
  impact: 'high' | 'medium' | 'low';
}

interface KeywordAnalysis {
  primaryKeyword: string;
  keywordDensity: { [keyword: string]: number };
  keywordDistribution: KeywordDistribution;
  missingKeywords: string[];
  overOptimized: string[];
  suggestions: string[];
}

interface KeywordDistribution {
  title: boolean;
  firstParagraph: boolean;
  headings: boolean;
  conclusion: boolean;
  metaDescription: boolean;
}

interface ReadabilityAnalysis {
  fleschScore: number;
  gradeLevel: string;
  averageSentenceLength: number;
  passiveVoicePercentage: number;
  transitionWords: number;
  recommendations: string[];
}

interface TechnicalSEOAnalysis {
  titleLength: number;
  metaDescriptionLength: number;
  headingStructure: HeadingStructure;
  internalLinkOpportunities: string[];
  imageOptimization: ImageSEOAnalysis[];
}

interface HeadingStructure {
  h1Count: number;
  h2Count: number;
  h3Count: number;
  hasProperHierarchy: boolean;
  issues: string[];
}

interface ImageSEOAnalysis {
  hasAltText: boolean;
  altTextQuality: 'good' | 'poor' | 'missing';
  hasCaption: boolean;
  isOptimized: boolean;
  suggestions: string[];
}

interface OptimizedContent {
  title: string;
  metaDescription: string;
  suggestedHeadings: string[];
  internalLinks: InternalLinkSuggestion[];
  schemaMarkup: any;
}

interface InternalLinkSuggestion {
  anchorText: string;
  targetUrl: string;
  relevanceScore: number;
  position: number;
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
    const request: SEOAnalysisRequest = await req.json()
    
    // Validate required fields
    if (!request.title || !request.content || !request.targetKeywords) {
      throw new Error('Missing required fields: title, content, targetKeywords')
    }

    // Perform comprehensive SEO analysis
    const analysis = await performSEOAnalysis(request)

    return new Response(
      JSON.stringify(analysis),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in analyze-blog-seo function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

async function performSEOAnalysis(request: SEOAnalysisRequest): Promise<SEOAnalysisResult> {
  const { title, content, excerpt, targetKeywords, language } = request
  
  // Analyze keywords
  const keywordAnalysis = analyzeKeywords(title, content, excerpt, targetKeywords)
  
  // Analyze readability
  const readabilityAnalysis = analyzeReadability(content, language)
  
  // Analyze technical SEO
  const technicalSEO = analyzeTechnicalSEO(title, content, excerpt)
  
  // Generate recommendations
  const recommendations = generateSEORecommendations(
    keywordAnalysis,
    readabilityAnalysis,
    technicalSEO
  )
  
  // Calculate overall score
  const score = calculateSEOScore(keywordAnalysis, readabilityAnalysis, technicalSEO)
  
  // Generate optimized content
  const optimizedContent = generateOptimizedContent(title, content, targetKeywords)

  return {
    score,
    recommendations,
    keywordAnalysis,
    readabilityAnalysis,
    technicalSEO,
    optimizedContent
  }
}

function analyzeKeywords(title: string, content: string, excerpt: string, targetKeywords: string[]): KeywordAnalysis {
  const fullText = `${title} ${excerpt} ${content}`.toLowerCase()
  const words = fullText.split(/\s+/)
  const totalWords = words.length
  
  // Calculate keyword density
  const keywordDensity: { [keyword: string]: number } = {}
  targetKeywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase()
    const occurrences = (fullText.match(new RegExp(`\\b${keywordLower}\\b`, 'g')) || []).length
    keywordDensity[keyword] = Math.round((occurrences / totalWords) * 100 * 100) / 100
  })

  // Analyze keyword distribution
  const keywordDistribution: KeywordDistribution = {
    title: targetKeywords.some(kw => title.toLowerCase().includes(kw.toLowerCase())),
    firstParagraph: checkFirstParagraph(content, targetKeywords),
    headings: checkHeadings(content, targetKeywords),
    conclusion: checkConclusion(content, targetKeywords),
    metaDescription: targetKeywords.some(kw => excerpt.toLowerCase().includes(kw.toLowerCase()))
  }

  // Find missing and over-optimized keywords
  const missingKeywords = targetKeywords.filter(kw => keywordDensity[kw] === 0)
  const overOptimized = targetKeywords.filter(kw => keywordDensity[kw] > 3)

  // Generate keyword suggestions
  const suggestions = generateKeywordSuggestions(content, targetKeywords)

  return {
    primaryKeyword: targetKeywords[0] || '',
    keywordDensity,
    keywordDistribution,
    missingKeywords,
    overOptimized,
    suggestions
  }
}

function analyzeReadability(content: string, language: string): ReadabilityAnalysis {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const words = content.split(/\s+/).filter(w => w.length > 0)
  const syllables = countSyllables(content)
  
  // Calculate Flesch Reading Ease Score
  const avgSentenceLength = words.length / sentences.length
  const avgSyllablesPerWord = syllables / words.length
  const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord)
  
  // Determine grade level
  const gradeLevel = getGradeLevel(Math.max(0, Math.min(100, fleschScore)))
  
  // Analyze passive voice
  const passiveVoiceCount = countPassiveVoice(content)
  const passiveVoicePercentage = (passiveVoiceCount / sentences.length) * 100
  
  // Count transition words
  const transitionWords = countTransitionWords(content, language)
  
  // Generate readability recommendations
  const recommendations = generateReadabilityRecommendations(
    fleschScore,
    avgSentenceLength,
    passiveVoicePercentage,
    transitionWords
  )

  return {
    fleschScore: Math.round(Math.max(0, Math.min(100, fleschScore))),
    gradeLevel,
    averageSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    passiveVoicePercentage: Math.round(passiveVoicePercentage * 10) / 10,
    transitionWords,
    recommendations
  }
}

function analyzeTechnicalSEO(title: string, content: string, excerpt: string): TechnicalSEOAnalysis {
  return {
    titleLength: title.length,
    metaDescriptionLength: excerpt.length,
    headingStructure: analyzeHeadingStructure(content),
    internalLinkOpportunities: findInternalLinkOpportunities(content),
    imageOptimization: analyzeImageSEO(content)
  }
}

// Helper functions implementation
function checkFirstParagraph(content: string, keywords: string[]): boolean {
  const firstParagraph = content.split('\n\n')[0] || content.substring(0, 200)
  return keywords.some(kw => firstParagraph.toLowerCase().includes(kw.toLowerCase()))
}

function checkHeadings(content: string, keywords: string[]): boolean {
  const headings = content.match(/#{1,6}\s+.+/g) || []
  const headingText = headings.join(' ').toLowerCase()
  return keywords.some(kw => headingText.includes(kw.toLowerCase()))
}

function checkConclusion(content: string, keywords: string[]): boolean {
  const lastParagraph = content.split('\n\n').slice(-1)[0] || content.slice(-200)
  return keywords.some(kw => lastParagraph.toLowerCase().includes(kw.toLowerCase()))
}

function generateKeywordSuggestions(content: string, targetKeywords: string[]): string[] {
  const belizeKeywords = [
    'belize travel', 'central america', 'caribbean sea', 'maya ruins',
    'barrier reef', 'adventure tours', 'eco tourism', 'tropical paradise',
    'snorkeling', 'diving', 'rainforest', 'wildlife watching'
  ]
  
  return belizeKeywords.filter(kw => 
    !targetKeywords.includes(kw) && 
    !content.toLowerCase().includes(kw.toLowerCase())
  ).slice(0, 5)
}

function countSyllables(text: string): number {
  return text.toLowerCase()
    .replace(/[^a-z]/g, '')
    .replace(/[aeiouy]+/g, 'a')
    .replace(/[^a]/g, '')
    .length || 1
}

function getGradeLevel(fleschScore: number): string {
  if (fleschScore >= 90) return '5th grade'
  if (fleschScore >= 80) return '6th grade'
  if (fleschScore >= 70) return '7th grade'
  if (fleschScore >= 60) return '8th-9th grade'
  if (fleschScore >= 50) return '10th-12th grade'
  if (fleschScore >= 30) return 'College level'
  return 'Graduate level'
}

function countPassiveVoice(content: string): number {
  const passiveIndicators = [
    /\bwas\s+\w+ed\b/gi,
    /\bwere\s+\w+ed\b/gi,
    /\bbeen\s+\w+ed\b/gi,
    /\bis\s+\w+ed\b/gi,
    /\bare\s+\w+ed\b/gi
  ]
  
  let count = 0
  passiveIndicators.forEach(pattern => {
    const matches = content.match(pattern)
    if (matches) count += matches.length
  })
  
  return count
}

function countTransitionWords(content: string, language: string): number {
  const transitionWords = language === 'fr' ? [
    'également', 'aussi', 'en outre', 'de plus', 'par ailleurs',
    'cependant', 'néanmoins', 'toutefois', 'en revanche',
    'donc', 'ainsi', 'par conséquent', 'en effet'
  ] : [
    'however', 'therefore', 'moreover', 'furthermore', 'additionally',
    'consequently', 'meanwhile', 'nevertheless', 'nonetheless',
    'indeed', 'thus', 'hence', 'accordingly'
  ]
  
  const contentLower = content.toLowerCase()
  return transitionWords.filter(word => 
    contentLower.includes(word.toLowerCase())
  ).length
}

function generateSEORecommendations(
  keywordAnalysis: KeywordAnalysis,
  readabilityAnalysis: ReadabilityAnalysis,
  technicalSEO: TechnicalSEOAnalysis
): SEORecommendation[] {
  const recommendations: SEORecommendation[] = []

  // Title length recommendations
  if (technicalSEO.titleLength < 30) {
    recommendations.push({
      type: 'warning',
      category: 'technical',
      issue: 'Title is too short',
      solution: 'Expand title to 30-60 characters for better SEO',
      impact: 'medium'
    })
  } else if (technicalSEO.titleLength > 60) {
    recommendations.push({
      type: 'critical',
      category: 'technical',
      issue: 'Title is too long',
      solution: 'Reduce title to under 60 characters to prevent truncation',
      impact: 'high'
    })
  }

  // Keyword recommendations
  if (keywordAnalysis.missingKeywords.length > 0) {
    recommendations.push({
      type: 'warning',
      category: 'keywords',
      issue: `Missing target keywords: ${keywordAnalysis.missingKeywords.join(', ')}`,
      solution: 'Include these keywords naturally in your content',
      impact: 'high'
    })
  }

  if (keywordAnalysis.overOptimized.length > 0) {
    recommendations.push({
      type: 'critical',
      category: 'keywords',
      issue: `Over-optimized keywords: ${keywordAnalysis.overOptimized.join(', ')}`,
      solution: 'Reduce keyword density to 1-3% to avoid penalties',
      impact: 'high'
    })
  }

  // Readability recommendations
  if (readabilityAnalysis.fleschScore < 30) {
    recommendations.push({
      type: 'warning',
      category: 'readability',
      issue: 'Content is difficult to read',
      solution: 'Use shorter sentences and simpler words',
      impact: 'medium'
    })
  }

  return recommendations
}

function calculateSEOScore(
  keywordAnalysis: KeywordAnalysis,
  readabilityAnalysis: ReadabilityAnalysis,
  technicalSEO: TechnicalSEOAnalysis
): number {
  let score = 100

  // Deduct points for issues
  if (!keywordAnalysis.keywordDistribution.title) score -= 15
  if (!keywordAnalysis.keywordDistribution.firstParagraph) score -= 10
  if (keywordAnalysis.missingKeywords.length > 0) score -= keywordAnalysis.missingKeywords.length * 5
  if (keywordAnalysis.overOptimized.length > 0) score -= keywordAnalysis.overOptimized.length * 10
  
  if (technicalSEO.titleLength < 30 || technicalSEO.titleLength > 60) score -= 10
  if (technicalSEO.metaDescriptionLength < 120 || technicalSEO.metaDescriptionLength > 160) score -= 8
  
  if (readabilityAnalysis.fleschScore < 30) score -= 15
  if (readabilityAnalysis.passiveVoicePercentage > 25) score -= 5

  return Math.max(0, Math.min(100, Math.round(score)))
}

function generateOptimizedContent(title: string, content: string, targetKeywords: string[]): OptimizedContent {
  return {
    title: optimizeTitle(title, targetKeywords),
    metaDescription: generateMetaDescription(content, targetKeywords),
    suggestedHeadings: generateHeadingSuggestions(content, targetKeywords),
    internalLinks: [],
    schemaMarkup: generateSchemaMarkup(title, content)
  }
}

function optimizeTitle(title: string, keywords: string[]): string {
  if (keywords.length === 0) return title
  
  const primaryKeyword = keywords[0]
  if (!title.toLowerCase().includes(primaryKeyword.toLowerCase())) {
    return `${title} | ${primaryKeyword}`
  }
  
  return title
}

function generateMetaDescription(content: string, keywords: string[]): string {
  const firstSentence = content.split('.')[0] + '.'
  const primaryKeyword = keywords[0] || ''
  
  let metaDesc = firstSentence
  if (primaryKeyword && !metaDesc.toLowerCase().includes(primaryKeyword.toLowerCase())) {
    metaDesc = `${primaryKeyword}: ${metaDesc}`
  }
  
  if (metaDesc.length > 160) {
    metaDesc = metaDesc.substring(0, 157) + '...'
  }
  
  return metaDesc
}

function generateHeadingSuggestions(content: string, keywords: string[]): string[] {
  return [
    `What Makes ${keywords[0] || 'This Experience'} Special?`,
    `Planning Your ${keywords[0] || 'Adventure'}`,
    `What to Expect`,
    `Best Time to Visit`
  ]
}

function generateSchemaMarkup(title: string, content: string): any {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": content.substring(0, 200),
    "author": {
      "@type": "Organization",
      "name": "Belize Solo Vibes"
    }
  }
}

function analyzeHeadingStructure(content: string): HeadingStructure {
  const h1Count = (content.match(/^#\s+/gm) || []).length
  const h2Count = (content.match(/^##\s+/gm) || []).length
  const h3Count = (content.match(/^###\s+/gm) || []).length
  
  const issues: string[] = []
  let hasProperHierarchy = true
  
  if (h1Count === 0) {
    issues.push('Missing H1 heading')
    hasProperHierarchy = false
  }

  return { h1Count, h2Count, h3Count, hasProperHierarchy, issues }
}

function findInternalLinkOpportunities(content: string): string[] {
  const opportunities = [
    'adventure tours', 'belize adventures', 'tour packages',
    'booking', 'contact us', 'safety guidelines'
  ]
  
  const contentLower = content.toLowerCase()
  return opportunities.filter(opportunity => 
    contentLower.includes(opportunity.toLowerCase())
  )
}

function analyzeImageSEO(content: string): ImageSEOAnalysis[] {
  return [{
    hasAltText: false,
    altTextQuality: 'missing',
    hasCaption: false,
    isOptimized: false,
    suggestions: ['Add descriptive alt text', 'Include image captions', 'Optimize image file size']
  }]
}

function generateReadabilityRecommendations(
  fleschScore: number,
  avgSentenceLength: number,
  passiveVoicePercentage: number,
  transitionWords: number
): string[] {
  const recommendations: string[] = []
  
  if (fleschScore < 30) {
    recommendations.push('Use shorter sentences and simpler vocabulary')
  }
  
  if (avgSentenceLength > 20) {
    recommendations.push('Break up long sentences for better readability')
  }
  
  if (passiveVoicePercentage > 20) {
    recommendations.push('Use more active voice to engage readers')
  }
  
  if (transitionWords < 3) {
    recommendations.push('Add transition words to improve flow')
  }
  
  return recommendations
}

/* To deploy this function, run:
supabase functions deploy analyze-blog-seo */