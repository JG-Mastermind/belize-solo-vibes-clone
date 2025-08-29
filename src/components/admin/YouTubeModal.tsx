import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Video, ExternalLink, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface YouTubeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string) => void;
}

// Tourism video suggestions for Belize content
const touristSuggestions = [
  {
    title: "Cave Tubing Adventure - Belize",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    description: "Explore underground rivers in Belize"
  },
  {
    title: "Snorkeling at Blue Hole - Belize Barrier Reef",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    description: "Diving the famous Blue Hole"
  },
  {
    title: "Maya Ruins at Caracol - Ancient Belize",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    description: "Discover ancient Maya civilization"
  }
];

export const YouTubeModal: React.FC<YouTubeModalProps> = ({
  isOpen,
  onClose,
  onInsert
}) => {
  const [url, setUrl] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<{
    title?: string;
    thumbnail?: string;
    error?: string;
  } | null>(null);

  // Extract YouTube video ID from various URL formats
  const extractVideoId = (youtubeUrl: string): string | null => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = youtubeUrl.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  // Validate and preview YouTube URL
  const validateUrl = async (inputUrl: string) => {
    if (!inputUrl.trim()) {
      setVideoId(null);
      setPreviewData(null);
      return;
    }

    setIsValidating(true);
    const id = extractVideoId(inputUrl);
    
    if (!id) {
      setVideoId(null);
      setPreviewData({ error: 'Invalid YouTube URL format' });
      setIsValidating(false);
      return;
    }

    setVideoId(id);
    
    try {
      // Create preview data (in real implementation, you'd fetch from YouTube API)
      const thumbnailUrl = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
      setPreviewData({
        title: 'YouTube Video Preview',
        thumbnail: thumbnailUrl
      });
    } catch (error) {
      setPreviewData({ error: 'Could not load video preview' });
    }
    
    setIsValidating(false);
  };

  // Handle URL input change with debouncing
  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    
    // Debounce validation
    const timeoutId = setTimeout(() => {
      validateUrl(newUrl);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  // Handle video insertion
  const handleInsert = () => {
    if (!videoId || !url.trim()) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }

    // Use the original URL for TipTap YouTube extension
    onInsert(url);
    
    // Reset modal state
    setUrl('');
    setVideoId(null);
    setPreviewData(null);
    
    toast.success('YouTube video embedded successfully! 🎬');
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestionUrl: string) => {
    setUrl(suggestionUrl);
    validateUrl(suggestionUrl);
  };

  // Handle modal close
  const handleClose = () => {
    setUrl('');
    setVideoId(null);
    setPreviewData(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-red-600" />
            Embed YouTube Video
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="youtube-url">YouTube Video URL</Label>
            <div className="relative">
              <Input
                id="youtube-url"
                type="url"
                placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="pr-10"
              />
              {isValidating && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Supports various YouTube URL formats: youtube.com/watch, youtu.be, youtube.com/embed
            </p>
          </div>

          {/* Video Preview */}
          {previewData && (
            <div className="border rounded-lg p-4">
              {previewData.error ? (
                <div className="text-center py-4 text-red-600 dark:text-red-400">
                  <Video className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>{previewData.error}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Video Preview</span>
                    {videoId && (
                      <Badge variant="outline" className="text-xs">
                        ID: {videoId}
                      </Badge>
                    )}
                  </div>
                  {previewData.thumbnail && (
                    <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={previewData.thumbnail}
                        alt="Video thumbnail"
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          // Fallback to standard resolution thumbnail
                          (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-red-600 hover:bg-red-700 transition-colors rounded-full p-3">
                          <Video className="w-6 h-6 text-white" fill="white" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tourism Video Suggestions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-orange-600" />
              <span className="font-medium">Suggested Belize Tourism Videos</span>
            </div>
            <div className="grid gap-2">
              {touristSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => handleSuggestionSelect(suggestion.url)}
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{suggestion.title}</h4>
                    <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">Belize</Badge>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Size Options */}
          <div className="space-y-3">
            <Label>Video Size Options</Label>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 border rounded bg-muted/20">
                <div className="text-xs font-medium">Default</div>
                <div className="text-xs text-muted-foreground">640x360px</div>
              </div>
              <div className="text-center p-2 border rounded">
                <div className="text-xs font-medium">Large</div>
                <div className="text-xs text-muted-foreground">854x480px</div>
              </div>
              <div className="text-center p-2 border rounded">
                <div className="text-xs font-medium">Responsive</div>
                <div className="text-xs text-muted-foreground">Full width</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Default size will be used. Video will be responsive within the content area.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleInsert}
              disabled={!videoId || isValidating}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Video className="w-4 h-4 mr-2" />
              Embed Video
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};