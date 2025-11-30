<?php

/**
 * @file FavoriteService.php
 * @description Servizio per la logica dei preferiti.
 *
 * Incapsula la logica di business per la gestione dei preferiti
 * e delega la persistenza al repository.
 */

namespace App\Services;

use App\Contracts\FavoriteRepositoryInterface;
use App\DataTransferObjects\PhotoData;
use App\Models\Favorite;
use Illuminate\Database\Eloquent\Collection;

class FavoriteService
{
    public function __construct(private FavoriteRepositoryInterface $repository) {}

    public function all(string $userId): Collection
    {
        return $this->repository->all($userId);
    }

    public function findByPhotoId(string $photoId, string $userId): ?Favorite
    {
        return $this->repository->findByPhotoId($photoId, $userId);
    }

    public function save(string $photoId, array $photoData, string $userId): Favorite
    {
        // Valida e normalizza i dati usando il DTO
        $photoDto = PhotoData::fromArray($photoData);

        return $this->repository->save($photoId, $photoDto->toArray(), $userId);
    }

    public function delete(Favorite $favorite): bool
    {
        return $this->repository->delete($favorite);
    }
}
