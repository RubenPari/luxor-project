<?php

/**
 * @file DatabaseSeeder.php
 * @description Seeder principale per popolare il database.
 * 
 * I Seeder vengono usati per inserire dati iniziali nel database.
 * Utili per:
 * - Ambiente di sviluppo con dati di test
 * - Dati di default necessari all'applicazione
 * - Setup iniziale dopo il deploy
 * 
 * Esecuzione:
 * - php artisan db:seed - esegue tutti i seeder
 * - php artisan db:seed --class=NomeSeeder - esegue seeder specifico
 * - php artisan migrate:fresh --seed - reset DB + seed
 */

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

/**
 * Seeder principale del database.
 * 
 * Punto di ingresso per il seeding. Può chiamare altri seeder
 * tramite $this->call([AltroSeeder::class]).
 */
class DatabaseSeeder extends Seeder
{
    /**
     * Trait per disabilitare eventi model durante il seeding.
     * 
     * Migliora le performance evitando l'esecuzione di observer,
     * eventi created/updated, e altre operazioni automatiche.
     */
    use WithoutModelEvents;

    /**
     * Popola il database con dati iniziali.
     * 
     * Crea un utente di test con credenziali note per
     * facilitare il login durante lo sviluppo.
     * 
     * Credenziali utente test:
     * - Email: test@example.com
     * - Password: password (definita in UserFactory)
     *
     * @return void
     */
    public function run(): void
    {
        // Decommentare per creare 10 utenti random
        // User::factory(10)->create();

        // Crea un utente di test con dati noti
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
