# Backend Setup Guide - Quick Start

## 🚀 Quick Setup (15 menit)

### Prerequisites
- ✅ Laravel Herd (sudah terinstall)
- ✅ DBngin (sudah terinstall)
- ✅ TablePlus (sudah terinstall)
- ✅ MySQL running di DBngin

---

## Step 1: Create Laravel Project

```bash
# Buka terminal di folder Herd
cd ~/Herd

# Create new Laravel project
laravel new ai-pengatur-file-backend

# Masuk ke project
cd ai-pengatur-file-backend

# Install dependencies
composer require laravel/sanctum
composer require midtrans/midtrans-php

# Publish Sanctum config
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

---

## Step 2: Setup Database

### 2.1 Create Database di TablePlus
1. Buka TablePlus
2. Connect ke MySQL (127.0.0.1:3306)
3. Klik kanan → Create Database
4. Nama: `ai_pengatur_file`
5. Charset: `utf8mb4`
6. Collation: `utf8mb4_unicode_ci`

### 2.2 Configure Laravel .env
```env
APP_NAME="AI Pengatur File"
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ai_pengatur_file
DB_USERNAME=root
DB_PASSWORD=

# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:8080,127.0.0.1:8080
SESSION_DOMAIN=localhost

# Midtrans (get from https://dashboard.midtrans.com)
MIDTRANS_SERVER_KEY=your_server_key_here
MIDTRANS_CLIENT_KEY=your_client_key_here
MIDTRANS_IS_PRODUCTION=false

# Frontend URL
FRONTEND_URL=http://localhost:8080
```

---

## Step 3: Create Migrations

### 3.1 Create Migration Files
```bash
# Users table (sudah ada default, kita modify)
php artisan make:migration add_fields_to_users_table --table=users

# Subscriptions
php artisan make:migration create_subscriptions_table

# Usage Tracking
php artisan make:migration create_usage_tracking_table

# Transactions
php artisan make:migration create_transactions_table

# File Processing History
php artisan make:migration create_file_processing_history_table

# Admin Activity Logs
php artisan make:migration create_admin_activity_logs_table
```

### 3.2 Migration Content

**File: `database/migrations/xxxx_add_fields_to_users_table.php`**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('google_id')->nullable()->unique()->after('email');
            $table->string('avatar')->nullable()->after('google_id');
            $table->enum('role', ['user', 'admin'])->default('user')->after('avatar');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['google_id', 'avatar', 'role']);
        });
    }
};
```

**File: `database/migrations/xxxx_create_subscriptions_table.php`**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('package_type', ['gratis', 'pro', 'bisnis']);
            $table->integer('file_limit');
            $table->decimal('price', 10, 2);
            $table->enum('billing_cycle', ['monthly', 'yearly']);
            $table->enum('status', ['active', 'expired', 'cancelled', 'pending'])->default('pending');
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('auto_renew')->default(true);
            $table->timestamps();
            
            $table->index('user_id');
            $table->index('status');
            $table->index('end_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
```

**File: `database/migrations/xxxx_create_usage_tracking_table.php`**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usage_tracking', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('subscription_id')->constrained()->onDelete('cascade');
            $table->integer('files_processed')->default(0);
            $table->string('month_year', 7); // Format: 2026-02
            $table->date('last_reset_date');
            $table->timestamps();
            
            $table->unique(['user_id', 'month_year']);
            $table->index('user_id');
            $table->index('month_year');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usage_tracking');
    }
};
```

**File: `database/migrations/xxxx_create_transactions_table.php`**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('subscription_id')->nullable()->constrained()->onDelete('set null');
            $table->string('order_id')->unique();
            $table->string('midtrans_transaction_id')->nullable();
            $table->enum('package_type', ['gratis', 'pro', 'bisnis']);
            $table->integer('file_limit');
            $table->decimal('amount', 10, 2);
            $table->enum('billing_cycle', ['monthly', 'yearly']);
            $table->string('payment_method', 50)->nullable();
            $table->enum('payment_status', ['pending', 'success', 'failed', 'expired'])->default('pending');
            $table->timestamp('paid_at')->nullable();
            $table->json('midtrans_response')->nullable();
            $table->timestamps();
            
            $table->index('user_id');
            $table->index('order_id');
            $table->index('payment_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
```

**File: `database/migrations/xxxx_create_file_processing_history_table.php`**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('file_processing_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('subscription_id')->constrained()->onDelete('cascade');
            $table->integer('files_count');
            $table->enum('operation_type', ['bulk_rename', 'magic_folder', 'template']);
            $table->timestamp('processed_at')->useCurrent();
            
            $table->index('user_id');
            $table->index('processed_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('file_processing_history');
    }
};
```

**File: `database/migrations/xxxx_create_admin_activity_logs_table.php`**
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->constrained('users')->onDelete('cascade');
            $table->string('action');
            $table->string('target_type', 50)->nullable();
            $table->unsignedBigInteger('target_id')->nullable();
            $table->json('details')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamp('created_at')->useCurrent();
            
            $table->index('admin_id');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_activity_logs');
    }
};
```

---

## Step 4: Run Migrations

```bash
# Run all migrations
php artisan migrate

