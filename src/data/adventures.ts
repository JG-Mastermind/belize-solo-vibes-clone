
import { Adventure } from "./schema";

export const adventures: Adventure[] = [
  {
    id: 1,
    title: "Cave Tubing & Jungle Trek",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
    price: "$149",
    duration: "Full Day",
    groupSize: "4-8 people",
    rating: 4.9,
    reviews: 127,
    location: "Cayo District",
    description: "Float through ancient underground cave systems and explore pristine jungle trails.",
    highlights: ["Ancient Maya caves", "Jungle wildlife spotting", "Professional guide", "Equipment included"],
    steps: ["Select Date", "Your Info", "Payment", "Confirmation"]
  },
  {
    id: 2,
    title: "Snorkeling at Hol Chan",
    image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&h=400&fit=crop",
    price: "$89",
    duration: "Half Day",
    groupSize: "6-12 people",
    rating: 4.8,
    reviews: 89,
    location: "Ambergris Caye",
    description: "Discover vibrant coral reefs and tropical marine life in Belize's premier marine reserve.",
    highlights: ["Hol Chan Marine Reserve", "Shark Ray Alley", "Colorful coral gardens", "All gear provided"],
    steps: ["Select Date", "Your Info", "Payment", "Confirmation"]
  },
  {
    id: 3,
    title: "Caracol Maya Ruins Adventure",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    price: "$199",
    duration: "Full Day",
    groupSize: "4-10 people",
    rating: 4.9,
    reviews: 156,
    location: "Chiquibul Forest",
    description: "Explore Belize's largest Maya archaeological site hidden deep in the jungle.",
    highlights: ["Ancient Maya temples", "Jungle canopy views", "Historical insights", "Lunch included"],
    steps: ["Select Date", "Your Info", "Payment", "Confirmation"]
  },
  {
    id: 4,
    title: "Blue Hole Diving Experience",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
    price: "$299",
    duration: "Full Day",
    groupSize: "4-8 people",
    rating: 5.0,
    reviews: 73,
    location: "Lighthouse Reef",
    description: "Dive into the world-famous Blue Hole, a UNESCO World Heritage site.",
    highlights: ["UNESCO World Heritage", "Unique geological formation", "Expert dive guides", "Certificate required"],
    steps: ["Select Date", "Your Info", "Payment", "Confirmation"]
  },
  {
    id: 5,
    title: "Jungle Zip-lining & Waterfall",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
    price: "$119",
    duration: "Half Day",
    groupSize: "6-12 people",
    rating: 4.7,
    reviews: 98,
    location: "Mountain Pine Ridge",
    description: "Soar through the jungle canopy and cool off in natural swimming holes.",
    highlights: ["Canopy zip-lining", "Natural waterfalls", "Swimming opportunities", "Safety certified"],
    steps: ["Select Date", "Your Info", "Payment", "Confirmation"]
  },
  {
    id: 6,
    title: "Manatee Watching & Beach Day",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
    price: "$129",
    duration: "Full Day",
    groupSize: "4-10 people",
    rating: 4.8,
    reviews: 112,
    location: "Placencia",
    description: "Gentle manatee encounters followed by relaxation on pristine beaches.",
    highlights: ["Manatee sanctuary visit", "Pristine beaches", "Beach lunch", "Conservation focus"],
    steps: ["Select Date", "Your Info", "Payment", "Confirmation"]
  }
];
