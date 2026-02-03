<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\UsageController;
use App\Http\Controllers\Api\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Subscriptions
    Route::prefix('subscriptions')->group(function () {
        Route::get('/', [SubscriptionController::class, 'index']);
        Route::post('/create', [SubscriptionController::class, 'create']);
        Route::get('/{id}', [SubscriptionController::class, 'show']);
        Route::post('/{id}/cancel', [SubscriptionController::class, 'cancel']);
    });

    // Usage Tracking
    Route::prefix('usage')->group(function () {
        Route::get('/current', [UsageController::class, 'current']);
        Route::post('/track', [UsageController::class, 'track']);
        Route::get('/history', [UsageController::class, 'history']);
        Route::get('/processing-history', [UsageController::class, 'processingHistory']);
    });

    // Admin routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        // Dashboard
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        
        // Users
        Route::get('/users', [AdminController::class, 'users']);
        Route::get('/users/{id}', [AdminController::class, 'userDetail']);
        Route::put('/users/{id}', [AdminController::class, 'updateUser']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        
        // Subscriptions
        Route::get('/subscriptions', [AdminController::class, 'subscriptions']);
        
        // Transactions
        Route::get('/transactions', [AdminController::class, 'transactions']);
        
        // Analytics
        Route::get('/analytics', [AdminController::class, 'analytics']);
    });
});

// Midtrans webhook (no auth required)
Route::post('/midtrans/callback', function (Request $request) {
    // Implement Midtrans callback handler
    return response()->json(['message' => 'Callback received']);
});
