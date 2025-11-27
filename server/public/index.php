<?php

/**
 * @file index.php
 * @description Front controller dell'applicazione Laravel.
 * 
 * Questo è il punto di ingresso per TUTTE le richieste HTTP.
 * Il web server (Apache/Nginx/PHP built-in) deve essere configurato
 * per dirigere tutte le richieste a questo file.
 * 
 * Flusso di esecuzione:
 * 1. Registra il timestamp di avvio (per performance metrics)
 * 2. Verifica se l'app è in maintenance mode
 * 3. Carica l'autoloader Composer
 * 4. Inizializza l'applicazione Laravel
 * 5. Gestisce la richiesta HTTP e invia la risposta
 * 
 * Nota: questo file dovrebbe essere l'unico PHP accessibile pubblicamente.
 * Tutti gli altri file PHP devono stare fuori dalla cartella public/.
 */

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

/**
 * Timestamp di avvio dell'applicazione.
 * 
 * Usato per calcolare il tempo totale di esecuzione della richiesta.
 * Accessibile in tutta l'app tramite la costante LARAVEL_START.
 */
define('LARAVEL_START', microtime(true));

/**
 * Verifica maintenance mode.
 * 
 * Se esiste il file maintenance.php, l'app è in manutenzione.
 * Creato con: php artisan down
 * Rimosso con: php artisan up
 * 
 * Il file maintenance.php contiene la risposta HTTP da mostrare
 * agli utenti durante la manutenzione (status 503).
 */
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

/**
 * Carica l'autoloader Composer.
 * 
 * Registra il class autoloading PSR-4 per tutte le dipendenze
 * e per i namespace dell'applicazione (App\, Database\, Tests\).
 */
require __DIR__.'/../vendor/autoload.php';

/**
 * Inizializza e gestisce la richiesta.
 * 
 * 1. Carica l'istanza Application da bootstrap/app.php
 * 2. Cattura la richiesta HTTP corrente
 * 3. La passa attraverso middleware e router
 * 4. Invia la risposta al client
 * 
 * @var Application $app Istanza dell'applicazione Laravel
 */
$app = require_once __DIR__.'/../bootstrap/app.php';

// Gestisce la richiesta e invia la risposta
$app->handleRequest(Request::capture());
