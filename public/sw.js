
self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('v1').then(function(cache) {
        return cache.addAll([
          '/',
        ]);
      })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request).then(function (response) {
            let responseClone = response.clone();
            caches.open('v1').then(function (cache) {
                cache.put(event.request, responseClone);
            });
            return response;
        }).catch(function () {
            return caches.match(event.request).then(function(response) {
                return response;
            })
        })
    );
});

