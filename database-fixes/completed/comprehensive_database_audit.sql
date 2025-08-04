-- COMPREHENSIVE DATABASE AUDIT - READ ONLY
-- This script makes NO changes, only reports current state
-- Run this first to understand exactly what's broken

-- 1. EXACT COUNT OF POSTS BY TRANSLATION STATUS
SELECT 
  'TRANSLATION STATUS SUMMARY' as audit_section,
  COUNT(*) as total_published_posts,
  COUNT(CASE WHEN title_fr IS NOT NULL AND title_fr != '' AND title_fr != title THEN 1 END) as posts_with_good_french,
  COUNT(CASE WHEN title_fr IS NULL THEN 1 END) as posts_with_null_french,
  COUNT(CASE WHEN title_fr = '' THEN 1 END) as posts_with_empty_french,
  COUNT(CASE WHEN title_fr = title THEN 1 END) as posts_with_duplicate_english
FROM posts 
WHERE status = 'published';

-- 2. SHOW ALL POSTS IN ORDER (exactly as they appear on blog page)
SELECT 
  'DETAILED POST ANALYSIS' as audit_section,
  ROW_NUMBER() OVER (ORDER BY published_at DESC) as visual_position,
  id,
  LEFT(title, 60) as title_preview,
  LEFT(COALESCE(title_fr, 'NULL'), 60) as french_title_preview,
  CASE 
    WHEN title_fr IS NOT NULL AND title_fr != '' AND title_fr != title THEN '✅ HAS_GOOD_FRENCH'
    WHEN title_fr IS NULL THEN '❌ NULL_FRENCH'
    WHEN title_fr = '' THEN '❌ EMPTY_FRENCH'
    WHEN title_fr = title THEN '❌ DUPLICATE_ENGLISH'
    ELSE '❓ OTHER_ISSUE'
  END as translation_status,
  slug,
  published_at
FROM posts 
WHERE status = 'published'
ORDER BY published_at DESC;

-- 3. IDENTIFY THE 4 WORKING POSTS SPECIFICALLY
SELECT 
  'THE 4 WORKING POSTS' as audit_section,
  id,
  title,
  title_fr,
  'WORKING' as status
FROM posts 
WHERE status = 'published'
  AND title_fr IS NOT NULL 
  AND title_fr != ''
  AND title_fr != title
ORDER BY published_at DESC;

-- 4. SHOW BROKEN POSTS WITH THEIR EXACT TITLES (for pattern matching)
SELECT 
  'BROKEN POSTS NEEDING FIXES' as audit_section,
  id,
  title,
  COALESCE(title_fr, 'NULL') as current_french_title,
  CASE 
    WHEN title_fr IS NULL THEN 'NEEDS_FRENCH_TRANSLATION'
    WHEN title_fr = '' THEN 'NEEDS_FRENCH_TRANSLATION'
    WHEN title_fr = title THEN 'NEEDS_PROPER_FRENCH_TRANSLATION'
    ELSE 'OTHER_ISSUE'
  END as fix_needed,
  slug
FROM posts 
WHERE status = 'published'
  AND NOT (title_fr IS NOT NULL AND title_fr != '' AND title_fr != title)
ORDER BY published_at DESC;

-- 5. CHECK FOR CORRUPTION PATTERNS FROM PREVIOUS SCRIPTS
SELECT 
  'CORRUPTION PATTERN ANALYSIS' as audit_section,
  COUNT(*) as posts_matching_old_patterns,
  'Posts that might match restore_french_titles.sql patterns' as description
FROM posts 
WHERE status = 'published'
  AND (
    title LIKE '%San Ignacio%' OR
    title LIKE '%Cave%' OR
    title LIKE '%Maya%' OR
    title LIKE '%Snorkel%' OR
    title LIKE '%Wildlife%' OR
    title LIKE '%Blue Hole%' OR
    title LIKE '%Jungle%' OR
    title LIKE '%Beach%' OR
    title LIKE '%Fishing%' OR
    title LIKE '%Caye Caulker%' OR
    title LIKE '%Placencia%' OR
    title LIKE '%Caracol%'
  );