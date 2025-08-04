// Debug language detection - paste this in browser console on blog page
console.log('=== LANGUAGE DEBUG ===');
console.log('i18n.language:', window.i18n?.language);
console.log('i18n.languages:', window.i18n?.languages);
console.log('Browser language:', navigator.language);
console.log('Browser languages:', navigator.languages);
console.log('Document lang:', document.documentElement.lang);

// Test the getTranslatedContent logic
const testPost = {
  title: "A Week in San Ignacio: Your Solo Travel Guide",
  title_fr: "Une Semaine à San Ignacio : Guide de Voyage Solo",
  excerpt: "Discover Belize...",
  excerpt_fr: "Découvrez le Belize..."
};

const currentLanguage = window.i18n?.language;
console.log('Current language detected:', currentLanguage);

const isFrench = currentLanguage === 'fr-CA';
console.log('Is French (fr-CA check):', isFrench);

const isFrenchLoose = currentLanguage?.startsWith('fr');
console.log('Is French (loose check):', isFrenchLoose);

const translatedContent = {
  title: (isFrench && testPost.title_fr) ? testPost.title_fr : testPost.title,
  excerpt: (isFrench && testPost.excerpt_fr) ? testPost.excerpt_fr : testPost.excerpt
};

console.log('Translated content result:', translatedContent);
console.log('Expected French title:', testPost.title_fr);
console.log('Getting French title?', translatedContent.title === testPost.title_fr);