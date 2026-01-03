
const CACHE_NAME = 'kfgc-media-v1';

const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',

  // images (add more if needed)
  '/kfgc.jpg',
  '/user.jpg',
  '/grow.jpg',
  '/worship.jpg',
  '/bible.jpg',
  '/youths-ministry.jpg',
  '/children.jpg',
  '/praise.jpg',
  '/women.jpg',
  '/evangelism.jpg',
];

// Install
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request).then(fetchRes => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchRes.clone());
          return fetchRes;
        });
      }).catch(() => caches.match('/index.html'));
    })
  );
});
