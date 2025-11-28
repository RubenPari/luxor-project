<?php

/**
 * @file PhotoData.php
 * @description DTO principale per i dati di una foto Unsplash.
 *
 * Aggrega tutti i dati di una foto in un oggetto tipizzato.
 * Sostituisce gli array associativi per maggiore type safety.
 */

namespace App\DataTransferObjects;

/**
 * Dati completi di una foto Unsplash.
 *
 * Classe readonly per immutabilità garantita.
 * Utilizza composizione con altri DTO (PhotoUrls, PhotoLinks, PhotoUser).
 */
readonly class PhotoData
{
    /**
     * Costruttore con property promotion.
     *
     * @param string $id ID univoco della foto su Unsplash
     * @param int|null $width Larghezza in pixel
     * @param int|null $height Altezza in pixel
     * @param string|null $description Descrizione della foto
     * @param string|null $altDescription Testo alternativo per accessibilità
     * @param PhotoUrls $urls URL delle varie dimensioni
     * @param PhotoLinks $links Link correlati
     * @param PhotoUser $user Informazioni sul fotografo
     * @param string|null $createdAt Data di caricamento ISO 8601
     */
    public function __construct(
        public string $id,
        public ?int $width = null,
        public ?int $height = null,
        public ?string $description = null,
        public ?string $altDescription = null,
        public PhotoUrls $urls = new PhotoUrls(),
        public PhotoLinks $links = new PhotoLinks(),
        public PhotoUser $user = new PhotoUser(),
        public ?string $createdAt = null,
    ) {}

    /**
     * Crea un'istanza da un array associativo (es. risposta API Unsplash).
     *
     * @param array<string, mixed> $data Array con dati della foto
     * @return self Nuova istanza PhotoData
     */
    public static function fromArray(array $data): self
    {
        return new self(
            id: $data['id'] ?? '',
            width: $data['width'] ?? null,
            height: $data['height'] ?? null,
            description: $data['description'] ?? null,
            altDescription: $data['alt_description'] ?? null,
            urls: PhotoUrls::fromArray($data['urls'] ?? []),
            links: PhotoLinks::fromArray($data['links'] ?? []),
            user: PhotoUser::fromArray($data['user'] ?? []),
            createdAt: $data['created_at'] ?? null,
        );
    }

    /**
     * Converte in array per serializzazione JSON.
     *
     * Mantiene la struttura compatibile con il frontend esistente.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'width' => $this->width,
            'height' => $this->height,
            'description' => $this->description,
            'alt_description' => $this->altDescription,
            'urls' => $this->urls->toArray(),
            'links' => $this->links->toArray(),
            'user' => $this->user->toArray(),
            'created_at' => $this->createdAt,
        ];
    }
}
