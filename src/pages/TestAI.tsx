/**
 * Test page for AI image generation
 * Navigate to /test-ai to test the OpenAI integration
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import aiImageService from '@/services/aiImageService';
import type { AIImageResult } from '@/services/aiImageService';

const TestAI: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<AIImageResult | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [usageStats, setUsageStats] = useState<{ totalAIImages: number; lastGenerated?: string } | null>(null);

  const defaultPrompt = 'Professional travel photography: Solo female traveler exploring ancient Mayan ruins in Belize jungle, warm afternoon lighting, authentic adventure atmosphere, vibrant tropical colors. Style: high-quality travel blog header image, 2:1 aspect ratio.';

  const handleGenerateImage = async () => {
    if (!aiImageService.isAvailable()) {
      setResult({
        success: false,
        error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env file.'
      });
      return;
    }

    setIsGenerating(true);
    setResult(null);

    try {
      const prompt = customPrompt.trim() || defaultPrompt;
      const result = await aiImageService.generateImage({
        prompt,
        size: '1792x1024',
        quality: 'standard',
        style: 'natural'
      });

      setResult(result);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const loadUsageStats = async () => {
    try {
      const stats = await aiImageService.getUsageStats();
      setUsageStats(stats);
    } catch (error) {
      console.error('Failed to load usage stats:', error);
    }
  };

  React.useEffect(() => {
    loadUsageStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🧪 AI Image Generation Test</h1>
          <p className="text-gray-600">
            Test the OpenAI DALL-E 3 integration for blog post image generation.
          </p>
        </div>

        {/* API Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔑 API Status
              <Badge variant={aiImageService.isAvailable() ? "default" : "destructive"}>
                {aiImageService.isAvailable() ? "Connected" : "Not Available"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {aiImageService.isAvailable() ? (
              <div className="text-green-600">
                ✅ OpenAI API key is configured and ready for image generation.
              </div>
            ) : (
              <div className="text-red-600">
                ❌ OpenAI API key not found. Please add OPENAI_API_KEY to your .env file.
              </div>
            )}
            
            {usageStats && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">📊 Usage Statistics</h4>
                <p><strong>Total AI Images Generated:</strong> {usageStats.totalAIImages}</p>
                {usageStats.lastGenerated && (
                  <p><strong>Last Generated:</strong> {new Date(usageStats.lastGenerated).toLocaleString()}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prompt Input */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>✏️ Image Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter custom prompt or leave empty to use default..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={4}
              className="mb-4"
            />
            
            {!customPrompt.trim() && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Default Prompt:</h4>
                <p className="text-blue-700 text-sm">{defaultPrompt}</p>
              </div>
            )}
            
            <Button 
              onClick={handleGenerateImage}
              disabled={isGenerating || !aiImageService.isAvailable()}
              className="mt-4"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating Image...
                </>
              ) : (
                '🎨 Generate AI Image'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📸 Generation Result
                <Badge variant={result.success ? "default" : "destructive"}>
                  {result.success ? "Success" : "Failed"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.success && result.imageUrl ? (
                <div>
                  <div className="mb-4">
                    <img 
                      src={result.imageUrl} 
                      alt="Generated AI image"
                      className="w-full max-w-2xl rounded-lg shadow-lg"
                      onLoad={() => console.log('✅ Image loaded successfully')}
                      onError={() => console.error('❌ Failed to load image')}
                    />
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Image URL:</strong>
                      <a 
                        href={result.imageUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-600 hover:underline break-all"
                      >
                        {result.imageUrl}
                      </a>
                    </div>
                    
                    {result.prompt && (
                      <div>
                        <strong>Original Prompt:</strong>
                        <p className="text-gray-600 mt-1">{result.prompt}</p>
                      </div>
                    )}
                    
                    {result.revisedPrompt && (
                      <div>
                        <strong>OpenAI Revised Prompt:</strong>
                        <p className="text-gray-600 mt-1">{result.revisedPrompt}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-red-600">
                  <strong>Error:</strong> {result.error}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Cost Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>💰 Cost Information</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <ul className="space-y-1">
              <li><strong>DALL-E 3 Standard (1024×1024):</strong> $0.040 per image</li>
              <li><strong>DALL-E 3 Standard (1792×1024):</strong> $0.040 per image</li>
              <li><strong>DALL-E 3 HD (1024×1024):</strong> $0.080 per image</li>
            </ul>
            <p className="mt-2 text-xs">
              Images expire from OpenAI's CDN after 1 hour. For production, implement Supabase Storage upload.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestAI;