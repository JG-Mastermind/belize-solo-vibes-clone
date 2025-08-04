-- Check if database was corrupted by previous SQL scripts
-- This will show us the current state and any data integrity issues

-- 1. Basic integrity check - count posts and their translation status
SELECT 
  'TOTAL POSTS' as check_type,
  COUNT(*) as count,
  NULL as details
FROM posts
UNION ALL
SELECT 
  'POSTS WITH FRENCH TITLES' as check_type,
  COUNT(*) as count,
  NULL as details
FROM posts 
WHERE title_fr IS NOT NULL AND title_fr != ''
UNION ALL
SELECT 
  'POSTS WITHOUT FRENCH TITLES' as check_type,
  COUNT(*) as count,
  NULL as details
FROM posts 
WHERE title_fr IS NULL OR title_fr = '';

-- 2. Check for data corruption patterns
SELECT 
  'CORRUPTION CHECK' as section,
  title,
  title_fr,
  CASE 
    WHEN title_fr IS NULL THEN 'MISSING_FRENCH'
    WHEN title_fr = '' THEN 'EMPTY_FRENCH'
    WHEN title_fr = title THEN 'DUPLICATE_ENGLISH'
    WHEN title_fr LIKE '%<%' OR title_fr LIKE '%>%' THEN 'HTML_CORRUPTED'
    WHEN LENGTH(title_fr) > 200 THEN 'TOO_LONG'
    WHEN title_fr LIKE 'CASE%' THEN 'SQL_ERROR'
    ELSE 'OK'
  END as corruption_status
FROM posts
ORDER BY 
  CASE 
    WHEN title_fr IS NULL THEN 1
    WHEN title_fr = '' THEN 2
    WHEN title_fr = title THEN 3
    ELSE 4
  END,
  created_at DESC;

-- 3. Check if we have any original sample data left
SELECT 
  'SAMPLE DATA CHECK' as section,
  COUNT(*) as posts_with_sample_patterns
FROM posts 
WHERE title LIKE '%San Ignacio%' 
   OR title LIKE '%Cave%' 
   OR title LIKE '%Maya%'
   OR title LIKE '%Snorkel%';

-- 4. Show a few example posts to verify data quality
SELECT 
  'EXAMPLE POSTS' as section,
  id,
  title,
  title_fr,
  slug,
  created_at
FROM posts 
ORDER BY created_at DESC 
LIMIT 5;