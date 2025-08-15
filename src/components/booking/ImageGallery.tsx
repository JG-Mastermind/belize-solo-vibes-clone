import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Play, X, Maximize2 } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  selectedIndex: number;
  onImageChange: (index: number) => void;
  videoUrl?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  selectedIndex, 
  onImageChange,
  videoUrl 
}) => {
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const nextImage = () => {
    onImageChange((selectedIndex + 1) % images.length);
  };

  const prevImage = () => {
    onImageChange(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Escape') setShowFullscreen(false);
  };

  return (
    <>
      {/* Main Gallery */}
      <div className="relative w-full h-full group">
        {/* Main Image */}
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={images[selectedIndex]}
            alt={`Adventure image ${selectedIndex + 1}`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={prevImage}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={nextImage}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
          {selectedIndex + 1} / {images.length}
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          {videoUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
              onClick={() => setShowVideo(true)}
            >
              <Play className="w-4 h-4 mr-1" />
              Watch Video
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
            onClick={() => setShowFullscreen(true)}
          >
            <Maximize2 className="w-4 h-4 mr-1" />
            View All
          </Button>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedIndex 
                      ? 'border-white shadow-lg' 
                      : 'border-white/50 hover:border-white/80'
                  }`}
                  onClick={() => onImageChange(index)}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  {index === selectedIndex && (
                    <div className="absolute inset-0 bg-white/20" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Gallery Modal */}
      <Dialog open={showFullscreen} onOpenChange={setShowFullscreen}>
        <DialogContent className="max-w-7xl w-full h-full max-h-screen p-0" onKeyDown={handleKeyDown}>
          <DialogHeader className="absolute top-4 left-4 z-10">
            <DialogTitle className="text-white bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
              Adventure Gallery ({selectedIndex + 1} / {images.length})
            </DialogTitle>
          </DialogHeader>
          
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
            onClick={() => setShowFullscreen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
          
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            <img
              src={images[selectedIndex]}
              alt={`Adventure image ${selectedIndex + 1}`}
              loading="lazy"
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            
            {/* Navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="lg"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="lg"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}
          </div>
          
          {/* Thumbnail Strip */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex justify-center space-x-2 overflow-x-auto scrollbar-hide">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedIndex 
                      ? 'border-white shadow-lg' 
                      : 'border-white/50 hover:border-white/80'
                  }`}
                  onClick={() => onImageChange(index)}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  {index === selectedIndex && (
                    <div className="absolute inset-0 bg-white/20" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Modal */}
      {videoUrl && (
        <Dialog open={showVideo} onOpenChange={setShowVideo}>
          <DialogContent className="max-w-4xl w-full p-0">
            <DialogHeader className="absolute top-4 left-4 z-10">
              <DialogTitle className="text-white bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                Adventure Video
              </DialogTitle>
            </DialogHeader>
            
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
              onClick={() => setShowVideo(false)}
            >
              <X className="w-5 h-5" />
            </Button>
            
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={videoUrl}
                title="Adventure Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};