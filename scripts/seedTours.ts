import { supabase } from '../src/lib/supabase';

const mockTours = [
  {
    title: "Cave Tubing & Jungle Trek",
    description: "Float through ancient underground cave systems and explore pristine jungle trails. Experience the mystical beauty of Belize's cave networks while spotting exotic wildlife along jungle paths.",
    location_name: "San Ignacio",
    price_per_person: 149,
    duration_hours: 8,
    max_participants: 12,
    images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop"],
    provider_id: "00000000-0000-0000-0000-000000000000",
    is_active: true
  },
  {
    title: "Snorkeling at Hol Chan Marine Reserve",
    description: "Discover vibrant coral reefs and tropical marine life in Belize's premier marine reserve. Swim alongside nurse sharks and stingrays in crystal-clear Caribbean waters.",
    location_name: "San Pedro",
    price_per_person: 89,
    duration_hours: 4,
    max_participants: 15,
    images: ["https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&h=400&fit=crop"],
    provider_id: "00000000-0000-0000-0000-000000000000",
    is_active: true
  },
  {
    title: "Caracol Maya Ruins Adventure",
    description: "Explore Belize's largest Maya archaeological site hidden deep in the jungle. Climb ancient temples and learn about Maya civilization from expert local guides.",
    location_name: "Chiquibul Forest",
    price_per_person: 199,
    duration_hours: 8,
    max_participants: 10,
    images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"],
    provider_id: "00000000-0000-0000-0000-000000000000",
    is_active: true
  },
  {
    title: "Blue Hole Diving Experience",
    description: "Dive into the world-famous Blue Hole, a UNESCO World Heritage site. Experience unique geological formations and diverse marine life in this natural wonder.",
    location_name: "Lighthouse Reef",
    price_per_person: 299,
    duration_hours: 8,
    max_participants: 8,
    images: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop"],
    provider_id: "00000000-0000-0000-0000-000000000000",
    is_active: true
  },
  {
    title: "Jungle Zip-lining & Waterfall Tour",
    description: "Soar through the jungle canopy on thrilling zip-lines and cool off in natural swimming holes. Experience adrenaline-pumping adventure with stunning mountain views.",
    location_name: "Mountain Pine Ridge",
    price_per_person: 119,
    duration_hours: 6,
    max_participants: 14,
    images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop"],
    provider_id: "00000000-0000-0000-0000-000000000000",
    is_active: true
  },
  {
    title: "Manatee Watching & Beach Day",
    description: "Gentle manatee encounters followed by relaxation on pristine beaches. Learn about conservation efforts while enjoying Belize's gentle sea cows in their natural habitat.",
    location_name: "Placencia",
    price_per_person: 129,
    duration_hours: 6,
    max_participants: 12,
    images: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop"],
    provider_id: "00000000-0000-0000-0000-000000000000",
    is_active: true
  },
  {
    title: "Sunrise Fishing & Island Hopping",
    description: "Start your day with deep-sea fishing followed by island exploration. Catch local fish species and enjoy fresh ceviche on secluded tropical islands.",
    location_name: "Hopkins",
    price_per_person: 169,
    duration_hours: 8,
    max_participants: 10,
    images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop"],
    provider_id: "00000000-0000-0000-0000-000000000000",
    is_active: true
  },
  {
    title: "Night Jungle Safari",
    description: "Discover Belize's nocturnal wildlife on this unique after-dark adventure. Spot jaguars, owls, and other elusive creatures with expert naturalist guides.",
    location_name: "Cockscomb Basin",
    price_per_person: 95,
    duration_hours: 4,
    max_participants: 8,
    images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"],
    provider_id: "00000000-0000-0000-0000-000000000000",
    is_active: true
  },
  {
    title: "Cultural Village Tour & Chocolate Making",
    description: "Immerse yourself in Maya culture and learn traditional chocolate-making techniques. Visit authentic villages and participate in ancient cacao ceremonies.",
    location_name: "Toledo District",
    price_per_person: 79,
    duration_hours: 5,
    max_participants: 15,
    images: ["https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&h=400&fit=crop"],
    provider_id: "00000000-0000-0000-0000-000000000000",
    is_active: true
  }
];

async function seedTours() {
  try {
    console.log('🌱 Starting to seed tours data...');
    
    const { data, error } = await supabase
      .from('tours')
      .insert(mockTours)
      .select();

    if (error) {
      console.error('❌ Error inserting tours:', error.message);
      return;
    }

    console.log(`✅ Successfully inserted ${data?.length || 0} tours:`);
    data?.forEach((tour, index) => {
      console.log(`  ${index + 1}. ${tour.title} - $${tour.price_per_person}`);
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the seed function
seedTours();