// Service Worker registration utility
// Handles service worker registration with proper error handling

const isProduction = import.meta.env.PROD;
const isLocalhost = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1';

export interface ServiceWorkerConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

export function registerServiceWorker(config?: ServiceWorkerConfig) {
  // Only register in production or if explicitly enabled in development
  if (!isProduction && !isLocalhost) {
    console.log('Service Worker: Registration skipped (not production)');
    return;
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = '/sw.js';
      
      if (isLocalhost) {
        // Development environment
        checkValidServiceWorker(swUrl, config);
        
        navigator.serviceWorker.ready.then(() => {
          console.log('Service Worker: Ready for offline use');
        });
      } else {
        // Production environment
        registerValidServiceWorker(swUrl, config);
      }
    });
  } else {
    console.log('Service Worker: Not supported in this browser');
  }
}

async function registerValidServiceWorker(swUrl: string, config?: ServiceWorkerConfig) {
  try {
    const registration = await navigator.serviceWorker.register(swUrl);
    
    registration.addEventListener('updatefound', () => {
      const installingWorker = registration.installing;
      if (!installingWorker) return;

      installingWorker.addEventListener('statechange', () => {
        if (installingWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // New content is available
            console.log('Service Worker: New content available, please refresh');
            config?.onUpdate?.(registration);
          } else {
            // Content is cached for offline use
            console.log('Service Worker: Content cached for offline use');
            config?.onSuccess?.(registration);
          }
        }
      });
    });

    console.log('Service Worker: Registration successful');
    return registration;
  } catch (error) {
    const swError = error instanceof Error ? error : new Error('Service Worker registration failed');
    console.error('Service Worker: Registration failed', swError);
    config?.onError?.(swError);
  }
}

async function checkValidServiceWorker(swUrl: string, config?: ServiceWorkerConfig) {
  try {
    const response = await fetch(swUrl, {
      headers: { 'Service-Worker': 'script' },
    });

    const contentType = response.headers.get('content-type');
    if (response.status === 404 || 
        (contentType && !contentType.includes('javascript'))) {
      // Service worker not found or invalid
      const registration = await navigator.serviceWorker.ready;
      await registration.unregister();
      window.location.reload();
    } else {
      // Service worker found, proceed with registration
      registerValidServiceWorker(swUrl, config);
    }
  } catch (error) {
    console.log('Service Worker: No internet connection, app running in offline mode');
  }
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
        console.log('Service Worker: Unregistered');
      })
      .catch((error) => {
        console.error('Service Worker: Unregistration failed', error);
      });
  }
}

// Utility to manually update cache
export function updateCache(url: string) {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_UPDATE',
      url: url
    });
  }
}

// Check if app is running in offline mode
export function isOffline(): boolean {
  return !navigator.onLine;
}

// Listen for online/offline events
export function addConnectivityListeners(
  onOnline?: () => void,
  onOffline?: () => void
) {
  window.addEventListener('online', () => {
    console.log('App: Back online');
    onOnline?.();
  });

  window.addEventListener('offline', () => {
    console.log('App: Gone offline');
    onOffline?.();
  });
}