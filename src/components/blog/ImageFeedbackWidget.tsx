import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Eye, 
  MessageSquare,
  TrendingUp,
  X
} from 'lucide-react';

interface ImageFeedbackWidgetProps {
  postSlug: string;
  imageVariant: 'unsplash' | 'ai-generated';
  aiTool?: 'midjourney' | 'adobe-firefly' | 'dall-e-3';
  className?: string;
  compact?: boolean;
}

interface FeedbackData {
  helpful: number;
  notHelpful: number;
  visualAppeal: number;
  relevance: number;
  userVoted?: 'helpful' | 'notHelpful' | null;
}

export const ImageFeedbackWidget: React.FC<ImageFeedbackWidgetProps> = ({
  postSlug,
  imageVariant,
  aiTool,
  className = '',
  compact = false
}) => {
  const { t } = useTranslation(['blog', 'common']);
  const [feedback, setFeedback] = useState<FeedbackData>({
    helpful: 0,
    notHelpful: 0,
    visualAppeal: 0,
    relevance: 0,
    userVoted: null
  });
  const [isVisible, setIsVisible] = useState(false);
  const [showThanks, setShowThanks] = useState(false);

  // Show feedback widget based on user engagement
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 15000); // Show after 15 seconds on page

    return () => clearTimeout(timer);
  }, []);

  // Load existing feedback from localStorage
  useEffect(() => {
    const savedFeedback = localStorage.getItem(`image-feedback-${postSlug}`);
    if (savedFeedback) {
      const parsed = JSON.parse(savedFeedback);
      setFeedback(parsed);
    }
  }, [postSlug]);

  const handleFeedback = (type: 'helpful' | 'notHelpful') => {
    if (feedback.userVoted) return; // Prevent multiple votes

    const newFeedback = {
      ...feedback,
      [type]: feedback[type] + 1,
      userVoted: type
    };

    setFeedback(newFeedback);
    localStorage.setItem(`image-feedback-${postSlug}`, JSON.stringify(newFeedback));
    
    // Track analytics event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'image_feedback', {
        event_category: 'blog_engagement',
        event_label: `${postSlug}_${imageVariant}_${type}`,
        value: type === 'helpful' ? 1 : -1
      });
    }

    setShowThanks(true);
    setTimeout(() => setShowThanks(false), 3000);
  };

  const dismiss = () => {
    setIsVisible(false);
    localStorage.setItem(`image-feedback-dismissed-${postSlug}`, 'true');
  };

  // Check if user already dismissed this widget
  useEffect(() => {
    const dismissed = localStorage.getItem(`image-feedback-dismissed-${postSlug}`);
    if (dismissed) {
      setIsVisible(false);
    }
  }, [postSlug]);

  if (!isVisible || compact && feedback.userVoted) return null;

  return (
    <Card className={`fixed bottom-6 right-6 z-50 w-80 shadow-lg border-l-4 border-l-belize-orange-500 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-belize-orange-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('blog:feedback.imageQuestion', 'How\'s this image?')}
            </span>
            {imageVariant === 'ai-generated' && (
              <Badge variant="secondary" className="text-xs">
                {aiTool === 'midjourney' && 'AI'}
                {aiTool === 'adobe-firefly' && 'AI'}  
                {aiTool === 'dall-e-3' && 'AI'}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={dismiss}
            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>

        {showThanks ? (
          <div className="text-center py-2">
            <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <p className="text-sm text-green-600 font-medium">
              {t('blog:feedback.thanks', 'Thanks for your feedback!')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {t('blog:feedback.helpUs', 'Help us improve our content visuals')}
            </p>
            
            <div className="flex gap-2">
              <Button
                variant={feedback.userVoted === 'helpful' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFeedback('helpful')}
                disabled={feedback.userVoted !== null}
                className="flex-1 text-xs"
              >
                <ThumbsUp className="w-3 h-3 mr-1" />
                {t('blog:feedback.helpful', 'Helpful')}
                {feedback.helpful > 0 && (
                  <span className="ml-1 text-xs">({feedback.helpful})</span>
                )}
              </Button>
              
              <Button
                variant={feedback.userVoted === 'notHelpful' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFeedback('notHelpful')}
                disabled={feedback.userVoted !== null}
                className="flex-1 text-xs"
              >
                <ThumbsDown className="w-3 h-3 mr-1" />
                {t('blog:feedback.notHelpful', 'Not helpful')}
                {feedback.notHelpful > 0 && (
                  <span className="ml-1 text-xs">({feedback.notHelpful})</span>
                )}
              </Button>
            </div>

            {imageVariant === 'ai-generated' && (
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {t('blog:feedback.aiGenerated', 'This image was AI-generated for better relevance')}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Compact version for blog listing page
export const CompactImageFeedback: React.FC<{
  postSlug: string;
  imageVariant: 'unsplash' | 'ai-generated';
}> = ({ postSlug, imageVariant }) => {
  const [feedback, setFeedback] = useState({ helpful: 0, notHelpful: 0, userVoted: null });

  useEffect(() => {
    const savedFeedback = localStorage.getItem(`image-feedback-${postSlug}`);
    if (savedFeedback) {
      setFeedback(JSON.parse(savedFeedback));
    }
  }, [postSlug]);

  if (!feedback.userVoted) return null;

  return (
    <div className="absolute top-2 right-2 z-10">
      <Badge 
        variant="secondary" 
        className="text-xs bg-white/90 text-gray-700 shadow-sm"
      >
        {feedback.userVoted === 'helpful' ? (
          <><ThumbsUp className="w-2 h-2 mr-1" /> Helpful</>
        ) : (
          <><ThumbsDown className="w-2 h-2 mr-1" /> Not helpful</>
        )}
      </Badge>
    </div>
  );
};

export default ImageFeedbackWidget;