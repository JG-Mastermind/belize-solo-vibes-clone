-- Create blog database schema
-- Run this in Supabase SQL Editor

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags table  
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table
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
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post-Tags junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS post_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, tag_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON post_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view published posts" ON posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Public can view tags" ON tags
  FOR SELECT USING (true);

CREATE POLICY "Public can view post tags" ON post_tags
  FOR SELECT USING (true);

-- Create policies for authenticated users to create/update
CREATE POLICY "Authenticated users can insert posts" ON posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update posts" ON posts
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert post_tags" ON post_tags
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete post_tags" ON post_tags
  FOR DELETE USING (auth.role() = 'authenticated');

-- Insert initial categories
INSERT INTO categories (name, slug, description) VALUES
  ('Adventure Travel', 'adventure-travel', 'Solo adventure travel guides and experiences'),
  ('Safety & Security', 'safety-security', 'Travel safety tips and security advice'),
  ('Budget Travel', 'budget-travel', 'Budget-friendly travel tips and guides'),
  ('Wildlife & Nature', 'wildlife-nature', 'Wildlife watching and nature exploration'),
  ('Photography', 'photography', 'Travel photography tips and guides'),
  ('Local Culture', 'local-culture', 'Cultural experiences and local insights')
ON CONFLICT (slug) DO NOTHING;

-- Insert initial tags
INSERT INTO tags (name, slug) VALUES
  ('Solo Travel', 'solo-travel'),
  ('Adventure', 'adventure'),
  ('Safety', 'safety'),
  ('Budget', 'budget'),
  ('Wildlife', 'wildlife'),
  ('Photography', 'photography'),
  ('Diving', 'diving'),
  ('Culture', 'culture'),
  ('Nature', 'nature'),
  ('Backpacking', 'backpacking'),
  ('Marine Life', 'marine-life'),
  ('Jungle', 'jungle'),
  ('Female Travel', 'female-travel'),
  ('City Guide', 'city-guide'),
  ('Blue Hole', 'blue-hole'),
  ('Instagram', 'instagram'),
  ('Hidden Gems', 'hidden-gems')
ON CONFLICT (slug) DO NOTHING;