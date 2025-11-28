<?php

/**
 * @file cors.php
 * @description Configurazione CORS (Cross-Origin Resource Sharing) per Laravel.
 * 
 * NOTA: Questo file non è attualmente utilizzato perché l'app usa un middleware
 * CORS personalizzato in app/Http/Middleware/Cors.php che permette tutte le origini (*).
 * 
 * Configurazione mantenuta per riferimento e futuri usi in produzione.
 */

return [

    /*
    |--------------------------------------------------------------------------
    | Percorsi abilitati per CORS
    |--------------------------------------------------------------------------
    |
    | Specifica quali percorsi dell'applicazione devono includere le intestazioni CORS.
    | Il pattern 'api/*' abilita CORS per tutte le route API.
    |
    */
    'paths' => ['api/*'],

    /*
    |--------------------------------------------------------------------------
    | Metodi HTTP consentiti
    |--------------------------------------------------------------------------
    |
    | Lista dei metodi HTTP permessi nelle richieste cross-origin.
    | '*' permette tutti i metodi (GET, POST, PUT, DELETE, etc.).
    |
    */
    'allowed_methods' => ['*'],

    /*
    |--------------------------------------------------------------------------
    | Origini consentite
    |--------------------------------------------------------------------------
    |
    | Lista delle origini (domini) che possono effettuare richieste cross-origin.
    | 
    | In sviluppo con Docker:
    | - localhost:3000 - Frontend React/Vite esposto dall'host
    | - localhost:5173 - Porta interna Vite (per riferimento)
    | 
    | Nota: il middleware personalizzato attualmente permette tutte le origini (*).
    |
    */
    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ],

    /*
    |--------------------------------------------------------------------------
    | Pattern origini consentite
    |--------------------------------------------------------------------------
    |
    | Pattern regex per origini consentite. Utile per ambienti dinamici.
    |
    */
    'allowed_origins_patterns' => [],

    /*
    |--------------------------------------------------------------------------
    | Headers consentiti
    |--------------------------------------------------------------------------
    |
    | Lista degli headers HTTP che il client può inviare nelle richieste.
    | '*' permette tutti gli headers.
    |
    */
    'allowed_headers' => ['*'],

    /*
    |--------------------------------------------------------------------------
    | Headers esposti
    |--------------------------------------------------------------------------
    |
    | Headers che il server può esporre al client nella risposta.
    |
    */
    'exposed_headers' => [],

    /*
    |--------------------------------------------------------------------------
    | Max Age
    |--------------------------------------------------------------------------
    |
    | Tempo in secondi per cui il browser può cachare la risposta preflight.
    | 0 disabilita il caching.
    |
    */
    'max_age' => 0,

    /*
    |--------------------------------------------------------------------------
    | Supporto credenziali
    |--------------------------------------------------------------------------
    |
    | Se true, permette l'invio di cookies e credenziali nelle richieste CORS.
    |
    */
    'supports_credentials' => false,

];
