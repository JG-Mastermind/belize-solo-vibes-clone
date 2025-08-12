/**
 * Translation utilities for common text transformations
 */

/**
 * Translates reading time from English to French
 * @param readingTime - The reading time string (e.g., "7 min read")
 * @param currentLanguage - The current language code
 * @returns Translated reading time string
 */
export const getTranslatedReadingTime = (readingTime: string, currentLanguage: string): string => {
  const isFrench = currentLanguage === 'fr-CA';
  
  if (!isFrench) return readingTime;
  
  // Extract number from reading time (e.g., "7 min read" -> "7")
  const timeMatch = readingTime.match(/(\d+)\s*min\s*read/i);
  if (timeMatch) {
    const minutes = timeMatch[1];
    return `${minutes} min de lecture`;
  }
  
  // Fallback: simple replacement
  return readingTime.replace(/min read/i, 'min de lecture');
};