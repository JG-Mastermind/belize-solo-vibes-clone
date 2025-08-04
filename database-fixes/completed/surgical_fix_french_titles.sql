-- SURGICAL FIX: French Translations for Blog Posts
-- Based on exact audit results from Supabase
-- 
-- SAFETY: This script will ONLY update posts that currently have:
-- - title_fr = title (duplicate English)
-- - title_fr IS NULL
-- 
-- It will NOT touch the 4 posts that already have proper French translations

-- STEP 1: BACKUP VERIFICATION (run this first to confirm what will be updated)
SELECT 
  'POSTS THAT WILL BE UPDATED' as action,
  id,
  title,
  title_fr as current_french_title,
  CASE 
    WHEN title_fr IS NULL THEN 'NULL - WILL ADD FRENCH'
    WHEN title_fr = title THEN 'DUPLICATE - WILL FIX FRENCH'
    ELSE 'SKIP - ALREADY HAS GOOD FRENCH'
  END as planned_action
FROM posts 
WHERE status = 'published'
  AND (title_fr IS NULL OR title_fr = title)
ORDER BY published_at DESC;

-- STEP 2: SINGLE POST TEST (uncomment to test on ONE post first)
/*
UPDATE posts 
SET title_fr = 'Une Semaine à San Ignacio : Guide de Voyage Solo'
WHERE title = 'A Week in San Ignacio: Your Solo Travel Guide'
  AND status = 'published'
  AND (title_fr IS NULL OR title_fr = title);
*/

-- STEP 3: FULL BATCH UPDATE (only run after testing single post)
/*
UPDATE posts 
SET title_fr = CASE 
  -- Posts with NULL or duplicate English titles
  WHEN title = 'A Week in San Ignacio: Your Solo Travel Guide' THEN 'Une Semaine à San Ignacio : Guide de Voyage Solo'
  WHEN title = 'Wildlife Watching in Belize: San Ignacio''s Birder''s Guide' THEN 'Observation de la Faune au Belize : Guide Ornithologique'
  WHEN title = 'Navigating Belize City Safely: A Female Solo Traveler''s Street Smart Guide' THEN 'Naviguer dans Belize City en Sécurité : Guide pour Voyageuses Solo'
  WHEN title = 'Belize on $50/day: Ultimate Backpacker''s Survival Guide' THEN 'Belize à 50$/jour : Guide de Survie du Backpacker'
  WHEN title = 'Spotting Jaguars in Belize: The Complete Wildlife Guide' THEN 'Repérer les Jaguars au Belize : Guide Complet de la Faune'
  WHEN title = 'Best Time to Visit Belize for Solo Travelers' THEN 'Meilleur Moment pour Visiter le Belize en Solo'
  WHEN title = 'Belize Travel Safety in 2024: What You Need to Know' THEN 'Sécurité de Voyage au Belize en 2024 : Ce qu''il Faut Savoir'
  WHEN title = '10 Solo Adventures in Belize You Can''t Miss' THEN '10 Aventures Solo au Belize à Ne Pas Manquer'
  WHEN title = 'Budget Belize: Solo Travel Tips' THEN 'Belize Économique : Conseils de Voyage Solo'
  
  -- Keep existing good French titles unchanged
  ELSE title_fr
END,
excerpt_fr = CASE 
  -- Add French excerpts for posts that need them
  WHEN title = 'A Week in San Ignacio: Your Solo Travel Guide' THEN 'Découvrez comment passer une semaine parfaite à San Ignacio avec ce guide complet pour voyageurs solo.'
  WHEN title = 'Wildlife Watching in Belize: San Ignacio''s Birder''s Guide' THEN 'Guide complet pour l''observation des oiseaux et de la faune sauvage dans la région de San Ignacio.'
  WHEN title = 'Navigating Belize City Safely: A Female Solo Traveler''s Street Smart Guide' THEN 'Conseils de sécurité essentiels pour les femmes voyageant seules à Belize City.'
  WHEN title = 'Belize on $50/day: Ultimate Backpacker''s Survival Guide' THEN 'Comment voyager au Belize avec un budget de 50$ par jour : guide pratique et économique.'
  WHEN title = 'Spotting Jaguars in Belize: The Complete Wildlife Guide' THEN 'Guide complet pour repérer les jaguars et autres animaux sauvages du Belize.'
  WHEN title = 'Best Time to Visit Belize for Solo Travelers' THEN 'Découvrez la meilleure période pour visiter le Belize en voyageur solo.'
  WHEN title = 'Belize Travel Safety in 2024: What You Need to Know' THEN 'Informations de sécurité essentielles pour voyager au Belize en 2024.'
  WHEN title = '10 Solo Adventures in Belize You Can''t Miss' THEN 'Les 10 aventures incontournables pour les voyageurs solo au Belize.'
  WHEN title = 'Budget Belize: Solo Travel Tips' THEN 'Conseils et astuces pour voyager au Belize sans se ruiner.'
  
  -- Keep existing excerpts unchanged
  ELSE excerpt_fr
END
WHERE status = 'published'
  AND (title_fr IS NULL OR title_fr = title);
*/

-- STEP 4: VERIFICATION (run after update to confirm success)
/*
SELECT 
  'VERIFICATION AFTER UPDATE' as check_type,
  id,
  title,
  title_fr,
  CASE 
    WHEN title_fr IS NOT NULL AND title_fr != '' AND title_fr != title THEN '✅ FIXED'
    ELSE '❌ STILL BROKEN'
  END as status
FROM posts 
WHERE status = 'published'
ORDER BY published_at DESC;
*/