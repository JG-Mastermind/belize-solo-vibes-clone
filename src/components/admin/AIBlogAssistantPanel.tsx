import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DALLEImageGenerator } from '@/components/admin/DALLEImageGenerator';
import { 
  Sparkles, 
  Image as ImageIcon, 
  FileText, 
  Check, 
  X, 
  RefreshCw, 
  Loader2,
  Target,
  TrendingUp,
  Search,
  Eye,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Zap
} from 'lucide-react';
import { 
  generateBlogContent,
  generateBlogImage,
  analyzeBlogSEO,
  type BlogContentRequest,
  type GeneratedBlogContent,
  type BlogImageRequest,
  type GeneratedBlogImage,
  type SEOAnalysisResult
} from '@/lib/ai';
import { toast } from 'sonner';

interface AIBlogAssistantPanelProps {
  userType: string;
  className?: string;
  onUseGenerated?: (data: {
    title?: string;
    title_fr?: string;
    excerpt?: string;
    excerpt_fr?: string;
    content?: string;
    content_fr?: string;
    featured_image_url?: string;
  }) => void;
  currentContent?: {
    title: string;
    excerpt: string;
    content: string;
  };
}

interface GeneratedBlogData {
  content: GeneratedBlogContent;
  contentFr?: GeneratedBlogContent;
  image: GeneratedBlogImage;
  seoAnalysis: SEOAnalysisResult;
}

