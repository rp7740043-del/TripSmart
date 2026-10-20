// sw.js - Service Worker for Offline-First PWA Support
const CACHE_NAME = 'tripsmart-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/main.css',
  './css/components.css',
  './css/responsive.css',
  './js/data.js',
  './js/mockApi.js',
  './js/tools.js',
  './js/optimizer.js',
  './js/booking.js',
  './js/chatbot.js',
  './js/wizard.js',
  './js/app.js',
  './data/destinations.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(networkResponse => {
        return networkResponse;
      }).catch(() => {
        // Fallback if offline
        return caches.match('./index.html');
      });
    })
  );
});
