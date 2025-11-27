<?php

/**
 * @file FavoriteController.php
 * @description Controller API per la gestione dei preferiti.
 *
 * Implementa le operazioni CRUD per i preferiti:
 * - GET /api/favorites: recupera tutti i preferiti
 * - POST /api/favorites: aggiunge una foto ai preferiti
 * - DELETE /api/favorites/{photoId}: rimuove una foto dai preferiti
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFavoriteRequest;
use App\Models\Favorite;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

/**
 * Controller per le operazioni sui preferiti.
 *
 * Gestisce il salvataggio e la rimozione delle foto preferite.
 */
class FavoriteController extends Controller
{
    /**
     * Recupera tutti i preferiti.
     *
     * I risultati sono ordinati per data di creazione decrescente (più recenti prima).
     *
     * @return JsonResponse Lista dei preferiti o errore
     *
     * @example GET /api/favorites
     */
    public function index(): JsonResponse
    {
        try {
            // Recupera tutti i preferiti ordinati per data decrescente
            $favorites = Favorite::orderBy('created_at', 'desc')->get();

            return $this->success($favorites);
        } catch (Exception $e) {
            // Logga l'errore per debug
            Log::error('Failed to fetch favorites', [
                'exception' => $e,
            ]);

            return $this->failure('Failed to fetch favorites', $e->getMessage(), 500);
        }
    }

    /**
     * Aggiunge una foto ai preferiti.
     *
     * Utilizza updateOrCreate per gestire sia l'inserimento che l'aggiornamento:
     * - Se il photo_id esiste già, aggiorna photo_data
     * - Altrimenti crea un nuovo record
     *
     * Questo previene duplicati e permette di aggiornare i metadati della foto.
     *
     * @param StoreFavoriteRequest $request Richiesta validata con photo_id, photo_data
     * @return JsonResponse Preferito creato/aggiornato o errore
     *
     * @example POST /api/favorites {"photo_id": "abc123", "photo_data": {...} }
     */
    public function store(StoreFavoriteRequest $request): JsonResponse
    {
        // I dati sono già validati dal FormRequest
        $data = $request->validated();

        try {
            // Crea o aggiorna il preferito
            $favorite = Favorite::updateOrCreate(
                [
                    'photo_id' => $data['photo_id'],  // Chiave: ID foto Unsplash
                ],
                [
                    'photo_data' => $data['photo_data'],  // Dati da aggiornare
                ]
            );

            return $this->success($favorite, 'Photo added to favorites', 201);
        } catch (Exception $e) {
            // Logga l'errore con il payload per debug
            Log::error('Failed to add favorite', [
                'exception' => $e,
                'payload' => $data,
            ]);

            return $this->failure('Failed to add favorite', $e->getMessage(), 500);
        }
    }

    /**
     * Rimuove una foto dai preferiti.
     *
     * Cerca il preferito per photo_id, poi lo elimina.
     * Restituisce 404 se il preferito non viene trovato.
     *
     * @param string $photoId ID della foto Unsplash da rimuovere
     * @return JsonResponse Conferma eliminazione o errore
     *
     * @example DELETE /api/favorites/abc123
     */
    public function destroy(string $photoId): JsonResponse
    {
        try {
            // Cerca il preferito per photo_id
            $favorite = Favorite::where('photo_id', $photoId)->first();

            // Verifica che esista
            if (!$favorite) {
                return $this->failure('Favorite not found', null, 404);
            }

            // Elimina il record
            $favorite->delete();

            return $this->success(null, 'Photo removed from favorites');
        } catch (Exception $e) {
            // Logga l'errore per debug
            Log::error('Failed to remove favorite', [
                'exception' => $e,
                'photo_id' => $photoId,
            ]);

            return $this->failure('Failed to remove favorite', $e->getMessage(), 500);
        }
    }
}
