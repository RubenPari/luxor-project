<?php

use App\Http\Controllers\Api\FavoriteController;
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

// Unsplash photo search
Route::get('/unsplash/search', [UnsplashController::class, 'search']);

// Favorites
Route::get('/favorites', [FavoriteController::class, 'index']);
Route::post('/favorites', [FavoriteController::class, 'store']);
Route::delete('/favorites/{photoId}', [FavoriteController::class, 'destroy']);
