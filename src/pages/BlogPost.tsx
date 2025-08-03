import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  User, 
  Clock, 
  Share2, 
  Facebook, 
  Twitter, 
  Instagram,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  MessageCircle,
  ArrowUp
} from 'lucide-react';

interface BlogPostData {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishDate: string;
  lastModified: string;
  readingTime: string;
  category: string;
  tags: string[];
  featuredImage: string;
  metaDescription: string;
  keywords: string[];
  views: number;
  likes: number;
  comments: number;
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['blog', 'common', 'navigation']);
  
  const [blogPost, setBlogPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [tableOfContents, setTableOfContents] = useState<Array<{id: string, title: string}>>([]);
  const [isLiked, setIsLiked] = useState(false);

  // Blog post data mapping
  const blogPostMap: Record<string, BlogPostData> = {
    '10-solo-adventures-belize': {
      id: 1,
      title: t('blog:posts.post1.title'),
      content: t('blog:posts.post1.fullContent'),
      excerpt: t('blog:posts.post1.excerpt'),
      author: 'Maya Rodriguez',
      publishDate: '2024-12-15',
      lastModified: '2024-12-15',
      readingTime: '8 min read',
      category: 'Adventures',
      tags: ['Solo Travel', 'Adventure', 'Belize', 'Travel Tips'],
      featuredImage: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=1200&h=600&fit=crop&crop=center',
      metaDescription: t('blog:posts.post1.metaDescription'),
      keywords: ['solo travel belize', 'belize adventures', 'solo adventures', 'belize travel guide'],
      views: 1247,
      likes: 89,
      comments: 23
    },
    'solo-travel-safety-belize': {
      id: 2,
      title: t('blog:posts.post2.title'),
      content: t('blog:posts.post2.fullContent'),
      excerpt: t('blog:posts.post2.excerpt'),
      author: 'Carlos Mendez',
      publishDate: '2024-12-10',
      lastModified: '2024-12-10',
      readingTime: '6 min read',
      category: 'Safety',
      tags: ['Safety', 'Solo Travel', 'Travel Tips', 'Belize'],
      featuredImage: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1200&h=600&fit=crop&crop=center',
      metaDescription: t('blog:posts.post2.metaDescription'),
      keywords: ['belize safety', 'solo travel safety', 'travel safety tips', 'belize travel guide'],
      views: 987,
      likes: 76,
      comments: 18
    },
    'san-ignacio-week-guide': {
      id: 3,
      title: t('blog:posts.post3.title'),
      content: t('blog:posts.post3.fullContent'),
      excerpt: t('blog:posts.post3.excerpt'),
      author: 'Sarah Thompson',
      publishDate: '2024-12-05',
      lastModified: '2024-12-05',
      readingTime: '10 min read',
      category: 'Destinations',
      tags: ['San Ignacio', 'Budget Travel', 'Luxury Travel', 'Belize'],
      featuredImage: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200&h=600&fit=crop&crop=center',
      metaDescription: t('blog:posts.post3.metaDescription'),
      keywords: ['san ignacio belize', 'belize budget travel', 'belize luxury travel', 'san ignacio guide'],
      views: 1156,
      likes: 94,
      comments: 31
    },
    'wildlife-watching-solo': {
      id: 4,
      title: t('blog:posts.post4.title'),
      content: t('blog:posts.post4.fullContent'),
      excerpt: t('blog:posts.post4.excerpt'),
      author: 'Elena Castro',
      publishDate: '2024-11-28',
      lastModified: '2024-11-28',
      readingTime: '7 min read',
      category: 'Wildlife',
      tags: ['Wildlife', 'Solo Travel', 'Nature', 'Photography'],
      featuredImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&h=600&fit=crop&crop=center',
      metaDescription: t('blog:posts.post4.metaDescription'),
      keywords: ['belize wildlife', 'wildlife watching', 'solo wildlife tours', 'belize animals'],
      views: 892,
      likes: 67,
      comments: 15
    },
    'budget-belize-solo-travel': {
      id: 5,
      title: t('blog:posts.post5.title'),
      content: t('blog:posts.post5.fullContent'),
      excerpt: t('blog:posts.post5.excerpt'),
      author: 'Mike Johnson',
      publishDate: '2024-11-20',
      lastModified: '2024-11-20',
      readingTime: '9 min read',
      category: 'Budget Travel',
      tags: ['Budget Travel', 'Solo Travel', 'Money Saving', 'Backpacking'],
      featuredImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1200&h=600&fit=crop&crop=center',
      metaDescription: t('blog:posts.post5.metaDescription'),
      keywords: ['budget belize travel', 'cheap belize travel', 'belize backpacking', 'budget solo travel'],
      views: 1543,
      likes: 128,
      comments: 42
    },
    'best-time-visit-belize': {
      id: 6,
      title: t('blog:posts.post6.title'),
      content: t('blog:posts.post6.fullContent'),
      excerpt: t('blog:posts.post6.excerpt'),
      author: 'Ana Gutierrez',
      publishDate: '2024-11-15',
      lastModified: '2024-11-15',
      readingTime: '6 min read',
      category: 'Travel Planning',
      tags: ['Travel Planning', 'Weather', 'Seasons', 'Travel Tips'],
      featuredImage: 'https://images.unsplash.com/photo-1518495973542-4543c06a5843?w=1200&h=600&fit=crop&crop=center',
      metaDescription: t('blog:posts.post6.metaDescription'),
      keywords: ['best time visit belize', 'belize weather', 'belize seasons', 'when to visit belize'],
      views: 756,
      likes: 54,
      comments: 12
    },
    'belize-barrier-reef-marine-wildlife-guide': {
      id: 7,
      title: 'Belize Barrier Reef: Marine Wildlife Guide for Solo Divers',
      content: `<h2 id="essential-marine-wildlife">Essential Marine Wildlife You'll Encounter</h2>
      
      <p><strong>Nurse Sharks at Shark Ray Alley</strong>: Don't let the name intimidate you. These gentle giants, measuring up to 10 feet, are completely harmless to humans. During my first dive here, I counted over 30 nurse sharks gliding gracefully around me. The best time to visit is early morning when they're most active. Cost: $85 USD for a half-day snorkeling tour from San Pedro.</p>
      
      <p><strong>Southern Stingrays</strong>: These magnificent creatures with wingspans reaching 5 feet are surprisingly docile. At Shark Ray Alley, they'll swim right up to you, expecting the fish scraps that dive operators provide. Pro tip: Keep your hands to yourself – touching disrupts their protective slime coating.</p>
      
      <p><strong>Manatees in Southern Waters</strong>: Placencia offers the best chance to encounter these endangered "sea cows." I spent three magical hours with a mother and calf near Laughing Bird Caye National Park. These gentle giants can weigh up to 1,200 pounds and are incredibly curious about human visitors. Manatee tours cost $120 USD and include lunch.</p>
      
      <h2 id="reef-fish-diversity">Reef Fish Diversity That'll Blow Your Mind</h2>
      
      <p>The Belize reef system hosts over 500 fish species. During a single dive at Hol Chan Marine Reserve, I spotted parrotfish creating that distinctive crunching sound as they fed on coral, angelfish in brilliant blues and yellows, and schools of yellowtail snappers creating living curtains of gold.</p>
      
      <p><strong>Photography goldmine</strong>: The Blue Hole, while famous for its geological formation, disappointed me wildlife-wise. Instead, head to Turneffe Atoll where I encountered reef sharks, eagle rays, and the elusive permit fish that sport fishermen dream about.</p>
      
      <h2 id="solo-diver-safety">Solo Diver Safety & Practical Tips</h2>
      
      <p><strong>Certification Requirements</strong>: Bring your PADI or SSI certification – Belize dive operators are strict about credentials. Advanced Open Water is recommended for deeper sites like the Blue Hole (130 feet).</p>
      
      <p><strong>Best Dive Operators for Solo Travelers</strong>:</p>
      <ul>
        <li><strong>Ambergris Divers</strong> (San Pedro): Excellent for meeting other solo travelers</li>
        <li><strong>Splash Dive Center</strong> (Placencia): Smaller groups, more personalized attention</li>
        <li><strong>Hamanasi Adventure Resort</strong> (Hopkins): All-inclusive packages perfect for solo female travelers</li>
      </ul>
      
      <p><strong>Budget Breakdown</strong>:</p>
      <ul>
        <li>Two-tank reef dive: $75-95 USD</li>
        <li>Blue Hole day trip: $285 USD (includes gear and lunch)</li>
        <li>Nitrox certification: $185 USD</li>
        <li>Gear rental (full set): $35 USD/day</li>
      </ul>
      
      <h2 id="seasonal-wildlife-patterns">Seasonal Wildlife Patterns</h2>
      
      <p><strong>Dry Season (December-April)</strong>: Clearest visibility (100+ feet) but higher prices and crowds. Whale shark season runs February-June at Gladden Spit.</p>
      
      <p><strong>Wet Season (June-November)</strong>: Fewer crowds, lower prices, but occasional storms. I've had phenomenal diving in September with 80-foot visibility and abundant marine life.</p>
      
      <h2 id="conservation-reality">Conservation Reality Check</h2>
      
      <p>Climate change and tourism pressure are real threats. I've witnessed coral bleaching firsthand and declining fish populations over my eight years diving here. Choose operators committed to reef protection – many now use mooring buoys instead of anchoring and practice responsible wildlife interaction.</p>
      
      <p><strong>How You Can Help</strong>: Avoid touching coral, use reef-safe sunscreen, and consider donating to the Belize Audubon Society's marine conservation programs.</p>
      
      <h2 id="solo-female-perspective">The Solo Female Perspective</h2>
      
      <p>Belize's diving community welcomed me warmly as a solo female traveler. Dive boats typically have 6-8 divers, making it easy to connect with like-minded ocean lovers. I've made lifelong friends on these trips and found dive buddies for future Central America adventures.</p>
      
      <p><strong>Bottom Line</strong>: Belize's marine wildlife offers world-class diving accessible to solo travelers. The reef's proximity to shore (many sites are 10-15 minutes by boat) makes it perfect for nervous first-time solo divers, while advanced sites provide thrills for experienced underwater explorers.</p>
      
      <p>Budget $150-200 USD daily for diving, accommodation, and meals. Trust me – every dollar spent exploring these underwater gardens supports local communities and conservation efforts protecting this irreplaceable marine ecosystem.</p>`,
      excerpt: 'Discover the incredible marine wildlife of Belize\'s Barrier Reef through the eyes of an experienced solo diver. From gentle nurse sharks to majestic manatees, this comprehensive guide covers the best dive sites, operators, and practical tips for exploring the world\'s second-largest reef system independently.',
      author: 'Maya Rodriguez',
      publishDate: '2025-01-08',
      lastModified: '2025-01-08',
      readingTime: '8 min read',
      category: 'Wildlife',
      tags: ['Wildlife', 'Solo Travel', 'Diving', 'Marine Life', 'Photography', 'Safety'],
      featuredImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=600&fit=crop&crop=center',
      metaDescription: 'Complete marine wildlife guide for solo divers in Belize. Discover nurse sharks, stingrays, manatees, and 500+ fish species in the world\'s second-largest barrier reef system.',
      keywords: ['belize diving', 'barrier reef wildlife', 'solo diving belize', 'marine life belize', 'belize snorkeling', 'blue hole diving'],
      views: 0,
      likes: 0,
      comments: 0
    },
    'spotting-jaguars-howler-monkeys-cockscomb-basin-solo-guide': {
      id: 8,
      title: 'Spotting Jaguars & Howler Monkeys: Cockscomb Basin Solo Guide',
      content: `<h2 id="cockscomb-jaguar-preserve">Cockscomb: World's First Jaguar Preserve</h2>
      <p>The Cockscomb Basin Wildlife Sanctuary protects 150 square miles of Maya Mountains rainforest – the world's first jaguar preserve. This isn't just marketing hype; I've documented jaguar tracks, scat, and scratch marks throughout my seven solo visits here. The sanctuary supports an estimated 60-80 jaguars, the highest density in Central America.</p>
      
      <h2 id="howler-monkey-encounters">Howler Monkey Encounters: Guaranteed</h2>
      <p><strong>Best Viewing Times</strong>: Dawn chorus (5:30-7:00 AM) and dusk settle-down (4:30-6:00 PM). These vegetarians move slowly through the canopy, making them perfect for solo wildlife photographers. I've counted troops of 15+ individuals feeding on strangler figs near the Red Bank Trail.</p>
      
      <h2 id="jaguar-tracking">Jaguar Tracking: Realistic Expectations</h2>
      <p><strong>Reality Check</strong>: In 50+ solo jungle days across Belize, I've glimpsed jaguars twice. Both sightings lasted under 10 seconds. Don't expect National Geographic moments – focus on sign reading and ecological understanding instead.</p>
      
      <h2 id="solo-safety">Solo Safety in Jaguar Territory</h2>
      <p><strong>Essential Protocol</strong>: Jaguars avoid human contact. In eight years of Central America solo travel, including nights camping in Corcovado and Darién, I've never felt threatened by big cats. They're ambush predators that prefer the cover of darkness.</p>`,
      excerpt: 'Explore the world\'s first jaguar preserve through the eyes of an experienced solo wildlife tracker. This comprehensive guide covers the best trails, timing, and techniques for encountering Belize\'s apex predator and noisiest mammals in their pristine rainforest sanctuary.',
      author: 'Maya Rodriguez',
      publishDate: '2025-01-07',
      lastModified: '2025-01-07',
      readingTime: '8 min read',
      category: 'Wildlife',
      tags: ['Wildlife', 'Solo Travel', 'Jungle', 'Photography', 'Safety', 'Nature'],
      featuredImage: 'https://images.unsplash.com/photo-1516642898597-9c0c8c8e8b8b?w=1200&h=600&fit=crop&crop=center',
      metaDescription: 'Solo wildlife tracking guide for Cockscomb Basin Wildlife Sanctuary. Learn jaguar tracking techniques, howler monkey viewing tips, and safety protocols for Belize\'s premier wildlife preserve.',
      keywords: ['cockscomb basin', 'jaguar tracking', 'howler monkeys', 'belize wildlife', 'solo jungle trekking'],
      views: 0,
      likes: 0,
      comments: 0
    },
    'solo-female-travel-safety-belize-real-experiences-tips': {
      id: 9,
      title: 'Solo Female Travel Safety in Belize: Real Experiences & Tips',
      content: `<h2 id="belize-city-navigation">Belize City: Navigation Without Fear</h2>
      <p><strong>Reality Check</strong>: Belize City gets a bad reputation, but violent crime primarily affects locals involved in gang activity. Tourist areas like the Fort George district, cruise ship terminal, and Museum of Belize remain relatively safe during daylight hours.</p>
      
      <h2 id="rural-belize-challenges">Rural Belize: Different Challenges</h2>
      <p><strong>Toledo District Experience</strong>: I've homestayed with Q'eqchi Maya families in remote villages like Blue Creek and Laguna – some of Belize's most isolated communities. Rural Belizeans are incredibly hospitable and protective of female guests.</p>
      
      <h2 id="cultural-considerations">Cultural Considerations</h2>
      <p><strong>Dress Codes</strong>: Belize's conservative Christian culture expects modest dress, especially in rural areas and when visiting religious sites. I pack lightweight long pants and sleeved shirts for cultural sites.</p>
      
      <h2 id="accommodation-safety">Accommodation Safety Strategies</h2>
      <p><strong>Safety Features to Demand</strong>: Locks that work from inside (test them!), ground floor rooms with secure windows, 24-hour front desk or owner presence, well-lit parking and walkways.</p>`,
      excerpt: 'Eight years of solo female travel across Belize revealed that preparation trumps paranoia. This unvarnished guide covers the real safety considerations, cultural awareness, and practical strategies for women exploring Belize independently with confidence.',
      author: 'Maya Rodriguez',
      publishDate: '2025-01-06',
      lastModified: '2025-01-06',
      readingTime: '10 min read',
      category: 'Safety',
      tags: ['Safety', 'Solo Travel', 'Female Travel', 'Cultural Awareness', 'Travel Tips'],
      featuredImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=600&fit=crop&crop=center',
      metaDescription: 'Comprehensive solo female travel safety guide for Belize based on eight years of real experiences. Cultural considerations, accommodation strategies, and practical safety tips.',
      keywords: ['solo female travel belize', 'belize safety women', 'female travel safety', 'solo women belize'],
      views: 0,
      likes: 0,
      comments: 0
    },
    'navigating-belize-city-safely-solo-traveler-street-smart-guide': {
      id: 10,
      title: 'Navigating Belize City Safely: A Solo Traveler\'s Street-Smart Guide',
      content: `<h2 id="understanding-geography">Understanding Belize City's Geography</h2>
      <p><strong>Safe Tourist Core</strong>: The Fort George area, bounded by Marine Parade Boulevard, Cork Street, and the seafront, remains relatively secure during daylight. This historic district houses the Tourism Village, Museum of Belize, Government House, and St. John's Cathedral.</p>
      
      <h2 id="arrival-departure">Arrival and Departure Strategies</h2>
      <p><strong>From Belize International Airport</strong>: Official taxis charge $25 USD to downtown hotels. Negotiate firmly or use airport shuttles ($12 USD). Avoid unmarked vehicles offering cheaper rides – it's not worth the risk.</p>
      
      <h2 id="accommodation-strategy">Accommodation Strategy</h2>
      <p><strong>Security Priorities</strong>: Ensure rooms lock from inside, windows secure properly, and front desk operates 24 hours. Pay extra for Fort George area locations – the safety premium is worth it.</p>
      
      <h2 id="cultural-attractions">Cultural Attractions</h2>
      <p>Museum of Belize: Essential history lesson, air-conditioned respite. Government House: Colonial architecture, free admission. St. John's Cathedral: Historic Anglican cathedral, oldest in Central America.</p>`,
      excerpt: 'Belize City gets unfairly demonized by outdated guidebooks. This street-smart navigation guide reveals how to safely explore the cultural heart of Belize, from transportation hubs to authentic local experiences, without falling victim to common tourist fears.',
      author: 'Maya Rodriguez',
      publishDate: '2025-01-05',
      lastModified: '2025-01-05',
      readingTime: '9 min read',
      category: 'Safety',
      tags: ['Safety', 'Solo Travel', 'Urban Navigation', 'Belize City', 'Street Smart'],
      featuredImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=600&fit=crop&crop=center',
      metaDescription: 'Street-smart guide to navigating Belize City safely as a solo traveler. Transportation, accommodation, and cultural attractions with practical safety strategies.',
      keywords: ['belize city safety', 'solo travel belize city', 'belize city guide', 'urban navigation belize'],
      views: 0,
      likes: 0,
      comments: 0
    },
    'belize-30-dollars-day-ultimate-backpacker-survival-guide': {
      id: 11,
      title: 'Belize on $30/Day: Ultimate Backpacker\'s Survival Guide',
      content: `<h2 id="accommodation-8-12-usd">Accommodation: $8-12 USD Daily</h2>
      <p><strong>Homestays are King</strong>: Skip hostels entirely. Belizean families offer spare rooms for $10-15 USD nightly, including breakfast and often dinner. These aren't advertised online – ask at local buses, markets, or churches.</p>
      
      <h2 id="transportation-3-8-usd">Transportation: $3-8 USD Daily</h2>
      <p><strong>Local Bus Mastery</strong>: Forget tourist shuttles costing $25+ USD. Belize's chicken bus network connects everywhere for $1-4 BZD ($0.50-2 USD) per ride.</p>
      
      <h2 id="food-6-12-usd">Food: $6-12 USD Daily</h2>
      <p><strong>Street Food Champions</strong>: Rice and beans with chicken: $4-6 BZD ($2-3 USD), available everywhere. Fry jacks: $1 BZD (50 cents) each, perfect breakfast with eggs.</p>
      
      <h2 id="money-saving-hacks">Money-Saving Hacks</h2>
      <p><strong>Negotiation Culture</strong>: Politely negotiate accommodation prices, especially for multiple nights. "I'm traveling on very small budget" often yields discounts.</p>`,
      excerpt: 'When stranded in expensive Belize with $210 for seven days, I discovered that extreme budget travel reveals the country\'s authentic heart. This survival guide shows exactly how to stretch every dollar while eating well, sleeping safely, and experiencing real Belizean culture.',
      author: 'Maya Rodriguez',
      publishDate: '2025-01-04',
      lastModified: '2025-01-04',
      readingTime: '12 min read',
      category: 'Budget Travel',
      tags: ['Budget Travel', 'Solo Travel', 'Backpacking', 'Money Saving', 'Extreme Budget'],
      featuredImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&h=600&fit=crop&crop=center',
      metaDescription: 'Complete guide to traveling Belize on $30 per day. Budget accommodation, transportation, food, and activities for extreme budget backpackers.',
      keywords: ['belize budget travel', '30 dollars day belize', 'backpacking belize cheap', 'budget belize guide'],
      views: 0,
      likes: 0,
      comments: 0
    },
    'capturing-belize-blue-hole-photography-tips-solo-travelers': {
      id: 12,
      title: 'Capturing Belize\'s Blue Hole: Photography Tips for Solo Travelers',
      content: `<h2 id="aerial-photography">Aerial Photography: The Money Shot</h2>
      <p><strong>Flight Options for Solo Travelers</strong>: Maya Island Air scenic flights: $195 USD per person, 30-minute circuit. Tropic Air Blue Hole tours: $220 USD including Lighthouse Reef overflight.</p>
      
      <h2 id="surface-photography">Surface Photography: Bringing Context</h2>
      <p><strong>Golden Hour Magic</strong>: Most Blue Hole tours arrive at midday when harsh overhead lighting flattens the scene. Convince your operator to arrive early (7-8 AM) or stay late (4-5 PM) for dramatic side lighting.</p>
      
      <h2 id="underwater-photography">Underwater Photography: The Ultimate Challenge</h2>
      <p><strong>Certification Requirements</strong>: Advanced Open Water minimum, Deep Specialty recommended. The Blue Hole's main chamber reaches 407 feet, but recreational diving stops at 130 feet where impressive stalactite formations begin.</p>
      
      <h2 id="equipment-recommendations">Equipment Recommendations for Solo Travelers</h2>
      <p><strong>Professional Setup</strong> ($3000-5000 USD): Full-frame camera body with backup, 14-24mm and 70-200mm lenses, underwater housing with strobes, drone with multiple batteries.</p>`,
      excerpt: 'After photographing the Blue Hole from air, surface, and 130 feet underwater, I\'ve learned this natural wonder rewards technical knowledge over expensive equipment. This comprehensive guide covers aerial flights, surface techniques, and underwater challenges for solo photographers.',
      author: 'Maya Rodriguez',
      publishDate: '2025-01-03',
      lastModified: '2025-01-03',
      readingTime: '11 min read',
      category: 'Photography',
      tags: ['Photography', 'Solo Travel', 'Blue Hole', 'Underwater Photography', 'Travel Photography'],
      featuredImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop&crop=center',
      metaDescription: 'Complete Blue Hole photography guide for solo travelers. Aerial, surface, and underwater photography techniques with equipment recommendations and practical tips.',
      keywords: ['blue hole photography', 'belize underwater photography', 'aerial photography belize', 'travel photography tips'],
      views: 0,
      likes: 0,
      comments: 0
    },
    'instagram-worthy-spots-belize-hidden-photography-gems': {
      id: 13,
      title: 'Instagram-Worthy Spots in Belize: Hidden Photography Gems',
      content: `<h2 id="rio-blanco-waterfall">Rio Blanco National Park's Hidden Waterfall</h2>
      <p><strong>Location</strong>: Toledo District, 45 minutes from Punta Gorda. <strong>Why It's Special</strong>: Three-tiered waterfall with natural swimming pools, virtually unknown to tourists. <strong>Photography Tips</strong>: Early morning light (7-9 AM) creates rainbow effects in the mist.</p>
      
      <h2 id="caracol-temple-sunrise">Caracol's Temple IV Sunrise</h2>
      <p><strong>Location</strong>: Cayo District, 2.5 hours from San Ignacio. <strong>Why It's Special</strong>: Highest man-made structure in Belize, 360-degree jungle views. <strong>Photography Tips</strong>: Arrive 5:30 AM for sunrise over endless rainforest canopy.</p>
      
      <h2 id="monkey-river-manatees">Monkey River Manatee Encounters</h2>
      <p><strong>Location</strong>: Southern Belize, Placencia Peninsula access. <strong>Why It's Special</strong>: Gentle manatees in crystal-clear river, underwater photography possible. <strong>Photography Tips</strong>: Underwater housing essential, respectful distance required.</p>`,
      excerpt: 'Beyond the over-tagged tourist spots lie Belize\'s truly hidden photography gems. This insider guide reveals secret waterfalls, pristine Maya ruins, and untouched natural wonders that will make your followers stop scrolling and start planning their own adventures.',
      author: 'Maya Rodriguez',
      publishDate: '2025-01-02',
      lastModified: '2025-01-02',
      readingTime: '7 min read',
      category: 'Photography',
      tags: ['Photography', 'Solo Travel', 'Hidden Gems', 'Instagram', 'Secret Spots'],
      featuredImage: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&h=600&fit=crop&crop=center',
      metaDescription: 'Discover Belize\'s hidden photography gems beyond the tourist trail. Secret waterfalls, pristine ruins, and untouched natural wonders for Instagram-worthy shots.',
      keywords: ['belize hidden gems', 'instagram spots belize', 'secret photography locations', 'belize off beaten path'],
      views: 0,
      likes: 0,
      comments: 0
    }
  };

  // Function to extract table of contents from blog post content
  const extractTableOfContents = (content: string) => {
    const headerRegex = /<h2[^>]*id="([^"]*)"[^>]*>(.*?)<\/h2>/g;
    const toc: Array<{id: string, title: string}> = [];
    let match;
    
    while ((match = headerRegex.exec(content)) !== null) {
      const id = match[1];
      const title = match[2].replace(/<[^>]*>/g, ''); // Remove any HTML tags from title
      toc.push({ id, title });
    }
    
    return toc;
  };

  // Function to translate a tag
  const translateTag = (tag: string) => {
    const translatedTag = t(`blog:tags.${tag}`, { defaultValue: tag });
    return translatedTag;
  };

  // Function to translate reading time
  const translateReadingTime = (readingTime: string) => {
    const match = readingTime.match(/(\d+)\s*min\s*read/);
    if (match) {
      const minutes = match[1];
      return `${minutes} ${t('blog:components.minRead')}`;
    }
    return readingTime;
  };

  // Function to translate category
  const translateCategory = (category: string) => {
    const translatedCategory = t(`blog:categories.${category}`, { defaultValue: category });
    return translatedCategory;
  };

  useEffect(() => {
    if (slug) {
      const post = blogPostMap[slug];
      if (post) {
        setBlogPost(post);
        // Extract table of contents from content
        const toc = extractTableOfContents(post.content);
        setTableOfContents(toc);
        // Simulate loading time
        setTimeout(() => setLoading(false), 500);
      } else {
        // Post not found
        setLoading(false);
      }
    }
  }, [slug, i18n.language]);

  // Scroll progress and scroll-to-top functionality
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setReadingProgress(scrollPercent);
      setShowScrollTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = blogPost?.title;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // In real app, this would update the database
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-foreground">Blog Post Not Found</h1>
          <Button onClick={() => navigate('/blog')}>Back to Blog</Button>
        </div>
      </div>
    );
  }

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blogPost.title,
    "description": blogPost.metaDescription,
    "image": blogPost.featuredImage,
    "author": {
      "@type": "Person",
      "name": blogPost.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "BelizeVibes",
      "logo": {
        "@type": "ImageObject",
        "url": "https://belizevibes.com/logo.png"
      }
    },
    "datePublished": blogPost.publishDate,
    "dateModified": blogPost.lastModified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    }
  };

  return (
    <>
      {/* SEO Meta Tags with React Helmet */}
      <Helmet>
        <title>{blogPost.title} | BelizeVibes</title>
        <meta name="description" content={blogPost.metaDescription} />
        <meta name="keywords" content={blogPost.keywords.join(', ')} />
        <meta name="author" content={blogPost.author} />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blogPost.title} />
        <meta property="og:description" content={blogPost.metaDescription} />
        <meta property="og:image" content={blogPost.featuredImage} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="BelizeVibes" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blogPost.title} />
        <meta name="twitter:description" content={blogPost.metaDescription} />
        <meta name="twitter:image" content={blogPost.featuredImage} />
        
        {/* Article specific */}
        <meta property="article:author" content={blogPost.author} />
        <meta property="article:published_time" content={blogPost.publishDate} />
        <meta property="article:modified_time" content={blogPost.lastModified} />
        <meta property="article:section" content={blogPost.category} />
        {blogPost.tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
        
        {/* Canonical URL */}
        <link rel="canonical" href={window.location.href} />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-belize-green-500 z-50 transition-all duration-300"
        style={{ width: `${readingProgress}%` }}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Breadcrumbs */}
        <div className="bg-white dark:bg-gray-800 border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-belize-green-600 dark:text-belize-green-500 hover:underline">{t('navigation:home')}</Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <Link to="/blog" className="text-belize-green-600 dark:text-belize-green-500 hover:underline">{t('navigation:blog')}</Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300 truncate">{blogPost.title}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative h-96 lg:h-[500px] overflow-hidden">
          <img 
            src={blogPost.featuredImage} 
            alt={blogPost.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
            <div className="container mx-auto">
              <div className="max-w-4xl">
                <Badge className="mb-4 bg-belize-green-600 text-white">{translateCategory(blogPost.category)}</Badge>
                <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  {blogPost.title}
                </h1>
                <p className="text-xl text-white/90 mb-6 line-clamp-2">
                  {blogPost.excerpt}
                </p>
                
                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-4 text-white/80">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{blogPost.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(blogPost.publishDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{translateReadingTime(blogPost.readingTime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{blogPost.views.toLocaleString()} {t('blog:components.views')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Article Content */}
            <main className="lg:col-span-3">
              <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 lg:p-12">
                
                {/* Article Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {blogPost.tags.map((tag, index) => (
                    <button
                      key={index}
                      className="px-3 py-1 text-sm bg-belize-green-100 text-belize-green-700 rounded-full hover:bg-belize-green-500 hover:text-white transition-colors duration-300"
                      onClick={() => console.log(`Filter by tag: ${tag}`)}
                    >
                      {translateTag(tag)}
                    </button>
                  ))}
                </div>

                {/* Article Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ __html: blogPost.content }}
                    className="text-gray-700 dark:text-gray-300 leading-relaxed"
                  />
                </div>

                <Separator className="my-8" />

                {/* Article Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant={isLiked ? "default" : "outline"}
                      size="sm"
                      onClick={handleLike}
                      className="flex items-center gap-2"
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      {blogPost.likes + (isLiked ? 1 : 0)}
                    </Button>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MessageCircle className="w-4 h-4" />
                      <span>{blogPost.comments}</span>
                    </div>
                  </div>

                  {/* Social Share */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 mr-2">Share:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('facebook')}
                    >
                      <Facebook className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('twitter')}
                    >
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('copy')}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Author Bio */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-belize-green-500 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{blogPost.author}</h3>
                      <p className="text-gray-600 dark:text-gray-300">Travel Writer & Belize Expert</p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {blogPost.author} is a passionate travel writer with over 10 years of experience exploring Central America. 
                    Specializing in solo travel and sustainable tourism, she has visited Belize numerous times and shares 
                    insider knowledge to help fellow travelers discover the magic of this incredible destination.
                  </p>
                </div>
              </article>
            </main>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                
                {/* Table of Contents - Placeholder */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-playfair font-semibold text-belize-green-600 dark:text-belize-green-500 mb-4">{t('blog:components.tableOfContents')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <nav className="space-y-2">
                      {tableOfContents.map((item, index) => (
                        <a 
                          key={index}
                          href={`#${item.id}`} 
                          className="block text-sm text-belize-orange-500 hover:text-belize-orange-600 hover:underline transition-colors duration-300"
                        >
                          {item.title}
                        </a>
                      ))}
                    </nav>
                  </CardContent>
                </Card>

                {/* Related Posts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-playfair font-semibold text-belize-green-600 dark:text-belize-green-500 mb-4">{t('blog:components.relatedPosts')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Related Posts based on shared tags and category */}
                    {(() => {
                      const currentTags = blogPost?.tags || [];
                      const currentCategory = blogPost?.category || '';
                      const allPosts = [
                        { title: "10 Solo Adventures in Belize", slug: "10-solo-adventures-belize", tags: ["Solo Travel", "Adventure", "Belize", "Travel Tips"] },
                        { title: "Solo Travel Safety in Belize", slug: "solo-travel-safety-belize", tags: ["Safety", "Solo Travel", "Travel Tips", "Belize"] },
                        { title: "San Ignacio Week Guide", slug: "san-ignacio-week-guide", tags: ["San Ignacio", "Budget Travel", "Luxury Travel", "Belize"] },
                        { title: "Wildlife Watching Solo", slug: "wildlife-watching-solo", tags: ["Wildlife", "Solo Travel", "Nature", "Photography"] },
                        { title: "Budget Belize Solo Travel", slug: "budget-belize-solo-travel", tags: ["Budget Travel", "Solo Travel", "Money Saving", "Backpacking"] },
                        { title: "Best Time to Visit Belize", slug: "best-time-visit-belize", tags: ["Travel Planning", "Weather", "Seasons", "Travel Tips"] },
                        { title: "Belize Barrier Reef: Marine Wildlife Guide", slug: "belize-barrier-reef-marine-wildlife-guide", tags: ["Wildlife", "Solo Travel", "Diving", "Marine Life", "Photography", "Safety"] },
                        { title: "Spotting Jaguars & Howler Monkeys", slug: "spotting-jaguars-howler-monkeys-cockscomb-basin-solo-guide", tags: ["Wildlife", "Solo Travel", "Jungle", "Photography", "Safety", "Nature"] },
                        { title: "Solo Female Travel Safety in Belize", slug: "solo-female-travel-safety-belize-real-experiences-tips", tags: ["Safety", "Solo Travel", "Female Travel", "Cultural Awareness", "Travel Tips"] },
                        { title: "Navigating Belize City Safely", slug: "navigating-belize-city-safely-solo-traveler-street-smart-guide", tags: ["Safety", "Solo Travel", "Urban Navigation", "Belize City", "Street Smart"] },
                        { title: "Belize on $30/Day: Backpacker's Guide", slug: "belize-30-dollars-day-ultimate-backpacker-survival-guide", tags: ["Budget Travel", "Solo Travel", "Backpacking", "Money Saving", "Extreme Budget"] },
                        { title: "Blue Hole Photography Tips", slug: "capturing-belize-blue-hole-photography-tips-solo-travelers", tags: ["Photography", "Solo Travel", "Blue Hole", "Underwater Photography", "Travel Photography"] },
                        { title: "Instagram-Worthy Spots in Belize", slug: "instagram-worthy-spots-belize-hidden-photography-gems", tags: ["Photography", "Solo Travel", "Hidden Gems", "Instagram", "Secret Spots"] }
                      ];
                      
                      const relatedPosts = allPosts
                        .filter(post => post.slug !== slug)
                        .map(post => ({
                          ...post,
                          score: post.tags.filter(tag => currentTags.includes(tag)).length
                        }))
                        .filter(post => post.score > 0)
                        .sort((a, b) => b.score - a.score)
                        .slice(0, 3);
                      
                      if (relatedPosts.length === 0) {
                        return (
                          <div className="text-sm text-belize-neutral-600">
                            {t('blog:components.relatedPostsComingSoon')}
                          </div>
                        );
                      }
                      
                      return relatedPosts.map((post, index) => (
                        <div key={index} className="border-l-4 border-belize-green-500 pl-4 py-2">
                          <Link 
                            to={`/blog/${post.slug}`}
                            className="text-sm font-medium text-belize-green-600 dark:text-belize-green-500 hover:text-belize-green-700 dark:hover:text-belize-green-400 transition-colors duration-300"
                          >
                            {post.title}
                          </Link>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {post.tags.filter(tag => currentTags.includes(tag)).map((tag, tagIndex) => (
                              <span key={tagIndex} className="text-xs bg-belize-green-100 text-belize-green-700 px-2 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </CardContent>
                </Card>

                {/* Newsletter Signup */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-playfair font-semibold text-belize-green-600 dark:text-belize-green-500 mb-4">{t('blog:components.stayUpdated')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-belize-neutral-600 mb-4">
                      {t('blog:components.stayUpdatedDescription')}
                    </p>
                    <div className="space-y-3">
                      <input
                        type="email"
                        placeholder={t('blog:components.enterEmail')}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-belize-green-500"
                      />
                      <Button className="w-full bg-belize-orange-500 hover:bg-belize-orange-600 text-white">{t('blog:components.subscribe')}</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 rounded-full w-12 h-12 shadow-lg"
          size="icon"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
};

export default BlogPost;