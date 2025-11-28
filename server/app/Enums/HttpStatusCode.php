<?php

/**
 * @file HttpStatusCode.php
 * @description Enum per i codici di stato HTTP.
 *
 * Definisce i codici HTTP usati nell'applicazione come enum tipizzato.
 * Migliora la leggibilità e previene errori di battitura.
 */

namespace App\Enums;

/**
 * Codici di stato HTTP comuni.
 *
 * Backed enum con valore intero per compatibilità con le response Laravel.
 */
enum HttpStatusCode: int
{
    // === SUCCESSO (2xx) ===

    /** Richiesta completata con successo */
    case OK = 200;

    /** Risorsa creata con successo */
    case CREATED = 201;

    /** Richiesta accettata, elaborazione in corso */
    case ACCEPTED = 202;

    /** Richiesta completata, nessun contenuto da restituire */
    case NO_CONTENT = 204;

    // === ERRORI CLIENT (4xx) ===

    /** Richiesta malformata o parametri non validi */
    case BAD_REQUEST = 400;

    /** Autenticazione richiesta */
    case UNAUTHORIZED = 401;

    /** Accesso negato (autenticato ma non autorizzato) */
    case FORBIDDEN = 403;

    /** Risorsa non trovata */
    case NOT_FOUND = 404;

    /** Metodo HTTP non permesso */
    case METHOD_NOT_ALLOWED = 405;

    /** Dati non processabili (validazione fallita) */
    case UNPROCESSABLE_ENTITY = 422;

    /** Troppe richieste (rate limiting) */
    case TOO_MANY_REQUESTS = 429;

    // === ERRORI SERVER (5xx) ===

    /** Errore interno del server */
    case INTERNAL_SERVER_ERROR = 500;

    /** Servizio non disponibile */
    case SERVICE_UNAVAILABLE = 503;
}
