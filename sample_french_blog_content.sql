-- Sample French translations for blog content (FIXED VERSION)
-- Run this manually in your Supabase SQL editor after running the migration

-- First, check if blog tables exist and create them if needed
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  name_fr VARCHAR(100),
  description_fr TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  name_fr VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  author VARCHAR(100) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  reading_time VARCHAR(20),
  meta_description TEXT,
  keywords TEXT[],
  title_fr VARCHAR(255),
  excerpt_fr TEXT,
  content_fr TEXT,
  meta_description_fr TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS post_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, tag_id)
);

-- Insert sample categories
INSERT INTO categories (id, name, slug, description, name_fr, description_fr) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Adventure', 'adventure', 'Adventure travel experiences', 'Aventure', 'Expériences de voyage d''aventure'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Culture', 'culture', 'Cultural insights and experiences', 'Culture', 'Aperçus et expériences culturels')
ON CONFLICT (slug) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  description_fr = EXCLUDED.description_fr;

-- Insert sample tags
INSERT INTO tags (id, name, slug, name_fr) VALUES 
  ('550e8400-e29b-41d4-a716-446655440010', 'Solo Travel', 'solo-travel', 'Voyage Solo'),
  ('550e8400-e29b-41d4-a716-446655440011', 'Belize', 'belize', 'Belize'),
  ('550e8400-e29b-41d4-a716-446655440012', 'Jungle', 'jungle', 'Jungle')
ON CONFLICT (slug) DO UPDATE SET
  name_fr = EXCLUDED.name_fr;

-- Insert sample blog posts with French translations
INSERT INTO posts (
  id, 
  title, 
  slug, 
  excerpt, 
  content, 
  author, 
  category_id, 
  featured_image_url, 
  reading_time,
  title_fr,
  excerpt_fr,
  content_fr
) VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440100',
    'Solo Adventures in Belize: A Complete Guide',
    'solo-adventures-belize-guide',
    'Discover the ultimate solo travel experience in Belize with our comprehensive guide to jungle adventures.',
    '<h2>Welcome to Belize</h2><p>Belize offers incredible solo travel opportunities. From jungle adventures to pristine beaches, this Central American gem has something for every solo traveler.</p><h3>Top Solo Activities</h3><ul><li>Cave tubing adventures</li><li>Snorkeling at the Blue Hole</li><li>Exploring Maya ruins</li></ul>',
    'Maria Rodriguez',
    '550e8400-e29b-41d4-a716-446655440001',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
    '5 min read',
    'Aventures Solo au Belize : Guide Complet',
    'Découvrez l''expérience ultime de voyage solo au Belize avec notre guide complet des aventures en jungle.',
    '<h2>Bienvenue au Belize</h2><p>Le Belize offre d''incroyables opportunités de voyage solo. Des aventures en jungle aux plages pristines, ce joyau d''Amérique centrale a quelque chose pour chaque voyageur solo.</p><h3>Principales Activités Solo</h3><ul><li>Aventures de tubing en grotte</li><li>Plongée au Blue Hole</li><li>Exploration des ruines Maya</li></ul>'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440101',
    'Cultural Immersion in Belize: Beyond Tourism',
    'cultural-immersion-belize',
    'Experience authentic Belizean culture through local communities and traditional practices.',
    '<h2>Authentic Cultural Experiences</h2><p>Belize''s rich cultural heritage offers incredible opportunities for meaningful connections with local communities.</p><h3>Cultural Activities</h3><ul><li>Visit local villages</li><li>Learn traditional crafts</li><li>Participate in cultural ceremonies</li></ul>',
    'James Thompson', 
    '550e8400-e29b-41d4-a716-446655440002',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=400&fit=crop',
    '7 min read',
    'Immersion Culturelle au Belize : Au-delà du Tourisme',
    'Vivez la culture bélizienne authentique à travers les communautés locales et les pratiques traditionnelles.',
    '<h2>Expériences Culturelles Authentiques</h2><p>Le riche patrimoine culturel du Belize offre d''incroyables opportunités de connexions significatives avec les communautés locales.</p><h3>Activités Culturelles</h3><ul><li>Visiter les villages locaux</li><li>Apprendre l''artisanat traditionnel</li><li>Participer aux cérémonies culturelles</li></ul>'
  )
ON CONFLICT (slug) DO UPDATE SET
  title_fr = EXCLUDED.title_fr,
  excerpt_fr = EXCLUDED.excerpt_fr,
  content_fr = EXCLUDED.content_fr;

-- Create post-tag relationships (only after we know posts and tags exist)
INSERT INTO post_tags (post_id, tag_id) 
SELECT p.id, t.id 
FROM posts p, tags t 
WHERE (p.slug = 'solo-adventures-belize-guide' AND t.slug = 'solo-travel')
   OR (p.slug = 'solo-adventures-belize-guide' AND t.slug = 'belize')
   OR (p.slug = 'cultural-immersion-belize' AND t.slug = 'belize')
   OR (p.slug = 'cultural-immersion-belize' AND t.slug = 'jungle')
ON CONFLICT (post_id, tag_id) DO NOTHING;

-- Verify the data was inserted
SELECT 'SUCCESS: Sample blog data with French translations inserted!' as status;