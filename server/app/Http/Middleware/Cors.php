<?php

/**
 * @file Cors.php
 * @description Middleware personalizzato per la gestione CORS.
 *
 * Questo middleware aggiunge gli header HTTP necessari per permettere
 * le richieste cross-origin dal frontend React al backend Laravel.
 *
 * Registrato in bootstrap/app.php come middleware globale per le API.
 */

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware CORS (Cross-Origin Resource Sharing).
 *
 * Gestisce le richieste cross-origin in due modi:
 * 1. Risponde alle richieste preflight OPTIONS con status 200
 * 2. Aggiunge gli header CORS a tutte le risposte
 *
 * Header aggiunti:
 * - Access-Control-Allow-Origin: * (tutte le origini)
 * - Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
 * - Access-Control-Allow-Headers: Content-Type, Authorization, etc.
 * - Access-Control-Max-Age: 86400 (cache preflight per 24 ore)
 */
class Cors
{
    /**
     * Gestisce una richiesta HTTP in arrivo.
     *
     * Intercetta tutte le richieste per:
     * - Rispondere immediatamente alle preflight OPTIONS
     * - Aggiungere header CORS alle risposte normali
     *
     * @param Request $request La richiesta HTTP in arrivo
     * @param Closure $next Il prossimo middleware nella pipeline
     * @return Response La risposta con header CORS
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Le richieste preflight OPTIONS vengono inviate dal browser
        // prima delle richieste effettive per verificare i permessi CORS.
        // Rispondiamo subito con 200 OK senza processare ulteriormente.
        if ($request->isMethod('OPTIONS')) {
            $response = response('', 200);
        } else {
            // Per tutte le altre richieste, procediamo con la pipeline
            $response = $next($request);
        }

        // Aggiungiamo gli header CORS a TUTTE le risposte

        // Permette richieste da qualsiasi origine
        // In produzione, limitare a domini specifici
        $response->headers->set('Access-Control-Allow-Origin', '*');

        // Metodi HTTP consentiti
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

        // Header che il client può inviare
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');

        // Tempo di cache per le risposte preflight (24 ore in secondi)
        // Riduce il numero di richieste OPTIONS ripetute
        $response->headers->set('Access-Control-Max-Age', '86400');

        return $response;
    }
}
