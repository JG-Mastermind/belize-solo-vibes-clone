import { useState } from 'react';
import { getTranslationService, TranslationResult } from '@/services/translationService';

export interface UseTranslationReturn {
  translateText: (
    text: string,
    targetLanguage: 'en' | 'fr',
    contentType?: 'title' | 'excerpt' | 'content'
  ) => Promise<string>;
  translateBlogPost: (
    blogPost: {
      title: string;
      excerpt: string;
      content: string;
    },
    targetLanguage: 'en' | 'fr'
  ) => Promise<{
    title: string;
    excerpt: string;
    content: string;
  }>;
  isTranslating: boolean;
  translationError: string | null;
  clearError: () => void;
}

export const useTranslation = (): UseTranslationReturn => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  const translateText = async (
    text: string,
    targetLanguage: 'en' | 'fr',
    contentType: 'title' | 'excerpt' | 'content' = 'content'
  ): Promise<string> => {
    if (!text.trim()) {
      throw new Error('No text provided for translation');
    }

    setIsTranslating(true);
    setTranslationError(null);

    try {
      const service = getTranslationService();
      const result = await service.translateText(text, targetLanguage, contentType);
      return result.translatedText;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Translation failed';
      setTranslationError(errorMessage);
      throw error;
    } finally {
      setIsTranslating(false);
    }
  };

  const translateBlogPost = async (
    blogPost: {
      title: string;
      excerpt: string;
      content: string;
    },
    targetLanguage: 'en' | 'fr'
  ) => {
    setIsTranslating(true);
    setTranslationError(null);

    try {
      const service = getTranslationService();
      const result = await service.translateBlogPost(blogPost, targetLanguage);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Translation failed';
      setTranslationError(errorMessage);
      throw error;
    } finally {
      setIsTranslating(false);
    }
  };

  const clearError = () => {
    setTranslationError(null);
  };

  return {
    translateText,
    translateBlogPost,
    isTranslating,
    translationError,
    clearError
  };
};