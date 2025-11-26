<?php

use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\UnsplashController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Health check endpoints
Route::get('/health', [HealthController::class, 'index']);
Route::get('/health/detailed', [HealthController::class, 'detailed']);

// Unsplash photo search
Route::get('/unsplash/search', [UnsplashController::class, 'search']);
