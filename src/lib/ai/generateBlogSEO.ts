// Advanced SEO analysis and optimization for blog content
import { supabase } from '@/integrations/supabase/client';

export interface SEOAnalysisRequest {
  title: string;
  content: string;
  excerpt: string;
  targetKeywords: string[];
  language?: 'en' | 'fr';
  competitorUrls?: string[];
}

export interface SEOAnalysisResult {
  score: number; // 0-100
  recommendations: SEORecommendation[];
  keywordAnalysis: KeywordAnalysis;
  readabilityAnalysis: ReadabilityAnalysis;
  technicalSEO: TechnicalSEOAnalysis;
  optimizedContent: OptimizedContent;
}

export interface SEORecommendation {
  type: 'critical' | 'warning' | 'suggestion';
  category: 'keywords' | 'content' | 'technical' | 'readability';
  issue: string;
  solution: string;
  impact: 'high' | 'medium' | 'low';
}

export interface KeywordAnalysis {
  primaryKeyword: string;
  keywordDensity: { [keyword: string]: number };
  keywordDistribution: KeywordDistribution;
  missingKeywords: string[];
  overOptimized: string[];
  suggestions: string[];
}

export interface KeywordDistribution {
  title: boolean;
  firstParagraph: boolean;
  headings: boolean;
  conclusion: boolean;
  metaDescription: boolean;
}

export interface ReadabilityAnalysis {
  fleschScore: number;
  gradeLevel: string;
  averageSentenceLength: number;
  passiveVoicePercentage: number;
  transitionWords: number;
  recommendations: string[];
}

export interface TechnicalSEOAnalysis {
  titleLength: number;
  metaDescriptionLength: number;
  headingStructure: HeadingStructure;
  internalLinkOpportunities: string[];
  imageOptimization: ImageSEOAnalysis[];
}

export interface HeadingStructure {
  h1Count: number;
  h2Count: number;
  h3Count: number;
  hasProperHierarchy: boolean;
  issues: string[];
}

export interface ImageSEOAnalysis {
  hasAltText: boolean;
  altTextQuality: 'good' | 'poor' | 'missing';
  hasCaption: boolean;
  isOptimized: boolean;
  suggestions: string[];
}

export interface OptimizedContent {
  title: string;
  metaDescription: string;
  suggestedHeadings: string[];
  internalLinks: InternalLinkSuggestion[];
  schemaMarkup: any;
}

export interface InternalLinkSuggestion {
  anchorText: string;
  targetUrl: string;
  relevanceScore: number;
  position: number;
}

// Main SEO analysis function
export async function analyzeBlogSEO(request: SEOAnalysisRequest): Promise<SEOAnalysisResult> {
  const {
    title,
    content,
    excerpt,
    targetKeywords,
    language = 'en',
    competitorUrls = []
  } = request;

  try {
    // Call Supabase Edge Function for advanced SEO analysis
    const { data, error } = await supabase.functions.invoke('analyze-blog-seo', {
      body: {
        title,
        content,
        excerpt,
        targetKeywords,
        language,
        competitorUrls,
        belizeContext: true,
        industryFocus: 'travel-tourism'
      }
    });

    if (error) {
      console.warn('AI SEO analysis failed, using local analysis:', error);
      return performLocalSEOAnalysis(request);
    }

    return data;

  } catch (error) {
    console.error('Error in SEO analysis:', error);
    return performLocalSEOAnalysis(request);
  }
}

