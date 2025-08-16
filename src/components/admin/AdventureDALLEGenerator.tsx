import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Mountain,
  Loader2,
  Check,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Camera,
  Plus,
  Star
} from 'lucide-react';
import { generateBlogImage, type BlogImageRequest } from '@/lib/ai/generateBlogImage';
import { toast } from 'sonner';

interface AdventureDALLEGeneratorProps {
  userType: string;
  onFeaturedImageGenerated?: (imageUrl: string, altText: string) => void;
  onGalleryImageGenerated?: (imageUrl: string, altText: string) => void;
  currentAdventure?: {
    title: string;
    description: string;
    location: string;
    difficulty_level?: string;
  };
  className?: string;
}

interface GeneratedAdventureImage {
  url: string;
  altText: string;
  caption: string;
  prompt: string;
  isForGallery: boolean;
  metadata: {
    style: string;
    mood: string;
    aspectRatio: string;
    keywords: string[];
  };
}

export const AdventureDALLEGenerator: React.FC<AdventureDALLEGeneratorProps> = ({
  userType,
  onFeaturedImageGenerated,
  onGalleryImageGenerated,
  currentAdventure,
  className = ''
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedAdventureImage[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  
  // Configuration state
  const [customPrompt, setCustomPrompt] = useState('');
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [imageStyle, setImageStyle] = useState<'photorealistic' | 'artistic' | 'landscape' | 'infographic'>('photorealistic');
  const [imageMood, setImageMood] = useState<'vibrant' | 'adventurous' | 'serene' | 'cultural'>('adventurous');
  const [aspectRatio, setAspectRatio] = useState<'1024x1024' | '1792x1024' | '1024x1792'>('1792x1024');
  const [imageType, setImageType] = useState<'featured' | 'gallery'>('featured');

  // Check if user has access
  const hasAccess = ['super_admin', 'admin', 'guide', 'provider'].includes(userType);

  if (!hasAccess) {
    return null;
  }

  // Generate adventure-specific prompt suggestions
  const getAdventurePromptSuggestions = () => {
    if (!currentAdventure?.title && !currentAdventure?.description) {
      return [
        'Thrilling adventure activity in Belize tropical landscape with lush jungle backdrop',
        'Exciting outdoor expedition in pristine Caribbean waters near Belize',
        'Adventurers exploring mysterious limestone caves in Belize rainforest',
        'Professional tour guide leading group through stunning Belize wilderness'
      ];
    }

    const content = `${currentAdventure.title} ${currentAdventure.description} ${currentAdventure.location}`.toLowerCase();
    const suggestions: string[] = [];

    // Adventure activity-based suggestions
    if (content.includes('cave') || content.includes('atm')) {
      suggestions.push('Adventurous cave exploration in Belize limestone formations with crystal clear underground pools');
    }
    if (content.includes('snorkel') || content.includes('diving') || content.includes('reef')) {
      suggestions.push('Vibrant underwater adventure at Belize Barrier Reef with tropical marine life');
    }
    if (content.includes('jungle') || content.includes('hike') || content.includes('rainforest')) {
      suggestions.push('Exciting jungle trekking adventure through Belize rainforest canopy');
    }
    if (content.includes('kayak') || content.includes('paddle') || content.includes('river')) {
      suggestions.push('Thrilling kayaking adventure through Belize mangrove channels and rivers');
    }
    if (content.includes('zip') || content.includes('canopy')) {
      suggestions.push('Exhilarating zip-line adventure high above Belize jungle canopy');
    }
    if (content.includes('maya') || content.includes('ruins') || content.includes('temple')) {
      suggestions.push('Cultural adventure exploring ancient Maya ruins surrounded by Belize jungle');
    }
    if (content.includes('fishing') || content.includes('fly fishing')) {
      suggestions.push('Exciting fishing adventure in pristine Belize waters with professional guide');
    }
    if (content.includes('wildlife') || content.includes('bird') || content.includes('jaguar')) {
      suggestions.push('Wildlife spotting adventure in Belize nature reserve with exotic animals');
    }

    // Difficulty-based suggestions
    if (currentAdventure.difficulty_level === 'challenging') {
      suggestions.push('Challenging adventure activity requiring skill and determination in Belize wilderness');
    }
    if (currentAdventure.difficulty_level === 'easy') {
      suggestions.push('Family-friendly adventure experience in beautiful Belize natural setting');
    }

    // Location-based suggestions
    if (content.includes('san ignacio') || content.includes('cayo')) {
      suggestions.push('Adventure activities in San Ignacio Cayo District with jungle and river backdrop');
    }
    if (content.includes('placencia') || content.includes('peninsula')) {
      suggestions.push('Coastal adventure activities in Placencia Peninsula with Caribbean Sea views');
    }
    if (content.includes('ambergris') || content.includes('san pedro')) {
      suggestions.push('Island adventure activities in Ambergris Caye with tropical paradise setting');
    }

    // Fallback suggestions if none match
    if (suggestions.length === 0) {
      suggestions.push(
        'Professional adventure tour in stunning Belize landscape with experienced guides',
        'Authentic Belize adventure experience showcasing natural beauty and cultural heritage',
        'Small group adventure activity in pristine Belize wilderness setting'
      );
    }

    return suggestions;
  };

  const handleGenerateImages = async () => {
    let prompt = customPrompt.trim();
    
    // Use adventure-based prompt if no custom prompt provided
    if (!prompt && currentAdventure?.title) {
      const activityType = imageType === 'featured' ? 'main adventure activity' : 'adventure scene';
      prompt = `${currentAdventure.title} - ${activityType} in ${currentAdventure.location || 'Belize'}`;
    }
    
    if (!prompt) {
      toast.error('Please enter a prompt or add adventure details to generate images');
      return;
    }

    setIsGenerating(true);
    setGeneratedImages([]);
    setSelectedImageIndex(null);

    try {
      const imagesToGenerate = Math.min(numberOfImages, 4); // DALL-E 3 limit safety
      const generationPromises: Promise<GeneratedAdventureImage>[] = [];

      for (let i = 0; i < imagesToGenerate; i++) {
        // Enhance prompt with adventure-specific context
        const enhancedPrompt = enhanceAdventurePrompt(prompt, currentAdventure);
        
        const imageRequest: BlogImageRequest = {
          title: enhancedPrompt,
          content: currentAdventure?.description || '',
          style: imageStyle,
          mood: imageMood,
          aspectRatio: aspectRatio === '1024x1024' ? '1:1' : 
                      aspectRatio === '1792x1024' ? '16:9' : '9:16',
          includeText: false,
          keywords: extractAdventureKeywords(currentAdventure)
        };

        const promise = generateBlogImage(imageRequest).then(result => ({
          url: result.url,
          altText: result.altText,
          caption: result.caption,
          prompt: prompt,
          isForGallery: imageType === 'gallery',
          metadata: result.metadata
        }));

        generationPromises.push(promise);
      }

      const results = await Promise.allSettled(generationPromises);
      const successfulImages: GeneratedAdventureImage[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successfulImages.push(result.value);
        } else {
          console.error(`Adventure image ${index + 1} generation failed:`, result.reason);
        }
      });

      if (successfulImages.length === 0) {
        throw new Error('All adventure image generations failed');
      }

      setGeneratedImages(successfulImages);
      toast.success(`${successfulImages.length} adventure image(s) generated successfully!`);

    } catch (error) {
      console.error('Error generating adventure images:', error);
      toast.error('Failed to generate adventure images. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const enhanceAdventurePrompt = (prompt: string, adventure?: {
    title?: string;
    description?: string;
    location?: string;
    difficulty_level?: string;
  }): string => {
    const belizeContext = "Beautiful Belize adventure tourism";
    const safetyContext = "professional guides, safe equipment, well-organized tour";
    const qualityContext = "high-quality, professional photography, marketing ready";
    
    return `${belizeContext}, ${prompt}, ${safetyContext}, ${qualityContext}`;
  };

  const extractAdventureKeywords = (adventure?: {
    title?: string;
    description?: string;
    location?: string;
  }): string[] => {
    if (!adventure) return ['belize', 'adventure', 'tourism', 'travel'];
    
    const keywords = ['belize', 'adventure', 'tour', 'travel'];
    const content = `${adventure.title} ${adventure.description} ${adventure.location}`.toLowerCase();
    
    const adventureKeywords = {
      cave: ['cave', 'underground', 'limestone', 'spelunking'],
      water: ['snorkel', 'diving', 'reef', 'ocean', 'swimming'],
      jungle: ['jungle', 'rainforest', 'hiking', 'nature'],
      kayak: ['kayak', 'paddle', 'river', 'mangrove'],
      zip: ['zipline', 'canopy', 'aerial', 'treetop'],
      maya: ['maya', 'ruins', 'temple', 'archaeological'],
      wildlife: ['wildlife', 'bird', 'animal', 'nature'],
      fishing: ['fishing', 'angling', 'catch', 'sport']
    };

    Object.entries(adventureKeywords).forEach(([key, words]) => {
      if (content.includes(key)) {
        keywords.push(...words);
      }
    });

    return [...new Set(keywords)];
  };

  const handleSelectImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleUseSelectedImage = () => {
    if (selectedImageIndex !== null && generatedImages[selectedImageIndex]) {
      const selectedImage = generatedImages[selectedImageIndex];
      
      if (selectedImage.isForGallery && onGalleryImageGenerated) {
        onGalleryImageGenerated(selectedImage.url, selectedImage.altText);
        toast.success('Image added to adventure gallery!');
      } else if (!selectedImage.isForGallery && onFeaturedImageGenerated) {
        onFeaturedImageGenerated(selectedImage.url, selectedImage.altText);
        toast.success('Featured image applied to adventure!');
      }
    }
  };

  const handleRegenerateImage = (index: number) => {
    const imageToRegenerate = generatedImages[index];
    if (!imageToRegenerate) return;

    setIsGenerating(true);
    
    const enhancedPrompt = enhanceAdventurePrompt(imageToRegenerate.prompt, currentAdventure);
    const imageRequest: BlogImageRequest = {
      title: enhancedPrompt,
      content: currentAdventure?.description || '',
      style: imageStyle,
      mood: imageMood,
      aspectRatio: aspectRatio === '1024x1024' ? '1:1' : 
                  aspectRatio === '1792x1024' ? '16:9' : '9:16',
      includeText: false,
      keywords: extractAdventureKeywords(currentAdventure)
    };

    generateBlogImage(imageRequest)
      .then((newImage) => {
        const updatedImages = [...generatedImages];
        updatedImages[index] = {
          url: newImage.url,
          altText: newImage.altText,
          caption: newImage.caption,
          prompt: imageToRegenerate.prompt,
          isForGallery: imageToRegenerate.isForGallery,
          metadata: newImage.metadata
        };
        setGeneratedImages(updatedImages);
        toast.success('Adventure image regenerated successfully!');
      })
      .catch((error) => {
        console.error('Error regenerating adventure image:', error);
        toast.error('Failed to regenerate adventure image');
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
    <Card className={`border-2 border-dashed border-green-200 bg-gradient-to-br from-green-50 to-blue-50 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mountain className="w-5 h-5 text-green-600" />
          Adventure Image Generator
          <Badge variant="outline" className="ml-auto bg-white">
            DALL-E Powered
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Configuration Section */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="adventure-prompt" className="text-sm font-medium">
              Adventure Image Description
            </Label>
            <Textarea
              id="adventure-prompt"
              placeholder="Describe the adventure image you want to generate..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="min-h-[80px] resize-none mt-1"
              disabled={isGenerating}
            />
            <div className="mt-2">
              <Label className="text-xs text-muted-foreground">Adventure suggestions:</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {getAdventurePromptSuggestions().slice(0, 2).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-6 px-2"
                    onClick={() => setCustomPrompt(suggestion)}
                    disabled={isGenerating}
                  >
                    {suggestion.slice(0, 35)}...
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <Label className="text-sm font-medium">Image Purpose</Label>
              <Select value={imageType} onValueChange={(value) => setImageType(value as 'featured' | 'gallery')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured Image</SelectItem>
                  <SelectItem value="gallery">Gallery Image</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
              <Select value={imageStyle} onValueChange={(value) => setImageStyle(value as 'photorealistic' | 'artistic' | 'landscape' | 'infographic')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photorealistic">Photo Realistic</SelectItem>
                  <SelectItem value="landscape">Landscape</SelectItem>
                  <SelectItem value="artistic">Artistic</SelectItem>
                  <SelectItem value="infographic">Infographic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Mood</Label>
              <Select value={imageMood} onValueChange={(value) => setImageMood(value as 'vibrant' | 'adventurous' | 'serene' | 'cultural')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adventurous">Adventurous</SelectItem>
                  <SelectItem value="vibrant">Vibrant</SelectItem>
                  <SelectItem value="serene">Serene</SelectItem>
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
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating {numberOfImages} adventure image{numberOfImages > 1 ? 's' : ''}...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate {numberOfImages} Adventure Image{numberOfImages > 1 ? 's' : ''}
            </>
          )}
        </Button>

        {/* Loading State */}
        {isGenerating && (
          <div className="text-center p-4 bg-muted/50 rounded">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Loader2 className="w-4 h-4 animate-spin text-green-600" />
              <span className="text-sm text-muted-foreground">
                Creating AI-generated adventure images...
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              This may take 30-60 seconds for high-quality results
            </p>
          </div>
        )}

        {/* Generated Images Display */}
        {generatedImages.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Generated Adventure Images</Label>
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
                        ? 'border-green-500 ring-2 ring-green-200' 
                        : 'border-muted hover:border-green-300'
                    }`}
                    onClick={() => handleSelectImage(index)}
                  >
                    <img 
                      src={image.url} 
                      alt={image.altText}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop';
                      }}
                    />
                    
                    {/* Selection Indicator */}
                    {selectedImageIndex === index && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-green-600 text-white rounded-full p-1">
                          <Check className="w-3 h-3" />
                        </div>
                      </div>
                    )}

                    {/* Image Type Badge */}
                    <div className="absolute top-2 left-2">
                      <Badge variant={image.isForGallery ? "secondary" : "default"} className="text-xs">
                        {image.isForGallery ? 'Gallery' : 'Featured'}
                      </Badge>
                    </div>

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
                <div className="flex justify-center gap-2">
                  <Button 
                    onClick={handleUseSelectedImage}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Use as {generatedImages[selectedImageIndex]?.isForGallery ? 'Gallery' : 'Featured'} Image
                  </Button>
                  {generatedImages[selectedImageIndex] && !generatedImages[selectedImageIndex].isForGallery && onGalleryImageGenerated && (
                    <Button 
                      onClick={() => {
                        const selectedImage = generatedImages[selectedImageIndex!];
                        onGalleryImageGenerated!(selectedImage.url, selectedImage.altText);
                        toast.success('Image added to gallery!');
                      }}
                      variant="outline"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Gallery
                    </Button>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Info Footer */}
        <div className="text-xs text-muted-foreground text-center p-2 bg-muted/30 rounded">
          <AlertCircle className="w-3 h-3 inline mr-1" />
          Images are generated using DALL-E 3 and optimized for Belize adventure tourism content
        </div>
      </CardContent>
    </Card>
  );
};