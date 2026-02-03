<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FileProcessingHistory extends Model
{
    use HasFactory;

    protected $table = 'file_processing_history';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'subscription_id',
        'files_count',
        'operation_type',
        'processed_at',
    ];

    protected $casts = [
        'processed_at' => 'datetime',
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

    // Scopes
    public function scopeToday($query)
    {
        return $query->whereDate('processed_at', today());
    }

    public function scopeThisMonth($query)
    {
        return $query->whereYear('processed_at', now()->year)
            ->whereMonth('processed_at', now()->month);
    }

    public function scopeByOperationType($query, $type)
    {
        return $query->where('operation_type', $type);
    }
}
