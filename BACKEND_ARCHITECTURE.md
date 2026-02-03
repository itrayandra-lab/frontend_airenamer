# Backend Architecture - AI Pengatur File

## 🏗️ System Architecture

### Tech Stack
- **Frontend**: React + Vite (existing)
- **Backend**: Laravel 11 (via Laravel Herd)
- **Database**: MySQL (via DBngin)
- **Payment**: Midtrans
- **Authentication**: Laravel Sanctum (API tokens)
- **Database GUI**: TablePlus

---

## 📊 Database Schema

### 1. Users Table
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    google_id VARCHAR(255) NULL UNIQUE,
    avatar VARCHAR(255) NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_google_id (google_id)
);
```

### 2. Subscriptions Table
```sql
CREATE TABLE subscriptions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    package_type ENUM('gratis', 'pro', 'bisnis') NOT NULL,
    file_limit INT NOT NULL, -- 50, 1000, 10000, etc
    price DECIMAL(10, 2) NOT NULL,
    billing_cycle ENUM('monthly', 'yearly') NOT NULL,
    status ENUM('active', 'expired', 'cancelled', 'pending') DEFAULT 'pending',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    auto_renew BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_end_date (end_date)
);
```

### 3. Usage Tracking Table
```sql
CREATE TABLE usage_tracking (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    subscription_id BIGINT UNSIGNED NOT NULL,
    files_processed INT NOT NULL DEFAULT 0,
    month_year VARCHAR(7) NOT NULL, -- Format: 2026-02
    last_reset_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_month (user_id, month_year),
    INDEX idx_user_id (user_id),
    INDEX idx_month_year (month_year)
);
```

### 4. Transactions Table
```sql
CREATE TABLE transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    subscription_id BIGINT UNSIGNED NULL,
    order_id VARCHAR(255) UNIQUE NOT NULL,
    midtrans_transaction_id VARCHAR(255) NULL,
    package_type ENUM('gratis', 'pro', 'bisnis') NOT NULL,
    file_limit INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    billing_cycle ENUM('monthly', 'yearly') NOT NULL,
    payment_method VARCHAR(50) NULL,
    payment_status ENUM('pending', 'success', 'failed', 'expired') DEFAULT 'pending',
    paid_at TIMESTAMP NULL,
    midtrans_response JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_order_id (order_id),
    INDEX idx_payment_status (payment_status)
);
```

### 5. File Processing History Table
```sql
CREATE TABLE file_processing_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    subscription_id BIGINT UNSIGNED NOT NULL,
    files_count INT NOT NULL,
    operation_type ENUM('bulk_rename', 'magic_folder', 'template') NOT NULL,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_processed_at (processed_at)
);
```

### 6. Admin Activity Logs Table
```sql
CREATE TABLE admin_activity_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    admin_id BIGINT UNSIGNED NOT NULL,
    action VARCHAR(255) NOT NULL,
    target_type VARCHAR(50) NULL, -- 'user', 'subscription', 'transaction'
    target_id BIGINT UNSIGNED NULL,
    details JSON NULL,
    ip_address VARCHAR(45) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_admin_id (admin_id),
    INDEX idx_created_at (created_at)
);
```

---

## 🔐 Authentication Flow

### Laravel Sanctum Setup

**1. User Registration/Login:**
```php
// POST /api/register
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
}

// Response:
{
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user"
    },
    "token": "1|abc123xyz...",
    "subscription": {
        "package_type": "gratis",
        "file_limit": 50,
        "status": "active"
    }
}
```

**2. Google OAuth Login:**
```php
// GET /api/auth/google/redirect
// GET /api/auth/google/callback
```

**3. Protected API Calls:**
```javascript
// Frontend: Add token to all requests
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

---

## 🔄 Payment Integration Flow

### Midtrans Integration

**1. Create Transaction:**
```php
// POST /api/subscriptions/create
{
    "package_type": "pro",
    "file_limit": 500,
    "billing_cycle": "monthly"
}

// Response:
{
    "order_id": "ORDER-20260203-123456",
    "snap_token": "abc123xyz...",
    "redirect_url": "https://app.midtrans.com/snap/v2/vtweb/abc123xyz"
}
```

