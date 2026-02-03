<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Subscription;
use App\Models\UsageTracking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user',
        ]);

        // Create free subscription
        $subscription = Subscription::create([
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

        // Create usage tracking
        UsageTracking::create([
            'user_id' => $user->id,
            'subscription_id' => $subscription->id,
            'files_processed' => 0,
            'month_year' => now()->format('Y-m'),
            'last_reset_date' => now(),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'subscription' => $subscription,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'subscription' => $user->activeSubscription,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    public function user(Request $request)
    {
        $user = $request->user();
        $subscription = $user->activeSubscription;
        $usage = $user->currentUsage;

        return response()->json([
            'user' => $user,
            'subscription' => $subscription,
            'usage' => $usage,
            'remaining_files' => $user->getRemainingFiles(),
        ]);
    }
}
