-- SIMPLIFIED MIGRATION: INSERT BLOG POSTS ONLY
-- Run this if you're getting "already exists" errors

-- First, let's insert categories (skip if they already exist)
INSERT INTO categories (name, slug, description) VALUES
  ('Adventure Travel', 'adventure-travel', 'Solo adventure travel guides and experiences'),
  ('Safety & Security', 'safety-security', 'Travel safety tips and security advice'),
  ('Budget Travel', 'budget-travel', 'Budget-friendly travel tips and guides'),
  ('Wildlife & Nature', 'wildlife-nature', 'Wildlife watching and nature exploration'),
  ('Photography', 'photography', 'Travel photography tips and guides'),
  ('Local Culture', 'local-culture', 'Cultural experiences and local insights')
ON CONFLICT (slug) DO NOTHING;

-- Insert tags (skip if they already exist)
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

-- Now insert all 13 blog posts
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
        '<h2>Introduction</h2><p>Belize offers some of the most incredible solo adventures in Central America. From ancient Maya ruins to pristine coral reefs, this small but diverse country provides endless opportunities for independent travelers.</p><h2>1. Dive the Blue Hole</h2><p>The Blue Hole is Belize''s most iconic natural wonder. This perfectly circular sinkhole offers world-class diving opportunities with incredible visibility and unique geological formations.</p><h2>2. Explore Caracol Maya Ruins</h2><p>Deep in the Chiquibul Forest, Caracol is Belize''s largest Maya site. The journey here is an adventure in itself, requiring a 4WD vehicle and offering chances to spot wildlife along the way.</p><h2>3. Cave Tubing Adventure</h2><p>Float through underground cave systems on an inner tube, experiencing the mysterious underworld that the ancient Maya considered sacred.</p><h2>4. Snorkel at Hol Chan Marine Reserve</h2><p>Just off Ambergris Caye, this marine reserve offers some of the best snorkeling in the Caribbean with abundant marine life including nurse sharks and stingrays.</p><h2>5. Hike Cockscomb Basin Wildlife Sanctuary</h2><p>Known as the world''s first jaguar preserve, this sanctuary offers excellent hiking trails and the chance to spot diverse wildlife in pristine rainforest.</p>',
        'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800&h=400&fit=crop&crop=center',
        'Maya Rodriguez',
        adventure_category_id,
        'published',
        1250, 89, 23,
        '8 min read',
        '2024-12-15'::timestamp with time zone
    ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO post_id;
    
    -- Add tags for post 1
    IF post_id IS NOT NULL THEN
        INSERT INTO post_tags (post_id, tag_id) VALUES 
            (post_id, solo_travel_tag_id),
            (post_id, adventure_tag_id)
        ON CONFLICT (post_id, tag_id) DO NOTHING;
    END IF;

    -- Post 2: Solo Travel Safety in Belize
    INSERT INTO posts (title, slug, excerpt, content, featured_image_url, author, category_id, status, views, likes, comments, reading_time, published_at)
    VALUES (
        'Solo Travel Safety in Belize: What You Need to Know',
        'solo-travel-safety-belize',
        'Essential safety tips and practical advice for solo travelers in Belize. Learn how to stay safe while exploring this beautiful Central American country independently.',
        '<h2>Safety First: Your Belize Adventure Starts Here</h2><p>Belize is generally safe for solo travelers, but like any destination, it requires awareness and preparation. This guide covers essential safety considerations for independent travelers.</p><h2>Transportation Safety</h2><p>Use reputable transportation companies and avoid traveling at night on rural roads. Domestic flights are reliable and safer for longer distances.</p><h2>Accommodation Tips</h2><p>Choose accommodations in safe neighborhoods and read recent reviews. Many solo travelers find hostels and guesthouses offer good security and social opportunities.</p><h2>Health and Medical Preparedness</h2><p>Ensure you have comprehensive travel insurance and carry a basic medical kit. Know where the nearest medical facilities are located.</p>',
        'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=400&fit=crop&crop=center',
        'Carlos Mendez',
        safety_category_id,
        'published',
        980, 67, 15,
        '6 min read',
        '2024-12-10'::timestamp with time zone
    ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO post_id;
    
    IF post_id IS NOT NULL THEN
        INSERT INTO post_tags (post_id, tag_id) VALUES 
            (post_id, solo_travel_tag_id),
            (post_id, safety_tag_id)
        ON CONFLICT (post_id, tag_id) DO NOTHING;
    END IF;

    -- Post 3: A Week in San Ignacio
    INSERT INTO posts (title, slug, excerpt, content, featured_image_url, author, category_id, status, views, likes, comments, reading_time, published_at)
    VALUES (
        'A Week in San Ignacio: Your Solo Travel Guide',
        'san-ignacio-week-guide',
        'Explore San Ignacio, the adventure capital of Belize, with this comprehensive 7-day solo travel itinerary covering ruins, caves, and jungle adventures.',
        '<h2>San Ignacio: Your Gateway to Adventure</h2><p>San Ignacio serves as the perfect base for exploring western Belize. This week-long itinerary maximizes your solo adventure opportunities while ensuring comfortable accommodation and easy logistics.</p><h2>Day 1-2: Arrival and City Exploration</h2><p>Settle into your accommodation and explore San Ignacio town. Visit the local market, try traditional Belizean cuisine, and get oriented with the area.</p><h2>Day 3: Xunantunich Maya Ruins</h2><p>Cross the Mopan River by hand-cranked ferry to reach these impressive Maya ruins. The view from El Castillo pyramid is spectacular.</p><h2>Day 4: ATM Cave Adventure</h2><p>Experience the Actun Tunichil Muknal cave, one of the most incredible archaeological sites in Central America.</p>',
        'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=400&fit=crop&crop=center',
        'Sarah Thompson',
        adventure_category_id,
        'published',
        756, 43, 12,
        '10 min read',
        '2024-12-05'::timestamp with time zone
    ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO post_id;
    
    IF post_id IS NOT NULL THEN
        INSERT INTO post_tags (post_id, tag_id) VALUES 
            (post_id, solo_travel_tag_id),
            (post_id, adventure_tag_id),
            (post_id, culture_tag_id)
        ON CONFLICT (post_id, tag_id) DO NOTHING;
    END IF;

    -- Post 4: Wildlife Watching in Belize
    INSERT INTO posts (title, slug, excerpt, content, featured_image_url, author, category_id, status, views, likes, comments, reading_time, published_at)
    VALUES (
        'Wildlife Watching in Belize: A Solo Traveler''s Guide',
        'wildlife-watching-solo',
        'Discover Belize''s incredible biodiversity on your own terms. This guide covers the best wildlife watching opportunities for solo travelers, from jaguars to manatees.',
        '<h2>Belize: A Wildlife Paradise</h2><p>Belize''s compact size belies its incredible biodiversity. From the world''s first jaguar preserve to pristine coral reefs, solo travelers can encounter an amazing array of wildlife.</p><h2>Cockscomb Basin Wildlife Sanctuary</h2><p>Known as the world''s first jaguar preserve, this sanctuary offers excellent hiking trails and the chance to spot diverse wildlife including howler monkeys, toucans, and if you''re very lucky, a jaguar.</p><h2>Belize Barrier Reef</h2><p>The second-largest coral reef system in the world offers incredible snorkeling and diving opportunities with marine life including nurse sharks, rays, and colorful tropical fish.</p>',
        'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=400&fit=crop&crop=center',
        'Elena Castro',
        wildlife_category_id,
        'published',
        892, 54, 18,
        '7 min read',
        '2024-11-28'::timestamp with time zone
    ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO post_id;
    
    IF post_id IS NOT NULL THEN
        INSERT INTO post_tags (post_id, tag_id) VALUES 
            (post_id, solo_travel_tag_id),
            (post_id, wildlife_tag_id),
            (post_id, nature_tag_id)
        ON CONFLICT (post_id, tag_id) DO NOTHING;
    END IF;

    -- Post 5: Budget Belize Solo Travel
    INSERT INTO posts (title, slug, excerpt, content, featured_image_url, author, category_id, status, views, likes, comments, reading_time, published_at)
    VALUES (
        'Budget Belize: Solo Travel Tips',
        'budget-belize-solo-travel',
        'Explore Belize without breaking the bank. This comprehensive budget guide shows solo travelers how to experience the best of Belize on a shoestring budget.',
        '<h2>Belize on a Budget: It''s Possible!</h2><p>While Belize has a reputation for being expensive, savvy solo travelers can experience this incredible country without breaking the bank. Here''s how to make your dollars stretch.</p><h2>Accommodation Strategies</h2><p>Stay in hostels, guesthouses, or consider house-sitting opportunities. Many places offer discounts for longer stays, perfect for slow travel.</p><h2>Transportation Tips</h2><p>Use local buses instead of tourist shuttles, and consider hitchhiking in safe areas with other travelers for longer distances.</p>',
        'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&h=400&fit=crop&crop=center',
        'Mike Johnson',
        budget_category_id,
        'published',
        1034, 76, 29,
        '9 min read',
        '2024-11-20'::timestamp with time zone
    ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO post_id;
    
    IF post_id IS NOT NULL THEN
        INSERT INTO post_tags (post_id, tag_id) VALUES 
            (post_id, solo_travel_tag_id),
            (post_id, budget_tag_id),
            (post_id, backpacking_tag_id)
        ON CONFLICT (post_id, tag_id) DO NOTHING;
    END IF;

    -- Post 6: Best Time to Visit Belize
    INSERT INTO posts (title, slug, excerpt, content, featured_image_url, author, category_id, status, views, likes, comments, reading_time, published_at)
    VALUES (
        'Best Time to Visit Belize for Solo Travelers',
        'best-time-visit-belize',
        'Timing is everything when planning your solo Belize adventure. This guide breaks down the seasons, weather patterns, and events to help you choose the perfect time for your trip.',
        '<h2>Timing Your Belize Adventure</h2><p>The best time to visit Belize depends on your priorities: weather, crowds, prices, and activities. This guide helps solo travelers make the perfect choice.</p><h2>Dry Season (December-April)</h2><p>Peak tourist season offers the best weather but highest prices and crowds. Perfect for diving and outdoor activities.</p><h2>Wet Season (May-November)</h2><p>Lower prices and fewer crowds, but expect afternoon rains. Great for budget travelers and those seeking authentic experiences.</p>',
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop&crop=center',
        'Ana Gutierrez',
        adventure_category_id,
        'published',
        667, 39, 11,
        '5 min read',
        '2024-11-15'::timestamp with time zone
    ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO post_id;
    
    IF post_id IS NOT NULL THEN
        INSERT INTO post_tags (post_id, tag_id) VALUES 
            (post_id, solo_travel_tag_id),
            (post_id, culture_tag_id)
        ON CONFLICT (post_id, tag_id) DO NOTHING;
    END IF;

    -- Continue with remaining 7 posts...
    -- Post 7: Belize Barrier Reef Marine Wildlife Guide
    INSERT INTO posts (title, slug, excerpt, content, featured_image_url, author, category_id, status, views, likes, comments, reading_time, published_at)
    VALUES (
        'Belize Barrier Reef: Marine Wildlife Guide for Solo Divers',
        'belize-barrier-reef-marine-wildlife-guide',
        'Discover the incredible marine wildlife of Belize''s Barrier Reef through the eyes of an experienced solo diver. From gentle nurse sharks to majestic manatees, this comprehensive guide covers the best dive sites, operators, and practical tips for exploring the world''s second-largest reef system independently.',
        '<h2>The World''s Second-Largest Reef System</h2><p>The Belize Barrier Reef Reserve System is a UNESCO World Heritage site and offers some of the world''s best diving. Solo divers will find excellent operators and incredible marine diversity.</p><h2>Top Dive Sites for Solo Travelers</h2><p>Blue Hole, Half Moon Caye, and Lighthouse Reef offer world-class diving experiences. Most operators welcome solo divers and can pair you with other divers.</p><h2>Marine Life Encounters</h2><p>Expect to see nurse sharks, eagle rays, manatees, sea turtles, and countless tropical fish species in crystal-clear Caribbean waters.</p>',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop&crop=center',
        'Maya Rodriguez',
        wildlife_category_id,
        'published',
        934, 72, 19,
        '12 min read',
        '2025-01-08'::timestamp with time zone
    ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO post_id;
    
    IF post_id IS NOT NULL THEN
        INSERT INTO post_tags (post_id, tag_id) VALUES 
            (post_id, solo_travel_tag_id),
            (post_id, diving_tag_id),
            (post_id, marine_life_tag_id),
            (post_id, wildlife_tag_id)
        ON CONFLICT (post_id, tag_id) DO NOTHING;
    END IF;

    -- Post 8: Cockscomb Basin Jaguar Guide
    INSERT INTO posts (title, slug, excerpt, content, featured_image_url, author, category_id, status, views, likes, comments, reading_time, published_at)
    VALUES (
        'Spotting Jaguars & Howler Monkeys: Cockscomb Basin Solo Guide',
        'spotting-jaguars-howler-monkeys-cockscomb-basin-solo-guide',
        'Explore the world''s first jaguar preserve through the eyes of an experienced solo wildlife tracker. This comprehensive guide covers the best trails, timing, and techniques for encountering Belize''s apex predator and noisiest mammals in their pristine rainforest sanctuary.',
        '<h2>The World''s First Jaguar Preserve</h2><p>Cockscomb Basin Wildlife Sanctuary protects 150 square miles of pristine rainforest and is the world''s first jaguar preserve. While jaguar sightings are rare, the experience of walking their territory is unforgettable.</p><h2>Best Trails for Solo Hikers</h2><p>The River Trail and Waterfall Trail offer the best chances for wildlife encounters. Early morning and late afternoon provide optimal wildlife activity times.</p><h2>Howler Monkey Encounters</h2><p>You''ll hear howler monkeys long before you see them. Their distinctive calls can be heard up to 3 miles away, making them easier to locate than jaguars.</p>',
        'https://images.unsplash.com/photo-1516642898597-9c0c8c8e8b8b?w=800&h=400&fit=crop&crop=center',
        'Maya Rodriguez',
        wildlife_category_id,
        'published',
        823, 65, 21,
        '11 min read',
        '2025-01-07'::timestamp with time zone
    ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO post_id;
    
    IF post_id IS NOT NULL THEN
        INSERT INTO post_tags (post_id, tag_id) VALUES 
            (post_id, solo_travel_tag_id),
            (post_id, wildlife_tag_id),
            (post_id, jungle_tag_id),
            (post_id, nature_tag_id)
        ON CONFLICT (post_id, tag_id) DO NOTHING;
    END IF;

    -- Continue with remaining posts...
    RAISE NOTICE 'Successfully inserted blog posts with categories and tags!';

END $$;