**2. Midtrans Callback (Webhook):**
```php
// POST /api/midtrans/callback
// Midtrans will send notification when payment status changes

// Auto-update subscription status:
// - pending → success: Activate subscription
// - pending → failed: Mark as failed
// - pending → expired: Mark as expired
```

**3. Frontend Payment Flow:**
```javascript
// 1. User clicks "Dapatkan Paket Pro"
// 2. Call API to create transaction
// 3. Get snap_token
// 4. Open Midtrans Snap popup
// 5. User completes payment
// 6. Midtrans sends callback to backend
// 7. Backend updates subscription
// 8. Frontend polls status or receives webhook
// 9. Redirect to dashboard
```

---

## 📱 API Endpoints

### Authentication
```
POST   /api/register                 - Register new user
POST   /api/login                    - Login user
POST   /api/logout                   - Logout user
GET    /api/user                     - Get current user
GET    /api/auth/google/redirect     - Google OAuth redirect
GET    /api/auth/google/callback     - Google OAuth callback
```

### Subscriptions
```
GET    /api/subscriptions            - Get user's subscriptions
POST   /api/subscriptions/create     - Create new subscription
GET    /api/subscriptions/{id}       - Get subscription details
PUT    /api/subscriptions/{id}/cancel - Cancel subscription
POST   /api/subscriptions/{id}/renew  - Renew subscription
```

### Usage Tracking
```
GET    /api/usage/current            - Get current month usage
POST   /api/usage/track              - Track file processing
GET    /api/usage/history            - Get usage history
```

### Transactions
```
GET    /api/transactions             - Get user's transactions
GET    /api/transactions/{id}        - Get transaction details
POST   /api/midtrans/callback        - Midtrans webhook
```

### Admin
```
GET    /api/admin/dashboard          - Admin dashboard stats
GET    /api/admin/users              - List all users
GET    /api/admin/users/{id}         - Get user details
PUT    /api/admin/users/{id}         - Update user
DELETE /api/admin/users/{id}         - Delete user
GET    /api/admin/subscriptions      - List all subscriptions
GET    /api/admin/transactions       - List all transactions
GET    /api/admin/analytics          - Analytics data
```

---

## 🎨 Frontend Components to Create

### 1. User Dashboard (`/dashboard`)
```typescript
interface UserDashboard {
  subscription: {
    package_type: string;
    file_limit: number;
    files_used: number;
    status: string;
    start_date: string;
    end_date: string;
    days_remaining: number;
  };
  usage: {
    current_month: number;
    percentage: number;
    history: Array<{month: string, count: number}>;
  };
  transactions: Array<{
    id: number;
    order_id: string;
    amount: number;
    status: string;
    paid_at: string;
  }>;
}
```

**Components:**
- `DashboardHeader.tsx` - Welcome message, user info
- `SubscriptionCard.tsx` - Current subscription details
- `UsageChart.tsx` - Usage visualization
- `TransactionHistory.tsx` - Payment history
- `RenewalAlert.tsx` - Renewal reminders

### 2. Admin Dashboard (`/admin`)
```typescript
interface AdminDashboard {
  stats: {
    total_users: number;
    active_subscriptions: number;
    monthly_revenue: number;
    total_files_processed: number;
  };
  recent_users: User[];
  recent_transactions: Transaction[];
  revenue_chart: Array<{month: string, revenue: number}>;
}
```

**Components:**
- `AdminStats.tsx` - Key metrics cards
- `UserManagement.tsx` - User list & management
- `SubscriptionManagement.tsx` - Subscription overview
- `TransactionManagement.tsx` - Transaction list
- `AnalyticsCharts.tsx` - Revenue & usage charts

---

## 🚀 Implementation Steps

### Phase 1: Backend Setup (Laravel)
1. ✅ Install Laravel via Herd
2. ✅ Setup MySQL database via DBngin
3. ✅ Create migrations for all tables
4. ✅ Setup Laravel Sanctum for authentication
5. ✅ Create models & relationships
6. ✅ Implement authentication controllers
7. ✅ Implement subscription logic
8. ✅ Integrate Midtrans payment
9. ✅ Create admin middleware
10. ✅ Setup API routes

