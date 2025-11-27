<?php

/**
 * @file Controller.php
 * @description Controller base astratto per tutti i controller dell'applicazione.
 *
 * Fornisce metodi helper per standardizzare le risposte JSON API:
 * - success(): per risposte di successo con dati
 * - failure(): per risposte di errore con messaggi
 *
 * Tutti i controller API dovrebbero estendere questa classe per garantire
 * un formato di risposta consistente in tutta l'applicazione.
 */

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

/**
 * Controller base astratto.
 *
 * Definisce l'interfaccia comune per le risposte API JSON.
 * Il formato standard delle risposte è:
 *
 * Successo: {"success": true, "data": mixed, "message"?: string}
 * Errore:   {"success": false, "message": string, "error"?: string}
 */
abstract class Controller
{
    /**
     * Genera una risposta JSON di successo.
     *
     * Crea una risposta standardizzata per operazioni completate con successo.
     * Il campo 'message' è opzionale e viene incluso solo se fornito.
     *
     * @param mixed $data Dati da includere nella risposta (può essere null)
     * @param string|null $message Messaggio opzionale di conferma
     * @param int $status Codice HTTP (default: 200 OK)
     * @return JsonResponse Risposta JSON formattata
     *
     * @example
     * return $this->success($favorites);  // Solo dati
     * return $this->success($photo, 'Foto aggiunta ai preferiti', 201);  // Con messaggio
     */
    protected function success(mixed $data = null, ?string $message = null, int $status = 200): JsonResponse
    {
        // Costruisce il payload base
        $payload = [
            'success' => true,
            'data' => $data,
        ];

        // Aggiunge il messaggio solo se fornito
        if ($message !== null) {
            $payload['message'] = $message;
        }

        return response()->json($payload, $status);
    }

    /**
     * Genera una risposta JSON di errore.
     *
     * Crea una risposta standardizzata per operazioni fallite.
     * Il campo 'error' è opzionale e può contenere dettagli tecnici
     * (es. messaggio dell'eccezione) utili per il debug.
     *
     * @param string $message Messaggio di errore user-friendly
     * @param string|null $error Dettaglio tecnico dell'errore (opzionale)
     * @param int $status Codice HTTP di errore (default: 500 Internal Server Error)
     * @return JsonResponse Risposta JSON formattata
     *
     * @example
     * return $this->failure('Preferito non trovato', null, 404);
     * return $this->failure('Errore database', $e->getMessage(), 500);
     */
    protected function failure(string $message, ?string $error = null, int $status = 500): JsonResponse
    {
        // Costruisce il payload base
        $payload = [
            'success' => false,
            'message' => $message,
        ];

        // Aggiunge i dettagli dell'errore solo se forniti
        if ($error !== null) {
            $payload['error'] = $error;
        }

        return response()->json($payload, $status);
    }
}
