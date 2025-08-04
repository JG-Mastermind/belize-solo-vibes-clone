-- Fix bilingual title issue
-- Remove the mixed language titles created by CONCAT

-- First, let's see the problematic titles
SELECT title, title_fr FROM posts WHERE title_fr LIKE 'Guide de Voyage:%';

-- Fix the bilingual titles by removing the CONCAT prefix and creating proper French titles
UPDATE posts 
SET title_fr = CASE 
  WHEN title LIKE '%San Ignacio%' THEN 'Une Semaine à San Ignacio : Guide de Voyage Solo'
  WHEN title LIKE '%Cave%' THEN 'Aventures de Tubing en Grotte au Belize'
  WHEN title LIKE '%Maya%' THEN 'Exploration des Ruines Maya au Belize'
  WHEN title LIKE '%Snorkel%' THEN 'Plongée avec Tuba au Belize'
  WHEN title LIKE '%Wildlife%' THEN 'Observation de la Faune au Belize'
  WHEN title LIKE '%Blue Hole%' THEN 'Plongée au Blue Hole du Belize'
  WHEN title LIKE '%Jungle%' THEN 'Aventures en Jungle au Belize'
  WHEN title LIKE '%Beach%' THEN 'Détente sur les Plages du Belize'
  WHEN title LIKE '%Fishing%' THEN 'Pêche Sportive au Belize'
  WHEN title LIKE '%Caye Caulker%' THEN 'Découvrir Caye Caulker : Guide Complet'
  WHEN title LIKE '%Placencia%' THEN 'Aventures à Placencia : Guide de Voyage'
  WHEN title LIKE '%Caracol%' THEN 'Explorer Caracol : Ruines Maya Anciennes'
  ELSE REPLACE(title, 'Guide de Voyage: ', 'Guide de Voyage : ')
END
WHERE title_fr LIKE 'Guide de Voyage:%' OR title_fr LIKE '%: %';

-- Clean up any remaining mixed language issues
UPDATE posts 
SET title_fr = 'Aventures Solo au Belize : Guide Complet'
WHERE title_fr LIKE '%Guide de Voyage:%' AND title LIKE '%Belize%';

-- Verify the fix
SELECT title, title_fr, 'FIXED' as status FROM posts WHERE title_fr IS NOT NULL;