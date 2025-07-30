import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr-CA'],
    
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
        },
        hero: {
          title_part1: 'Discover Your Ultimate',
          title_part2: 'Belize Adventure',
          subtitle: 'Join solo-friendly adventures through pristine jungles, ancient caves, and crystal-clear waters. Expert guides, sustainable travel, unforgettable memories.',
          rating: '4.9/5 Rating',
          reviews: '500+ Reviews',
          soloFriendly: 'Solo Friendly',
          smallGroups: 'Small Groups',
          fullyInsured: 'Fully Insured',
          atolProtected: 'ATOL Protected',
          sustainable: 'Sustainable',
          ecoCertified: 'Eco-Certified',
          bookNowPrice: 'Book Now - $',
          loadingTours: 'Loading Tours...',
          featuredAdventure: 'Featured Adventure:',
        },
        adventureCards: {
          title: 'Choose Your Adventure',
          subtitle: 'From ancient Maya ruins to pristine coral reefs, discover the best of Belize with our carefully curated adventures designed for solo travelers and small groups.',
          highlights: 'Highlights:',
          viewAllAdventures: 'View All Adventures',
        }
      },
      'fr-CA': {
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
        },
        hero: {
          title_part1: 'Découvrez Votre Ultime',
          title_part2: 'Aventure au Belize',
          subtitle: 'Rejoignez des aventures solo-friendly à travers des jungles pristines, des grottes anciennes et des eaux cristallines. Guides experts, voyage durable, souvenirs inoubliables.',
          rating: 'Note 4.9/5',
          reviews: '500+ Avis',
          soloFriendly: 'Solo-Friendly',
          smallGroups: 'Petits Groupes',
          fullyInsured: 'Entièrement Assuré',
          atolProtected: 'Protection ATOL',
          sustainable: 'Durable',
          ecoCertified: 'Éco-Certifié',
          bookNowPrice: 'Réserver - $',
          loadingTours: 'Chargement des Tours...',
          featuredAdventure: 'Aventure Vedette:',
        },
        adventureCards: {
          title: 'Choisissez Votre Aventure',
          subtitle: 'Des ruines mayas anciennes aux récifs coralliens pristines, découvrez le meilleur du Belize avec nos aventures soigneusement sélectionnées pour les voyageurs solo et petits groupes.',
          highlights: 'Points Forts:',
          viewAllAdventures: 'Voir Toutes les Aventures',
        }
      }
    }
  });

export default i18n;