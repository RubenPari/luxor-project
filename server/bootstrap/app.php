<?php

/**
 * @file app.php
 * @description Bootstrap principale dell'applicazione Laravel 11.
 *
 * Questo file configura i componenti fondamentali dell'applicazione:
 * - Routing: definisce quali file contengono le route
 * - Middleware: configura i middleware globali e per gruppo
 * - Exception handling: personalizza la gestione degli errori
 *
 * Laravel 11 ha introdotto questa struttura semplificata rispetto
 * alle versioni precedenti che usavano kernel HTTP separati.
 *
 * Ordine di esecuzione:
 * 1. L'applicazione viene creata con Application::configure()
 * 2. Le route vengono caricate (web.php, api.php, console.php)
 * 3. I middleware vengono registrati
 * 4. L'handler delle eccezioni viene configurato
 * 5. L'istanza Application viene restituita
 */

use App\Http\Middleware\Cors;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

/**
 * Crea e configura l'istanza dell'applicazione Laravel.
 *
 * basePath: directory root del progetto (server/)
 * Usato per risolvere i percorsi relativi in tutta l'app.
 */
return Application::configure(basePath: dirname(__DIR__))
    /**
     * Configurazione del routing.
     *
     * Definisce i file che contengono le definizioni delle route:
     * - web: route con middleware 'web' (sessioni, CSRF, cookies)
     * - api: route con middleware 'api' (stateless, rate limiting)
     * - commands: comandi Artisan personalizzati
     */
    ->withRouting(
        web: __DIR__.'/../routes/web.php',      // Route web (non usate in questa app)
        api: __DIR__.'/../routes/api.php',      // Route API REST
        commands: __DIR__.'/../routes/console.php' // Comandi CLI
    )
    /**
     * Configurazione dei middleware.
     *
     * I middleware sono filtri che processano le richieste HTTP
     * prima che raggiungano i controller.
     *
     * prepend: aggiunge il middleware ALL'INIZIO della pipeline,
     * garantendo che CORS venga gestito prima di tutto.
     */
    ->withMiddleware(function (Middleware $middleware): void {
        // Registra il middleware CORS personalizzato per le route API
        // Necessario per permettere al frontend (localhost:5173)
        // di comunicare con il backend (localhost:8000)
        $middleware->api(prepend: [
            Cors::class,
        ]);
    })
    /**
     * Configurazione della gestione eccezioni.
     *
     * Qui si possono personalizzare:
     * - Reporting: come loggare gli errori
     * - Rendering: come mostrare gli errori all'utente
     * - Exception mapping: conversione eccezioni in risposte HTTP
     *
     * Attualmente usa la configurazione di default.
     */
    ->withExceptions(function (Exceptions $exceptions): void {
        // Configurazione di default - Laravel gestisce automaticamente
        // la conversione delle eccezioni in risposte JSON per le API
    })
    // Crea e restituisce l'istanza Application configurata
    ->create();
