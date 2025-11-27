<?php

/**
 * @file 0001_01_01_000001_create_cache_table.php
 * @description Migrazione per le tabelle di cache.
 * 
 * Crea le tabelle necessarie quando CACHE_DRIVER=database.
 * Permette di usare il database come sistema di caching
 * invece di file, Redis o Memcached.
 * 
 * Utile per:
 * - Hosting condiviso senza Redis/Memcached
 * - Ambienti dove la cache deve persistere tra deploy
 * - Debug della cache (dati ispezionabili via SQL)
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migrazione: creazione tabelle cache.
 */
return new class extends Migration
{
    /**
     * Esegue la migrazione - crea le tabelle cache.
     *
     * @return void
     */
    public function up(): void
    {
        /**
         * Tabella 'cache' - Dati in cache.
         * 
         * Memorizza coppie chiave-valore con scadenza.
         * 
         * Schema:
         * - key: VARCHAR(255) PRIMARY KEY - chiave univoca
         * - value: MEDIUMTEXT - valore serializzato
         * - expiration: INT - timestamp UNIX di scadenza
         */
        Schema::create('cache', function (Blueprint $table) {
            $table->string('key')->primary();    // Chiave cache univoca
            $table->mediumText('value');         // Valore serializzato
            $table->integer('expiration');       // Timestamp scadenza
        });

        /**
         * Tabella 'cache_locks' - Lock atomici per cache.
         * 
         * Usata per implementare lock distribuiti e prevenire
         * race condition quando più processi accedono alla stessa chiave.
         * 
         * Schema:
         * - key: VARCHAR(255) PRIMARY KEY - chiave del lock
         * - owner: VARCHAR(255) - identificativo del processo proprietario
         * - expiration: INT - timestamp scadenza lock
         */
        Schema::create('cache_locks', function (Blueprint $table) {
            $table->string('key')->primary();    // Chiave lock
            $table->string('owner');             // Proprietario del lock
            $table->integer('expiration');       // Scadenza automatica
        });
    }

    /**
     * Annulla la migrazione - elimina le tabelle cache.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('cache');
        Schema::dropIfExists('cache_locks');
    }
};
