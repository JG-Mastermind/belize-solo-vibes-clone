// Service Worker for BelizeVibes.com
// Implements caching strategies for performance optimization

const CACHE_NAME = 'belize-vibes-v1';
const STATIC_CACHE_NAME = 'belize-vibes-static-v1';
const DYNAMIC_CACHE_NAME = 'belize-vibes-dynamic-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/adventures',
  '/about',
  '/contact',
  '/blog',
  '/safety',
  '/favicon.svg',
  '/placeholder.svg',
  '/robots.txt'
];

// Dynamic cache patterns - cache responses for these patterns
const CACHE_PATTERNS = {
  images: /\.(jpg|jpeg|png|gif|webp|svg)$/i,
  api: /\/api\//,
  tours: /\/tours\//,
  blog: /\/blog\//
};

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch(error => console.error('Service Worker: Cache failed', error))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) return;

  event.respondWith(
    handleFetchRequest(request, url)
  );
});

async function handleFetchRequest(request, url) {
  try {
    // Strategy 1: Cache First for images and static assets
    if (CACHE_PATTERNS.images.test(url.pathname) || isStaticAsset(url.pathname)) {
      return await cacheFirst(request);
    }

    // Strategy 2: Network First for API calls and dynamic content
    if (CACHE_PATTERNS.api.test(url.pathname) || 
        CACHE_PATTERNS.tours.test(url.pathname) || 
        CACHE_PATTERNS.blog.test(url.pathname)) {
      return await networkFirst(request);
    }

    // Strategy 3: Stale While Revalidate for navigation requests
    if (request.mode === 'navigate') {
      return await staleWhileRevalidate(request);
    }

    // Default: Network First
    return await networkFirst(request);

  } catch (error) {
    console.error('Service Worker: Fetch failed', error);
    
    // Return cached version if available, otherwise show offline page
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline fallback for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/');
    }
    
    throw error;
  }
}

// Cache First Strategy - good for images and static assets
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await fetch(request);
  
  if (networkResponse.status === 200) {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Network First Strategy - good for API calls and dynamic content
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache');
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale While Revalidate Strategy - good for navigation and frequently updated content
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.status === 200) {
      const cache = caches.open(DYNAMIC_CACHE_NAME);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

// Helper function to identify static assets
function isStaticAsset(pathname) {
  return pathname.includes('.') && (
    pathname.endsWith('.css') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.woff') ||
    pathname.endsWith('.woff2') ||
    pathname.endsWith('.ttf') ||
    pathname.endsWith('.eot')
  );
}

// Message handling for cache updates
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CACHE_UPDATE') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE_NAME)
        .then(cache => cache.delete(event.data.url))
        .then(() => console.log('Service Worker: Cache updated for', event.data.url))
    );
  }
});

// Background sync for offline actions (if needed)
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Implement background sync logic if needed
      console.log('Service Worker: Background sync triggered')
    );
  }
});

console.log('Service Worker: Script loaded');