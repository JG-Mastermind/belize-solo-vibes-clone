// AI-powered content generation utilities
export { generateAdventureImage } from './generateImage';
export { generateAdventureDescription } from './generateDescription';

// AI-powered blog content generation
export { generateBlogContent } from './generateBlogContent';
export { generateBlogImage } from './generateBlogImage';
export { analyzeBlogSEO } from './generateBlogSEO';

// Type definitions for AI-generated content
export interface AIGeneratedContent {
  image: string;
  description: string;
}

// Blog-specific exports
export type {
  BlogContentRequest,
  GeneratedBlogContent
} from './generateBlogContent';

export type {
  BlogImageRequest,
  GeneratedBlogImage
} from './generateBlogImage';

export type {
  SEOAnalysisRequest,
  SEOAnalysisResult,
  SEORecommendation,
  KeywordAnalysis,
  ReadabilityAnalysis,
  TechnicalSEOAnalysis,
  OptimizedContent
} from './generateBlogSEO';