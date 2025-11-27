<?php

/**
 * @file unsplash.php
 * @description Configurazione per l'integrazione con l'API Unsplash.
 * 
 * Questo file contiene le credenziali API e i parametri di default
 * per le ricerche foto su Unsplash.
 * 
 * Le credenziali vengono lette dalle variabili d'ambiente (.env)
 * per mantenere sicure le chiavi API.
 * 
 * Per ottenere le credenziali:
 * 1. Vai su https://unsplash.com/oauth/applications
 * 2. Crea una nuova applicazione
 * 3. Copia Access Key e Secret Key nel file .env
 * 
 * Utilizzo: config('unsplash.access_key'), config('unsplash.default_per_page')
 */

return [
    /*
    |--------------------------------------------------------------------------
    | Credenziali API Unsplash
    |--------------------------------------------------------------------------
    |
    | Chiavi di accesso per l'API Unsplash. Configurare nel file .env:
    | UNSPLASH_ACCESS_KEY=your_access_key_here
    | UNSPLASH_SECRET_KEY=your_secret_key_here
    |
    | La access_key è sufficiente per le ricerche foto.
    | La secret_key serve per operazioni autenticate (es. upload).
    |
    */

    // Chiave pubblica per le richieste API
    'access_key' => env('UNSPLASH_ACCESS_KEY'),
    
    // Chiave segreta (non usata attualmente, per future implementazioni)
    'secret_key' => env('UNSPLASH_SECRET_KEY'),

    /*
    |--------------------------------------------------------------------------
    | Parametri di Default per la Ricerca
    |--------------------------------------------------------------------------
    |
    | Valori predefiniti per le ricerche foto quando non specificati
    | nella richiesta API.
    |
    */

    // Numero di risultati per pagina di default
    // Usato quando il parametro 'per_page' non è fornito
    'default_per_page' => 12,
    
    // Limite massimo di risultati per pagina
    // Imposto dall'API Unsplash (non superare 30)
    'max_per_page' => 30,
];
