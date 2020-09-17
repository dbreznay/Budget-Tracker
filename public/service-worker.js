const CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v1';


const FILES_TO_CACHE = [
    '/',
    '/styles.css',
    '/index.js',
    '/db.js',
    '/manifest.webmanifest',
    '/index.html',
    '/icons/18-PWA_02-Homework_Develop_public_icons_icon-192x192.png',
    '/icons/18-PWA_02-Homework_Develop_public_icons_icon-512x512.png'
    
]

self.addEventListener("install", evt => {
  console.log('Service Worker: Installed');   

  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Caching Files');
      cache.addAll(FILES_TO_CACHE);
    })
    .then(() => self.skipWaiting())
  );   
});

self.addEventListener("activate", evt => {
  console.log('Service Worker: Activated');
  
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(evt) {
  
  evt.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(evt.request).then(response => {
          return response || fetch(evt.request);
      });
    })
  );
});   