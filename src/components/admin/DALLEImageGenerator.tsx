import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Image as ImageIcon,
  Loader2,
  Check,
  RefreshCw,
  X,
  AlertCircle,
  Sparkles,
  Camera,
  Palette,
  Settings
} from 'lucide-react';
import { generateBlogImage, type BlogImageRequest } from '@/lib/ai/generateBlogImage';
import { toast } from 'sonner';

interface DALLEImageGeneratorProps {
  userType: string;
  onImageGenerated?: (imageUrl: string) => void;
  currentContent?: {
    title: string;
    excerpt: string;
    content: string;
  };
  className?: string;
}

interface GeneratedImageData {
  url: string;
  altText: string;
  caption: string;
  prompt: string;
  metadata: {
    style: string;
    mood: string;
    aspectRatio: string;
    keywords: string[];
  };
}

export const DALLEImageGenerator: React.FC<DALLEImageGeneratorProps> = ({
  userType,
  onImageGenerated,
  currentContent,
  className = ''
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImageData[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  
  // Configuration state
  const [customPrompt, setCustomPrompt] = useState('');
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [imageStyle, setImageStyle] = useState<'photorealistic' | 'artistic' | 'infographic' | 'landscape'>('photorealistic');
  const [imageMood, setImageMood] = useState<'vibrant' | 'serene' | 'adventurous' | 'cultural'>('vibrant');
  const [aspectRatio, setAspectRatio] = useState<'1024x1024' | '1792x1024' | '1024x1792'>('1792x1024');

  // Check if user has access
  const hasAccess = ['super_admin', 'admin', 'blogger'].includes(userType);

  if (!hasAccess) {
    return null;
  }

  // Generate smart prompt suggestions based on current content
  const getPromptSuggestions = () => {
    if (!currentContent?.title && !currentContent?.content) {
      return [
        'Pristine Caribbean beach in Belize with crystal clear turquoise water',
        'Lush Belize rainforest with exotic wildlife and tropical plants',
        'Ancient Mayan ruins surrounded by jungle in Belize',
        'Vibrant underwater coral reef scene with tropical fish in Belize waters'
      ];
    }

    const content = `${currentContent.title} ${currentContent.content}`.toLowerCase();
    const suggestions: string[] = [];

    // Content-based suggestions
    if (content.includes('beach') || content.includes('ocean')) {
      suggestions.push('Stunning Belize Caribbean beach with palm trees and turquoise water');
    }
    if (content.includes('jungle') || content.includes('rainforest')) {
      suggestions.push('Lush Belize rainforest canopy with exotic birds and tropical plants');
    }
    if (content.includes('maya') || content.includes('ruins')) {
      suggestions.push('Ancient Mayan temple ruins emerging from Belize jungle');
    }
    if (content.includes('diving') || content.includes('snorkel')) {
      suggestions.push('Vibrant underwater coral reef with tropical fish in Belize waters');
    }
    if (content.includes('adventure') || content.includes('tour')) {
      suggestions.push('Exciting adventure activities in Belize tropical landscape');
    }

    // Fallback suggestions
    if (suggestions.length === 0) {
      suggestions.push(
        'Beautiful Belize landscape showcasing tropical paradise',
        'Authentic Belize cultural experience with local traditions',
        'Adventure activities in stunning Belize natural setting'
      );
    }

    return suggestions;
  };

  const handleGenerateImages = async () => {
    let prompt = customPrompt.trim();
    
    // Use content-based prompt if no custom prompt provided
    if (!prompt && currentContent?.title) {
      prompt = `${currentContent.title} - ${currentContent.excerpt || 'Beautiful Belize scene'}`;
    }
    
    if (!prompt) {
      toast.error('Please enter a prompt or add content to generate images');
      return;
    }

    setIsGenerating(true);
    setGeneratedImages([]);
    setSelectedImageIndex(null);

    try {
      const imagesToGenerate = Math.min(numberOfImages, 4); // DALL-E 3 limit safety
      const generationPromises: Promise<GeneratedImageData>[] = [];

      for (let i = 0; i < imagesToGenerate; i++) {
        const imageRequest: BlogImageRequest = {
          title: prompt,
          content: currentContent?.content || '',
          style: imageStyle,
          mood: imageMood,
          aspectRatio: aspectRatio === '1024x1024' ? '1:1' : 
                      aspectRatio === '1792x1024' ? '16:9' : '9:16',
          includeText: false,
          keywords: []
        };

        generationPromises.push(generateBlogImage(imageRequest));
      }

      const results = await Promise.allSettled(generationPromises);
      const successfulImages: GeneratedImageData[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successfulImages.push({
            url: result.value.url,
            altText: result.value.altText,
            caption: result.value.caption,
            prompt: prompt,
            metadata: result.value.metadata
          });
        } else {
          console.error(`Image ${index + 1} generation failed:`, result.reason);
        }
      });

      if (successfulImages.length === 0) {
        throw new Error('All image generations failed');
      }

      setGeneratedImages(successfulImages);
      toast.success(`${successfulImages.length} image(s) generated successfully!`);

    } catch (error) {
      console.error('Error generating images:', error);
      toast.error('Failed to generate images. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleUseSelectedImage = () => {
    if (selectedImageIndex !== null && generatedImages[selectedImageIndex] && onImageGenerated) {
      const selectedImage = generatedImages[selectedImageIndex];
      onImageGenerated(selectedImage.url);
      toast.success('Image applied to blog post!');
    }
  };

  const handleRegenerateImage = (index: number) => {
    // Remove the specific image and regenerate just that one
    const imageToRegenerate = generatedImages[index];
    if (!imageToRegenerate) return;

    setIsGenerating(true);
    
    const imageRequest: BlogImageRequest = {
      title: imageToRegenerate.prompt,
      content: currentContent?.content || '',
      style: imageStyle,
      mood: imageMood,
      aspectRatio: aspectRatio === '1024x1024' ? '1:1' : 
                  aspectRatio === '1792x1024' ? '16:9' : '9:16',
      includeText: false,
      keywords: []
    };

    generateBlogImage(imageRequest)
      .then((newImage) => {
        const updatedImages = [...generatedImages];
        updatedImages[index] = {
          url: newImage.url,
          altText: newImage.altText,
          caption: newImage.caption,
          prompt: imageToRegenerate.prompt,
          metadata: newImage.metadata
        };
        setGeneratedImages(updatedImages);
        toast.success('Image regenerated successfully!');
      })
      .catch((error) => {
        console.error('Error regenerating image:', error);
        toast.error('Failed to regenerate image');
      })
      .finally(() => {
        setIsGenerating(false);
      });
  };

  const getAspectRatioLabel = (ratio: string) => {
    switch (ratio) {
      case '1024x1024': return 'Square (1:1)';
      case '1792x1024': return 'Landscape (16:9)';
      case '1024x1792': return 'Portrait (9:16)';
      default: return ratio;
    }
  };

  return (
    <Card className={`dashboard-card border-2 border-dashed border-purple-200 dark:border-purple-700 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-purple-600" />
          DALL-E Image Generator
          <Badge variant="outline" className="ml-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            AI Powered
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Configuration Section */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="image-prompt" className="text-sm font-medium">
              Image Description
            </Label>
            <Textarea
              id="image-prompt"
              placeholder="Describe the image you want to generate..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="min-h-[80px] resize-none mt-1"
              disabled={isGenerating}
            />
            <div className="mt-2">
              <Label className="text-xs text-muted-foreground">Quick suggestions:</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {getPromptSuggestions().slice(0, 2).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-6 px-2"
                    onClick={() => setCustomPrompt(suggestion)}
                    disabled={isGenerating}
                  >
                    {suggestion.slice(0, 30)}...
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <Label className="text-sm font-medium">Number of Images</Label>
              <Select 
                value={numberOfImages.toString()} 
                onValueChange={(value) => setNumberOfImages(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Image</SelectItem>
                  <SelectItem value="2">2 Images</SelectItem>
                  <SelectItem value="3">3 Images</SelectItem>
                  <SelectItem value="4">4 Images</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Style</Label>
              <Select value={imageStyle} onValueChange={(value) => setImageStyle(value as 'photorealistic' | 'artistic' | 'infographic' | 'landscape')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photorealistic">Photo Realistic</SelectItem>
                  <SelectItem value="artistic">Artistic</SelectItem>
                  <SelectItem value="landscape">Landscape</SelectItem>
                  <SelectItem value="infographic">Infographic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Mood</Label>
              <Select value={imageMood} onValueChange={(value) => setImageMood(value as 'vibrant' | 'serene' | 'adventurous' | 'cultural')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vibrant">Vibrant</SelectItem>
                  <SelectItem value="serene">Serene</SelectItem>
                  <SelectItem value="adventurous">Adventurous</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Size</Label>
              <Select value={aspectRatio} onValueChange={(value) => setAspectRatio(value as '1024x1024' | '1792x1024' | '1024x1792')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1792x1024">Landscape (16:9)</SelectItem>
                  <SelectItem value="1024x1024">Square (1:1)</SelectItem>
                  <SelectItem value="1024x1792">Portrait (9:16)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={handleGenerateImages}
          disabled={isGenerating}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating {numberOfImages} image{numberOfImages > 1 ? 's' : ''}...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate {numberOfImages} Image{numberOfImages > 1 ? 's' : ''}
            </>
          )}
        </Button>

        {/* Loading State with Skeleton */}
        {isGenerating && (
          <div className="space-y-4">
            <div className="text-center p-4 bg-muted/50 rounded">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                <span className="text-sm text-muted-foreground">
                  Creating AI-generated images...
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                This may take 30-60 seconds for high-quality results
              </p>
            </div>
            
            {/* Image Generation Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg h-48 flex items-center justify-center">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
              <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg h-48 flex items-center justify-center">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
            </div>
          </div>
        )}

        {/* Generated Images Display */}
        {generatedImages.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Generated Images</Label>
                <Badge variant="secondary" className="text-xs">
                  {generatedImages.length} image{generatedImages.length > 1 ? 's' : ''} created
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedImages.map((image, index) => (
                  <div 
                    key={index}
                    className={`relative group border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                      selectedImageIndex === index 
                        ? 'border-purple-500 ring-2 ring-purple-200' 
                        : 'border-muted hover:border-purple-300'
                    }`}
                    onClick={() => handleSelectImage(index)}
                  >
                    <img 
                      src={image.url} 
                      alt={image.altText}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop';
                      }}
                    />
                    
                    {/* Selection Indicator */}
                    {selectedImageIndex === index && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-purple-600 text-white rounded-full p-1">
                          <Check className="w-3 h-3" />
                        </div>
                      </div>
                    )}

                    {/* Image Actions Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegenerateImage(index);
                        }}
                        disabled={isGenerating}
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Regenerate
                      </Button>
                    </div>

                    {/* Image Info */}
                    <div className="p-2 bg-muted/80">
                      <p className="text-xs text-muted-foreground truncate">
                        {image.metadata.style} • {image.metadata.mood} • {getAspectRatioLabel(aspectRatio)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Use Selected Image Button */}
              {selectedImageIndex !== null && (
                <div className="flex justify-center">
                  <Button 
                    onClick={handleUseSelectedImage}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Use Selected Image
                  </Button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Info Footer */}
        <div className="text-xs text-muted-foreground text-center p-2 bg-muted/30 rounded">
          <AlertCircle className="w-3 h-3 inline mr-1" />
          Images are generated using DALL-E 3 and optimized for Belize tourism content
        </div>
      </CardContent>
    </Card>
  );
};