<?php

/**
 * @file 0001_01_01_000002_create_jobs_table.php
 * @description Migrazione per le tabelle del sistema code.
 * 
 * Crea le tabelle necessarie per il sistema di code Laravel
 * quando QUEUE_CONNECTION=database.
 * 
 * Le code permettono di eseguire task in background:
 * - Invio email
 * - Elaborazione immagini
 * - Chiamate API esterne
 * - Task lunghi che non devono bloccare la risposta HTTP
 * 
 * Attualmente non usate nell'app, ma predisposte per future
 * implementazioni (es. notifiche, elaborazioni batch).
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migrazione: creazione tabelle sistema code.
 */
return new class extends Migration
{
    /**
     * Esegue la migrazione - crea le tabelle per le code.
     *
     * @return void
     */
    public function up(): void
    {
        /**
         * Tabella 'jobs' - Job in coda.
         * 
         * Memorizza i job in attesa di essere processati.
         * Il worker (php artisan queue:work) legge da qui.
         * 
         * Schema:
         * - id: BIGINT PRIMARY KEY
         * - queue: VARCHAR(255) - nome della coda (default, emails, etc.)
         * - payload: LONGTEXT - job serializzato
         * - attempts: TINYINT - numero di tentativi effettuati
         * - reserved_at: INT - timestamp quando un worker l'ha preso
         * - available_at: INT - timestamp quando sarà disponibile
         * - created_at: INT - timestamp creazione
         */
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();                                  // PK
            $table->string('queue')->index();              // Nome coda (indicizzato)
            $table->longText('payload');                   // Job serializzato
            $table->unsignedTinyInteger('attempts');       // Tentativi (max 255)
            $table->unsignedInteger('reserved_at')->nullable(); // Quando riservato
            $table->unsignedInteger('available_at');       // Quando disponibile
            $table->unsignedInteger('created_at');         // Quando creato
        });

        /**
         * Tabella 'job_batches' - Batch di job.
         * 
         * Permette di raggruppare job correlati e monitorarli insieme.
         * Es: elaborare 100 immagini come unico batch.
         * 
         * Schema:
         * - id: VARCHAR(255) PRIMARY KEY - UUID del batch
         * - name: VARCHAR(255) - nome descrittivo
         * - total_jobs: INT - numero totale di job
         * - pending_jobs: INT - job ancora da processare
         * - failed_jobs: INT - job falliti
         * - failed_job_ids: LONGTEXT - ID dei job falliti (JSON)
         * - options: MEDIUMTEXT - opzioni serializzate
         * - cancelled_at: INT - timestamp cancellazione
         * - created_at: INT - timestamp creazione
         * - finished_at: INT - timestamp completamento
         */
        Schema::create('job_batches', function (Blueprint $table) {
            $table->string('id')->primary();               // UUID batch
            $table->string('name');                        // Nome batch
            $table->integer('total_jobs');                 // Totale job
            $table->integer('pending_jobs');               // In attesa
            $table->integer('failed_jobs');                // Falliti
            $table->longText('failed_job_ids');            // ID falliti
            $table->mediumText('options')->nullable();     // Opzioni
            $table->integer('cancelled_at')->nullable();   // Cancellato
            $table->integer('created_at');                 // Creato
            $table->integer('finished_at')->nullable();    // Completato
        });

        /**
         * Tabella 'failed_jobs' - Job falliti.
         * 
         * Memorizza i job che hanno fallito tutti i tentativi.
         * Utile per debug e retry manuale.
         * 
         * Schema:
         * - id: BIGINT PRIMARY KEY
         * - uuid: VARCHAR(255) UNIQUE - identificativo univoco
         * - connection: TEXT - nome connessione coda
         * - queue: TEXT - nome coda
         * - payload: LONGTEXT - job serializzato
         * - exception: LONGTEXT - stack trace dell'errore
         * - failed_at: TIMESTAMP - quando è fallito
         */
        Schema::create('failed_jobs', function (Blueprint $table) {
            $table->id();                                  // PK
            $table->string('uuid')->unique();              // UUID univoco
            $table->text('connection');                    // Connessione
            $table->text('queue');                         // Coda
            $table->longText('payload');                   // Job serializzato
            $table->longText('exception');                 // Stack trace
            $table->timestamp('failed_at')->useCurrent();  // Timestamp fallimento
        });
    }

    /**
     * Annulla la migrazione - elimina le tabelle code.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('job_batches');
        Schema::dropIfExists('failed_jobs');
    }
};
