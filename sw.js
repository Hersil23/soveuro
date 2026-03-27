/* ========================================
   SVU — Service Worker
   Cache First: assets estáticos
   Network First: páginas HTML
   Offline fallback
   ======================================== */

const CACHE_NAME = 'svu-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/main.js',
  '/manifest.json'
];

/* --- Install: pre-cache static assets --- */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* --- Activate: clean old caches --- */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

/* --- Fetch strategy --- */
self.addEventListener('fetch', event => {
  const { request } = event;

  /* HTML pages: Network First */
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then(cached => cached || offlineFallback()))
    );
    return;
  }

  /* Static assets: Cache First */
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        return response;
      });
    })
  );
});

/* --- Offline fallback --- */
function offlineFallback() {
  return new Response(
    `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sin conexión — SVU</title>
  <style>
    body { font-family: 'DM Sans', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #111; color: #fff; text-align: center; padding: 2rem; }
    h1 { font-size: 1.5rem; margin-bottom: 1rem; }
    p { color: #999; }
    a { color: #F0C000; }
  </style>
</head>
<body>
  <div>
    <h1>Sin conexión</h1>
    <p>No pudimos cargar esta página. Verifica tu conexión a internet e <a href="/">intenta de nuevo</a>.</p>
  </div>
</body>
</html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}
