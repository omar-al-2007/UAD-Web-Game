# 🚀 دليل النشر (Deployment Guide)

## منصات النشر المدعومة

- ✅ Vercel
- ✅ Netlify
- ✅ GitHub Pages
- ✅ Shared Hosting (Apache)
- ✅ VPS (Nginx, Apache)
- ✅ Docker Container

---

## 1️⃣ النشر على Vercel (الأسهل)

### الخطوات:

1. **إنشاء حساب**: https://vercel.com
2. **ربط GitHub** (اختياري لكن موصى به)
3. **استيراد المشروع**:
   ```
   - اذهب إلى Dashboard
   - اضغط "New Project"
   - اختر مستودع GitHub أو "Continue with Git"
   - اختر فرع النشر (main/master)
   ```

4. **الإعدادات**:
   ```
   Framework: Other (None)
   Build Command: (ترك فارغ)
   Output Directory: (ترك فارغ)
   Environment Variables: (لا توجد حالياً)
   ```

5. **النشر**: اضغط "Deploy"

### النتيجة:
```
✅ موقع مباشر على: https://your-project.vercel.app
✅ Automatic Deployments عند كل push
✅ SSL/HTTPS افتراضي
✅ CDN عالمي
```

---

## 2️⃣ النشر على Netlify

### الخطوات:

1. **إنشاء حساب**: https://netlify.com
2. **ربط GitHub**
3. **اختيار المستودع**
4. **الإعدادات التلقائية**:
   ```
   - Build Command: (اترك فارغ)
   - Publish Directory: . (الجذر)
   ```

5. **النشر**: اضغط "Deploy site"

### الميزات:
```
✅ A/B Testing
✅ Preview Deployments
✅ Analytics مدمج
✅ Form Handling (اختياري)
```

### الأوامر المفيدة:
```bash
# إذا استخدمت Netlify CLI
npm install -g netlify-cli
netlify deploy

# نشر إلى الإنتاج
netlify deploy --prod
```

---

## 3️⃣ النشر على GitHub Pages

### الخطوات:

1. **دفع إلى GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **تفعيل Pages**:
   - اذهب إلى Settings → Pages
   - اختر فرع وجذر المجلد
   - اضغط Save

3. **انتظر**: سيتم النشر تلقائياً في 1-2 دقيقة

### الإعدادات المتقدمة:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/upload-pages-artifact@v1
        with:
          path: '.'
      - uses: actions/deploy-pages@v1
```

---

## 4️⃣ النشر على Shared Hosting

### المتطلبات:
- ✅ FTP/SFTP Access
- ✅ Apache/Nginx Configured
- ✅ PHP support (اختياري)

### خطوات النشر:

#### 1. إعداد .htaccess:
```bash
# ملف .htaccess موجود بالفعل ✅
# تأكد من تفعيل mod_rewrite على الخادم
```

#### 2. رفع الملفات:

**باستخدام FTP (مثل FileZilla)**:
```
1. افتح FileZilla
2. دخول البيانات:
   - Host: ftp.yoursite.com
   - Username: your_ftp_user
   - Password: your_ftp_password
   - Port: 21
3. انسخ جميع الملفات إلى public_html/
```

**باستخدام SFTP**:
```bash
sftp user@yoursite.com
cd public_html
put -r .
```

#### 3. التحقق:
```bash
# من الخادم الخاص بك
chmod 755 -R .
chmod 644 *.html *.css *.js
```

---

## 5️⃣ النشر على VPS (Nginx)

### الخطوات:

#### 1. إعداد الخادم:
```bash
# تحديث النظام
sudo apt update && sudo apt upgrade

# تثبيت Nginx
sudo apt install nginx

# تثبيت Certbot (للـ SSL)
sudo apt install certbot python3-certbot-nginx
```

#### 2. إعداد Nginx:
```bash
# إنشاء مجلد للموقع
sudo mkdir -p /var/www/usd-studio

