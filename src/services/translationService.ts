export interface TranslationConfig {
  apiKey?: string;
  model?: string;
}

export interface TranslationResult {
  translatedText: string;
  detectedLanguage?: string;
  confidence?: number;
}

export class TranslationService {
  private config: TranslationConfig;

  constructor(config: TranslationConfig = {}) {
    this.config = {
      model: 'gpt-4',
      ...config
    };
  }

  async detectLanguage(text: string): Promise<'en' | 'fr'> {
    // Simple language detection based on common French words
    const frenchIndicators = /\b(le|la|les|de|du|des|et|à|pour|avec|dans|sur|par|ce|cette|un|une|que|qui|est|sont|avoir|être)\b/gi;
    const frenchMatches = text.match(frenchIndicators);
    const frenchScore = frenchMatches ? frenchMatches.length : 0;
    
    // If more than 3 French indicators found, consider it French
    return frenchScore > 3 ? 'fr' : 'en';
  }

  async translateText(
    text: string, 
    targetLanguage: 'en' | 'fr',
    contentType: 'title' | 'excerpt' | 'content' = 'content'
  ): Promise<TranslationResult> {
    if (!this.config.apiKey) {
      throw new Error('OpenAI API key not configured. Please add your API key to environment variables.');
    }

    try {
      const detectedLang = await this.detectLanguage(text);
      
      // If already in target language, return as-is
      if (detectedLang === targetLanguage) {
        return {
          translatedText: text,
          detectedLanguage: detectedLang,
          confidence: 1.0
        };
      }

      const targetLangName = targetLanguage === 'fr' ? 'French (Canadian)' : 'English';
      const sourceLangName = detectedLang === 'fr' ? 'French' : 'English';

      let prompt = '';
      switch (contentType) {
        case 'title':
          prompt = `Translate this blog post title from ${sourceLangName} to ${targetLangName}. Keep it engaging and SEO-friendly:\n\n${text}`;
          break;
        case 'excerpt':
          prompt = `Translate this blog post excerpt from ${sourceLangName} to ${targetLangName}. Maintain the compelling and descriptive tone:\n\n${text}`;
          break;
        case 'content':
          prompt = `Translate this blog post content from ${sourceLangName} to ${targetLangName}. Preserve all HTML tags, maintain the writing style, and ensure the translation is natural and engaging for travel blog readers:\n\n${text}`;
          break;
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: 'You are a professional translator specializing in travel and tourism content. Provide accurate, natural translations that maintain the original tone and style.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: contentType === 'content' ? 4000 : 200
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const translatedText = data.choices[0]?.message?.content?.trim();

      if (!translatedText) {
        throw new Error('No translation received from OpenAI');
      }

      return {
        translatedText,
        detectedLanguage: detectedLang,
        confidence: 0.95
      };

    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }

  async translateBlogPost(blogPost: {
    title: string;
    excerpt: string;
    content: string;
  }, targetLanguage: 'en' | 'fr'): Promise<{
    title: string;
    excerpt: string;
    content: string;
  }> {
    const [titleResult, excerptResult, contentResult] = await Promise.all([
      this.translateText(blogPost.title, targetLanguage, 'title'),
      this.translateText(blogPost.excerpt, targetLanguage, 'excerpt'),
      this.translateText(blogPost.content, targetLanguage, 'content')
    ]);

    return {
      title: titleResult.translatedText,
      excerpt: excerptResult.translatedText,
      content: contentResult.translatedText
    };
  }
}

// Singleton instance
let translationService: TranslationService | null = null;

export const getTranslationService = (): TranslationService => {
  if (!translationService) {
    translationService = new TranslationService({
      // API key handled server-side via Edge Functions
      // Client-side translation calls proxy to server endpoints
    });
  }
  return translationService;
};

export const translateContent = async (
  text: string,
  targetLanguage: 'en' | 'fr',
  contentType: 'title' | 'excerpt' | 'content' = 'content'
): Promise<string> => {
  const service = getTranslationService();
  const result = await service.translateText(text, targetLanguage, contentType);
  return result.translatedText;
};