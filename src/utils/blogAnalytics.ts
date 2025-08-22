/**
 * Blog Analytics Utility for Image A/B Testing
 * Tracks user interactions and performance metrics for blog images
 */

export interface BlogImageAnalytics {
  postSlug: string;
  imageVariant: 'unsplash' | 'ai-generated';
  aiTool?: 'midjourney' | 'adobe-firefly' | 'dall-e-3';
  metrics: {
    // Blog listing metrics
    listingImpressions: number;
    listingClicks: number;
    listingCTR: number;
    
    // Individual post metrics
    pageViews: number;
    uniqueVisitors: number;
    averageTimeOnPage: number;
    bounceRate: number;
    scrollDepthPct: number;
    
    // Engagement metrics
    socialShares: number;
    comments: number;
    returnVisitors: number;
    
    // User feedback
    feedbackHelpful: number;
    feedbackNotHelpful: number;
    feedbackScore: number; // (helpful - notHelpful) / (helpful + notHelpful)
  };
  testStartDate: string;
  lastUpdated: string;
}

// Initialize analytics tracking for a blog post
export const initializeBlogAnalytics = (
  postSlug: string,
  imageVariant: 'unsplash' | 'ai-generated',
  aiTool?: 'midjourney' | 'adobe-firefly' | 'dall-e-3'
): BlogImageAnalytics => {
  return {
    postSlug,
    imageVariant,
    aiTool,
    metrics: {
      listingImpressions: 0,
      listingClicks: 0,
      listingCTR: 0,
      pageViews: 0,
      uniqueVisitors: 0,
      averageTimeOnPage: 0,
      bounceRate: 0,
      scrollDepthPct: 0,
      socialShares: 0,
      comments: 0,
      returnVisitors: 0,
      feedbackHelpful: 0,
      feedbackNotHelpful: 0,
      feedbackScore: 0
    },
    testStartDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  };
};

// Track blog listing interactions
export const trackListingInteraction = (
  postSlug: string,
  action: 'impression' | 'click'
): void => {
  // Google Analytics event
  if (typeof gtag !== 'undefined') {
    gtag('event', `blog_listing_${action}`, {
      event_category: 'blog_engagement',
      event_label: postSlug,
      value: action === 'click' ? 1 : 0
    });
  }

  // Update local analytics data
  const analyticsKey = `blog-analytics-${postSlug}`;
  const existing = localStorage.getItem(analyticsKey);
  
  if (existing) {
    const analytics: BlogImageAnalytics = JSON.parse(existing);
    if (action === 'impression') {
      analytics.metrics.listingImpressions++;
    } else if (action === 'click') {
      analytics.metrics.listingClicks++;
    }
    analytics.metrics.listingCTR = analytics.metrics.listingClicks / analytics.metrics.listingImpressions;
    analytics.lastUpdated = new Date().toISOString();
    
    localStorage.setItem(analyticsKey, JSON.stringify(analytics));
  }
};

// Track page engagement metrics
export const trackPageEngagement = (
  postSlug: string,
  metrics: {
    timeOnPage?: number;
    scrollDepth?: number;
    bounced?: boolean;
    isReturnVisitor?: boolean;
  }
): void => {
  // Google Analytics events
  if (typeof gtag !== 'undefined') {
    if (metrics.timeOnPage) {
      gtag('event', 'blog_engagement_time', {
        event_category: 'blog_engagement',
        event_label: postSlug,
        value: Math.round(metrics.timeOnPage / 1000) // Convert to seconds
      });
    }

    if (metrics.scrollDepth) {
      gtag('event', 'blog_scroll_depth', {
        event_category: 'blog_engagement', 
        event_label: postSlug,
        value: metrics.scrollDepth
      });
    }
  }

  // Update local analytics
  const analyticsKey = `blog-analytics-${postSlug}`;
  const existing = localStorage.getItem(analyticsKey);
  
  if (existing) {
    const analytics: BlogImageAnalytics = JSON.parse(existing);
    
    if (metrics.timeOnPage) {
      const currentAvg = analytics.metrics.averageTimeOnPage;
      const views = analytics.metrics.pageViews;
      analytics.metrics.averageTimeOnPage = (currentAvg * views + metrics.timeOnPage) / (views + 1);
    }
    
    if (metrics.scrollDepth !== undefined) {
      analytics.metrics.scrollDepthPct = Math.max(analytics.metrics.scrollDepthPct, metrics.scrollDepth);
    }
    
    if (metrics.bounced !== undefined) {
      const currentBounces = analytics.metrics.bounceRate * analytics.metrics.pageViews;
      const newBounces = currentBounces + (metrics.bounced ? 1 : 0);
      analytics.metrics.bounceRate = newBounces / (analytics.metrics.pageViews + 1);
    }
    
    if (metrics.isReturnVisitor) {
      analytics.metrics.returnVisitors++;
    }
    
    analytics.metrics.pageViews++;
    analytics.lastUpdated = new Date().toISOString();
    
    localStorage.setItem(analyticsKey, JSON.stringify(analytics));
  }
};

// Track social sharing
export const trackSocialShare = (
  postSlug: string,
  platform: 'facebook' | 'twitter' | 'linkedin' | 'email' | 'copy'
): void => {
  // Google Analytics event
  if (typeof gtag !== 'undefined') {
    gtag('event', 'share', {
      method: platform,
      content_type: 'blog_post',
      content_id: postSlug
    });
  }

  // Update analytics
  const analyticsKey = `blog-analytics-${postSlug}`;
  const existing = localStorage.getItem(analyticsKey);
  
  if (existing) {
    const analytics: BlogImageAnalytics = JSON.parse(existing);
    analytics.metrics.socialShares++;
    analytics.lastUpdated = new Date().toISOString();
    localStorage.setItem(analyticsKey, JSON.stringify(analytics));
  }
};

