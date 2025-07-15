import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, 
  Image as ImageIcon, 
  FileText, 
  Check, 
  X, 
  RefreshCw, 
  Loader2,
  Lightbulb
} from 'lucide-react';
import { generateAdventureImage } from '@/lib/ai/generateImage';
import { generateAdventureDescription } from '@/lib/ai/generateDescription';
import { toast } from 'sonner';

interface AIAssistantPanelProps {
  userType: string;
  className?: string;
  onUseGenerated?: (data: { image: string; description: string; title?: string }) => void;
}

interface GeneratedContent {
  image: string;
  description: string;
}

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ 
  userType, 
  className = '',
  onUseGenerated
}) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Check if user has access to AI assistant
  const hasAccess = ['admin', 'guide', 'host'].includes(userType);

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
    if (!prompt.trim()) {
      toast.error('Please describe your adventure first');
      return;
    }

    if (!isOnline) {
      toast.error('AI generation not available offline');
      return;
    }

    setIsGenerating(true);
    setGeneratedContent(null);

    try {
      // Generate both image and description concurrently
      const [image, description] = await Promise.all([
        generateAdventureImage(prompt),
        generateAdventureDescription(prompt)
      ]);

      setGeneratedContent({ image, description });
      toast.success('Adventure content generated successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseContent = () => {
    if (generatedContent && onUseGenerated) {
      // Extract potential title from prompt
      const extractedTitle = prompt.length > 5 ? 
        prompt.charAt(0).toUpperCase() + prompt.slice(1) : '';
      
      onUseGenerated({
        ...generatedContent,
        title: extractedTitle
      });
      toast.success('Content applied to form!');
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleDiscard = () => {
    setGeneratedContent(null);
    toast.info('Generated content discarded');
  };

  const renderLoadingState = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Generating your adventure content...</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Generated Image</Label>
          <Skeleton className="w-full h-48 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Generated Description</Label>
          <Skeleton className="w-full h-48 rounded-md" />
        </div>
      </div>
    </div>
  );

  const renderGeneratedContent = () => {
    if (!generatedContent) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Check className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-600">Content generated successfully!</span>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Generated Image</Label>
            <img 
              src={generatedContent.image} 
              alt="Generated adventure"
              className="w-full max-w-md h-48 object-cover rounded-xl border-2 border-muted"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop';
              }}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Generated Description</Label>
            <div className="p-3 bg-muted/50 rounded-md border max-h-48 overflow-y-auto">
              <p className="text-sm leading-relaxed">{generatedContent.description}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={handleUseContent}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="w-4 h-4 mr-2" />
            Use This
          </Button>
          <Button 
            onClick={handleRegenerate}
            size="sm"
            variant="outline"
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
    <Card className={`bg-muted/20 border-dashed ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span>AI Adventure Generator</span>
            <Badge variant="outline" className="ml-2">
              {userType.charAt(0).toUpperCase() + userType.slice(1)}
            </Badge>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <Label htmlFor="ai-toggle" className="text-sm font-medium">
              Use AI Assistant?
            </Label>
            <Switch 
              id="ai-toggle"
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
          </div>
        </div>
      </CardHeader>

      {isEnabled && (
        <CardContent className="space-y-4">
          {!isOnline && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                ⚠️ AI generation not available offline. Please check your internet connection.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="adventure-prompt" className="text-sm font-medium">
              Describe your adventure in one sentence
            </Label>
            <Textarea
              id="adventure-prompt"
              placeholder="Nighttime bioluminescent kayak tour near Hopkins"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[80px] resize-none"
              disabled={isGenerating || !isOnline}
            />
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim() || !isOnline}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4 mr-2" />
                <FileText className="w-4 h-4 mr-2" />
                Generate Image + Description
              </>
            )}
          </Button>

          {(isGenerating || generatedContent) && (
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