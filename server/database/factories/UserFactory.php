<?php

/**
 * @file UserFactory.php
 * @description Factory per generare utenti di test.
 * 
 * Le Factory sono usate per creare istanze di modelli con dati fake
 * per testing e seeding del database.
 * 
 * Utilizzo nei test:
 * - User::factory()->create() - crea e salva nel DB
 * - User::factory()->make() - crea senza salvare
 * - User::factory()->count(10)->create() - crea 10 utenti
 * 
 * Utilizzo nei seeder:
 * - User::factory()->create(['name' => 'Admin'])
 */

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Factory per il modello User.
 * 
 * Genera dati fake realistici usando la libreria Faker.
 * La password viene hashata una sola volta e riutilizzata
 * per performance (evita hashing multipli).
 *
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Password hashata condivisa tra tutte le istanze.
     * 
     * Usa il pattern "null coalescing assignment" per hashare
     * la password solo alla prima chiamata.
     * Default: 'password'
     *
     * @var string|null
     */
    protected static ?string $password;

    /**
     * Definisce lo stato di default del modello.
     * 
     * Genera dati fake per tutti i campi dell'utente:
     * - name: nome completo fake (es. "John Doe")
     * - email: email sicura unica (es. "john.doe@example.com")
     * - email_verified_at: timestamp corrente (email verificata)
     * - password: hash di 'password'
     * - remember_token: stringa random per "ricordami"
     *
     * @return array<string, mixed> Array di attributi
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),               // Nome fake
            'email' => fake()->unique()->safeEmail(), // Email univoca
            'email_verified_at' => now(),           // Già verificato
            'password' => static::$password ??= Hash::make('password'), // Hash cached
            'remember_token' => Str::random(10),    // Token random
        ];
    }

    /**
     * Stato: email non verificata.
     * 
     * Modifica lo stato per creare utenti con email_verified_at = null.
     * Utile per testare flussi di verifica email.
     * 
     * Utilizzo: User::factory()->unverified()->create()
     *
     * @return static Factory con stato modificato
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
