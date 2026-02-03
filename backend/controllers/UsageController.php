<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UsageTracking;
use App\Models\FileProcessingHistory;
use Illuminate\Http\Request;

class UsageController extends Controller
{
    public function current(Request $request)
    {
        $user = $request->user();
        $subscription = $user->activeSubscription;
        $usage = $user->currentUsage;

        if (!$usage && $subscription) {
            // Create usage tracking if not exists
            $usage = UsageTracking::create([
                'user_id' => $user->id,
                'subscription_id' => $subscription->id,
                'files_processed' => 0,
                'month_year' => now()->format('Y-m'),
                'last_reset_date' => now(),
            ]);
        }

        return response()->json([
            'subscription' => $subscription,
            'usage' => $usage,
            'remaining_files' => $user->getRemainingFiles(),
            'usage_percentage' => $usage ? $usage->getUsagePercentage() : 0,
        ]);
    }

    public function track(Request $request)
    {
        $request->validate([
            'files_count' => 'required|integer|min:1',
            'operation_type' => 'required|in:bulk_rename,magic_folder,template',
        ]);

        $user = $request->user();
        $subscription = $user->activeSubscription;

        if (!$subscription) {
            return response()->json([
                'error' => 'No active subscription found',
            ], 403);
        }

        // Check if user can process files
        if (!$user->canProcessFiles($request->files_count)) {
            return response()->json([
                'error' => 'File limit exceeded',
                'remaining_files' => $user->getRemainingFiles(),
            ], 403);
        }

        // Get or create usage tracking
        $usage = $user->currentUsage;
        if (!$usage) {
            $usage = UsageTracking::create([
                'user_id' => $user->id,
                'subscription_id' => $subscription->id,
                'files_processed' => 0,
                'month_year' => now()->format('Y-m'),
                'last_reset_date' => now(),
            ]);
        }

        // Increment usage
        $usage->incrementUsage($request->files_count);

        // Log file processing history
        FileProcessingHistory::create([
            'user_id' => $user->id,
            'subscription_id' => $subscription->id,
            'files_count' => $request->files_count,
            'operation_type' => $request->operation_type,
            'processed_at' => now(),
        ]);

        return response()->json([
            'message' => 'Usage tracked successfully',
            'usage' => $usage->fresh(),
            'remaining_files' => $user->getRemainingFiles(),
        ]);
    }

    public function history(Request $request)
    {
        $history = $request->user()
            ->usageTracking()
            ->orderBy('month_year', 'desc')
            ->get();

        return response()->json($history);
    }

    public function processingHistory(Request $request)
    {
        $history = $request->user()
            ->fileProcessingHistory()
            ->latest('processed_at')
            ->paginate(20);

        return response()->json($history);
    }
}
