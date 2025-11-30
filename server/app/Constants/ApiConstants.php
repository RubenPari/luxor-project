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
    // === PAGINAZIONE ===

    /** Numero di risultati per pagina di default */
    public const DEFAULT_PER_PAGE = 12;

    /** Numero massimo di risultati per pagina (limite API Unsplash) */
    public const MAX_PER_PAGE = 30;

    // === UNSPLASH ===

    /** Nome applicazione per attribuzione Unsplash */
    public const UNSPLASH_UTM_SOURCE = 'Luxor Project';

    /** Durata cache risultati ricerca Unsplash in secondi (1 ora) */
    public const UNSPLASH_CACHE_TTL = 3600;
}
