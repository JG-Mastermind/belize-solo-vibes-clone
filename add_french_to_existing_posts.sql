-- Add French translations to existing English blog posts
-- Run this to translate your existing blog posts

-- First, let's see what posts exist without French translations
SELECT 
  id,
  title,
  slug,
  CASE WHEN title_fr IS NOT NULL THEN 'HAS FRENCH' ELSE 'NEEDS FRENCH' END as french_status
FROM posts 
ORDER BY created_at DESC;

-- Update existing posts with French translations
-- (Replace these with actual French translations of your real content)

-- Example: Update posts that don't have French translations yet
UPDATE posts 
SET 
  title_fr = CASE 
    WHEN title LIKE '%Cave%' THEN 'Aventures de Tubing en Grotte au Belize'
    WHEN title LIKE '%Maya%' THEN 'Exploration des Ruines Maya au Belize'
    WHEN title LIKE '%Snorkel%' THEN 'Plongée avec Tuba au Belize'
    WHEN title LIKE '%Wildlife%' THEN 'Observation de la Faune au Belize'
    WHEN title LIKE '%Blue Hole%' THEN 'Plongée au Blue Hole du Belize'
    WHEN title LIKE '%Jungle%' THEN 'Aventures en Jungle au Belize'
    WHEN title LIKE '%Beach%' THEN 'Détente sur les Plages du Belize'
    WHEN title LIKE '%Fishing%' THEN 'Pêche Sportive au Belize'
    ELSE CONCAT('Guide de Voyage: ', title)
  END,
  excerpt_fr = CASE 
    WHEN excerpt LIKE '%cave%' THEN 'Découvrez les mystérieuses grottes du Belize avec nos guides experts pour une aventure inoubliable.'
    WHEN excerpt LIKE '%Maya%' THEN 'Explorez les anciennes ruines Maya et découvrez l''histoire fascinante de cette civilisation.'
    WHEN excerpt LIKE '%snorkel%' THEN 'Plongez dans les eaux cristallines du Belize et découvrez la vie marine tropicale.'
    WHEN excerpt LIKE '%wildlife%' THEN 'Observez la faune extraordinaire du Belize dans son habitat naturel.'
    WHEN excerpt LIKE '%Blue Hole%' THEN 'Plongez dans le célèbre Blue Hole, l''une des merveilles naturelles du monde.'
    WHEN excerpt LIKE '%jungle%' THEN 'Explorez la jungle luxuriante du Belize et découvrez sa biodiversité unique.'
    WHEN excerpt LIKE '%beach%' THEN 'Détendez-vous sur les plages paradisiaques du Belize avec du sable blanc et des eaux turquoise.'
    WHEN excerpt LIKE '%fishing%' THEN 'Profitez d''une expérience de pêche sportive exceptionnelle dans les eaux du Belize.'
    ELSE 'Découvrez les merveilles du Belize avec nos guides experts pour une aventure solo inoubliable.'
  END,
  content_fr = CASE 
    WHEN content LIKE '%cave%' THEN '<h2>Aventures de Grotte</h2><p>Le Belize offre certaines des plus belles grottes au monde. Nos guides experts vous emmèneront dans un voyage à travers ces merveilles géologiques.</p>'
    WHEN content LIKE '%Maya%' THEN '<h2>Patrimoine Maya</h2><p>Découvrez l''histoire riche des civilisations Maya qui ont prospéré au Belize pendant des siècles.</p>'
    ELSE '<h2>Découvrez le Belize</h2><p>Le Belize est une destination extraordinaire pour les voyageurs solo à la recherche d''aventures authentiques.</p>'
  END
WHERE title_fr IS NULL OR title_fr = '';

-- Verify the updates
SELECT 
  title,
  title_fr,
  'UPDATED' as status
FROM posts 
WHERE title_fr IS NOT NULL 
ORDER BY created_at DESC;

SELECT COUNT(*) as total_posts_with_french FROM posts WHERE title_fr IS NOT NULL;