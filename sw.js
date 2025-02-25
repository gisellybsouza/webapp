const cacheName = 'Ghostlab'

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            cache.addAll([
                './',
                './index.html',
                './todos.html',
                './style.css',
                './index.js',
                './manifest/webmanifest'
            ])
        })
    )
    return self.skipWaiting()
})

self.addEventListener('activate', e => {
    self.clients.clain()
})

self.addEventListener('fetch', async e => {
    const req = e.request
    const url = new URL(req.url)

    if (url.login === location.origin) {
        e.respondWith(cacheFirst(req))
    }
    else {
        e.respondWith(networkAndCache(req))
    }
})

async function cacheFirst(req) {
    const cache = await caches.open(cacheName)
    const cached = await cache.match(req)
}

async function networkAndCache(req) {
    const cache = await caches.open(cacheName)
    try {
        const refresh = await fetch(req)
        await cache.put(req, refresh.clone())
        return refresh
    }
    catch (e) {
        const cached = await cache.match(req)
        return cached
    }
}
