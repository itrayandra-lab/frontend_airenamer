# 🚀 Backend Setup Instructions

## 📁 Struktur Folder
```
renamer-next/
├── backend/
│   ├── migrations/          ← Copy ke Laravel project
│   ├── seeders/            ← Copy ke Laravel project
│   ├── models/             ← (akan dibuat next)
│   ├── controllers/        ← (akan dibuat next)
│   └── routes/             ← (akan dibuat next)
├── src/                    ← Frontend React
└── public/
```

---

## ✅ STEP 1: Copy Migration Files

**Dari:**
```
D:\Second Brain\coding space\Project\ray_foldering\renamer-next\backend\migrations\
```

**Ke:**
```
D:\Second Brain\coding space\Project\ray_foldering\ai-pengatur-file-api\database\migrations\
```

**Files (6 files):**
1. `2024_01_01_000001_add_fields_to_users_table.php`
2. `2024_01_01_000002_create_subscriptions_table.php`
3. `2024_01_01_000003_create_usage_tracking_table.php`
4. `2024_01_01_000004_create_transactions_table.php`
5. `2024_01_01_000005_create_file_processing_history_table.php`
6. `2024_01_01_000006_create_admin_activity_logs_table.php`

---

## ✅ STEP 2: Copy Seeder File

**Dari:**
```
D:\Second Brain\coding space\Project\ray_foldering\renamer-next\backend\seeders\
```

**Ke:**
```
D:\Second Brain\coding space\Project\ray_foldering\ai-pengatur-file-api\database\seeders\
```

**File (1 file):**
1. `AdminSeeder.php`

---

## ✅ STEP 3: Update .env di Laravel Project

Buka file:
```
D:\Second Brain\coding space\Project\ray_foldering\ai-pengatur-file-api\.env
```

Update bagian database:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ai_pengatur_file
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:8080,127.0.0.1:8080
SESSION_DOMAIN=localhost

FRONTEND_URL=http://localhost:8080
```

---

## ✅ STEP 4: Run Commands

Buka terminal di folder Laravel project:
```
cd "D:\Second Brain\coding space\Project\ray_foldering\ai-pengatur-file-api"
```

Jalankan commands:
```bash
# 1. Install Sanctum
composer require laravel/sanctum

# 2. Publish Sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# 3. Run migrations
php artisan migrate

# 4. Run seeder
php artisan db:seed --class=AdminSeeder
```

---

## ✅ STEP 5: Verify di TablePlus

Buka TablePlus, connect ke database `ai_pengatur_file`, check:

**Tables (harus ada 6 tables baru):**
- ✅ subscriptions
- ✅ usage_tracking
- ✅ transactions
- ✅ file_processing_history
- ✅ admin_activity_logs
- ✅ users (updated dengan kolom: google_id, avatar, role)

**Data (harus ada):**
- ✅ 2 users:
  * admin@raymaizing.com (role: admin)
  * user@test.com (role: user)
- ✅ 2 subscriptions (keduanya paket gratis)
- ✅ 2 usage_tracking records

---

## 🎯 Expected Result

Setelah selesai, Anda akan punya:
- ✅ Database structure lengkap (6 tables)
- ✅ Admin user untuk testing
- ✅ Test user untuk testing
- ✅ Sample data untuk development

---

## 🚨 Troubleshooting

### Error: "Class 'Laravel\Sanctum\...' not found"
```bash
composer require laravel/sanctum
```

### Error: "SQLSTATE[HY000] [2002] Connection refused"
- Check MySQL di DBngin sudah running
- Check .env DB_HOST dan DB_PORT

### Error: "Base table or column not found"
```bash
php artisan migrate:rollback
php artisan migrate
```

---

## 📝 Next Steps

Setelah migrations berhasil, konfirmasi ke saya:

```
DONE MIGRATIONS ✅

Tables created: 6
Users created: 2
Ready for Models & Controllers!
```

Lalu saya akan create:
1. Models (User, Subscription, Transaction, dll)
2. Controllers (Auth, Subscription, Admin)
3. API Routes
4. Middleware
5. Frontend Integration

---

## 📞 Need Help?

Jika ada error atau stuck, screenshot error message dan kirim ke saya!
