-- EMERGENCY: Restore database from clean sample data
-- Only run this if database is corrupted and you want to start fresh

-- WARNING: This will DELETE all existing posts and restore from sample data
-- Make sure you have backups before running this!

-- Step 1: Clear corrupted data (DANGEROUS - creates backup first)
CREATE TABLE posts_backup AS SELECT * FROM posts;

-- Step 2: Clean slate
DELETE FROM post_tags;
DELETE FROM posts;
DELETE FROM tags WHERE id NOT IN (SELECT DISTINCT tag_id FROM post_tags);
DELETE FROM categories WHERE id NOT IN (SELECT DISTINCT category_id FROM posts);

-- Step 3: Restore categories
INSERT INTO categories (id, name, name_fr, description, created_at) VALUES
('cat-adventure', 'Adventure', 'Aventure', 'Exciting outdoor activities and adventures', NOW()),
('cat-culture', 'Culture', 'Culture', 'Cultural experiences and local traditions', NOW()),
('cat-nature', 'Nature', 'Nature', 'Wildlife and natural attractions', NOW()),
('cat-travel-tips', 'Travel Tips', 'Conseils de Voyage', 'Practical travel advice and tips', NOW()),
('cat-food', 'Food & Drink', 'Nourriture et Boissons', 'Local cuisine and dining experiences', NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_fr = EXCLUDED.name_fr,
  description = EXCLUDED.description;

-- Step 4: Restore tags
INSERT INTO tags (id, name, name_fr, created_at) VALUES
('tag-solo-travel', 'Solo Travel', 'Voyage Solo', NOW()),
('tag-adventure', 'Adventure', 'Aventure', NOW()),
('tag-nature', 'Nature', 'Nature', NOW()),
('tag-culture', 'Culture', 'Culture', NOW()),
('tag-budget', 'Budget Travel', 'Voyage Économique', NOW()),
('tag-wildlife', 'Wildlife', 'Faune', NOW()),
('tag-diving', 'Diving', 'Plongée', NOW()),
('tag-maya', 'Maya Ruins', 'Ruines Maya', NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_fr = EXCLUDED.name_fr;

-- Step 5: Restore clean posts with proper French translations
INSERT INTO posts (
  id, title, title_fr, content, content_fr, excerpt, excerpt_fr, 
  author, slug, category_id, featured_image_url, status, 
  published_at, reading_time, views, likes, comments
) VALUES
(
  'post-san-ignacio-guide',
  'A Week in San Ignacio: Your Solo Travel Guide',
  'Une Semaine à San Ignacio : Guide de Voyage Solo',
  '<h2>Discover San Ignacio</h2><p>San Ignacio is the perfect base for solo travelers exploring western Belize. This charming town offers incredible adventures, from cave tubing to Maya ruins.</p>',
  '<h2>Découvrez San Ignacio</h2><p>San Ignacio est la base parfaite pour les voyageurs solo explorant l''ouest du Belize. Cette charmante ville offre des aventures incroyables, du tubing en grotte aux ruines Maya.</p>',
  'Your complete guide to spending a week in San Ignacio, Belize. Discover the best adventures, accommodations, and local experiences for solo travelers.',
  'Votre guide complet pour passer une semaine à San Ignacio, Belize. Découvrez les meilleures aventures, hébergements et expériences locales pour les voyageurs solo.',
  'Sarah Thompson',
  'week-in-san-ignacio-solo-travel-guide',
  'cat-travel-tips',
  'https://images.unsplash.com/photo-1539650116574-75c0c6d49d3d?w=800&h=600&fit=crop',
  'published',
  '2024-12-04 10:00:00',
  '10 min read',
  756, 43, 12
),
(
  'post-cave-tubing-belize',
  'Cave Tubing Adventures in Belize: What You Can''t Miss',
  'Aventures de Tubing en Grotte au Belize',
  '<h2>Underground Wonders</h2><p>Cave tubing in Belize is an unforgettable adventure that takes you through ancient Maya ceremonial caves.</p>',
  '<h2>Merveilles Souterraines</h2><p>Le tubing en grotte au Belize est une aventure inoubliable qui vous emmène à travers d''anciennes grottes cérémonielles Maya.</p>',
  'Explore the mystical underground caves of Belize on an exciting tubing adventure through crystal-clear waters.',
  'Explorez les grottes souterraines mystiques du Belize lors d''une aventure passionnante de tubing à travers des eaux cristallines.',
  'Mike Rodriguez',
  'cave-tubing-adventures-belize',
  'cat-adventure',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
  'published',
  '2024-12-01 14:30:00',
  '8 min read',
  643, 38, 9
);

-- Step 6: Restore post-tag relationships
INSERT INTO post_tags (post_id, tag_id) VALUES
('post-san-ignacio-guide', 'tag-solo-travel'),
('post-san-ignacio-guide', 'tag-adventure'),
('post-san-ignacio-guide', 'tag-culture'),
('post-cave-tubing-belize', 'tag-adventure'),
('post-cave-tubing-belize', 'tag-nature'),
('post-cave-tubing-belize', 'tag-solo-travel');

-- Step 7: Verify restoration
SELECT 'RESTORATION COMPLETE' as status, COUNT(*) as posts_restored FROM posts;
SELECT 'FRENCH TITLES' as status, COUNT(*) as posts_with_french FROM posts WHERE title_fr IS NOT NULL;