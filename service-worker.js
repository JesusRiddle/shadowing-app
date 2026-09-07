// Service worker de Shadowing English.
// Cachea el "app shell" (HTML/CSS/JS/íconos) para que la app abra sin conexión,
// y para que los textos que ya cargaste (guardados en localStorage) se puedan
// seguir practicando sin internet. Cargar textos nuevos de Drive, traducir,
// o usar una voz "requiere internet" sigue necesitando conexión.

const CACHE_NAME = 'shadowing-shell-v2';
const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Solo aplicamos cache-first a nuestros propios archivos (mismo origen).
  // Las llamadas a Drive/Traducción/voz externa siempre van directo a la red.
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      }).catch(() => cached);
    })
  );
});
