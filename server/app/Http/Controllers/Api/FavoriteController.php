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

use App\Contracts\FavoriteRepositoryInterface;
use App\Enums\HttpStatusCode;
use App\Http\Controllers\Controller;
use App\Http\Middleware\UserIdentifierMiddleware;
use App\Http\Requests\StoreFavoriteRequest;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Controller per le operazioni sui preferiti.
 *
 * Gestisce il salvataggio e la rimozione delle foto preferite.
 */
class FavoriteController extends Controller
{
    /**
     * Costruttore con dependency injection del repository.
     *
     * @param FavoriteRepositoryInterface $repository Repository per i preferiti
     */
    public function __construct(
        private FavoriteRepositoryInterface $repository
    ) {}

    /**
     * Recupera tutti i preferiti dell'utente.
     *
     * I risultati sono ordinati per data di creazione decrescente (più recenti prima).
     * I preferiti sono filtrati per l'utente corrente tramite X-User-ID header.
     *
     * @param Request $request Richiesta HTTP (contiene l'header X-User-ID)
     * @return JsonResponse Lista dei preferiti dell'utente o errore
     *
     * @example GET /api/favorites
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $userId = $request->header('X-User-ID');
            $favorites = $this->repository->all($userId);

            return $this->success($favorites);
        } catch (Exception $e) {
            Log::error('Failed to fetch favorites', ['exception' => $e]);

            return $this->failure(
                'Failed to fetch favorites',
                $e->getMessage(),
                HttpStatusCode::INTERNAL_SERVER_ERROR->value
            );
        }
    }

    /**
     * Aggiunge una foto ai preferiti dell'utente.
     *
     * Utilizza updateOrCreate per gestire sia l'inserimento che l'aggiornamento:
     * - Se il (user_id, photo_id) esiste già, aggiorna photo_data
     * - Altrimenti crea un nuovo record
     *
     * Questo previene duplicati per utente e permette di aggiornare i metadati della foto.
     * L'utente è identificato tramite X-User-ID header.
     *
     * @param StoreFavoriteRequest $request Richiesta validata con photo_id, photo_data
     * @return JsonResponse Preferito creato/aggiornato o errore
     *
     * @example POST /api/favorites {"photo_id": "abc123", "photo_data": {...} }
     */
    public function store(StoreFavoriteRequest $request): JsonResponse
    {
        $data = $request->validated();
        $userId = $request->header('X-User-ID');

        try {
            $favorite = $this->repository->save(
                $data['photo_id'],
                $data['photo_data'],
                $userId
            );

            return $this->success(
                $favorite,
                'Photo added to favorites',
                HttpStatusCode::CREATED->value
            );
        } catch (Exception $e) {
            Log::error('Failed to add favorite', [
                'exception' => $e,
                'payload' => $data,
                'user_id' => $userId,
            ]);

            return $this->failure(
                'Failed to add favorite',
                $e->getMessage(),
                HttpStatusCode::INTERNAL_SERVER_ERROR->value
            );
        }
    }

    /**
     * Rimuove una foto dai preferiti dell'utente.
     *
     * Cerca il preferito per (user_id, photo_id), poi lo elimina.
     * Restituisce 404 se il preferito non viene trovato.
     * L'utente è identificato tramite X-User-ID header.
     *
     * @param string $photoId ID della foto Unsplash da rimuovere
     * @param Request $request Richiesta HTTP (contiene l'header X-User-ID)
     * @return JsonResponse Conferma eliminazione o errore
     *
     * @example DELETE /api/favorites/abc123
     */
    public function destroy(string $photoId, Request $request): JsonResponse
    {
        $userId = $request->header('X-User-ID');
        
        try {
            $favorite = $this->repository->findByPhotoId($photoId, $userId);

            if (!$favorite) {
                return $this->failure(
                    'Favorite not found',
                    null,
                    HttpStatusCode::NOT_FOUND->value
                );
            }

            $this->repository->delete($favorite);

            return $this->success(null, 'Photo removed from favorites');
        } catch (Exception $e) {
            Log::error('Failed to remove favorite', [
                'exception' => $e,
                'photo_id' => $photoId,
                'user_id' => $userId,
            ]);

            return $this->failure(
                'Failed to remove favorite',
                $e->getMessage(),
                HttpStatusCode::INTERNAL_SERVER_ERROR->value
            );
        }
    }
}
