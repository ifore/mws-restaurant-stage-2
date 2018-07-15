const staticCacheName = 'mws-restaurant-v2';
const imgCache = 'mws-restaurant-imgs-v2';

const allCaches = [
  '/',
  '/index.html',
  '/restaurant.html',
  '/dist/css/styles.min.css',
  '/dist/js/idb.min.js',
  '/dist/js/init.min.js',
  '/dist/js/dbhelper.min.js',
  '/dist/js/main.min.js',
  '/dist/js/restaurant_info.min.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => cache.addAll(allCaches))
      .then(self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  const currentCaches = [staticCacheName, imgCache];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});


self.addEventListener('fetch', event => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return caches.open(imgCache).then(cache => {
          return fetch(event.request).then(response => {
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      }).catch(function(err) {
          console.log("What? ", err, event.request);
          return new Response('<h1>Don\'t panic!</h1>'
            + '<p>Sorry to inform you but you are without internet connetion.... Take a break.</p>', {
            headers: {'Content-Type': 'text/html'}
          });
        })

    );
  }
});