# Jika ada error, rollback dan coba lagi
php artisan migrate:rollback
php artisan migrate
```

---

## Step 5: Create Seeder for Admin User

```bash
php artisan make:seeder AdminSeeder
```

**File: `database/seeders/AdminSeeder.php`**
```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Subscription;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin Raymaizing',
            'email' => 'admin@raymaizing.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create free subscription for admin
        Subscription::create([
            'user_id' => $admin->id,
            'package_type' => 'gratis',
            'file_limit' => 50,
            'price' => 0,
            'billing_cycle' => 'monthly',
            'status' => 'active',
            'start_date' => now(),
            'end_date' => now()->addYear(),
            'auto_renew' => false,
        ]);

        // Create test user
        $user = User::create([
            'name' => 'Test User',
            'email' => 'user@test.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'email_verified_at' => now(),
        ]);

        // Create free subscription for test user
        Subscription::create([
            'user_id' => $user->id,
            'package_type' => 'gratis',
            'file_limit' => 50,
            'price' => 0,
            'billing_cycle' => 'monthly',
            'status' => 'active',
            'start_date' => now(),
            'end_date' => now()->addMonth(),
            'auto_renew' => true,
        ]);

        $this->command->info('Admin and test user created successfully!');
        $this->command->info('Admin: admin@raymaizing.com / admin123');
        $this->command->info('User: user@test.com / password');
    }
}
```

```bash
# Run seeder
php artisan db:seed --class=AdminSeeder
```

---

## Step 6: Configure CORS

**File: `config/cors.php`**
```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:8080', 'http://127.0.0.1:8080'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

---

## Step 7: Start Laravel Server

```bash
# Laravel Herd akan auto-serve di http://ai-pengatur-file-backend.test
# Atau manual start:
php artisan serve --port=8000

# Backend API akan available di:
# http://localhost:8000/api
```

---

## Step 8: Test API

### Test dengan Postman atau cURL

**1. Register User:**
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

**2. Login:**
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**3. Get User (with token):**
```bash
curl -X GET http://localhost:8000/api/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

---

## Step 9: Verify in TablePlus

1. Buka TablePlus
2. Connect ke database `ai_pengatur_file`
3. Check tables:
   - ✅ users
   - ✅ subscriptions
   - ✅ usage_tracking
   - ✅ transactions
   - ✅ file_processing_history
   - ✅ admin_activity_logs
4. Check data:
   - ✅ Admin user exists
   - ✅ Test user exists
   - ✅ Subscriptions created

---

## 🎯 Next Steps

Setelah backend setup selesai, kita bisa:

1. **Create Models & Controllers**
   - User model
   - Subscription model
   - Transaction model
   - Usage tracking model

2. **Implement API Routes**
   - Authentication routes
   - Subscription routes
   - Payment routes
   - Admin routes

3. **Integrate with Frontend**
   - Connect React to Laravel API
   - Implement authentication
   - Build dashboards

**Mau saya lanjutkan create Models & Controllers?** 🚀

---

## 📝 Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"
```bash
# Check MySQL password di DBngin
# Update .env dengan password yang benar
```

### Error: "SQLSTATE[HY000] [2002] Connection refused"
```bash
# Pastikan MySQL running di DBngin
# Check port di DBngin (default 3306)
```

### Error: "Class 'Laravel\Sanctum\...' not found"
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### CORS Error di Frontend
```bash
# Update config/cors.php
# Tambahkan frontend URL ke allowed_origins
# Restart Laravel server
```
