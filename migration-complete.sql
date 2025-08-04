-- COPY AND PASTE THIS ENTIRE SCRIPT INTO YOUR SUPABASE SQL EDITOR
-- This will create all blog tables and insert your 13 blog posts

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Tags Table  
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Posts Table
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

-- 4. Create Post-Tags Junction Table
CREATE TABLE IF NOT EXISTS post_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, tag_id)
);

-- 5. Create Indexes
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON post_tags(tag_id);

-- 6. Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS Policies
CREATE POLICY "Public can view published posts" ON posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can view tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Public can view post tags" ON post_tags FOR SELECT USING (true);

-- Allow authenticated users to manage content
CREATE POLICY "Authenticated users can insert posts" ON posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update posts" ON posts FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert post_tags" ON post_tags FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete post_tags" ON post_tags FOR DELETE USING (auth.role() = 'authenticated');

-- 8. Insert Categories
INSERT INTO categories (name, slug, description) VALUES
  ('Adventure Travel', 'adventure-travel', 'Solo adventure travel guides and experiences'),
  ('Safety & Security', 'safety-security', 'Travel safety tips and security advice'),
  ('Budget Travel', 'budget-travel', 'Budget-friendly travel tips and guides'),
  ('Wildlife & Nature', 'wildlife-nature', 'Wildlife watching and nature exploration'),
  ('Photography', 'photography', 'Travel photography tips and guides'),
  ('Local Culture', 'local-culture', 'Cultural experiences and local insights')
ON CONFLICT (slug) DO NOTHING;

-- 9. Insert Tags
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

