<?php

/**
 * @file PhotoLinks.php
 * @description DTO per i link correlati a una foto.
 *
 * Contiene i link API, pagina web e download di una foto Unsplash.
 */

namespace App\DataTransferObjects;

/**
 * Link correlati a una foto.
 *
 * Classe readonly per immutabilità garantita.
 */
readonly class PhotoLinks
{
    /**
     * Costruttore con property promotion.
     *
     * @param string|null $self Endpoint API della foto
     * @param string|null $html Pagina web su Unsplash
     * @param string|null $download URL per il download
     */
    public function __construct(
        public ?string $self = null,
        public ?string $html = null,
        public ?string $download = null,
    ) {}

    /**
     * Crea un'istanza da un array associativo.
     *
     * @param array<string, string|null> $data Array con chiavi link
     * @return self Nuova istanza PhotoLinks
     */
    public static function fromArray(array $data): self
    {
        return new self(
            self: $data['self'] ?? null,
            html: $data['html'] ?? null,
            download: $data['download'] ?? null,
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
            'self' => $this->self,
            'html' => $this->html,
            'download' => $this->download,
        ];
    }
}
