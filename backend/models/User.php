<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'avatar',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Relationships
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function activeSubscription()
    {
        return $this->hasOne(Subscription::class)
            ->where('status', 'active')
            ->latest();
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function usageTracking()
    {
        return $this->hasMany(UsageTracking::class);
    }

    public function currentUsage()
    {
        return $this->hasOne(UsageTracking::class)
            ->where('month_year', now()->format('Y-m'));
    }

    public function fileProcessingHistory()
    {
        return $this->hasMany(FileProcessingHistory::class);
    }

    // Helper methods
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function canProcessFiles($count)
    {
        $subscription = $this->activeSubscription;
        if (!$subscription) {
            return false;
        }

        $usage = $this->currentUsage;
        $currentUsage = $usage ? $usage->files_processed : 0;

        return ($currentUsage + $count) <= $subscription->file_limit;
    }

    public function getRemainingFiles()
    {
        $subscription = $this->activeSubscription;
        if (!$subscription) {
            return 0;
        }

        $usage = $this->currentUsage;
        $currentUsage = $usage ? $usage->files_processed : 0;

        return max(0, $subscription->file_limit - $currentUsage);
    }
}
