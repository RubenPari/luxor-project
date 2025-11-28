<?php

/**
 * @file PhotoUser.php
 * @description DTO per le informazioni del fotografo.
 *
 * Contiene i dati dell'utente Unsplash che ha scattato la foto.
 */

namespace App\DataTransferObjects;

/**
 * Informazioni sul fotografo.
 *
 * Classe readonly per immutabilità garantita.
 */
readonly class PhotoUser
{
    /**
     * Costruttore con property promotion.
     *
     * @param string|null $id ID univoco dell'utente su Unsplash
     * @param string|null $username Username dell'utente
     * @param string|null $name Nome visualizzato
     * @param string|null $portfolioUrl URL del portfolio
     * @param string|null $profileImage URL dell'immagine profilo
     */
    public function __construct(
        public ?string $id = null,
        public ?string $username = null,
        public ?string $name = null,
        public ?string $portfolioUrl = null,
        public ?string $profileImage = null,
    ) {}

    /**
     * Crea un'istanza da un array associativo.
     *
     * @param array<string, mixed> $data Array con dati utente
     * @return self Nuova istanza PhotoUser
     */
    public static function fromArray(array $data): self
    {
        return new self(
            id: $data['id'] ?? null,
            username: $data['username'] ?? null,
            name: $data['name'] ?? null,
            portfolioUrl: $data['portfolio_url'] ?? null,
            profileImage: $data['profile_image']['medium'] ?? $data['profile_image'] ?? null,
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
            'id' => $this->id,
            'username' => $this->username,
            'name' => $this->name,
            'portfolio_url' => $this->portfolioUrl,
            'profile_image' => $this->profileImage,
        ];
    }
}
