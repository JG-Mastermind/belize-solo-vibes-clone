// Mock AI image generation for adventures
export async function generateAdventureImage(prompt: string): Promise<string> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock implementation - return sample image URLs based on prompt keywords
  const sampleImages = {
    cave: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    kayak: 'https://images.unsplash.com/photo-1502780402662-acc01917949e?w=400&h=300&fit=crop',
    jungle: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    river: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    sunset: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    wildlife: 'https://images.unsplash.com/photo-1549366021-9f761d040a94?w=400&h=300&fit=crop',
    snorkel: 'https://images.unsplash.com/photo-1582845512747-e42001c95638?w=400&h=300&fit=crop',
    default: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop'
  };
  
  // Simple keyword matching for mock
  const lowerPrompt = prompt.toLowerCase();
  
  for (const [keyword, imageUrl] of Object.entries(sampleImages)) {
    if (lowerPrompt.includes(keyword)) {
      return imageUrl;
    }
  }
  
  // Fallback to default adventure image
  return sampleImages.default;
}