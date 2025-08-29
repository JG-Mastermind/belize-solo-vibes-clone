import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Maximize2, ExternalLink } from 'lucide-react';

interface BlogVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  videoTitle?: string;
}

// Extract YouTube video ID for enhanced features
const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

export const BlogVideoModal: React.FC<BlogVideoModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  videoTitle = 'Video'
}) => {
  if (!videoUrl) return null;

  const videoId = extractYouTubeId(videoUrl);
  const isYouTube = !!videoId;

  // Create enhanced YouTube URL with better player parameters
  const getEnhancedVideoUrl = (originalUrl: string): string => {
    if (!isYouTube || !videoId) return originalUrl;

    // Create embed URL with enhanced parameters for modal viewing
    const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`);
    embedUrl.searchParams.set('autoplay', '1'); // Autoplay when modal opens
    embedUrl.searchParams.set('rel', '0'); // Don't show related videos from other channels
    embedUrl.searchParams.set('modestbranding', '1'); // Minimal YouTube branding
    embedUrl.searchParams.set('controls', '1'); // Show player controls
    embedUrl.searchParams.set('fs', '1'); // Allow fullscreen
    embedUrl.searchParams.set('cc_load_policy', '1'); // Show captions if available
    embedUrl.searchParams.set('iv_load_policy', '3'); // Hide annotations
    embedUrl.searchParams.set('playsinline', '1'); // Play inline on mobile

    return embedUrl.toString();
  };

  // Handle opening video in new tab
  const handleOpenInNewTab = () => {
    if (isYouTube && videoId) {
      window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    } else {
      window.open(videoUrl, '_blank');
    }
  };

  const enhancedVideoUrl = getEnhancedVideoUrl(videoUrl);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 gap-0 bg-black border-none">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black/90 border-b border-gray-800">
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-medium truncate">{videoTitle}</h2>
            {isYouTube && (
              <p className="text-gray-400 text-sm">YouTube Video</p>
            )}
          </div>
          <div className="flex items-center gap-2 ml-4">
            {/* Fullscreen hint */}
            <div className="hidden sm:flex items-center gap-1 text-gray-400 text-xs">
              <Maximize2 className="w-3 h-3" />
              <span>Press fullscreen for best experience</span>
            </div>
            
            {/* Open in YouTube */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenInNewTab}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
              title="Open in YouTube"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>

            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Video Container */}
        <div className="relative bg-black">
          <div className="aspect-video">
            {isYouTube ? (
              <iframe
                src={enhancedVideoUrl}
                title={videoTitle}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                style={{
                  border: 'none',
                  outline: 'none'
                }}
              />
            ) : (
              // Fallback for non-YouTube videos
              <div className="flex items-center justify-center h-full text-white">
                <div className="text-center">
                  <p className="mb-4">Video player not supported for this URL format</p>
                  <Button 
                    onClick={handleOpenInNewTab}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Video
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer with video info */}
        <div className="p-4 bg-black/90 border-t border-gray-800">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center gap-4">
              {isYouTube && videoId && (
                <>
                  <span>Video ID: {videoId}</span>
                  <span>•</span>
                  <span>YouTube</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 text-xs bg-gray-800 border border-gray-700 rounded">
                ESC
              </kbd>
              <span className="text-xs">to close</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};