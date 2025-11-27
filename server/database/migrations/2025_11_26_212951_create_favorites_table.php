<?php

/**
 * @file 2025_11_26_212951_create_favorites_table.php
 * @description Migrazione per creare la tabella 'favorites'.
 * 
 * Crea la struttura per memorizzare le foto salvate come preferiti.
 * Supporta l'associazione opzionale con un utente per future
 * implementazioni di autenticazione.
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migrazione: creazione tabella favorites.
 * 
 * Classe anonima che estende Migration.
 * Definisce up() per creare e down() per eliminare la tabella.
 */
return new class extends Migration
{
    /**
     * Esegue la migrazione - crea la tabella favorites.
     * 
     * Schema della tabella:
     * - id: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
     * - user_id: BIGINT UNSIGNED NULLABLE (FK -> users.id)
     * - photo_id: VARCHAR(255) - ID Unsplash della foto
     * - photo_data: JSON - metadati completi della foto
     * - created_at: TIMESTAMP - data aggiunta ai preferiti
     * - updated_at: TIMESTAMP - ultima modifica
     * 
     * Vincoli:
     * - UNIQUE (user_id, photo_id): previene duplicati per utente
     * - FK user_id -> users.id con CASCADE on DELETE
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            // Chiave primaria auto-incrementante
            $table->id();
            
            // Foreign key opzionale verso tabella users
            // nullable(): permette preferiti senza autenticazione
            // constrained(): crea FK verso users.id
            // onDelete('cascade'): elimina preferiti se l'utente viene eliminato
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            
            // ID univoco della foto su Unsplash (es: "abc123XYZ")
            $table->string('photo_id');
            
            // Dati completi della foto in formato JSON
            // Include: urls, user info, description, dimensioni, etc.
            $table->json('photo_data');
            
            // Timestamp automatici created_at e updated_at
            $table->timestamps();
            
            // Vincolo di unicità composto
            // Previene che lo stesso utente salvi la stessa foto più volte
            // Per utenti null, ogni photo_id deve comunque essere unico
            $table->unique(['user_id', 'photo_id']);
        });
    }

    /**
     * Annulla la migrazione - elimina la tabella favorites.
     * 
     * Chiamato quando si esegue `php artisan migrate:rollback`.
     * Elimina completamente la tabella e tutti i dati.
     *
     * @return void
     */
    public function down(): void
    {
        // Elimina la tabella se esiste
        Schema::dropIfExists('favorites');
    }
};
