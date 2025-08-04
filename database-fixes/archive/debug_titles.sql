-- Systematic audit of current blog post titles
-- Check exactly what's in the database right now

-- 1. Show all posts with their English and French titles
SELECT 
  id,
  title as english_title,
  title_fr as french_title,
  CASE 
    WHEN title_fr IS NULL THEN 'NO FRENCH'
    WHEN title_fr = '' THEN 'EMPTY FRENCH'  
    WHEN title_fr = title THEN 'SAME AS ENGLISH'
    ELSE 'HAS FRENCH'
  END as french_status,
  slug,
  created_at
FROM posts 
ORDER BY created_at DESC;

-- 2. Check for problematic patterns
SELECT 
  'Mixed Language Titles' as issue_type,
  COUNT(*) as count
FROM posts 
WHERE title_fr LIKE '%Guide de Voyage:%' 
   OR title_fr LIKE '%: %' 
   OR (title_fr IS NOT NULL AND title_fr LIKE '%English%');

-- 3. Show posts that might have been broken by the fix
SELECT 
  title,
  title_fr,
  'POTENTIALLY BROKEN' as status
FROM posts 
WHERE title_fr IS NULL 
   OR title_fr = ''
   OR title_fr = title;

-- 4. Check language detection logic - posts that should have French but don't
SELECT 
  id,
  title,
  title_fr,
  CASE 
    WHEN title_fr IS NULL OR title_fr = '' THEN 'MISSING FRENCH TRANSLATION'
    ELSE 'OK'
  END as translation_status
FROM posts
WHERE status = 'published'
ORDER BY created_at DESC;