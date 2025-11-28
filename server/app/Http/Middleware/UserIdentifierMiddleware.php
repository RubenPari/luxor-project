<?php

/**
 * @file UserIdentifierMiddleware.php
 * @description Middleware per validare l'header X-User-ID contenente l'identificatore utente.
 *
 * Estrae e valida l'UUID dell'utente dall'header, rendendo disponibile
 * via request()->header('X-User-ID') per i controller.
 */

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware per la validazione dell'identificatore utente.
 *
 * Controlla che ogni richiesta API contenga un header X-User-ID valido
 * e restituisce un errore 400 se manca o è invalido.
 */
class UserIdentifierMiddleware
{
    /**
     * Pattern regex per validare un UUID versione 4.
     * Formato: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
     * dove x è esadecimale e y è [8,9,a,b].
     */
    private const UUID_PATTERN = '/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i';

    /**
     * Processa la richiesta in ingresso.
     *
     * @param Request $request Richiesta HTTP in ingresso
     * @param Closure $next Callback per continuare con il middleware successivo
     * @return Response Risposta HTTP
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Estrae l'header X-User-ID
        $userId = $request->header('X-User-ID');

        // Controlla che l'header sia presente
        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'Missing X-User-ID header',
                'error' => 'The X-User-ID header is required',
            ], 400);
        }

        // Valida il formato UUID
        if (!preg_match(self::UUID_PATTERN, $userId)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid X-User-ID format',
                'error' => 'X-User-ID must be a valid UUID',
            ], 400);
        }

        // Continua con il middleware successivo
        return $next($request);
    }
}
