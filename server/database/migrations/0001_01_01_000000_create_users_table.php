<?php

/**
 * @file 0001_01_01_000000_create_users_table.php
 * @description Migrazione per le tabelle di autenticazione utenti.
 * 
 * Questa migrazione crea le tabelle fondamentali per il sistema
 * di autenticazione Laravel:
 * - users: dati degli utenti registrati
 * - password_reset_tokens: token per il reset password
 * - sessions: sessioni attive degli utenti
 * 
 * Attualmente non usate attivamente (l'app funziona senza auth),
 * ma predisposte per future implementazioni.
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migrazione: creazione tabelle autenticazione.
 * 
 * Classe anonima per evitare conflitti di nomi con altre migrazioni.
 */
return new class extends Migration
{
    /**
     * Esegue la migrazione - crea le tabelle.
     * 
     * Crea tre tabelle correlate per l'autenticazione completa.
     *
     * @return void
     */
    public function up(): void
    {
        /**
         * Tabella 'users' - Utenti registrati.
         * 
         * Schema:
         * - id: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
         * - name: VARCHAR(255) - nome visualizzato
         * - email: VARCHAR(255) UNIQUE - email per login
         * - email_verified_at: TIMESTAMP NULLABLE - verifica email
         * - password: VARCHAR(255) - password hashata (bcrypt)
         * - remember_token: VARCHAR(100) - token "ricordami"
         * - created_at, updated_at: TIMESTAMP
         */
        Schema::create('users', function (Blueprint $table) {
            $table->id();                                    // PK auto-increment
            $table->string('name');                          // Nome utente
            $table->string('email')->unique();               // Email univoca
            $table->timestamp('email_verified_at')->nullable(); // Data verifica
            $table->string('password');                      // Password hashata
            $table->rememberToken();                         // Token "ricordami"
            $table->timestamps();                            // created_at, updated_at
        });

        /**
         * Tabella 'password_reset_tokens' - Token per reset password.
         * 
         * Memorizza i token temporanei inviati via email
         * per permettere il reset della password.
         * 
         * Schema:
         * - email: VARCHAR(255) PRIMARY KEY
         * - token: VARCHAR(255) - token hashato
         * - created_at: TIMESTAMP - per scadenza token
         */
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();   // Email come PK
            $table->string('token');              // Token hashato
            $table->timestamp('created_at')->nullable(); // Per calcolare scadenza
        });

        /**
         * Tabella 'sessions' - Sessioni utente.
         * 
         * Usata quando SESSION_DRIVER=database.
         * Memorizza i dati di sessione nel database invece che in file.
         * 
         * Schema:
         * - id: VARCHAR(255) PRIMARY KEY - session ID
         * - user_id: FK -> users.id (null se non autenticato)
         * - ip_address: VARCHAR(45) - IP del client
         * - user_agent: TEXT - browser/device info
         * - payload: LONGTEXT - dati sessione serializzati
         * - last_activity: INT - timestamp ultima attività
         */
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();               // Session ID
            $table->foreignId('user_id')->nullable()->index(); // FK utente
            $table->string('ip_address', 45)->nullable();  // IPv4/IPv6
            $table->text('user_agent')->nullable();        // Browser info
            $table->longText('payload');                   // Dati sessione
            $table->integer('last_activity')->index();     // Timestamp attività
        });
    }

    /**
     * Annulla la migrazione - elimina le tabelle.
     * 
     * Ordine importante: prima sessions (ha FK verso users),
     * poi le altre tabelle.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