export const AIBlogAssistantPanel: React.FC<AIBlogAssistantPanelProps> = ({ 
  userType, 
  className = '',
  onUseGenerated,
  currentContent
}) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState<'professional' | 'casual' | 'educational' | 'promotional'>('professional');
  const [audience, setAudience] = useState<'travelers' | 'adventure-seekers' | 'families' | 'solo-travelers'>('travelers');
  const [contentLength, setContentLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [generateBilingual, setGenerateBilingual] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<GeneratedBlogData | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [activeTab, setActiveTab] = useState('content');

  // Check if user has access to AI assistant
  const hasAccess = ['super_admin', 'admin', 'blogger'].includes(userType);

  // Handle online/offline status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!hasAccess) {
    return null;
  }

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please describe your blog topic first');
      return;
    }

    if (!isOnline) {
      toast.error('AI generation not available offline');
      return;
    }

    setIsGenerating(true);
    setGeneratedData(null);

    try {
      const keywordArray = keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
      
      // Prepare requests
      const contentRequest: BlogContentRequest = {
        topic,
        tone,
        targetAudience: audience,
        keywords: keywordArray,
        language: 'en',
        contentLength
      };

      const contentRequestFr: BlogContentRequest = {
        ...contentRequest,
        language: 'fr'
      };

      // Generate content concurrently
      const contentPromises = [
        generateBlogContent(contentRequest),
        generateBilingual ? generateBlogContent(contentRequestFr) : Promise.resolve(null)
      ];

      const [englishContent, frenchContent] = await Promise.all(contentPromises);

      // Generate image based on English content
      const imageRequest: BlogImageRequest = {
        title: englishContent.title,
        content: englishContent.content,
        style: 'photorealistic',
        mood: 'vibrant',
        aspectRatio: '16:9',
        keywords: keywordArray
      };

      const [image, seoAnalysis] = await Promise.all([
        generateBlogImage(imageRequest),
        analyzeBlogSEO({
          title: englishContent.title,
          content: englishContent.content,
          excerpt: englishContent.excerpt,
          targetKeywords: keywordArray,
          language: 'en'
        })
      ]);

      const result: GeneratedBlogData = {
        content: englishContent,
        contentFr: frenchContent || undefined,
        image,
        seoAnalysis
      };

      setGeneratedData(result);
      setActiveTab('content');
      toast.success('Blog content generated successfully!');

    } catch (error) {
      console.error('Error generating blog content:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyzeCurrent = async () => {
    if (!currentContent || !currentContent.title || !currentContent.content) {
      toast.error('No content to analyze');
      return;
    }

    if (!isOnline) {
      toast.error('SEO analysis not available offline');
      return;
    }

    setIsGenerating(true);

    try {
      const keywordArray = keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
      
      const seoAnalysis = await analyzeBlogSEO({
        title: currentContent.title,
        content: currentContent.content,
        excerpt: currentContent.excerpt,
        targetKeywords: keywordArray,
        language: 'en'
      });

      setGeneratedData(prev => prev ? { ...prev, seoAnalysis } : {
        content: {
          title: currentContent.title,
          excerpt: currentContent.excerpt,
          content: currentContent.content,
          seoKeywords: keywordArray,
          metaDescription: currentContent.excerpt,
          readabilityScore: 0,
          suggestedTags: []
        },
        image: {
          url: '',
          altText: '',
          caption: '',
          seoFilename: '',
          metadata: { style: 'photorealistic', mood: 'vibrant', aspectRatio: '16:9', keywords: [] }
        },
        seoAnalysis
      });

      setActiveTab('seo');
      toast.success('SEO analysis completed!');

    } catch (error) {
      console.error('Error analyzing content:', error);
      toast.error('Failed to analyze content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseContent = () => {
    if (generatedData && onUseGenerated) {
      onUseGenerated({
        title: generatedData.content.title,
        title_fr: generatedData.contentFr?.title || '',
        excerpt: generatedData.content.excerpt,
        excerpt_fr: generatedData.contentFr?.excerpt || '',
        content: generatedData.content.content,
        content_fr: generatedData.contentFr?.content || '',
        featured_image_url: generatedData.image.url
      });
      toast.success('AI-generated content applied to form!');
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleDiscard = () => {
    setGeneratedData(null);
    toast.info('Generated content discarded');
  };

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSEOScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const renderLoadingState = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        <span className="text-sm text-muted-foreground">
          {activeTab === 'seo' ? 'Analyzing SEO...' : 'Generating AI blog content...'}
        </span>
      </div>
      <Progress value={33} className="w-full" />
      
      {/* Content Generation Skeleton */}
      <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg p-6 space-y-4">
        <div className="space-y-3">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
        {/* Image Placeholder */}
        <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
      </div>
      
      <div className="text-xs text-muted-foreground text-center">
        This may take 30-60 seconds for high-quality results
      </div>
    </div>
  );

  const renderSEOAnalysis = () => {
    if (!generatedData?.seoAnalysis) return null;

    const { seoAnalysis } = generatedData;

    return (
      <div className="space-y-4">
        {/* SEO Score */}
        <div className={`p-4 rounded-lg ${getSEOScoreBg(seoAnalysis.score)}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">SEO Score</h3>
              <p className="text-sm text-muted-foreground">Overall optimization rating</p>
            </div>
            <div className={`text-2xl font-bold ${getSEOScoreColor(seoAnalysis.score)}`}>
              {seoAnalysis.score}/100
            </div>
          </div>
          <Progress value={seoAnalysis.score} className="mt-2" />
        </div>

        {/* Recommendations */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Recommendations
          </h4>
          <ScrollArea className="h-48">
            <div className="space-y-2">
              {seoAnalysis.recommendations.map((rec, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded border-l-4 ${
                    rec.type === 'critical' ? 'border-red-500 bg-red-50' :
                    rec.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {rec.type === 'critical' ? 
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" /> :
                      rec.type === 'warning' ? 
                      <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" /> :
                      <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                    }
                    <div className="flex-1">
                      <p className="font-medium text-sm">{rec.issue}</p>
                      <p className="text-xs text-muted-foreground mt-1">{rec.solution}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {rec.impact} impact
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-muted/50 rounded">
            <div className="text-sm font-medium">Readability</div>
            <div className="text-lg font-bold">{seoAnalysis.readabilityAnalysis.fleschScore}/100</div>
            <div className="text-xs text-muted-foreground">{seoAnalysis.readabilityAnalysis.gradeLevel}</div>
          </div>
          <div className="p-3 bg-muted/50 rounded">
            <div className="text-sm font-medium">Keywords</div>
            <div className="text-lg font-bold">{Object.keys(seoAnalysis.keywordAnalysis.keywordDensity).length}</div>
            <div className="text-xs text-muted-foreground">Target keywords found</div>
          </div>
        </div>
      </div>
    );
  };

  const renderGeneratedContent = () => {
    if (!generatedData) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-600">Content generated successfully!</span>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content" className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              Content
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-1">
              <ImageIcon className="w-3 h-3" />
              Image
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Generated Title</Label>
                <div className="p-2 bg-muted/50 rounded border text-sm">
                  {generatedData.content.title}
                </div>
              </div>
              
              {generatedData.contentFr && (
                <div>
                  <Label className="text-sm font-medium">Titre Français</Label>
                  <div className="p-2 bg-muted/50 rounded border text-sm">
                    {generatedData.contentFr.title}
                  </div>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium">Generated Excerpt</Label>
                <div className="p-2 bg-muted/50 rounded border text-sm max-h-20 overflow-y-auto">
                  {generatedData.content.excerpt}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Generated Content</Label>
                <ScrollArea className="h-32 p-2 bg-muted/50 rounded border">
                  <div className="text-sm whitespace-pre-wrap">
                    {generatedData.content.content}
                  </div>
                </ScrollArea>
              </div>

              <div>
                <Label className="text-sm font-medium">SEO Keywords</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {generatedData.content.seoKeywords.slice(0, 8).map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="image" className="mt-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Generated Image</Label>
                <img 
                  src={generatedData.image.url} 
                  alt={generatedData.image.altText}
                  className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-muted mt-2"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop';
                  }}
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Alt Text</Label>
                <div className="p-2 bg-muted/50 rounded border text-sm">
                  {generatedData.image.altText}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Caption</Label>
                <div className="p-2 bg-muted/50 rounded border text-sm">
                  {generatedData.image.caption}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="mt-4">
            {renderSEOAnalysis()}
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            <div className="space-y-4 p-4 border rounded-lg">
              <h2 className="text-xl font-bold">{generatedData.content.title}</h2>
              <p className="text-muted-foreground italic">{generatedData.content.excerpt}</p>
              <img 
                src={generatedData.image.url} 
                alt={generatedData.image.altText}
                className="w-full h-48 object-cover rounded"
              />
              <div className="prose text-sm">
                {generatedData.content.content.split('\n\n').slice(0, 2).map((paragraph, index) => (
                  <p key={index} className="mb-2">{paragraph}</p>
                ))}
                <p className="text-muted-foreground">...</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <Button 
            onClick={handleUseContent}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="w-4 h-4 mr-2" />
            Use This Content
          </Button>
          <Button 
            onClick={handleRegenerate}
            size="sm"
            variant="outline"
            disabled={isGenerating}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate
          </Button>
          <Button 
            onClick={handleDiscard}
            size="sm"
            variant="outline"
          >
            <X className="w-4 h-4 mr-2" />
            Discard
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className={`dashboard-card border-2 border-dashed border-blue-200 dark:border-blue-700 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <span>AI Blog Generator</span>
            <Badge variant="outline" className="ml-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              {userType.replace('_', ' ').toUpperCase()}
            </Badge>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <Label htmlFor="ai-blog-toggle" className="text-sm font-medium">
              AI Assistant
            </Label>
            <Switch 
              id="ai-blog-toggle"
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
          </div>
        </div>
      </CardHeader>

      {isEnabled && (
        <CardContent className="space-y-6">
          {!isOnline && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ AI generation not available offline. Please check your internet connection.
              </p>
            </div>
          )}

          {/* Configuration */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="blog-topic" className="text-sm font-medium">
                Blog Topic / Subject
              </Label>
              <Textarea
                id="blog-topic"
                placeholder="e.g., Best snorkeling spots in Belize for beginners"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="min-h-[60px] resize-none mt-1"
                disabled={isGenerating || !isOnline}
              />
            </div>

            <div>
              <Label htmlFor="keywords" className="text-sm font-medium">
                Target Keywords (comma-separated)
              </Label>
              <Input
                id="keywords"
                placeholder="belize snorkeling, caribbean diving, marine life"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                disabled={isGenerating || !isOnline}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <Label className="text-sm font-medium">Tone</Label>
                <Select value={tone} onValueChange={(value: any) => setTone(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="promotional">Promotional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Audience</Label>
                <Select value={audience} onValueChange={(value: any) => setAudience(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="travelers">Travelers</SelectItem>
                    <SelectItem value="adventure-seekers">Adventure Seekers</SelectItem>
                    <SelectItem value="families">Families</SelectItem>
                    <SelectItem value="solo-travelers">Solo Travelers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Length</Label>
                <Select value={contentLength} onValueChange={(value: any) => setContentLength(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  checked={generateBilingual}
                  onCheckedChange={setGenerateBilingual}
                />
                <Label className="text-sm">EN + FR</Label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim() || !isOnline}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Complete Blog
                </>
              )}
            </Button>

            {currentContent && (
              <Button 
                onClick={handleAnalyzeCurrent}
                disabled={isGenerating || !isOnline}
                variant="outline"
              >
                <Search className="w-4 h-4 mr-2" />
                Analyze Current
              </Button>
            )}
          </div>

          {/* DALL-E Image Generator Section */}
          <Separator />
          <DALLEImageGenerator
            userType={userType}
            onImageGenerated={(imageUrl) => {
              if (onUseGenerated) {
                onUseGenerated({ featured_image_url: imageUrl });
              }
            }}
            currentContent={currentContent}
            className="mt-6"
          />

          {(isGenerating || generatedData) && (
            <>
              <Separator />
              {isGenerating ? renderLoadingState() : renderGeneratedContent()}
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
};