<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Subscription;
use App\Models\UsageTracking;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

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
        $adminSubscription = Subscription::create([
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

        // Create usage tracking for admin
        UsageTracking::create([
            'user_id' => $admin->id,
            'subscription_id' => $adminSubscription->id,
            'files_processed' => 0,
            'month_year' => now()->format('Y-m'),
            'last_reset_date' => now(),
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
        $userSubscription = Subscription::create([
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

        // Create usage tracking for test user
        UsageTracking::create([
            'user_id' => $user->id,
            'subscription_id' => $userSubscription->id,
            'files_processed' => 15,
            'month_year' => now()->format('Y-m'),
            'last_reset_date' => now(),
        ]);

        $this->command->info('✅ Admin and test user created successfully!');
        $this->command->info('📧 Admin: admin@raymaizing.com / admin123');
        $this->command->info('📧 User: user@test.com / password');
    }
}
