# 🛠️ دليل التطوير المحلي

## المتطلبات

- **محرر نصوص**: VS Code, Sublime Text, أو أي محرر آخر
- **خادم محلي**: Python, Node.js, أو أي خادم ويب آخر
- **متصفح حديث**: Chrome, Firefox, Safari, Edge

## البدء السريع

### 1️⃣ إعداد الخادم المحلي

#### باستخدام Python:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### باستخدام Node.js:
```bash
# إذا لم تثبت http-server
npm install -g http-server

# تشغيل الخادم
http-server -p 8000
```

#### باستخدام VSCode Live Server:
```bash
# ثبت الإضافة "Live Server"
# اضغط بزر الفأرة الأيمن على index.html → Open with Live Server
```

### 2️⃣ الوصول للموقع
```
http://localhost:8000
```

## 🧪 اختبار الميزات

### اختبار Service Worker
```javascript
// افتح console (F12) وجرب:
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('عدد Service Workers:', registrations.length);
});
```

### اختبار في وضع بدون اتصال
1. افتح DevTools (F12)
2. اذهب إلى **Application** tab
3. اختر **Service Workers**
4. فعّل **Offline** mode
5. حدّث الصفحة - يجب أن تعمل بشكل طبيعي!

### اختبار PWA
```javascript
// تحقق من تثبيت PWA
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('✅ التطبيق مثبت كـ PWA');
}
```

### اختبار Performance
1. افتح DevTools
2. اذهب إلى **Lighthouse** tab
3. اضغط "Generate report"
4. ستحصل على نقاط الأداء

## 📝 تعديل الملفات

### إضافة صفحة جديدة
```html
<!-- في index.html -->
<section id="new-section" class="section">
  <div class="container">
    <!-- محتواك هنا -->
  </div>
</section>

<!-- أضف في navigations -->
<a class="nav__link" href="#new-section">اسم القسم</a>
```

### تعديل الألوان
```css
/* في index.html <style> section */
:root {
  --brand1: #7c3aed;  /* البنفسجي الأساسي */
  --brand2: #22c55e;  /* الأخضر */
  --brand3: #06b6d4;  /* السماوي */
  --bg: #0b1220;      /* الخلفية الداكنة */
}
```

### إضافة موارد خارجية جديدة
```javascript
// في service-worker.js
const CACHE_URLS = [
  '/',
  '/index.html',
  '/game.html',
  'https://cdn.example.com/library.js', // أضف هنا
];
```

## 🔍 Debugging

### تفعيل Debug Mode
```javascript
// أضف في أي ملف JS:
if (localStorage.getItem('debug') === 'true') {
  console.log('🐛 Debug Mode Enabled');
}

// في console:
localStorage.setItem('debug', 'true');
location.reload();
```

### مراقبة Network Requests
1. افتح DevTools
2. اذهب إلى **Network** tab
3. راقب الطلبات والاستجابات

### تحليل الـ Cache
```javascript
caches.keys().then(names => {
  names.forEach(name => {
    caches.open(name).then(cache => {
      cache.keys().then(requests => {
        console.log(`📦 Cache: ${name}`);
        requests.forEach(req => console.log(`  - ${req.url}`));
      });
    });
  });
});
```

## 📊 الاختبارات الموصى بها

### قبل النشر

- [ ] اختبر في متصفحات مختلفة
- [ ] اختبر في وضع بدون اتصال
- [ ] اختبر على أجهزة مختلفة (موبايل، تابلت)
- [ ] تحقق من Lighthouse scores
- [ ] تحقق من الروابط والملفات المرفقة
- [ ] اختبر الكونسول بحثاً عن أخطاء

### اختبارات الأداء
```javascript
// قياس أداء الصفحة
performance.mark('start');
// ... عملياتك
performance.mark('end');
performance.measure('myMeasure', 'start', 'end');
console.log(performance.getEntriesByName('myMeasure')[0]);
```

## 📤 نشر التحديثات

### تحديث Version
```javascript
// في service-worker.js
const CACHE_NAME = 'usd-studio-v1.0.1'; // غيّر الرقم
```

### مسح الـ Cache القديم
```javascript
// المستخدمون سيحصلون على نسخة جديدة تلقائياً
// لكن يمكنهم مسح يدوياً:
localStorage.setItem('clearCache', 'true');
```

## 🐛 الأخطاء الشائعة

### Service Worker لا يعمل
```
الحل: تأكد من:
- خادم HTTPS (محلياً يعمل HTTP)
- اسم ملف service-worker.js صحيح
- سجل في index.html و game.html
```

### PWA لا يظهر زر التثبيت
```
الحل:
- استخدم HTTPS في الإنتاج
- manifest.json موجود ومصحيح
- جميع الأيقونات متاحة
```

### الصور لا تحمل بدون اتصال
```
الحل:
- أضف URLs الصور في CACHE_URLS
- استخدم CORS headers بشكل صحيح
```

## 📞 الدعم والمساعدة

- 📖 [Web.dev Guidance](https://web.dev)
- 📖 [MDN Docs](https://developer.mozilla.org)
- 💬 [GitHub Issues](https://github.com/omar-al-2007/issues)

## 🎯 أفضل الممارسات

✅ استخدم HTTPS في الإنتاج  
✅ راقب حجم الملفات  
✅ اختبر على اتصالات بطيئة  
✅ استخدم Web Vitals للقياس  
✅ حدّث الـ Cache بانتظام  
✅ وثّق التغييرات  

---

**آخر تحديث:** 2026-06-12  
**الإصدار:** 1.0.0
