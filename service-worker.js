// Service Worker for Le'Fam Central PWA
// This is a minimal service worker that enables PWA installation

const CACHE_NAME = 'lefam-v1';

// Install event - cache essential assets
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(clients.claim());
});

// Fetch event - network first, no offline caching for now
// (all data comes from Google Sheets via API so offline doesn't make sense yet)
self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});