// Comprehensive local SEO analysis as fallback
function performLocalSEOAnalysis(request: SEOAnalysisRequest): SEOAnalysisResult {
  const { title, content, excerpt, targetKeywords, language } = request;
  
  // Analyze keywords
  const keywordAnalysis = analyzeKeywords(title, content, excerpt, targetKeywords);
  
  // Analyze readability
  const readabilityAnalysis = analyzeReadability(content, language);
  
  // Analyze technical SEO
  const technicalSEO = analyzeTechnicalSEO(title, content, excerpt);
  
  // Generate recommendations
  const recommendations = generateSEORecommendations(
    keywordAnalysis,
    readabilityAnalysis,
    technicalSEO
  );
  
  // Calculate overall score
  const score = calculateSEOScore(keywordAnalysis, readabilityAnalysis, technicalSEO);
  
  // Generate optimized content
  const optimizedContent = generateOptimizedContent(title, content, targetKeywords);

  return {
    score,
    recommendations,
    keywordAnalysis,
    readabilityAnalysis,
    technicalSEO,
    optimizedContent
  };
}

function analyzeKeywords(title: string, content: string, excerpt: string, targetKeywords: string[]): KeywordAnalysis {
  const fullText = `${title} ${excerpt} ${content}`.toLowerCase();
  const words = fullText.split(/\s+/);
  const totalWords = words.length;
  
  // Calculate keyword density
  const keywordDensity: { [keyword: string]: number } = {};
  targetKeywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    const occurrences = (fullText.match(new RegExp(keywordLower, 'g')) || []).length;
    keywordDensity[keyword] = Math.round((occurrences / totalWords) * 100 * 100) / 100;
  });

  // Analyze keyword distribution
  const keywordDistribution: KeywordDistribution = {
    title: targetKeywords.some(kw => title.toLowerCase().includes(kw.toLowerCase())),
    firstParagraph: checkFirstParagraph(content, targetKeywords),
    headings: checkHeadings(content, targetKeywords),
    conclusion: checkConclusion(content, targetKeywords),
    metaDescription: targetKeywords.some(kw => excerpt.toLowerCase().includes(kw.toLowerCase()))
  };

  // Find missing and over-optimized keywords
  const missingKeywords = targetKeywords.filter(kw => keywordDensity[kw] === 0);
  const overOptimized = targetKeywords.filter(kw => keywordDensity[kw] > 3);

  // Generate keyword suggestions
  const suggestions = generateKeywordSuggestions(content, targetKeywords);

  return {
    primaryKeyword: targetKeywords[0] || '',
    keywordDensity,
    keywordDistribution,
    missingKeywords,
    overOptimized,
    suggestions
  };
}

function analyzeReadability(content: string, language: string): ReadabilityAnalysis {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = content.split(/\s+/).filter(w => w.length > 0);
  const syllables = countSyllables(content);
  
  // Calculate Flesch Reading Ease Score
  const avgSentenceLength = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;
  const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
  
  // Determine grade level
  const gradeLevel = getGradeLevel(Math.max(0, Math.min(100, fleschScore)));
  
  // Analyze passive voice
  const passiveVoiceCount = countPassiveVoice(content);
  const passiveVoicePercentage = (passiveVoiceCount / sentences.length) * 100;
  
  // Count transition words
  const transitionWords = countTransitionWords(content, language);
  
  // Generate readability recommendations
  const recommendations = generateReadabilityRecommendations(
    fleschScore,
    avgSentenceLength,
    passiveVoicePercentage,
    transitionWords
  );

  return {
    fleschScore: Math.round(Math.max(0, Math.min(100, fleschScore))),
    gradeLevel,
    averageSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    passiveVoicePercentage: Math.round(passiveVoicePercentage * 10) / 10,
    transitionWords,
    recommendations
  };
}

function analyzeTechnicalSEO(title: string, content: string, excerpt: string): TechnicalSEOAnalysis {
  // Analyze title length
  const titleLength = title.length;
  
  // Analyze meta description length
  const metaDescriptionLength = excerpt.length;
  
  // Analyze heading structure
  const headingStructure = analyzeHeadingStructure(content);
  
  // Find internal link opportunities
  const internalLinkOpportunities = findInternalLinkOpportunities(content);
  
  // Analyze image optimization
  const imageOptimization = analyzeImageSEO(content);

  return {
    titleLength,
    metaDescriptionLength,
    headingStructure,
    internalLinkOpportunities,
    imageOptimization
  };
}

