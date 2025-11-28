<?php

/**
 * @file FavoriteRepositoryInterface.php
 * @description Interfaccia per il repository dei preferiti.
 *
 * Definisce il contratto per le operazioni di persistenza sui preferiti.
 * Permette di sostituire l'implementazione (es. per testing).
 */

namespace App\Contracts;

use App\Models\Favorite;
use Illuminate\Database\Eloquent\Collection;

/**
 * Contratto per il repository dei preferiti.
 *
 * Principio: Dependency Inversion - dipendere da astrazioni, non implementazioni.
 */
interface FavoriteRepositoryInterface
{
    /**
     * Recupera tutti i preferiti di un utente ordinati per data decrescente.
     *
     * @param string $userId ID univoco dell'utente (UUID)
     * @return Collection<int, Favorite> Collezione di preferiti dell'utente
     */
    public function all(string $userId): Collection;

    /**
     * Trova un preferito per ID foto Unsplash e ID utente.
     *
     * @param string $photoId ID univoco della foto su Unsplash
     * @param string $userId ID univoco dell'utente (UUID)
     * @return Favorite|null Il preferito trovato o null
     */
    public function findByPhotoId(string $photoId, string $userId): ?Favorite;

    /**
     * Salva o aggiorna un preferito per un utente specifico.
     *
     * @param string $photoId ID univoco della foto su Unsplash
     * @param array<string, mixed> $photoData Dati completi della foto
     * @param string $userId ID univoco dell'utente (UUID)
     * @return Favorite Il preferito creato o aggiornato
     */
    public function save(string $photoId, array $photoData, string $userId): Favorite;

    /**
     * Elimina un preferito.
     *
     * @param Favorite $favorite Il preferito da eliminare
     * @return bool True se eliminato con successo
     */
    public function delete(Favorite $favorite): bool;
}
