<?php

/**
 * @file 2025_11_26_212951_create_favorites_table.php
 * @description Migrazione per creare la tabella 'favorites'.
 *
 * Crea la struttura per memorizzare le foto salvate come preferiti.
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
     * - photo_id: VARCHAR(255) UNIQUE - ID Unsplash della foto
     * - photo_data: JSON - metadati completi della foto
     * - created_at: TIMESTAMP - data aggiunta ai preferiti
     * - updated_at: TIMESTAMP - ultima modifica
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            // Chiave primaria auto-incrementante
            $table->id();

            // ID univoco della foto su Unsplash (es: "abc123XYZ")
            // unique(): previene duplicati della stessa foto
            $table->string('photo_id')->unique();

            // Dati completi della foto in formato JSON
            // Include: urls, user info, description, dimensioni, etc.
            $table->json('photo_data');

            // Timestamp automatici created_at e updated_at
            $table->timestamps();
        });
    }

    /**
     * Annulla la migrazione - elimina la tabella favorites.
     *
     * Chiamato quando si esegue `php artisan migrate:rollback`.
     * Elimina la tabella e tutti i dati.
     *
     * @return void
     */
    public function down(): void
    {
        // Elimina la tabella se esiste
        Schema::dropIfExists('favorites');
    }
};
