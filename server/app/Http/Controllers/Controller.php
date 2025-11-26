<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

abstract class Controller
{
    /**
     * Helper per risposte API di successo con payload consistente.
     */
    protected function success(mixed $data = null, ?string $message = null, int $status = 200): JsonResponse
    {
        $payload = [
            'success' => true,
            'data' => $data,
        ];

        if ($message !== null) {
            $payload['message'] = $message;
        }

        return response()->json($payload, $status);
    }

    /**
     * Helper per risposte API di errore con payload consistente.
     */
    protected function failure(string $message, ?string $error = null, int $status = 500): JsonResponse
    {
        $payload = [
            'success' => false,
            'message' => $message,
        ];

        if ($error !== null) {
            $payload['error'] = $error;
        }

        return response()->json($payload, $status);
    }
}
