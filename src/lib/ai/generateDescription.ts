// Mock AI description generation for adventures
export async function generateAdventureDescription(prompt: string): Promise<string> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock implementation - generate descriptions based on prompt keywords
  const lowerPrompt = prompt.toLowerCase();
  
  // Adventure type templates
  const templates = {
    cave: [
      "Explore mysterious underground caverns filled with ancient stalactites and crystal formations.",
      "Journey through sacred Mayan cave systems where history comes alive in every chamber.",
      "Discover hidden underground rivers and limestone formations in this spelunking adventure."
    ],
    kayak: [
      "Paddle through pristine waters surrounded by lush tropical vegetation and wildlife.",
      "Glide silently through mangrove channels spotting exotic birds and marine life.",
      "Experience the tranquility of kayaking while nature unfolds around you."
    ],
    jungle: [
      "Trek through dense rainforest canopies alive with howler monkeys and tropical birds.",
      "Immerse yourself in the heart of the jungle where adventure awaits at every turn.",
      "Discover hidden waterfalls and wildlife in this unforgettable jungle expedition."
    ],
    snorkel: [
      "Dive into crystal-clear waters teeming with colorful fish and coral reefs.",
      "Explore underwater worlds where tropical marine life thrives in pristine conditions.",
      "Experience the magic of snorkeling in some of the world's most biodiverse waters."
    ],
    sunset: [
      "Watch spectacular sunsets paint the sky in brilliant oranges and purples.",
      "End your day with breathtaking views as the sun dips below the horizon.",
      "Capture magical golden hour moments in this unforgettable sunset experience."
    ],
    wildlife: [
      "Encounter exotic wildlife in their natural habitat with expert local guides.",
      "Spot rare birds, mammals, and reptiles while learning about conservation efforts.",
      "Experience close encounters with nature's most fascinating creatures."
    ]
  };
  
  // Find matching template
  let selectedTemplate = templates.cave; // default
  for (const [keyword, descriptions] of Object.entries(templates)) {
    if (lowerPrompt.includes(keyword)) {
      selectedTemplate = descriptions;
      break;
    }
  }
  
  // Select random template and customize
  const baseDescription = selectedTemplate[Math.floor(Math.random() * selectedTemplate.length)];
  
  // Add activity-specific details
  const additions = [
    "Includes all necessary equipment and safety gear.",
    "Led by certified local guides with years of experience.",
    "Perfect for beginners and experienced adventurers alike.",
    "Small group sizes ensure personalized attention and safety.",
    "Transportation and refreshments included in the package.",
    "Suitable for all fitness levels with flexible difficulty options.",
    "Eco-friendly tour supporting local conservation efforts.",
    "Professional photography opportunities throughout the journey."
  ];
  
  const randomAddition = additions[Math.floor(Math.random() * additions.length)];
  
  return `${baseDescription} ${randomAddition} This authentic Belizean adventure creates lasting memories while respecting local culture and environment.`;
}