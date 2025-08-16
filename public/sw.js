// Service Worker for Hud FC Manager PWA
const CACHE_NAME = 'hudfc-manager-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Files to cache for offline functionality
const CORE_CACHE_FILES = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/src/main.tsx',
  '/src/index.css',
  // Add main app assets
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// API cache for Supabase requests
const API_CACHE_NAME = 'hudfc-api-v1.0.0';
const API_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

// Install event - cache core files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        console.log('Service Worker: Caching core files');
        await cache.addAll(CORE_CACHE_FILES);
        
        // Cache the offline page
        await cache.add(new Request(OFFLINE_URL, { cache: 'reload' }));
        
        // Skip waiting to activate immediately
        self.skipWaiting();
      } catch (error) {
        console.error('Service Worker: Installation failed', error);
      }
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    (async () => {
      try {
        // Clean up old caches
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName.startsWith('hudfc-') && 
              cacheName !== CACHE_NAME && 
              cacheName !== API_CACHE_NAME
            )
            .map(cacheName => {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            })
        );
        
        // Claim all clients
        await self.clients.claim();
        console.log('Service Worker: Activated successfully');
      } catch (error) {
        console.error('Service Worker: Activation failed', error);
      }
    })()
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }
  
  // Handle API requests (Supabase)
  if (url.hostname.includes('supabase')) {
    event.respondWith(handleAPIRequest(request));
    return;
  }
  
  // Handle static assets
  if (request.destination === 'image' || 
      request.destination === 'style' || 
      request.destination === 'script' ||
      request.destination === 'font') {
    event.respondWith(handleStaticAssets(request));
    return;
  }
  
  // Default: network first, fallback to cache
  event.respondWith(handleDefault(request));
});

// Handle navigation requests (pages)
async function handleNavigation(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Navigation offline, serving cached version');
    
    // Try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to offline page
    return caches.match(OFFLINE_URL);
  }
}

// Handle API requests with cache strategies
async function handleAPIRequest(request) {
  const url = new URL(request.url);
  
  // For read operations, try cache first, then network
  if (url.pathname.includes('/rest/v1/') && request.method === 'GET') {
    return handleAPIRead(request);
  }
  
  // For write operations, always try network
  return handleAPIWrite(request);
}

async function handleAPIRead(request) {
  try {
    const cache = await caches.open(API_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    // Check if cached response is still fresh
    if (cachedResponse) {
      const cacheTime = cachedResponse.headers.get('sw-cache-time');
      if (cacheTime && (Date.now() - parseInt(cacheTime)) < API_CACHE_TIME) {
        console.log('Service Worker: Serving fresh cached API response');
        return cachedResponse;
      }
    }
    
    // Fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Clone and add timestamp
      const responseToCache = networkResponse.clone();
      const responseWithTimestamp = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: {
          ...Object.fromEntries(responseToCache.headers),
          'sw-cache-time': Date.now().toString()
        }
      });
      
      cache.put(request, responseWithTimestamp);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: API request failed, trying cache');
    
    // Fallback to cache
    const cache = await caches.open(API_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API
    return new Response(JSON.stringify({
      error: 'Offline - cached data not available',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleAPIWrite(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.log('Service Worker: API write request failed - offline');
    
    // Store failed requests for later sync (if needed)
    // For now, just return error
    return new Response(JSON.stringify({
      error: 'Cannot perform this action while offline',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle static assets (images, CSS, JS, fonts)
async function handleStaticAssets(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    
    // Check cache first
    let cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fetch from network and cache
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Try cache again as fallback
    const cache = await caches.open(CACHE_NAME);
    return cache.match(request);
  }
}

// Default handler
async function handleDefault(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cache = await caches.open(CACHE_NAME);
    return cache.match(request);
  }
}

// Background sync for offline actions (future implementation)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Implement background sync for offline actions
  console.log('Service Worker: Performing background sync...');
}

// Push notifications (future implementation)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('Service Worker: Loaded successfully');