# نسخ الملفات
sudo cp -r ./* /var/www/usd-studio/

# تعديل الصلاحيات
sudo chown -R www-data:www-data /var/www/usd-studio
sudo chmod -R 755 /var/www/usd-studio
```

#### 3. إعداد الـ Config:
```bash
# إنشاء config file
sudo nano /etc/nginx/sites-available/usd-studio
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    root /var/www/usd-studio;
    index index.html;
    
    # Service Worker
    location /service-worker.js {
        add_header Cache-Control "public, max-age=0, must-revalidate";
    }
    
    # Assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # HTML
    location ~* \.html$ {
        add_header Cache-Control "public, max-age=3600";
    }
    
    # Rewrite
    try_files $uri $uri/ =404;
    error_page 404 /index.html;
    
    # Security
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
}
```

#### 4. تفعيل Config:
```bash
sudo ln -s /etc/nginx/sites-available/usd-studio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. إضافة SSL:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 6️⃣ النشر باستخدام Docker

### Dockerfile:
```dockerfile
FROM nginx:alpine

# نسخ الملفات
COPY . /usr/share/nginx/html/

# نسخ config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf:
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        
        root /usr/share/nginx/html;
        index index.html;
        
        # Service Worker
        location /service-worker.js {
            add_header Cache-Control "public, max-age=0, must-revalidate";
        }
        
        # Assets
        location ~* \.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Rewrite
        try_files $uri $uri/ =404;
        error_page 404 /index.html;
        
        # Security Headers
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-Content-Type-Options "nosniff";
        add_header X-XSS-Protection "1; mode=block";
    }
}
```

### بناء وتشغيل:
```bash
# بناء الـ image
docker build -t usd-studio:latest .

# تشغيل الـ container
docker run -p 80:80 usd-studio:latest

# أو استخدام docker-compose
docker-compose up -d
```

---

## 7️⃣ النشر على AWS

### خطوات سريعة:

#### 1. استخدام S3 + CloudFront:
```bash
# إنشاء S3 bucket
aws s3 mb s3://usd-studio-bucket

# رفع الملفات
aws s3 sync . s3://usd-studio-bucket --delete

# تفعيل Static Website Hosting
# - من AWS Console
# - S3 → Bucket → Properties → Static website hosting
```

#### 2. CloudFront Distribution:
```bash
# إنشاء CloudFront distribution
# للـ caching وتوزيع المحتوى عالمياً
```

---

## ✅ قائمة المراجعة قبل النشر

- [ ] اختبر جميع الروابط والميزات
- [ ] تحقق من أداء Lighthouse
- [ ] اختبر بدون اتصال (Service Worker)
- [ ] اختبر على أجهزة مختلفة
- [ ] تأكد من SSL/HTTPS
- [ ] قم بتعيين المجال (Domain)
- [ ] أضف Google Analytics (اختياري)
- [ ] أضف Google Search Console
- [ ] اختبر التحديثات التلقائية

---

## 📝 بعد النشر

### 1. Google Search Console:
```
1. اذهب إلى https://search.google.com/search-console
2. أضف الموقع
3. تحقق من ملكية الموقع
4. أرسل sitemap.xml
```

### 2. Google Analytics:
```html
<!-- أضف هذا قبل </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### 3. مراقبة الأداء:
```
- استخدم Lighthouse CI
- راقب Core Web Vitals
- تابع الأخطاء والمشاكل
```

---

## 🔄 التحديثات والصيانة

### تحديث الموقع:

```bash
# نموذج سير العمل
1. عدّل الملفات محلياً
2. اختبر بشكل كامل
3. Push إلى GitHub
4. التحديث تلقائي على الخادم (Vercel/Netlify)
```

### تحديث Service Worker:

```javascript
// في service-worker.js
const CACHE_NAME = 'usd-studio-v1.0.1'; // زيادة الإصدار
```

---

## 🆘 استكشاف الأخطاء

### الموقع لا يحمل؟
```
✓ تحقق من رابط المجال
✓ امسح الـ cache (Ctrl+Shift+Delete)
✓ تحقق من console للأخطاء (F12)
```

### Service Worker لا يعمل؟
```
✓ يجب HTTPS في الإنتاج
✓ افتح DevTools → Application → Service Workers
✓ تأكد من تسجيل الـ Service Worker
```

### الصور لا تظهر؟
```
✓ تحقق من الروابط في manifest.json
✓ أضف الصور الجديدة للـ CACHE_URLS
✓ امسح الـ cache يدوياً
```

---

**الإصدار:** 1.0.0  
**آخر تحديث:** 2026-06-12