function generateSEORecommendations(
  keywordAnalysis: KeywordAnalysis,
  readabilityAnalysis: ReadabilityAnalysis,
  technicalSEO: TechnicalSEOAnalysis
): SEORecommendation[] {
  const recommendations: SEORecommendation[] = [];

  // Title length recommendations
  if (technicalSEO.titleLength < 30) {
    recommendations.push({
      type: 'warning',
      category: 'technical',
      issue: 'Title is too short',
      solution: 'Expand title to 30-60 characters for better SEO',
      impact: 'medium'
    });
  } else if (technicalSEO.titleLength > 60) {
    recommendations.push({
      type: 'critical',
      category: 'technical',
      issue: 'Title is too long',
      solution: 'Reduce title to under 60 characters to prevent truncation',
      impact: 'high'
    });
  }

  // Meta description recommendations
  if (technicalSEO.metaDescriptionLength < 120) {
    recommendations.push({
      type: 'warning',
      category: 'technical',
      issue: 'Meta description is too short',
      solution: 'Expand meta description to 120-160 characters',
      impact: 'medium'
    });
  } else if (technicalSEO.metaDescriptionLength > 160) {
    recommendations.push({
      type: 'critical',
      category: 'technical',
      issue: 'Meta description is too long',
      solution: 'Reduce meta description to under 160 characters',
      impact: 'high'
    });
  }

  // Keyword recommendations
  if (keywordAnalysis.missingKeywords.length > 0) {
    recommendations.push({
      type: 'warning',
      category: 'keywords',
      issue: `Missing target keywords: ${keywordAnalysis.missingKeywords.join(', ')}`,
      solution: 'Include these keywords naturally in your content',
      impact: 'high'
    });
  }

  if (keywordAnalysis.overOptimized.length > 0) {
    recommendations.push({
      type: 'critical',
      category: 'keywords',
      issue: `Over-optimized keywords: ${keywordAnalysis.overOptimized.join(', ')}`,
      solution: 'Reduce keyword density to 1-3% to avoid penalties',
      impact: 'high'
    });
  }

  // Readability recommendations
  if (readabilityAnalysis.fleschScore < 30) {
    recommendations.push({
      type: 'warning',
      category: 'readability',
      issue: 'Content is difficult to read',
      solution: 'Use shorter sentences and simpler words',
      impact: 'medium'
    });
  }

  if (readabilityAnalysis.passiveVoicePercentage > 20) {
    recommendations.push({
      type: 'suggestion',
      category: 'readability',
      issue: 'High percentage of passive voice',
      solution: 'Use more active voice for better engagement',
      impact: 'low'
    });
  }

  // Heading structure recommendations
  if (!technicalSEO.headingStructure.hasProperHierarchy) {
    recommendations.push({
      type: 'warning',
      category: 'technical',
      issue: 'Improper heading hierarchy',
      solution: 'Use headings in proper order (H1, H2, H3, etc.)',
      impact: 'medium'
    });
  }

  return recommendations;
}

