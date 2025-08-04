-- INSERT ONLY THE MISSING 7 BLOG POSTS
-- Simple, clean script

-- Insert the 7 missing posts one by one
INSERT INTO posts (title, slug, excerpt, content, featured_image_url, author, category_id, status, views, likes, comments, reading_time, published_at)
VALUES 
(
  'Belize Barrier Reef: Marine Wildlife Guide for Solo Divers', 
  'belize-barrier-reef-marine-wildlife-guide', 
  'Discover the incredible marine wildlife of Belize''s Barrier Reef through the eyes of an experienced solo diver. From gentle nurse sharks to majestic manatees, this comprehensive guide covers the best dive sites.', 
  '<h2>The World''s Second-Largest Reef System</h2><p>The Belize Barrier Reef Reserve System is a UNESCO World Heritage site and offers some of the world''s best diving. Solo divers will find excellent operators and incredible marine diversity.</p><h2>Top Dive Sites</h2><p>Blue Hole, Half Moon Caye, and Lighthouse Reef offer world-class diving experiences. Most operators welcome solo divers and can pair you with other divers.</p><h2>Marine Life Encounters</h2><p>Expect to see nurse sharks, eagle rays, manatees, sea turtles, and countless tropical fish species in crystal-clear Caribbean waters.</p>', 
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop&crop=center', 
  'Maya Rodriguez', 
  (SELECT id FROM categories WHERE slug = 'wildlife-nature'), 
  'published', 
  934, 72, 19, 
  '12 min read', 
  '2025-01-08'::timestamp with time zone
),
(
  'Spotting Jaguars & Howler Monkeys: Cockscomb Basin Solo Guide', 
  'spotting-jaguars-howler-monkeys-cockscomb-basin-solo-guide', 
  'Explore the world''s first jaguar preserve through the eyes of an experienced solo wildlife tracker. This comprehensive guide covers the best trails, timing, and techniques for encountering Belize''s apex predator.', 
  '<h2>The World''s First Jaguar Preserve</h2><p>Cockscomb Basin Wildlife Sanctuary protects 150 square miles of pristine rainforest and is the world''s first jaguar preserve. While jaguar sightings are rare, the experience of walking their territory is unforgettable.</p><h2>Best Trails for Solo Hikers</h2><p>The River Trail and Waterfall Trail offer the best chances for wildlife encounters. Early morning and late afternoon provide optimal wildlife activity times.</p><h2>Howler Monkey Encounters</h2><p>You''ll hear howler monkeys long before you see them. Their distinctive calls can be heard up to 3 miles away, making them easier to locate than jaguars.</p>', 
  'https://images.unsplash.com/photo-1516642898597-9c0c8c8e8b8b?w=800&h=400&fit=crop&crop=center', 
  'Maya Rodriguez', 
  (SELECT id FROM categories WHERE slug = 'wildlife-nature'), 
  'published', 
  823, 65, 21, 
  '11 min read', 
  '2025-01-07'::timestamp with time zone
),
(
  'Solo Female Travel Safety in Belize: Real Experiences & Tips', 
  'solo-female-travel-safety-belize-real-experiences-tips', 
  'Eight years of solo female travel across Belize revealed that preparation trumps paranoia. This unvarnished guide covers the real safety considerations, cultural awareness, and practical strategies for women exploring Belize independently.', 
  '<h2>Real Talk: Solo Female Travel in Belize</h2><p>After eight years of solo female travel across Belize, I''ve learned that preparation trumps paranoia. This guide covers the real safety considerations and practical strategies for women exploring Belize independently with confidence.</p><h2>Cultural Awareness</h2><p>Understanding local customs and cultural norms helps female travelers navigate social situations with confidence and respect.</p><h2>Transportation Safety</h2><p>From chicken buses to domestic flights, knowing your transportation options and safety protocols is essential for female solo travelers.</p>', 
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop&crop=center', 
  'Maya Rodriguez', 
  (SELECT id FROM categories WHERE slug = 'safety-security'), 
  'published', 
  743, 58, 16, 
  '9 min read', 
  '2025-01-06'::timestamp with time zone
),
(
  'Navigating Belize City Safely: A Solo Traveler''s Street-Smart Guide', 
  'navigating-belize-city-safely-solo-traveler-street-smart-guide', 
  'Belize City gets unfairly demonized by outdated guidebooks. This street-smart navigation guide reveals how to safely explore the cultural heart of Belize, from transportation hubs to authentic local experiences.', 
  '<h2>Beyond the Reputation</h2><p>Belize City gets unfairly demonized by outdated guidebooks. This street-smart navigation guide reveals how to safely explore the cultural heart of Belize, from transportation hubs to authentic local experiences, without falling victim to common tourist fears.</p><h2>Transportation Hubs</h2><p>The city serves as the main transportation hub for the country, making it unavoidable for most travelers. Understanding how to navigate safely is essential.</p><h2>Local Experiences</h2><p>Beyond the warnings lie authentic cultural experiences, from local markets to historical sites that showcase Belize''s rich heritage.</p>', 
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop&crop=center', 
  'Maya Rodriguez', 
  (SELECT id FROM categories WHERE slug = 'safety-security'), 
  'published', 
  612, 44, 13, 
  '8 min read', 
  '2025-01-05'::timestamp with time zone
),
(
  'Belize on $30/Day: Ultimate Backpacker''s Survival Guide', 
  'belize-30-dollars-day-ultimate-backpacker-survival-guide', 
  'When stranded in expensive Belize with $210 for seven days, I discovered that extreme budget travel reveals the country''s authentic heart. This survival guide shows exactly how to stretch every dollar while eating well, sleeping safely, and experiencing real Belizean culture.', 
  '<h2>The $30/Day Challenge</h2><p>When stranded in expensive Belize with $210 for seven days, I discovered that extreme budget travel reveals the country''s authentic heart. This survival guide shows exactly how to stretch every dollar while eating well, sleeping safely, and experiencing real Belizean culture.</p><h2>Accommodation Hacks</h2><p>From camping to work exchanges, there are creative ways to minimize accommodation costs while maximizing cultural immersion.</p><h2>Food Strategies</h2><p>Local food stalls and markets offer authentic meals at fraction of tourist restaurant prices. Know what to order and where to find it.</p>', 
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=400&fit=crop&crop=center', 
  'Maya Rodriguez', 
  (SELECT id FROM categories WHERE slug = 'budget-travel'), 
  'published', 
  856, 67, 24, 
  '13 min read', 
  '2025-01-04'::timestamp with time zone
),
(
  'Capturing Belize''s Blue Hole: Photography Tips for Solo Travelers', 
  'capturing-belize-blue-hole-photography-tips-solo-travelers', 
  'After photographing the Blue Hole from air, surface, and 130 feet underwater, I''ve learned this natural wonder rewards technical knowledge over expensive equipment. This comprehensive guide covers aerial flights, surface techniques, and underwater challenges for solo photographers.', 
  '<h2>Photographing a Natural Wonder</h2><p>After photographing the Blue Hole from air, surface, and 130 feet underwater, I''ve learned this natural wonder rewards technical knowledge over expensive equipment. This comprehensive guide covers aerial flights, surface techniques, and underwater challenges for solo photographers.</p><h2>Aerial Photography</h2><p>Scenic flights offer the classic Blue Hole shot, but timing and positioning are crucial for the perfect aerial photograph.</p><h2>Underwater Challenges</h2><p>Diving the Blue Hole with a camera requires advanced skills and proper equipment. The depth and conditions present unique challenges for underwater photographers.</p>', 
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop&crop=center', 
  'Maya Rodriguez', 
  (SELECT id FROM categories WHERE slug = 'photography'), 
  'published', 
  689, 52, 18, 
  '10 min read', 
  '2025-01-03'::timestamp with time zone
),
(
  'Instagram-Worthy Spots in Belize: Hidden Photography Gems', 
  'instagram-worthy-spots-belize-hidden-photography-gems', 
  'Beyond the over-tagged tourist spots lie Belize''s truly hidden photography gems. This insider guide reveals secret waterfalls, pristine Maya ruins, and untouched natural wonders that will make your followers stop scrolling and start planning their own adventures.', 
  '<h2>Beyond the Tourist Shots</h2><p>Beyond the over-tagged tourist spots lie Belize''s truly hidden photography gems. This insider guide reveals secret waterfalls, pristine Maya ruins, and untouched natural wonders that will make your followers stop scrolling and start planning their own adventures.</p><h2>Secret Waterfalls</h2><p>Hidden cascades in the Mountain Pine Ridge offer Instagram gold without the crowds of popular tourist destinations.</p><h2>Pristine Maya Ruins</h2><p>Lesser-known archaeological sites provide dramatic backdrops without the tourist hordes found at mainstream locations.</p>', 
  'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=400&fit=crop&crop=center', 
  'Maya Rodriguez', 
  (SELECT id FROM categories WHERE slug = 'photography'), 
  'published', 
  945, 78, 31, 
  '11 min read', 
  '2025-01-02'::timestamp with time zone
)
ON CONFLICT (slug) DO NOTHING;