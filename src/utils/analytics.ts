// Analytics and conversion tracking utilities
// This is a placeholder implementation - in production, integrate with Google Analytics, Mixpanel, etc.

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
  userId?: string;
}

export const analytics = {
  // Track authentication events
  trackAuthStart: (method: string) => {
    console.log('Auth started:', method);
    // gtag('event', 'auth_start', { method });
  },

  trackAuthSuccess: (method: string, userId: string) => {
    console.log('Auth success:', method, userId);
    // gtag('event', 'auth_success', { method, user_id: userId });
  },

  trackAuthFailure: (method: string, error: string) => {
    console.log('Auth failure:', method, error);
    // gtag('event', 'auth_failure', { method, error });
  },

  trackRoleSelection: (role: string, userId: string) => {
    console.log('Role selected:', role, userId);
    // gtag('event', 'role_selection', { role, user_id: userId });
  },

  trackPasswordStrength: (strength: number) => {
    console.log('Password strength:', strength);
    // gtag('event', 'password_strength', { strength });
  },

  trackModalOpen: (modalType: string) => {
    console.log('Modal opened:', modalType);
    // gtag('event', 'modal_open', { modal_type: modalType });
  },

  trackModalClose: (modalType: string) => {
    console.log('Modal closed:', modalType);
    // gtag('event', 'modal_close', { modal_type: modalType });
  },

  trackConversion: (conversionType: string, value?: number) => {
    console.log('Conversion:', conversionType, value);
    // gtag('event', 'conversion', { conversion_type: conversionType, value });
  },

  trackError: (error: string, context?: string) => {
    console.error('Error tracked:', error, context);
    // gtag('event', 'error', { error, context });
  },

  // Device and browser detection
  getDeviceInfo: () => {
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) || 
                  (navigator.maxTouchPoints > 1 && userAgent.includes('Mac'));
    const isAndroid = /Android/.test(userAgent);
    const isMobile = /Mobi|Android/i.test(userAgent);
    
    return {
      isIOS,
      isAndroid,
      isMobile,
      userAgent,
      screen: {
        width: window.screen.width,
        height: window.screen.height
      }
    };
  },

  // A/B testing support
  getTestVariant: (testName: string): string => {
    const userId = localStorage.getItem('userId') || 'anonymous';
    const hash = userId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return Math.abs(hash) % 2 === 0 ? 'A' : 'B';
  },

  // Initialize analytics
  init: (userId?: string) => {
    console.log('Analytics initialized for user:', userId);
    
    // Track device info
    const deviceInfo = analytics.getDeviceInfo();
    console.log('Device info:', deviceInfo);
    
    // Set user properties
    if (userId) {
      // gtag('config', 'GA_MEASUREMENT_ID', { user_id: userId });
    }
  }
};

export default analytics;