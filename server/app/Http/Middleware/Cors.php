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

use App\Constants\ApiConstants;
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
        // Guard clause: preflight OPTIONS risponde subito
        if ($request->isMethod('OPTIONS')) {
            return $this->addCorsHeaders(response('', 200));
        }

        return $this->addCorsHeaders($next($request));
    }

    /**
     * Aggiunge gli header CORS alla risposta.
     *
     * @param Response $response La risposta da modificare
     * @return Response La risposta con header CORS
     */
    private function addCorsHeaders(Response $response): Response
    {
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', ApiConstants::CORS_ALLOWED_METHODS);
        $response->headers->set('Access-Control-Allow-Headers', ApiConstants::CORS_ALLOWED_HEADERS);
        $response->headers->set('Access-Control-Max-Age', (string) ApiConstants::CORS_MAX_AGE_SECONDS);

        return $response;
    }
}
