<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\Transaction;
use App\Models\UsageTracking;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SubscriptionController extends Controller
{
    public function index(Request $request)
    {
        $subscriptions = $request->user()
            ->subscriptions()
            ->with('usageTracking')
            ->latest()
            ->get();

        return response()->json($subscriptions);
    }

    public function show(Request $request, $id)
    {
        $subscription = $request->user()
            ->subscriptions()
            ->with(['usageTracking', 'transactions'])
            ->findOrFail($id);

        return response()->json($subscription);
    }

    public function create(Request $request)
    {
        $request->validate([
            'package_type' => 'required|in:pro,bisnis',
            'file_limit' => 'required|integer|min:51',
            'billing_cycle' => 'required|in:monthly,yearly',
        ]);

        // Calculate price based on package and file limit
        $price = $this->calculatePrice(
            $request->package_type,
            $request->file_limit,
            $request->billing_cycle
        );

        // Create transaction
        $transaction = Transaction::create([
            'user_id' => $request->user()->id,
            'order_id' => 'ORDER-' . date('Ymd') . '-' . strtoupper(Str::random(8)),
            'package_type' => $request->package_type,
            'file_limit' => $request->file_limit,
            'amount' => $price,
            'billing_cycle' => $request->billing_cycle,
            'payment_status' => 'pending',
        ]);

        // Generate Midtrans Snap Token (implement later)
        $snapToken = $this->generateMidtransToken($transaction);

        return response()->json([
            'transaction' => $transaction,
            'snap_token' => $snapToken,
            'redirect_url' => config('midtrans.snap_url') . '/' . $snapToken,
        ]);
    }

    public function cancel(Request $request, $id)
    {
        $subscription = $request->user()
            ->subscriptions()
            ->findOrFail($id);

        $subscription->update([
            'status' => 'cancelled',
            'auto_renew' => false,
        ]);

        return response()->json([
            'message' => 'Subscription cancelled successfully',
            'subscription' => $subscription,
        ]);
    }

    private function calculatePrice($packageType, $fileLimit, $billingCycle)
    {
        // Price calculation logic
        $prices = [
            'pro' => [
                100 => 75000,
                250 => 120000,
                500 => 180000,
                750 => 240000,
                1000 => 300000,
            ],
            'bisnis' => [
                1500 => 450000,
                2500 => 600000,
                5000 => 900000,
                10000 => 1500000,
            ],
        ];

        $monthlyPrice = $prices[$packageType][$fileLimit] ?? 0;

        if ($billingCycle === 'yearly') {
            // 15% discount for yearly
            return round($monthlyPrice * 12 * 0.85);
        }

        return $monthlyPrice;
    }

    private function generateMidtransToken($transaction)
    {
        // Implement Midtrans Snap token generation
        // For now, return dummy token
        return 'dummy-snap-token-' . $transaction->order_id;
    }
}
