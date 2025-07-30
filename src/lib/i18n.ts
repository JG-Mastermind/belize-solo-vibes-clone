import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr-ca'],
    
    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },

    resources: {
      en: {
        navigation: {
          home: 'Home',
          adventures: 'Adventures',
          reviews: 'Reviews',
          about: 'About',
          blog: 'Blog',
          safety: 'Safety',
          contact: 'Contact',
        },
        common: {
          signIn: 'Sign In',
          signUp: 'Sign Up',
          bookNow: 'Book Now',
          learnMore: 'Learn More',
        }
      },
      'fr-ca': {
        navigation: {
          home: 'Accueil',
          adventures: 'Aventures',
          reviews: 'Avis',
          about: 'À Propos',
          blog: 'Blog',
          safety: 'Sécurité',
          contact: 'Contact',
        },
        common: {
          signIn: 'Se Connecter',
          signUp: 'S\'Inscrire',
          bookNow: 'Réserver',
          learnMore: 'En Savoir Plus',
        }
      }
    }
  });

export default i18n;