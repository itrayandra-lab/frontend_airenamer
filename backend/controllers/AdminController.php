<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Subscription;
use App\Models\Transaction;
use App\Models\FileProcessingHistory;
use App\Models\AdminActivityLog;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'total_users' => User::where('role', 'user')->count(),
            'active_subscriptions' => Subscription::active()->count(),
            'monthly_revenue' => Transaction::success()
                ->whereMonth('paid_at', now()->month)
                ->sum('amount'),
            'total_files_processed' => FileProcessingHistory::thisMonth()->sum('files_count'),
        ];

        $recentUsers = User::where('role', 'user')
            ->with('activeSubscription')
            ->latest()
            ->take(10)
            ->get();

        $recentTransactions = Transaction::with('user')
            ->latest()
            ->take(10)
            ->get();

        // Revenue chart (last 6 months)
        $revenueChart = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $revenueChart[] = [
                'month' => $month->format('M Y'),
                'revenue' => Transaction::success()
                    ->whereYear('paid_at', $month->year)
                    ->whereMonth('paid_at', $month->month)
                    ->sum('amount'),
            ];
        }

        AdminActivityLog::log('view_dashboard');

        return response()->json([
            'stats' => $stats,
            'recent_users' => $recentUsers,
            'recent_transactions' => $recentTransactions,
            'revenue_chart' => $revenueChart,
        ]);
    }

    public function users(Request $request)
    {
        $query = User::where('role', 'user')
            ->with(['activeSubscription', 'currentUsage']);

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by subscription status
        if ($request->has('status')) {
            $query->whereHas('activeSubscription', function ($q) use ($request) {
                $q->where('status', $request->status);
            });
        }

        $users = $query->paginate(20);

        AdminActivityLog::log('view_users');

        return response()->json($users);
    }

    public function userDetail($id)
    {
        $user = User::with([
            'subscriptions',
            'transactions',
            'usageTracking',
            'fileProcessingHistory'
        ])->findOrFail($id);

        AdminActivityLog::log('view_user_detail', 'user', $id);

        return response()->json($user);
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'role' => 'sometimes|in:user,admin',
        ]);

        $user->update($request->only(['name', 'email', 'role']));

        AdminActivityLog::log('update_user', 'user', $id, [
            'changes' => $request->only(['name', 'email', 'role'])
        ]);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user,
        ]);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $userName = $user->name;
        
        $user->delete();

        AdminActivityLog::log('delete_user', 'user', $id, [
            'user_name' => $userName
        ]);

        return response()->json([
            'message' => 'User deleted successfully',
        ]);
    }

    public function subscriptions(Request $request)
    {
        $query = Subscription::with('user');

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by package type
        if ($request->has('package_type')) {
            $query->where('package_type', $request->package_type);
        }

        $subscriptions = $query->latest()->paginate(20);

        AdminActivityLog::log('view_subscriptions');

        return response()->json($subscriptions);
    }

    public function transactions(Request $request)
    {
        $query = Transaction::with('user');

        // Filter by status
        if ($request->has('status')) {
            $query->where('payment_status', $request->status);
        }

        // Date range filter
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('created_at', [
                $request->start_date,
                $request->end_date
            ]);
        }

        $transactions = $query->latest()->paginate(20);

        AdminActivityLog::log('view_transactions');

        return response()->json($transactions);
    }

    public function analytics()
    {
        // User growth (last 12 months)
        $userGrowth = [];
        for ($i = 11; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $userGrowth[] = [
                'month' => $month->format('M Y'),
                'count' => User::where('role', 'user')
                    ->whereYear('created_at', $month->year)
                    ->whereMonth('created_at', $month->month)
                    ->count(),
            ];
        }

        // Package distribution
        $packageDistribution = Subscription::active()
            ->selectRaw('package_type, COUNT(*) as count')
            ->groupBy('package_type')
            ->get();

        // Usage trends (last 30 days)
        $usageTrends = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $usageTrends[] = [
                'date' => $date->format('M d'),
                'files' => FileProcessingHistory::whereDate('processed_at', $date)
                    ->sum('files_count'),
            ];
        }

        AdminActivityLog::log('view_analytics');

        return response()->json([
            'user_growth' => $userGrowth,
            'package_distribution' => $packageDistribution,
            'usage_trends' => $usageTrends,
        ]);
    }
}
