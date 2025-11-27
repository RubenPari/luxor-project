<?php

/**
 * @file FavoriteController.php
 * @description Controller API per la gestione dei preferiti.
 * 
 * Implementa le operazioni CRUD per i preferiti:
 * - GET /api/favorites: recupera tutti i preferiti (filtrabili per user_id)
 * - POST /api/favorites: aggiunge una foto ai preferiti
 * - DELETE /api/favorites/{photoId}: rimuove una foto dai preferiti
 * 
 * I preferiti possono essere associati a un utente specifico (user_id)
 * oppure essere "anonimi" (user_id = null) per utenti non autenticati.
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFavoriteRequest;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Controller per le operazioni sui preferiti.
 * 
 * Gestisce il salvataggio e la rimozione delle foto preferite.
 * Supporta sia utenti autenticati che anonimi attraverso
 * il parametro opzionale user_id.
 */
class FavoriteController extends Controller
{
    /**
     * Recupera tutti i preferiti.
     * 
     * Se viene fornito un user_id, restituisce solo i preferiti di quell'utente.
     * Altrimenti restituisce i preferiti "anonimi" (con user_id = null).
     * I risultati sono ordinati per data di creazione decrescente (più recenti prima).
     *
     * @param Request $request Richiesta HTTP con parametro opzionale 'user_id'
     * @return \Illuminate\Http\JsonResponse Lista dei preferiti o errore
     * 
     * @example GET /api/favorites - Preferiti anonimi
     * @example GET /api/favorites?user_id=1 - Preferiti dell'utente 1
     */
    public function index(Request $request)
    {
        try {
            // Estrae l'ID utente dalla query string (opzionale)
            $userId = $request->input('user_id');

            // Costruisce la query base
            $query = Favorite::query();

            // Filtra per utente specifico o preferiti anonimi
            if ($userId) {
                $query->where('user_id', $userId);
            } else {
                $query->whereNull('user_id');
            }

            // Esegue la query ordinando per data decrescente
            $favorites = $query->orderBy('created_at', 'desc')->get();

            return $this->success($favorites);
        } catch (\Exception $e) {
            // Logga l'errore per debug
            Log::error('Failed to fetch favorites', [
                'exception' => $e,
                'user_id' => $request->input('user_id'),
            ]);

            return $this->failure('Failed to fetch favorites', $e->getMessage(), 500);
        }
    }

    /**
     * Aggiunge una foto ai preferiti.
     * 
     * Utilizza updateOrCreate per gestire sia l'inserimento che l'aggiornamento:
     * - Se la combinazione user_id + photo_id esiste già, aggiorna photo_data
     * - Altrimenti crea un nuovo record
     * 
     * Questo previene duplicati e permette di aggiornare i metadati della foto.
     *
     * @param StoreFavoriteRequest $request Richiesta validata con photo_id, photo_data, user_id?
     * @return \Illuminate\Http\JsonResponse Preferito creato/aggiornato o errore
     * 
     * @example POST /api/favorites { "photo_id": "abc123", "photo_data": {...} }
     */
    public function store(StoreFavoriteRequest $request)
    {
        // I dati sono già validati dal FormRequest
        $data = $request->validated();

        try {
            // Crea o aggiorna il preferito
            // La chiave univoca è la combinazione user_id + photo_id
            $favorite = Favorite::updateOrCreate(
                [
                    'user_id' => $data['user_id'] ?? null,  // Chiave: utente (o null)
                    'photo_id' => $data['photo_id'],        // Chiave: ID foto Unsplash
                ],
                [
                    'photo_data' => $data['photo_data'],    // Dati da aggiornare
                ]
            );

            return $this->success($favorite, 'Photo added to favorites', 201);
        } catch (\Exception $e) {
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
     * Cerca il preferito per photo_id e user_id, poi lo elimina.
     * Restituisce 404 se il preferito non viene trovato.
     *
     * @param Request $request Richiesta HTTP con parametro opzionale 'user_id'
     * @param string $photoId ID della foto Unsplash da rimuovere
     * @return \Illuminate\Http\JsonResponse Conferma eliminazione o errore
     * 
     * @example DELETE /api/favorites/abc123 - Rimuove dai preferiti anonimi
     * @example DELETE /api/favorites/abc123?user_id=1 - Rimuove dai preferiti utente 1
     */
    public function destroy(Request $request, $photoId)
    {
        try {
            // Estrae l'ID utente dalla query string
            $userId = $request->input('user_id');

            // Costruisce la query per trovare il preferito
            $query = Favorite::where('photo_id', $photoId);

            // Filtra per utente specifico o preferiti anonimi
            if ($userId) {
                $query->where('user_id', $userId);
            } else {
                $query->whereNull('user_id');
            }

            // Cerca il preferito
            $favorite = $query->first();

            // Verifica che esista
            if (!$favorite) {
                return $this->failure('Favorite not found', null, 404);
            }

            // Elimina il record
            $favorite->delete();

            return $this->success(null, 'Photo removed from favorites');
        } catch (\Exception $e) {
            // Logga l'errore per debug
            Log::error('Failed to remove favorite', [
                'exception' => $e,
                'photo_id' => $photoId,
                'user_id' => $request->input('user_id'),
            ]);

            return $this->failure('Failed to remove favorite', $e->getMessage(), 500);
        }
    }
}