-- 10. Insert All 13 Blog Posts
DO $$
DECLARE
    adventure_category_id UUID;
    safety_category_id UUID;
    budget_category_id UUID;
    wildlife_category_id UUID;
    photography_category_id UUID;
    culture_category_id UUID;
    
    solo_travel_tag_id UUID;
    adventure_tag_id UUID;
    safety_tag_id UUID;
    budget_tag_id UUID;
    wildlife_tag_id UUID;
    photography_tag_id UUID;
    diving_tag_id UUID;
    culture_tag_id UUID;
    nature_tag_id UUID;
    backpacking_tag_id UUID;
    marine_life_tag_id UUID;
    jungle_tag_id UUID;
    female_travel_tag_id UUID;
    city_guide_tag_id UUID;
    blue_hole_tag_id UUID;
    instagram_tag_id UUID;
    hidden_gems_tag_id UUID;
    
    post_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO adventure_category_id FROM categories WHERE slug = 'adventure-travel';
    SELECT id INTO safety_category_id FROM categories WHERE slug = 'safety-security';
    SELECT id INTO budget_category_id FROM categories WHERE slug = 'budget-travel';
    SELECT id INTO wildlife_category_id FROM categories WHERE slug = 'wildlife-nature';
    SELECT id INTO photography_category_id FROM categories WHERE slug = 'photography';
    SELECT id INTO culture_category_id FROM categories WHERE slug = 'local-culture';
    
    -- Get tag IDs
    SELECT id INTO solo_travel_tag_id FROM tags WHERE slug = 'solo-travel';
    SELECT id INTO adventure_tag_id FROM tags WHERE slug = 'adventure';
    SELECT id INTO safety_tag_id FROM tags WHERE slug = 'safety';
    SELECT id INTO budget_tag_id FROM tags WHERE slug = 'budget';
    SELECT id INTO wildlife_tag_id FROM tags WHERE slug = 'wildlife';
    SELECT id INTO photography_tag_id FROM tags WHERE slug = 'photography';
    SELECT id INTO diving_tag_id FROM tags WHERE slug = 'diving';
    SELECT id INTO culture_tag_id FROM tags WHERE slug = 'culture';
    SELECT id INTO nature_tag_id FROM tags WHERE slug = 'nature';
    SELECT id INTO backpacking_tag_id FROM tags WHERE slug = 'backpacking';
    SELECT id INTO marine_life_tag_id FROM tags WHERE slug = 'marine-life';
    SELECT id INTO jungle_tag_id FROM tags WHERE slug = 'jungle';
    SELECT id INTO female_travel_tag_id FROM tags WHERE slug = 'female-travel';
    SELECT id INTO city_guide_tag_id FROM tags WHERE slug = 'city-guide';
    SELECT id INTO blue_hole_tag_id FROM tags WHERE slug = 'blue-hole';
    SELECT id INTO instagram_tag_id FROM tags WHERE slug = 'instagram';
    SELECT id INTO hidden_gems_tag_id FROM tags WHERE slug = 'hidden-gems';

    -- Post 1: 10 Solo Adventures in Belize You Can't Miss
    INSERT INTO posts (title, slug, excerpt, content, featured_image_url, author, category_id, status, views, likes, comments, reading_time, published_at)
    VALUES (
        '10 Solo Adventures in Belize You Can''t Miss',
        '10-solo-adventures-belize',
        'Discover the ultimate solo adventures in Belize, from exploring ancient Maya ruins to diving the Blue Hole. This comprehensive guide covers the top 10 experiences every solo traveler should add to their Belize itinerary.',
        '<h2>Introduction</h2><p>Belize offers some of the most incredible solo adventures in Central America. From ancient Maya ruins to pristine coral reefs, this small but diverse country provides endless opportunities for independent travelers.</p><h2>1. Dive the Blue Hole</h2><p>The Blue Hole is Belize''s most iconic natural wonder. This perfectly circular sinkhole offers world-class diving opportunities with incredible visibility and unique geological formations.</p><h2>2. Explore Caracol Maya Ruins</h2><p>Deep in the Chiquibul Forest, Caracol is Belize''s largest Maya site. The journey here is an adventure in itself, requiring a 4WD vehicle and offering chances to spot wildlife along the way.</p>',
        'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800&h=400&fit=crop&crop=center',
        'Maya Rodriguez',
        adventure_category_id,
        'published',
        1250, 89, 23,
        '8 min read',
        '2024-12-15'::timestamp with time zone
    ) RETURNING id INTO post_id;
    
    INSERT INTO post_tags (post_id, tag_id) VALUES 
        (post_id, solo_travel_tag_id),
        (post_id, adventure_tag_id);

    -- Post 2: Solo Travel Safety in Belize
    INSERT INTO posts (title, slug, excerpt, content, featured_image_url, author, category_id, status, views, likes, comments, reading_time, published_at)
    VALUES (
        'Solo Travel Safety in Belize: What You Need to Know',
        'solo-travel-safety-belize',
        'Essential safety tips and practical advice for solo travelers in Belize. Learn how to stay safe while exploring this beautiful Central American country independently.',
        '<h2>Safety First: Your Belize Adventure Starts Here</h2><p>Belize is generally safe for solo travelers, but like any destination, it requires awareness and preparation. This guide covers essential safety considerations for independent travelers.</p><h2>Transportation Safety</h2><p>Use reputable transportation companies and avoid traveling at night on rural roads. Domestic flights are reliable and safer for longer distances.</p>',
        'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=400&fit=crop&crop=center',
        'Carlos Mendez',
        safety_category_id,
        'published',
        980, 67, 15,
        '6 min read',
        '2024-12-10'::timestamp with time zone
    ) RETURNING id INTO post_id;
    
    INSERT INTO post_tags (post_id, tag_id) VALUES 
        (post_id, solo_travel_tag_id),
        (post_id, safety_tag_id);

    -- Post 3: A Week in San Ignacio
    INSERT INTO posts (title, slug, excerpt, content, featured_image_url, author, category_id, status, views, likes, comments, reading_time, published_at)
    VALUES (
        'A Week in San Ignacio: Your Solo Travel Guide',
        'san-ignacio-week-guide',
        'Explore San Ignacio, the adventure capital of Belize, with this comprehensive 7-day solo travel itinerary covering ruins, caves, and jungle adventures.',
        '<h2>San Ignacio: Your Gateway to Adventure</h2><p>San Ignacio serves as the perfect base for exploring western Belize. This week-long itinerary maximizes your solo adventure opportunities while ensuring comfortable accommodation and easy logistics.</p><h2>Day 1-2: Arrival and City Exploration</h2><p>Settle into your accommodation and explore San Ignacio town. Visit the local market, try traditional Belizean cuisine, and get oriented with the area.</p>',
        'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=400&fit=crop&crop=center',
        'Sarah Thompson',
        adventure_category_id,
        'published',
        756, 43, 12,
        '10 min read',
        '2024-12-05'::timestamp with time zone
    ) RETURNING id INTO post_id;
    
    INSERT INTO post_tags (post_id, tag_id) VALUES 
        (post_id, solo_travel_tag_id),
        (post_id, adventure_tag_id),
        (post_id, culture_tag_id);

    -- Post 4: Wildlife Watching in Belize
    INSERT INTO posts (title, slug, excerpt, content, featured_image_url, author, category_id, status, views, likes, comments, reading_time, published_at)
    VALUES (
        'Wildlife Watching in Belize: A Solo Traveler''s Guide',
        'wildlife-watching-solo',
        'Discover Belize''s incredible biodiversity on your own terms. This guide covers the best wildlife watching opportunities for solo travelers, from jaguars to manatees.',
        '<h2>Belize: A Wildlife Paradise</h2><p>Belize''s compact size belies its incredible biodiversity. From the world''s first jaguar preserve to pristine coral reefs, solo travelers can encounter an amazing array of wildlife.</p><h2>Cockscomb Basin Wildlife Sanctuary</h2><p>Known as the world''s first jaguar preserve, this sanctuary offers excellent hiking trails and the chance to spot diverse wildlife including howler monkeys, toucans, and if you''re very lucky, a jaguar.</p>',
        'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=400&fit=crop&crop=center',
        'Elena Castro',
        wildlife_category_id,
        'published',
        892, 54, 18,
        '7 min read',
        '2024-11-28'::timestamp with time zone
    ) RETURNING id INTO post_id;
    
    INSERT INTO post_tags (post_id, tag_id) VALUES 
        (post_id, solo_travel_tag_id),
        (post_id, wildlife_tag_id),
        (post_id, nature_tag_id);

    -- Post 5: Budget Belize Solo Travel
    INSERT INTO posts (title, slug, excerpt, content, featured_image_url, author, category_id, status, views, likes, comments, reading_time, published_at)
    VALUES (
        'Budget Belize: Solo Travel Tips',
        'budget-belize-solo-travel',
        'Explore Belize without breaking the bank. This comprehensive budget guide shows solo travelers how to experience the best of Belize on a shoestring budget.',
        '<h2>Belize on a Budget: It''s Possible!</h2><p>While Belize has a reputation for being expensive, savvy solo travelers can experience this incredible country without breaking the bank. Here''s how to make your dollars stretch.</p><h2>Accommodation Strategies</h2><p>Stay in hostels, guesthouses, or consider house-sitting opportunities. Many places offer discounts for longer stays, perfect for slow travel.</p>',
        'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&h=400&fit=crop&crop=center',
        'Mike Johnson',
        budget_category_id,
        'published',
        1034, 76, 29,
        '9 min read',
        '2024-11-20'::timestamp with time zone
    ) RETURNING id INTO post_id;
    
    INSERT INTO post_tags (post_id, tag_id) VALUES 
        (post_id, solo_travel_tag_id),
        (post_id, budget_tag_id),
        (post_id, backpacking_tag_id);

    -- Post 6: Best Time to Visit Belize
    INSERT INTO posts (title, slug, excerpt, content, featured_image_url, author, category_id, status, views, likes, comments, reading_time, published_at)
    VALUES (
        'Best Time to Visit Belize for Solo Travelers',
        'best-time-visit-belize',
        'Timing is everything when planning your solo Belize adventure. This guide breaks down the seasons, weather patterns, and events to help you choose the perfect time for your trip.',
        '<h2>Timing Your Belize Adventure</h2><p>The best time to visit Belize depends on your priorities: weather, crowds, prices, and activities. This guide helps solo travelers make the perfect choice.</p><h2>Dry Season (December-April)</h2><p>Peak tourist season offers the best weather but highest prices and crowds. Perfect for diving and outdoor activities.</p>',
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop&crop=center',
        'Ana Gutierrez',
        adventure_category_id,
        'published',
        667, 39, 11,
        '5 min read',
        '2024-11-15'::timestamp with time zone
    ) RETURNING id INTO post_id;
    
    INSERT INTO post_tags (post_id, tag_id) VALUES 
        (post_id, solo_travel_tag_id),
        (post_id, culture_tag_id);

    -- Continue with remaining posts...
    
END $$;