function calculateSEOScore(
  keywordAnalysis: KeywordAnalysis,
  readabilityAnalysis: ReadabilityAnalysis,
  technicalSEO: TechnicalSEOAnalysis
): number {
  let score = 100;

  // Deduct points for issues
  if (!keywordAnalysis.keywordDistribution.title) score -= 15;
  if (!keywordAnalysis.keywordDistribution.firstParagraph) score -= 10;
  if (keywordAnalysis.missingKeywords.length > 0) score -= keywordAnalysis.missingKeywords.length * 5;
  if (keywordAnalysis.overOptimized.length > 0) score -= keywordAnalysis.overOptimized.length * 10;
  
  if (technicalSEO.titleLength < 30 || technicalSEO.titleLength > 60) score -= 10;
  if (technicalSEO.metaDescriptionLength < 120 || technicalSEO.metaDescriptionLength > 160) score -= 8;
  if (!technicalSEO.headingStructure.hasProperHierarchy) score -= 5;
  
  if (readabilityAnalysis.fleschScore < 30) score -= 15;
  if (readabilityAnalysis.passiveVoicePercentage > 25) score -= 5;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function generateOptimizedContent(title: string, content: string, targetKeywords: string[]): OptimizedContent {
  // Generate optimized title
  const optimizedTitle = optimizeTitle(title, targetKeywords);
  
  // Generate optimized meta description
  const metaDescription = generateMetaDescription(content, targetKeywords);
  
  // Suggest headings
  const suggestedHeadings = generateHeadingSuggestions(content, targetKeywords);
  
  // Suggest internal links
  const internalLinks = generateInternalLinkSuggestions(content);
  
  // Generate schema markup
  const schemaMarkup = generateSchemaMarkup(title, content);

  return {
    title: optimizedTitle,
    metaDescription,
    suggestedHeadings,
    internalLinks,
    schemaMarkup
  };
}

// Helper functions
function checkFirstParagraph(content: string, keywords: string[]): boolean {
  const firstParagraph = content.split('\n\n')[0] || content.substring(0, 200);
  return keywords.some(kw => firstParagraph.toLowerCase().includes(kw.toLowerCase()));
}

function checkHeadings(content: string, keywords: string[]): boolean {
  const headings = content.match(/#{1,6}\s+.+/g) || [];
  const headingText = headings.join(' ').toLowerCase();
  return keywords.some(kw => headingText.includes(kw.toLowerCase()));
}

function checkConclusion(content: string, keywords: string[]): boolean {
  const lastParagraph = content.split('\n\n').slice(-1)[0] || content.slice(-200);
  return keywords.some(kw => lastParagraph.toLowerCase().includes(kw.toLowerCase()));
}

function generateKeywordSuggestions(content: string, targetKeywords: string[]): string[] {
  // Belize travel-specific keyword suggestions
  const belizeKeywords = [
    'belize travel', 'central america', 'caribbean sea', 'maya ruins',
    'barrier reef', 'adventure tours', 'eco tourism', 'tropical paradise',
    'snorkeling', 'diving', 'rainforest', 'wildlife watching'
  ];
  
  return belizeKeywords.filter(kw => 
    !targetKeywords.includes(kw) && 
    !content.toLowerCase().includes(kw.toLowerCase())
  ).slice(0, 5);
}

function countSyllables(text: string): number {
  return text.toLowerCase()
    .replace(/[^a-z]/g, '')
    .replace(/[aeiouy]+/g, 'a')
    .replace(/[^a]/g, '')
    .length || 1;
}

function getGradeLevel(fleschScore: number): string {
  if (fleschScore >= 90) return '5th grade';
  if (fleschScore >= 80) return '6th grade';
  if (fleschScore >= 70) return '7th grade';
  if (fleschScore >= 60) return '8th-9th grade';
  if (fleschScore >= 50) return '10th-12th grade';
  if (fleschScore >= 30) return 'College level';
  return 'Graduate level';
}

function countPassiveVoice(content: string): number {
  const passiveIndicators = [
    /\bwas\s+\w+ed\b/gi,
    /\bwere\s+\w+ed\b/gi,
    /\bbeen\s+\w+ed\b/gi,
    /\bis\s+\w+ed\b/gi,
    /\bare\s+\w+ed\b/gi
  ];
  
  let count = 0;
  passiveIndicators.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) count += matches.length;
  });
  
  return count;
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
  ];
  
  const contentLower = content.toLowerCase();
  return transitionWords.filter(word => 
    contentLower.includes(word.toLowerCase())
  ).length;
}

function generateReadabilityRecommendations(
  fleschScore: number,
  avgSentenceLength: number,
  passiveVoicePercentage: number,
  transitionWords: number
): string[] {
  const recommendations: string[] = [];
  
  if (fleschScore < 30) {
    recommendations.push('Use shorter sentences and simpler vocabulary');
  }
  
  if (avgSentenceLength > 20) {
    recommendations.push('Break up long sentences for better readability');
  }
  
  if (passiveVoicePercentage > 20) {
    recommendations.push('Use more active voice to engage readers');
  }
  
  if (transitionWords < 3) {
    recommendations.push('Add transition words to improve flow');
  }
  
  return recommendations;
}

