/**
 * Test utility for AI image generation
 * Use this to test the OpenAI integration
 */

import aiImageService from '@/services/aiImageService';

export async function testAIImageGeneration(): Promise<void> {
  console.log('🧪 Testing AI Image Generation...');
  
  // Check if service is available
  if (!aiImageService.isAvailable()) {
    console.error('❌ AI Image Service not available. Check your OPENAI_API_KEY.');
    return;
  }
  
  console.log('✅ AI Image Service is available');
  
  // Test with a simple blog post scenario
  const testPrompt = 'Professional travel photography: Solo female traveler exploring ancient Mayan ruins in Belize jungle, warm afternoon lighting, authentic adventure atmosphere, vibrant tropical colors. Style: high-quality travel blog header image, 2:1 aspect ratio.';
  
  console.log('🎨 Generating test image...');
  console.log('📝 Prompt:', testPrompt);
  
  try {
    const result = await aiImageService.generateImage({
      prompt: testPrompt,
      size: '1024x1024',
      quality: 'standard',
      style: 'natural'
    });
    
    if (result.success && result.imageUrl) {
      console.log('✅ Image generated successfully!');
      console.log('🖼️  URL:', result.imageUrl);
      console.log('📝 Original prompt:', result.prompt);
      if (result.revisedPrompt) {
        console.log('🔄 Revised prompt:', result.revisedPrompt);
      }
      
      // Test image preloading
      const img = new Image();
      img.onload = () => {
        console.log('✅ Image loaded successfully in browser');
      };
      img.onerror = () => {
        console.error('❌ Failed to load generated image');
      };
      img.src = result.imageUrl;
      
    } else {
      console.error('❌ Image generation failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Test usage stats
export async function testUsageStats(): Promise<void> {
  console.log('📊 Testing usage stats...');
  
  try {
    const stats = await aiImageService.getUsageStats();
    console.log('📈 Current AI image stats:', stats);
  } catch (error) {
    console.error('❌ Failed to get usage stats:', error);
  }
}

// Run both tests
export async function runAllTests(): Promise<void> {
  await testAIImageGeneration();
  await testUsageStats();
}

// Auto-run tests in development if this file is imported
if (import.meta.env.DEV) {
  console.log('🚀 AI Image Service Test Utils loaded. Run `testAIImageGeneration()` in console to test.');
}