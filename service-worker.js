// Service Worker - الإصدار 1.0.0
// الهدف: دعم العمل بدون اتصال إنترنت وتحسين الأداء

const CACHE_NAME = 'usd-studio-v1.0.0';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/game.html',
  '/style.css',
  '/offline.html',
  '/manifest.json',
  'https://i.postimg.cc/9fdsTybv/Whats-App-Image-2026-06-09-at-18-49-59.jpg',
  'https://i.postimg.cc/Kz1CvpdJ/upsidedown-transparent.png',
  'https://i.postimg.cc/90X9Mf7X/Copilot-20260611-134848.jpg'
];

// ────────────────────────────────────────────
// 1. تثبيت Service Worker وتخزين الملفات
// ────────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('📦 جاري تثبيت Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('✅ تم فتح الـ cache');
      return cache.addAll(CACHE_URLS).catch((error) => {
        console.warn('⚠️ بعض الموارد لم تتم مزامنتها:', error);
        // لا نرمي الخطأ لتجنب فشل التثبيت
      });
    })
  );
  self.skipWaiting(); // تفعيل الإصدار الجديد فوراً
});

// ────────────────────────────────────────────
// 2. تفعيل Service Worker الجديد
// ────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('🚀 تفعيل Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => {
            console.log('🗑️ حذف الـ cache القديم:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  self.clients.claim(); // التحكم بجميع الصفحات المفتوحة
});

// ────────────────────────────────────────────
// 3. التعامل مع الطلبات (Fetch)
// ────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // تجاهل الطلبات غير HTTP/HTTPS
  if (!request.url.startsWith('http')) {
    return;
  }

  const isStaticAsset = request.url.match(/\.(css|js|json|png|jpg|jpeg|gif|svg)$/i);
  const isNavigation = request.mode === 'navigate' || (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));

  // استراتيجية: Cache First للملفات الثابتة
  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response; // إرجاع من الـ cache
        }
        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        }).catch(() => {
          return caches.match('/offline.html') || 
                 new Response('أنت غير متصل بالإنترنت', { status: 503 });
        });
      })
    );
    return;
  }

  // استراتيجية: Network First لطلبات الصفحات والتنقل
  if (isNavigation) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((response) => {
            if (response) {
              return response;
            }
            return caches.match('/offline.html');
          });
        })
    );
    return;
  }

  // استراتيجية: Network First لباقي الطلبات
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((response) => {
          if (response) {
            return response;
          }
          return new Response(
            '😞 صفحة غير متاحة بدون اتصال إنترنت. تحقق من اتصالك وحاول مجدداً.',
            { 
              status: 503, 
              statusText: 'Service Unavailable',
              headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
            }
          );
        });
      })
  );
});

// ────────────────────────────────────────────
// 4. معالجة الرسائل من الصفحات
// ────────────────────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      console.log('✅ تم حذف الـ cache بنجاح');
    });
  }
});

console.log('✅ Service Worker جاهز للعمل');
