// ══════════════════════════════════════════════════════════
// Service Worker — Exam Is Near by ArkSetu
// Version: v6 — index.html split into public/js/**; cache bumped so
// returning users' service workers evict stale cached state and
// pick up the new file structure. See AUDIT.md.
// ══════════════════════════════════════════════════════════

const CACHE_NAME = 'exam-is-near-v7';
const CACHE_STATIC = 'ein-static-v6';

// Core assets to pre-cache on install — NO external URLs (they fail in SW context)
const PRECACHE_ASSETS = [
  './index.html',
  './manifest.json',
];

// ── INSTALL: pre-cache static assets ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

// ── ACTIVATE: clear old caches ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== CACHE_STATIC)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: smart caching strategy ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // ── ALWAYS pass through to network (no SW interception): ──
  const networkOnly = [
    // Firebase auth & Google OAuth — critical, must never be intercepted
    'accounts.google.com',
    'firebaseapp.com',
    'firebase.google.com',
    // Firebase services
    'firebaseio.com',
    'firestore.googleapis.com',
    'identitytoolkit.googleapis.com',
    'securetoken.googleapis.com',
    'firebaseinstallations.googleapis.com',
    // Google APIs & fonts
    'apis.google.com',
    'gstatic.com',
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    // Ads & analytics
    'pagead2.googlesyndication.com',
    'googletagmanager.com',
    'adtrafficquality.google',
    'doubleclick.net',
    // App services
    'groq.com',
    'cloudinary.com',
    'razorpay.com',
    'checkout.razorpay.com',
    'cloudfunctions.net',
    'run.app',
  ];
  if (networkOnly.some(domain => url.hostname.includes(domain))) return;

  // Standalone pages — always fetch from network, never intercept or fall back to index.html
  const standalonePages = ['/admin.html', '/finance.html', '/rankNEET.html', '/rankJEE.html', '/landing.html'];
  if (standalonePages.some(p => url.pathname.endsWith(p))) return;

  // Clean URL aliases for rank pages
  const staticPages = ['/neet/rank', '/jee/rank'];
  if (staticPages.includes(url.pathname)) return;

  // App shell (index.html, manifest.json) — Network first, cache fallback
  if (url.pathname === '/' || url.pathname.endsWith('index.html') || url.pathname.endsWith('manifest.json')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_STATIC).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Everything else — cache first, network fallback
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      // Don't fall back to index.html for direct .html page requests
      }).catch(() => url.pathname.endsWith('.html') ? null : caches.match('./index.html'));
    })
  );
});

// ── MESSAGE handler ──
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
