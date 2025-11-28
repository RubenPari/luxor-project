<?php

/**
 * @file ApiConstants.php
 * @description Costanti centralizzate per l'API.
 *
 * Raccoglie tutti i "magic numbers" e valori hardcoded
 * per evitare duplicazioni e migliorare la manutenibilità.
 */

namespace App\Constants;

/**
 * Costanti dell'applicazione API.
 *
 * Principio: evitare magic numbers sparsi nel codice.
 * Tutte le costanti sono definite in un unico punto.
 */
final class ApiConstants
{
    // === CORS ===

    /** Durata cache preflight CORS in secondi (24 ore) */
    public const CORS_MAX_AGE_SECONDS = 86400;

    /** Metodi HTTP permessi per CORS */
    public const CORS_ALLOWED_METHODS = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';

    /** Header permessi per CORS */
    public const CORS_ALLOWED_HEADERS = 'Content-Type, Authorization, X-Requested-With, Accept, Origin';

    // === PAGINAZIONE ===

    /** Numero di risultati per pagina di default */
    public const DEFAULT_PER_PAGE = 12;

    /** Numero massimo di risultati per pagina (limite API Unsplash) */
    public const MAX_PER_PAGE = 30;

    // === UNSPLASH ===

    /** Nome applicazione per attribuzione Unsplash */
    public const UNSPLASH_UTM_SOURCE = 'Luxor Project';
}
