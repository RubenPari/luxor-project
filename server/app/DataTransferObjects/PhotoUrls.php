<?php

/**
 * @file PhotoUrls.php
 * @description DTO per gli URL delle varie dimensioni di una foto.
 *
 * Rappresenta le diverse risoluzioni disponibili per una foto Unsplash.
 */

namespace App\DataTransferObjects;

/**
 * URL delle immagini in varie dimensioni.
 *
 * Classe readonly per immutabilità garantita (PHP 8.2+).
 */
readonly class PhotoUrls
{
    /**
     * Costruttore con property promotion.
     *
     * @param string|null $raw Immagine originale non processata
     * @param string|null $full Alta risoluzione
     * @param string|null $regular Risoluzione 1080px
     * @param string|null $small Risoluzione 400px
     * @param string|null $thumb Miniatura 200px
     */
    public function __construct(
        public ?string $raw = null,
        public ?string $full = null,
        public ?string $regular = null,
        public ?string $small = null,
        public ?string $thumb = null,
    ) {}

    /**
     * Crea un'istanza da un array associativo.
     *
     * @param array<string, string|null> $data Array con chiavi url
     * @return self Nuova istanza PhotoUrls
     */
    public static function fromArray(array $data): self
    {
        return new self(
            raw: $data['raw'] ?? null,
            full: $data['full'] ?? null,
            regular: $data['regular'] ?? null,
            small: $data['small'] ?? null,
            thumb: $data['thumb'] ?? null,
        );
    }

    /**
     * Converte in array per serializzazione JSON.
     *
     * @return array<string, string|null>
     */
    public function toArray(): array
    {
        return [
            'raw' => $this->raw,
            'full' => $this->full,
            'regular' => $this->regular,
            'small' => $this->small,
            'thumb' => $this->thumb,
        ];
    }
}
