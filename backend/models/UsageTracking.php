<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UsageTracking extends Model
{
    use HasFactory;

    protected $table = 'usage_tracking';

    protected $fillable = [
        'user_id',
        'subscription_id',
        'files_processed',
        'month_year',
        'last_reset_date',
    ];

    protected $casts = [
        'last_reset_date' => 'date',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }

    // Helper methods
    public function incrementUsage($count)
    {
        $this->increment('files_processed', $count);
    }

    public function resetUsage()
    {
        $this->update([
            'files_processed' => 0,
            'last_reset_date' => now(),
        ]);
    }

    public function getUsagePercentage()
    {
        $subscription = $this->subscription;
        if (!$subscription) {
            return 0;
        }

        return round(($this->files_processed / $subscription->file_limit) * 100, 2);
    }

    public function getRemainingFiles()
    {
        $subscription = $this->subscription;
        if (!$subscription) {
            return 0;
        }

        return max(0, $subscription->file_limit - $this->files_processed);
    }

    // Scopes
    public function scopeCurrentMonth($query)
    {
        return $query->where('month_year', now()->format('Y-m'));
    }
}
