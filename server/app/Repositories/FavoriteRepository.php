<?php

/**
 * @file FavoriteRepository.php
 * @description Repository per la persistenza dei preferiti.
 *
 * Implementa FavoriteRepositoryInterface per separare la logica
 * di accesso ai dati dal controller (principio SRP).
 */

namespace App\Repositories;

use App\Contracts\FavoriteRepositoryInterface;
use App\Models\Favorite;
use Illuminate\Database\Eloquent\Collection;

/**
 * Repository Eloquent per i preferiti.
 *
 * Incapsula tutte le query relative ai preferiti.
 * Permette al controller di non dipendere direttamente da Eloquent.
 */
class FavoriteRepository implements FavoriteRepositoryInterface
{
    /**
     * Recupera tutti i preferiti di un utente ordinati per data decrescente.
     *
     * @param string $userId ID univoco dell'utente (UUID)
     * @return Collection<int, Favorite> Collezione di preferiti dell'utente (più recenti prima)
     */
    public function all(string $userId): Collection
    {
        return Favorite::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Trova un preferito per ID foto Unsplash e ID utente.
     *
     * @param string $photoId ID univoco della foto su Unsplash
     * @param string $userId ID univoco dell'utente (UUID)
     * @return Favorite|null Il preferito trovato o null se non esiste
     */
    public function findByPhotoId(string $photoId, string $userId): ?Favorite
    {
        return Favorite::where('photo_id', $photoId)
            ->where('user_id', $userId)
            ->first();
    }

    /**
     * Salva o aggiorna un preferito per un utente specifico.
     *
     * Utilizza updateOrCreate per gestire sia inserimento che aggiornamento:
     * - Se (user_id, photo_id) esiste: aggiorna photo_data
     * - Altrimenti: crea nuovo record
     *
     * @param string $photoId ID univoco della foto su Unsplash
     * @param array<string, mixed> $photoData Dati completi della foto
     * @param string $userId ID univoco dell'utente (UUID)
     * @return Favorite Il preferito creato o aggiornato
     */
    public function save(string $photoId, array $photoData, string $userId): Favorite
    {
        return Favorite::updateOrCreate(
            ['photo_id' => $photoId, 'user_id' => $userId],
            ['photo_data' => $photoData]
        );
    }

    /**
     * Elimina un preferito.
     *
     * @param Favorite $favorite Il preferito da eliminare
     * @return bool True se eliminato con successo
     */
    public function delete(Favorite $favorite): bool
    {
        return (bool) $favorite->delete();
    }
}