// Track user feedback on images
export const trackImageFeedback = (
  postSlug: string,
  feedback: 'helpful' | 'notHelpful'
): void => {
  // Google Analytics event
  if (typeof gtag !== 'undefined') {
    gtag('event', 'image_feedback', {
      event_category: 'blog_engagement',
      event_label: `${postSlug}_${feedback}`,
      value: feedback === 'helpful' ? 1 : -1
    });
  }

  // Update analytics
  const analyticsKey = `blog-analytics-${postSlug}`;
  const existing = localStorage.getItem(analyticsKey);
  
  if (existing) {
    const analytics: BlogImageAnalytics = JSON.parse(existing);
    
    if (feedback === 'helpful') {
      analytics.metrics.feedbackHelpful++;
    } else {
      analytics.metrics.feedbackNotHelpful++;
    }
    
    // Calculate feedback score
    const total = analytics.metrics.feedbackHelpful + analytics.metrics.feedbackNotHelpful;
    analytics.metrics.feedbackScore = total > 0 
      ? (analytics.metrics.feedbackHelpful - analytics.metrics.feedbackNotHelpful) / total
      : 0;
    
    analytics.lastUpdated = new Date().toISOString();
    localStorage.setItem(analyticsKey, JSON.stringify(analytics));
  }
};

// Get analytics data for a specific post
export const getBlogAnalytics = (postSlug: string): BlogImageAnalytics | null => {
  const data = localStorage.getItem(`blog-analytics-${postSlug}`);
  return data ? JSON.parse(data) : null;
};

// Get all blog analytics for comparison
export const getAllBlogAnalytics = (): BlogImageAnalytics[] => {
  const analytics: BlogImageAnalytics[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('blog-analytics-')) {
      const data = localStorage.getItem(key);
      if (data) {
        analytics.push(JSON.parse(data));
      }
    }
  }
  
  return analytics.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
};

// Calculate A/B test performance comparison
export const compareImagePerformance = (
  originalSlug: string,
  testSlug: string
): {
  original: BlogImageAnalytics | null;
  test: BlogImageAnalytics | null;
  improvements: {
    ctrImprovement: number;
    engagementImprovement: number;
    feedbackImprovement: number;
    overallScore: number;
  };
} => {
  const original = getBlogAnalytics(originalSlug);
  const test = getBlogAnalytics(testSlug);
  
  const improvements = {
    ctrImprovement: 0,
    engagementImprovement: 0,
    feedbackImprovement: 0,
    overallScore: 0
  };
  
  if (original && test) {
    // CTR improvement
    improvements.ctrImprovement = original.metrics.listingCTR > 0
      ? ((test.metrics.listingCTR - original.metrics.listingCTR) / original.metrics.listingCTR) * 100
      : 0;
    
    // Engagement improvement (time on page + scroll depth - bounce rate)
    const originalEngagement = (original.metrics.averageTimeOnPage * original.metrics.scrollDepthPct / 100) * (1 - original.metrics.bounceRate);
    const testEngagement = (test.metrics.averageTimeOnPage * test.metrics.scrollDepthPct / 100) * (1 - test.metrics.bounceRate);
    improvements.engagementImprovement = originalEngagement > 0
      ? ((testEngagement - originalEngagement) / originalEngagement) * 100
      : 0;
    
    // Feedback improvement
    improvements.feedbackImprovement = (test.metrics.feedbackScore - original.metrics.feedbackScore) * 100;
    
    // Overall score (weighted average)
    improvements.overallScore = (
      improvements.ctrImprovement * 0.4 +
      improvements.engagementImprovement * 0.4 +
      improvements.feedbackImprovement * 0.2
    );
  }
  
  return { original, test, improvements };
};

// Auto-track scroll depth on blog posts
export const initScrollTracking = (postSlug: string): () => void => {
  let maxScrollDepth = 0;
  const startTime = Date.now();
  let isActive = true;

  const trackScroll = () => {
    if (!isActive) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    const scrollPercentage = Math.round((scrollTop + windowHeight) / documentHeight * 100);
    maxScrollDepth = Math.max(maxScrollDepth, scrollPercentage);
  };

  const handleVisibilityChange = () => {
    if (document.hidden && isActive) {
      // Page is being hidden, track final metrics
      const timeOnPage = Date.now() - startTime;
      const bounced = maxScrollDepth < 25 && timeOnPage < 30000; // Less than 25% scroll and 30 seconds
      
      trackPageEngagement(postSlug, {
        timeOnPage,
        scrollDepth: maxScrollDepth,
        bounced
      });
    }
  };

  // Set up event listeners
  window.addEventListener('scroll', trackScroll, { passive: true });
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Return cleanup function
  return () => {
    isActive = false;
    window.removeEventListener('scroll', trackScroll);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    
    // Final tracking on cleanup
    const timeOnPage = Date.now() - startTime;
    const bounced = maxScrollDepth < 25 && timeOnPage < 30000;
    
    trackPageEngagement(postSlug, {
      timeOnPage,
      scrollDepth: maxScrollDepth,
      bounced
    });
  };
};