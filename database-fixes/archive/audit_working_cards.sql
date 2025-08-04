-- Audit: Why do some cards work and others don't?
-- Find the pattern of working French titles vs non-working ones

-- 1. Show ALL posts with their exact titles and French titles
-- Order by creation to match the visual order on the page
SELECT 
  ROW_NUMBER() OVER (ORDER BY created_at DESC) as card_position,
  title as english_title,
  title_fr as french_title,
  CASE 
    WHEN title_fr IS NOT NULL AND title_fr != '' AND title_fr != title THEN 'HAS_FRENCH'
    WHEN title_fr IS NULL THEN 'NO_FRENCH'
    WHEN title_fr = '' THEN 'EMPTY_FRENCH'
    WHEN title_fr = title THEN 'SAME_AS_ENGLISH'
    ELSE 'OTHER'
  END as french_status,
  LENGTH(title_fr) as french_title_length,
  slug,
  created_at
FROM posts 
WHERE status = 'published'
ORDER BY created_at DESC;

-- 2. Identify the working French cards by matching visible titles
SELECT 
  'WORKING CARDS ANALYSIS' as analysis_type,
  title,
  title_fr,
  'WORKING' as status
FROM posts 
WHERE title_fr IS NOT NULL 
  AND title_fr != ''
  AND title_fr != title
  AND (
    title_fr LIKE '%Observation de la Faune%' 
    OR title_fr LIKE '%Solo Adventures%'
    OR title_fr LIKE '%Cultural Immersion%'
    OR title_fr LIKE '%Spotting Jaguars%'
  );

-- 3. Find the pattern: What makes these work?
SELECT 
  'PATTERN ANALYSIS' as analysis_type,
  COUNT(*) as total_posts,
  SUM(CASE WHEN title_fr IS NOT NULL AND title_fr != '' AND title_fr != title THEN 1 ELSE 0 END) as posts_with_good_french,
  SUM(CASE WHEN title_fr IS NULL OR title_fr = '' THEN 1 ELSE 0 END) as posts_missing_french,
  SUM(CASE WHEN title_fr = title THEN 1 ELSE 0 END) as posts_duplicate_english
FROM posts 
WHERE status = 'published';

-- 4. Show exact data for first 8 posts (matching visual order)
SELECT 
  'FIRST_8_POSTS' as section,
  ROW_NUMBER() OVER (ORDER BY created_at DESC) as visual_position,
  LEFT(title, 50) as title_preview,
  LEFT(title_fr, 50) as french_title_preview,
  CASE 
    WHEN title_fr IS NOT NULL AND title_fr != '' AND title_fr != title THEN '✅ GOOD'
    ELSE '❌ BROKEN'
  END as expected_display
FROM posts 
WHERE status = 'published'
ORDER BY created_at DESC
LIMIT 8;