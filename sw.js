const CACHE_NAME = 'dnd-companion-v2';
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json'
];

// Instalar el Service Worker y guardar recursos críticos
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Forzar activación inmediata
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

// Activar y limpiar cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Tomar control de los clientes inmediatamente
  );
});

// Interceptar peticiones de red
self.addEventListener('fetch', (event) => {
  // Solo manejar peticiones GET
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // ESTRATEGIA 1: Network First (Para HTML/Navegación)
  // Intenta ir a la red para obtener contenido fresco, si falla, usa caché.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          return caches.match('./index.html') || caches.match('./');
        })
    );
    return;
  }

  // ESTRATEGIA 2: Stale-While-Revalidate (Para JS, CSS, Imágenes, Fuentes)
  // Devuelve la caché inmediatamente (rápido), y actualiza la caché en segundo plano.
  // Esto es crítico para las librerías externas (React, Tailwind, etc).
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        // Promesa para buscar en la red y actualizar caché
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Solo guardar respuestas válidas (status 200 o opaque responses de CDNs)
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch((err) => {
           // Si falla la red, no pasa nada si ya tenemos caché
           // Si no hay caché y falla la red, el recurso fallará (normal offline)
        });

        // Devolver lo que tengamos en caché, si no, esperar a la red
        return cachedResponse || fetchPromise;
      });
    })
  );
});