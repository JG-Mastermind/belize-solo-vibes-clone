import { enUS } from 'date-fns/locale/en-US';
import { frCA } from 'date-fns/locale/fr-CA';
import i18n from './i18n';

/**
 * Get the appropriate date-fns locale based on the current i18n language
 */
export const getDateFnsLocale = () => {
  const currentLanguage = i18n.language;
  
  switch (currentLanguage) {
    case 'fr-CA':
      return frCA;
    case 'en':
    default:
      return enUS;
  }
};

/**
 * Available locales mapping
 */
export const AVAILABLE_LOCALES = {
  'en': enUS,
  'fr-CA': frCA,
} as const;

export type SupportedLocale = keyof typeof AVAILABLE_LOCALES;