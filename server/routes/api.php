<?php

/**
 * @file api.php
 * @description Definizione delle route API REST dell'applicazione.
 * 
 * Tutte le route definite qui hanno prefisso /api automatico
 * e appartengono al middleware group 'api'.
 * 
 * Endpoint disponibili:
 * 
 * UNSPLASH:
 * - GET /api/unsplash/search?query=...&page=...&per_page=...
 *   Cerca foto su Unsplash
 * 
 * PREFERITI:
 * - GET /api/favorites
 *   Lista tutti i preferiti
 * - POST /api/favorites
 *   Aggiunge una foto ai preferiti
 * - DELETE /api/favorites/{photoId}
 *   Rimuove una foto dai preferiti
 */

use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\UnsplashController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Route API
|--------------------------------------------------------------------------
|
| Qui vengono registrate le route API dell'applicazione.
| Queste route sono caricate dal RouteServiceProvider e appartengono
| al middleware group "api" con prefisso /api.
|
*/

// ============================================================================
// UNSPLASH - Ricerca foto
// ============================================================================

/**
 * Cerca foto su Unsplash.
 * 
 * Query params:
 * - query (required): termine di ricerca
 * - page (optional): numero pagina, default 1
 * - per_page (optional): risultati per pagina, default 12, max 30
 * 
 * @route GET /api/unsplash/search
 */
Route::get('/unsplash/search', [UnsplashController::class, 'search']);

// ============================================================================
// FAVORITES - Gestione preferiti
// ============================================================================

/**
 * Recupera tutti i preferiti.
 * Restituisce array di preferiti ordinati per data di creazione (più recenti prima).
 * 
 * @route GET /api/favorites
 */
Route::get('/favorites', [FavoriteController::class, 'index']);

/**
 * Aggiunge una foto ai preferiti.
 * Richiede photo_id e photo_data nel body JSON.
 * 
 * @route POST /api/favorites
 */
Route::post('/favorites', [FavoriteController::class, 'store']);

/**
 * Rimuove una foto dai preferiti.
 * Cerca per photo_id (ID Unsplash), non per ID database.
 * 
 * @route DELETE /api/favorites/{photoId}
 */
Route::delete('/favorites/{photoId}', [FavoriteController::class, 'destroy']);
