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
     * Recupera tutti i preferiti ordinati per data decrescente.
     *
     * @return Collection<int, Favorite> Collezione di preferiti (più recenti prima)
     */
    public function all(): Collection
    {
        return Favorite::orderBy('created_at', 'desc')->get();
    }

    /**
     * Trova un preferito per ID foto Unsplash.
     *
     * @param string $photoId ID univoco della foto su Unsplash
     * @return Favorite|null Il preferito trovato o null se non esiste
     */
    public function findByPhotoId(string $photoId): ?Favorite
    {
        return Favorite::where('photo_id', $photoId)->first();
    }

    /**
     * Salva o aggiorna un preferito.
     *
     * Utilizza updateOrCreate per gestire sia inserimento che aggiornamento:
     * - Se photo_id esiste: aggiorna photo_data
     * - Altrimenti: crea nuovo record
     *
     * @param string $photoId ID univoco della foto su Unsplash
     * @param array<string, mixed> $photoData Dati completi della foto
     * @return Favorite Il preferito creato o aggiornato
     */
    public function save(string $photoId, array $photoData): Favorite
    {
        return Favorite::updateOrCreate(
            ['photo_id' => $photoId],
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
