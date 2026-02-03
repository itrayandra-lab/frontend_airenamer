<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSubscription
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'error' => 'Unauthenticated.',
            ], 401);
        }

        $subscription = $user->activeSubscription;

        if (!$subscription) {
            return response()->json([
                'error' => 'No active subscription found.',
                'message' => 'Please subscribe to a plan to continue.',
            ], 403);
        }

        if ($subscription->isExpired()) {
            return response()->json([
                'error' => 'Subscription expired.',
                'message' => 'Your subscription has expired. Please renew to continue.',
                'expired_at' => $subscription->end_date,
            ], 403);
        }

        return $next($request);
    }
}
