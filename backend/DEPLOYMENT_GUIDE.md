# 🚀 Deployment Guide - Complete Setup

## 📋 Prerequisites Checklist

- ✅ Laravel Herd installed
- ✅ DBngin MySQL running
- ✅ TablePlus connected
- ✅ Database `ai_pengatur_file` created
- ✅ Composer installed
- ✅ PHP 8.1+ installed

---

## 🎯 STEP-BY-STEP DEPLOYMENT

### STEP 1: Copy All Backend Files to Laravel Project

**Copy structure:**
```
FROM: renamer-next/backend/
TO:   ai-pengatur-file-api/
```

**Files to copy:**

1. **Migrations** (6 files)
   ```
   FROM: renamer-next/backend/migrations/
   TO:   ai-pengatur-file-api/database/migrations/
   ```

2. **Seeders** (1 file)
   ```
   FROM: renamer-next/backend/seeders/
   TO:   ai-pengatur-file-api/database/seeders/
   ```

3. **Models** (6 files)
   ```
   FROM: renamer-next/backend/models/
   TO:   ai-pengatur-file-api/app/Models/
   ```

4. **Controllers** (4 files)
   ```
   FROM: renamer-next/backend/controllers/
   TO:   ai-pengatur-file-api/app/Http/Controllers/Api/
   ```
   
   **Note:** Create folder `Api` inside `Controllers` if not exists

5. **Middleware** (2 files)
   ```
   FROM: renamer-next/backend/middleware/
   TO:   ai-pengatur-file-api/app/Http/Middleware/
   ```

6. **Routes** (1 file)
   ```
   FROM: renamer-next/backend/routes/api.php
   TO:   ai-pengatur-file-api/routes/api.php
   ```
   
   **Note:** REPLACE existing api.php

7. **Config** (2 files)
   ```
   FROM: renamer-next/backend/config/cors.php
   TO:   ai-pengatur-file-api/config/cors.php
   
   FROM: renamer-next/backend/config/sanctum.php
   TO:   ai-pengatur-file-api/config/sanctum.php
   ```
   
   **Note:** REPLACE existing files

8. **.env.example**
   ```
   FROM: renamer-next/backend/.env.example
   TO:   ai-pengatur-file-api/.env.example
   ```

---

### STEP 2: Update .env File

Open `ai-pengatur-file-api/.env` and update:

```env
APP_NAME="AI Pengatur File"
APP_URL=http://ai-pengatur-file-api.test

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ai_pengatur_file
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:8080,127.0.0.1:8080
SESSION_DOMAIN=localhost

FRONTEND_URL=http://localhost:8080

MIDTRANS_SERVER_KEY=your_server_key_here
MIDTRANS_CLIENT_KEY=your_client_key_here
MIDTRANS_IS_PRODUCTION=false
```

---

### STEP 3: Register Middleware

Open `ai-pengatur-file-api/app/Http/Kernel.php`

Add to `$middlewareAliases` array:

```php
protected $middlewareAliases = [
    // ... existing middleware
    'admin' => \App\Http\Middleware\AdminMiddleware::class,
    'check.subscription' => \App\Http\Middleware\CheckSubscription::class,
];
```

---

### STEP 4: Run Commands

Open terminal in Laravel project folder:

```bash
cd "D:\Second Brain\coding space\Project\ray_foldering\ai-pengatur-file-api"

# 1. Install Sanctum
composer require laravel/sanctum

# 2. Publish Sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# 3. Run migrations
php artisan migrate

# 4. Run seeder
php artisan db:seed --class=AdminSeeder

# 5. Clear cache
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

---

### STEP 5: Verify in TablePlus

Open TablePlus, connect to `ai_pengatur_file`, verify:

**Tables (should have 6 new tables):**
- ✅ subscriptions
- ✅ usage_tracking
- ✅ transactions
- ✅ file_processing_history
- ✅ admin_activity_logs
- ✅ users (with new columns: google_id, avatar, role)

**Data (should have):**
- ✅ 2 users:
  * admin@raymaizing.com (role: admin)
  * user@test.com (role: user)
- ✅ 2 subscriptions (both gratis package)
- ✅ 2 usage_tracking records

---

### STEP 6: Test API Endpoints

**Test with Postman or cURL:**

1. **Register User:**
```bash
curl -X POST http://ai-pengatur-file-api.test/api/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

2. **Login:**
```bash
curl -X POST http://ai-pengatur-file-api.test/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "password"
  }'
```

3. **Get User (with token):**
```bash
curl -X GET http://ai-pengatur-file-api.test/api/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

4. **Admin Dashboard (with admin token):**
```bash
curl -X GET http://ai-pengatur-file-api.test/api/admin/dashboard \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -H "Accept: application/json"
```

---

## ✅ SUCCESS CRITERIA

Your backend is ready when:

1. ✅ All migrations run successfully
2. ✅ Admin and test user created
3. ✅ API endpoints respond correctly
4. ✅ Authentication works (login/register)
5. ✅ Admin routes protected
6. ✅ CORS configured for frontend

---

## 📊 API Endpoints Summary

### Public
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Authenticated
- `POST /api/logout` - Logout
- `GET /api/user` - Get current user
- `GET /api/subscriptions` - List subscriptions
- `POST /api/subscriptions/create` - Create subscription
- `GET /api/usage/current` - Get current usage
- `POST /api/usage/track` - Track file processing

### Admin Only
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - List all users
- `GET /api/admin/subscriptions` - List all subscriptions
- `GET /api/admin/transactions` - List all transactions
- `GET /api/admin/analytics` - Analytics data

---

## 🔧 Troubleshooting

### Error: "Class not found"
```bash
composer dump-autoload
php artisan config:clear
```

### Error: "SQLSTATE[HY000] [2002]"
- Check MySQL running in DBngin
- Check .env DB credentials

### Error: "CORS policy"
- Check config/cors.php
- Add frontend URL to allowed_origins
- Run: `php artisan config:clear`

### Error: "Unauthenticated"
- Check Sanctum configuration
- Verify token in Authorization header
- Format: `Bearer YOUR_TOKEN`

---

## 🎉 Next Steps

After backend is ready:
1. ✅ Integrate with frontend
2. ✅ Build user dashboard
3. ✅ Build admin dashboard
4. ✅ Implement Midtrans payment
5. ✅ Deploy to production

---

## 📝 Default Credentials

**Admin:**
- Email: admin@raymaizing.com
- Password: admin123

**Test User:**
- Email: user@test.com
- Password: password

**⚠️ IMPORTANT:** Change these passwords in production!

---

## 🆘 Need Help?

Check these files:
- `SETUP_INSTRUCTIONS.md` - Detailed setup guide
- `BACKEND_ARCHITECTURE.md` - System architecture
- `README.md` - Overview

Or contact support!
