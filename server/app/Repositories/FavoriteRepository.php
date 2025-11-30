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
     * - Se (user_id, photo_id) esiste: aggiorna i dati
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
            [
                'width' => $photoData['width'] ?? null,
                'height' => $photoData['height'] ?? null,
                'description' => $photoData['description'] ?? null,
                'alt_description' => $photoData['alt_description'] ?? null,
                
                'url_raw' => $photoData['urls']['raw'] ?? null,
                'url_full' => $photoData['urls']['full'] ?? null,
                'url_regular' => $photoData['urls']['regular'] ?? null,
                'url_small' => $photoData['urls']['small'] ?? null,
                'url_thumb' => $photoData['urls']['thumb'] ?? null,
                
                'link_self' => $photoData['links']['self'] ?? null,
                'link_html' => $photoData['links']['html'] ?? null,
                'link_download' => $photoData['links']['download'] ?? null,
                
                'user_unsplash_id' => $photoData['user']['id'] ?? null,
                'user_username' => $photoData['user']['username'] ?? null,
                'user_name' => $photoData['user']['name'] ?? null,
                'user_portfolio_url' => $photoData['user']['portfolio_url'] ?? null,
                'user_profile_image' => $photoData['user']['profile_image'] ?? null,
                
                'photo_created_at' => isset($photoData['created_at']) 
                    ? date('Y-m-d H:i:s', strtotime($photoData['created_at']))
                    : null,
            ]
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