### Phase 2: Frontend Integration
1. ✅ Create authentication context
2. ✅ Build login/register pages
3. ✅ Build user dashboard
4. ✅ Build admin dashboard
5. ✅ Integrate Midtrans Snap
6. ✅ Add usage tracking
7. ✅ Add transaction history

### Phase 3: Testing & Deployment
1. ✅ Test payment flow
2. ✅ Test subscription lifecycle
3. ✅ Test usage tracking
4. ✅ Test admin features
5. ✅ Deploy backend
6. ✅ Deploy frontend

---

## 💾 Laravel Herd + DBngin + TablePlus Setup

### 1. Laravel Herd Setup
```bash
# Herd sudah terinstall, buat project baru:
cd ~/Herd
laravel new ai-pengatur-file-backend
cd ai-pengatur-file-backend

# Install dependencies
composer require laravel/sanctum
composer require midtrans/midtrans-php
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 2. DBngin Setup
```
1. Buka DBngin
2. Start MySQL service
3. Note: Host=127.0.0.1, Port=3306, User=root, Password=(kosong atau yang Anda set)
```

### 3. TablePlus Connection
```
Name: AI Pengatur File
Host: 127.0.0.1
Port: 3306
User: root
Password: (your password)
Database: ai_pengatur_file
```

### 4. Laravel .env Configuration
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ai_pengatur_file
DB_USERNAME=root
DB_PASSWORD=

MIDTRANS_SERVER_KEY=your_server_key
MIDTRANS_CLIENT_KEY=your_client_key
MIDTRANS_IS_PRODUCTION=false

SANCTUM_STATEFUL_DOMAINS=localhost:8080,127.0.0.1:8080
SESSION_DOMAIN=localhost
```

### 5. Run Migrations
```bash
php artisan migrate
php artisan db:seed --class=AdminSeeder
```

---

## 🔄 Subscription Lifecycle

### Auto-Renewal Logic
```php
// Scheduled job: php artisan schedule:work
// Run daily to check expiring subscriptions

class CheckExpiringSubscriptions extends Command
{
    public function handle()
    {
        // 1. Find subscriptions expiring in 7 days
        // 2. Send email reminder
        // 3. If auto_renew = true, create renewal transaction
        // 4. If payment fails, send notification
        // 5. If expired, downgrade to free tier
    }
}
```

### Usage Reset Logic
```php
// Reset usage counter every month
class ResetMonthlyUsage extends Command
{
    public function handle()
    {
        // 1. Check if new month
        // 2. Reset files_processed to 0
        // 3. Update last_reset_date
        // 4. Archive previous month data
    }
}
```

---

## 📊 Admin Dashboard Features

### Key Metrics
- Total Users (with growth %)
- Active Subscriptions (by package)
- Monthly Revenue (with chart)
- Total Files Processed
- Conversion Rate (free → paid)

### User Management
- Search & filter users
- View user details
- Edit subscription
- Suspend/activate account
- View usage history

### Transaction Management
- List all transactions
- Filter by status/date
- Export to CSV
- Refund handling

### Analytics
- Revenue chart (monthly/yearly)
- User growth chart
- Package distribution pie chart
- Usage trends

---

## 🔒 Security Considerations

1. **API Rate Limiting**
```php
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    // Protected routes
});
```

2. **CORS Configuration**
```php
// config/cors.php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:8080'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

3. **Input Validation**
```php
$request->validate([
    'package_type' => 'required|in:gratis,pro,bisnis',
    'billing_cycle' => 'required|in:monthly,yearly',
]);
```

4. **Middleware Protection**
```php
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Admin only routes
});
```

---

## 📝 Next Steps

1. **Saya buatkan Laravel backend structure?**
   - Migrations
   - Models
   - Controllers
   - Routes
   - Middleware

2. **Saya buatkan Frontend components?**
   - Dashboard User
   - Dashboard Admin
   - Authentication pages
   - Payment integration

3. **Saya buatkan setup guide lengkap?**
   - Step-by-step installation
   - Database setup
   - API testing
   - Deployment

**Mau saya lanjutkan yang mana dulu?** 🚀
