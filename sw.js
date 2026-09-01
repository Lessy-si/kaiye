const VERSION = "38";
const CACHE = `kaiye-${VERSION}`;
const PRECACHE = [
  "./",
  "./index.html",
  "./get.html",
  "./manifest.webmanifest",
  "./css/app.css",
  "./js/app.js",
  "./js/packs.js",
  "./js/pack-g5.js",
  "./js/desk.js",
  "./js/srs.js",
  "./js/loop.js",
  "./js/speak-audio.js",
  "./js/get.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch.png",
  "./img/desk-hero.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("kaiye-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(event.request)
        .then((res) => {
          if (res && res.ok && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          }
          return res;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
