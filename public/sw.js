// ALTRON OS Service Worker for Android Notification Shade Shortcut & PWA Installation Compliance

const CACHE_NAME = 'altron-os-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch handler required for Chrome PWA Installability verification
self.addEventListener('fetch', (event) => {
  // Allow normal network requests, fallback gracefully if offline
  if (event.request.method !== 'GET') return;
  
  // Exclude API requests
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    fetch(event.request).catch(async () => {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      return new Response('ALTRON OS Offline Mode', {
        headers: { 'Content-Type': 'text/plain' }
      });
    })
  );
});

// Handle notification tap from Android notification shade
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const action = event.action;

  let targetUrl = '/';
  if (action === 'open_voice') {
    targetUrl = '/?action=voice';
  } else if (action === 'open_call') {
    targetUrl = '/?action=call';
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          if (client.url.includes(self.location.origin)) {
            client.postMessage({ type: 'ALTRON_QUICK_ACTION', action: action || 'open_dashboard' });
            return client.focus();
          }
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
