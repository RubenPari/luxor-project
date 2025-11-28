<?php

/**
 * @file 2025_11_28_223000_add_user_id_to_favorites_table.php
 * @description Migrazione per aggiungere il campo user_id alla tabella 'favorites'.
 *
 * Aggiunge un identificatore utente (UUID) a ogni preferito, permettendo
 * la separazione dei dati per utente senza autenticazione tradizionale.
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migrazione: aggiunta colonna user_id nella tabella favorites.
 *
 * Aggiunge un campo stringa per l'identificatore utente univoco (UUID)
 * e crea un indice per velocizzare le query filtrate per utente.
 */
return new class extends Migration
{
    /**
     * Esegue la migrazione - aggiunge colonna user_id.
     *
     * Aggiunge a ogni riga di preferito un riferimento all'utente che l'ha creato.
     * L'identificatore arriva dal client tramite header X-User-ID.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('favorites', function (Blueprint $table) {
            // Aggiunge colonna user_id prima di created_at
            // nullable=false per garantire che ogni preferito appartenga a un utente
            $table->string('user_id', 36)->after('photo_id');
            
            // Crea un indice per velocizzare le query "WHERE user_id = ?"
            // Combinato con photo_id permette di cercare velocemente i preferiti di un utente
            $table->index('user_id');
        });
    }

    /**
     * Annulla la migrazione - rimuove colonna user_id.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('favorites', function (Blueprint $table) {
            // Rimuove l'indice
            $table->dropIndex(['user_id']);
            
            // Rimuove la colonna
            $table->dropColumn('user_id');
        });
    }
};