function analyzeHeadingStructure(content: string): HeadingStructure {
  const h1Matches = content.match(/^#\s+/gm) || [];
  const h2Matches = content.match(/^##\s+/gm) || [];
  const h3Matches = content.match(/^###\s+/gm) || [];
  
  const h1Count = h1Matches.length;
  const h2Count = h2Matches.length;
  const h3Count = h3Matches.length;
  
  const issues: string[] = [];
  let hasProperHierarchy = true;
  
  if (h1Count === 0) {
    issues.push('Missing H1 heading');
    hasProperHierarchy = false;
  }
  
  if (h1Count > 1) {
    issues.push('Multiple H1 headings found');
    hasProperHierarchy = false;
  }
  
  if (h2Count === 0 && content.length > 500) {
    issues.push('Long content should have H2 subheadings');
    hasProperHierarchy = false;
  }

  return {
    h1Count,
    h2Count,
    h3Count,
    hasProperHierarchy,
    issues
  };
}

function findInternalLinkOpportunities(content: string): string[] {
  // Common Belize Solo Vibes internal link opportunities
  const linkOpportunities = [
    'adventure tours', 'belize adventures', 'tour packages',
    'booking', 'contact us', 'about us', 'safety guidelines',
    'travel tips', 'what to pack', 'best time to visit'
  ];
  
  const contentLower = content.toLowerCase();
  return linkOpportunities.filter(opportunity => 
    contentLower.includes(opportunity.toLowerCase())
  );
}

function analyzeImageSEO(content: string): ImageSEOAnalysis[] {
  // This would analyze images in the content
  // For now, return a placeholder analysis
  return [{
    hasAltText: false,
    altTextQuality: 'missing',
    hasCaption: false,
    isOptimized: false,
    suggestions: ['Add descriptive alt text', 'Include image captions', 'Optimize image file size']
  }];
}

function optimizeTitle(title: string, keywords: string[]): string {
  if (keywords.length === 0) return title;
  
  const primaryKeyword = keywords[0];
  if (!title.toLowerCase().includes(primaryKeyword.toLowerCase())) {
    return `${title} | ${primaryKeyword}`;
  }
  
  return title;
}

function generateMetaDescription(content: string, keywords: string[]): string {
  const firstSentence = content.split('.')[0] + '.';
  const primaryKeyword = keywords[0] || '';
  
  let metaDesc = firstSentence;
  if (primaryKeyword && !metaDesc.toLowerCase().includes(primaryKeyword.toLowerCase())) {
    metaDesc = `${primaryKeyword}: ${metaDesc}`;
  }
  
  // Ensure it's within optimal length
  if (metaDesc.length > 160) {
    metaDesc = metaDesc.substring(0, 157) + '...';
  }
  
  return metaDesc;
}

function generateHeadingSuggestions(content: string, keywords: string[]): string[] {
  const suggestions = [
    `What Makes ${keywords[0] || 'This Experience'} Special?`,
    `Planning Your ${keywords[0] || 'Adventure'}`,
    `What to Expect`,
    `Tips for First-Time Visitors`,
    `Best Time to Visit`,
    `How to Book Your Experience`
  ];
  
  return suggestions.slice(0, 4);
}

function generateInternalLinkSuggestions(content: string): InternalLinkSuggestion[] {
  // This would analyze content and suggest relevant internal links
  return [
    {
      anchorText: 'adventure tours',
      targetUrl: '/adventures',
      relevanceScore: 0.9,
      position: 100
    },
    {
      anchorText: 'book now',
      targetUrl: '/booking',
      relevanceScore: 0.8,
      position: 200
    }
  ];
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
    },
    "publisher": {
      "@type": "Organization",
      "name": "Belize Solo Vibes"
    }
  };
}