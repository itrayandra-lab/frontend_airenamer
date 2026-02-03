<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'subscription_id',
        'order_id',
        'midtrans_transaction_id',
        'package_type',
        'file_limit',
        'amount',
        'billing_cycle',
        'payment_method',
        'payment_status',
        'paid_at',
        'midtrans_response',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
        'midtrans_response' => 'array',
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
    public function isPending()
    {
        return $this->payment_status === 'pending';
    }

    public function isSuccess()
    {
        return $this->payment_status === 'success';
    }

    public function isFailed()
    {
        return $this->payment_status === 'failed';
    }

    public function markAsPaid($paymentMethod = null, $midtransResponse = null)
    {
        $this->update([
            'payment_status' => 'success',
            'payment_method' => $paymentMethod,
            'paid_at' => now(),
            'midtrans_response' => $midtransResponse,
        ]);
    }

    public function markAsFailed($midtransResponse = null)
    {
        $this->update([
            'payment_status' => 'failed',
            'midtrans_response' => $midtransResponse,
        ]);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('payment_status', 'pending');
    }

    public function scopeSuccess($query)
    {
        return $query->where('payment_status', 'success');
    }

    public function scopeFailed($query)
    {
        return $query->where('payment_status', 'failed');
    }
}
