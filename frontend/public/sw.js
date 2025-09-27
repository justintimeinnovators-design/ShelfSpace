// ShelfSpace Service Worker
const CACHE_NAME = 'shelfspace-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/library',
  '/discover',
  '/chat',
  '/groups',
  '/settings',
  '/login',
  '/manifest.json',
  // Add static assets
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline reading progress
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Sync reading progress when back online
  try {
    const readingProgress = await getStoredReadingProgress();
    if (readingProgress.length > 0) {
      await syncReadingProgress(readingProgress);
      await clearStoredReadingProgress();
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notifications for reading reminders
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Time to continue your reading journey!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Continue Reading',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-96x96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('ShelfSpace Reading Reminder', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});

// Helper functions
async function getStoredReadingProgress() {
  // Get reading progress from IndexedDB
  return [];
}

async function syncReadingProgress(progress) {
  // Sync with server
  console.log('Syncing reading progress:', progress);
}

async function clearStoredReadingProgress() {
  // Clear stored progress after sync
  console.log('Clearing stored reading progress');
}
