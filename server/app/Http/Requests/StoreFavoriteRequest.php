<?php

/**
 * @file StoreFavoriteRequest.php
 * @description Form Request per la validazione dei dati di un nuovo preferito.
 *
 * Gestisce la validazione lato server per l'aggiunta di una foto ai preferiti.
 * Verifica che photo_id e photo_data siano presenti e nel formato corretto.
 */

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Request per la creazione di un nuovo preferito.
 *
 * Estende FormRequest per integrare la validazione automatica
 * nel ciclo di vita della richiesta Laravel.
 *
 * Se la validazione fallisce, Laravel restituisce automaticamente
 * una risposta JSON con errori 422 (Unprocessable Entity).
 */
class StoreFavoriteRequest extends FormRequest
{
    /**
     * Regole di validazione per i dati della richiesta.
     *
     * Ogni campo è validato secondo le convenzioni Laravel:
     * - required: campo obbligatorio
     * - string: deve essere una stringa
     * - array: deve essere un array/oggetto JSON
     *
     * @return array<string, ValidationRule|array|string> Mappa campo => regole
     */
    public function rules(): array
    {
        return [
            // ID univoco della foto su Unsplash
            'photo_id' => ['required', 'string'],

            // Dati completi della foto (JSON decodificato come array)
            'photo_data' => ['required', 'array'],
            'photo_data.id' => ['required', 'string'],
            'photo_data.width' => ['nullable', 'integer'],
            'photo_data.height' => ['nullable', 'integer'],
            'photo_data.description' => ['nullable', 'string'],
            'photo_data.alt_description' => ['nullable', 'string'],
            'photo_data.created_at' => ['nullable', 'string'],
            
            // URLs della foto
            'photo_data.urls' => ['required', 'array'],
            'photo_data.urls.raw' => ['nullable', 'string'],
            'photo_data.urls.full' => ['nullable', 'string'],
            'photo_data.urls.regular' => ['required', 'string'],
            'photo_data.urls.small' => ['nullable', 'string'],
            'photo_data.urls.thumb' => ['nullable', 'string'],
            
            // Links della foto
            'photo_data.links' => ['nullable', 'array'],
            'photo_data.links.self' => ['nullable', 'string'],
            'photo_data.links.html' => ['nullable', 'string'],
            'photo_data.links.download' => ['nullable', 'string'],
            
            // Informazioni utente/fotografo
            'photo_data.user' => ['required', 'array'],
            'photo_data.user.id' => ['nullable', 'string'],
            'photo_data.user.username' => ['nullable', 'string'],
            'photo_data.user.name' => ['required', 'string'],
            'photo_data.user.portfolio_url' => ['nullable', 'string'],
            'photo_data.user.profile_image' => ['nullable', 'string'],
        ];
    }

    /**
     * Messaggi di errore personalizzati per la validazione.
     *
     * Sovrascrive i messaggi di default di Laravel per fornire
     * feedback più specifici e user-friendly.
     *
     * @return array<string, string> Mappa regola.campo => messaggio
     */
    public function messages(): array
    {
        return [
            // Errori per photo_id
            'photo_id.required' => 'The photo_id field is required.',
            'photo_id.string' => 'The photo_id must be a string.',

            // Errori per photo_data
            'photo_data.required' => 'The photo_data field is required.',
            'photo_data.array' => 'The photo_data must be a valid JSON object.',
            'photo_data.id.required' => 'The photo data must contain an ID.',
            'photo_data.urls.required' => 'The photo data must contain URLs.',
            'photo_data.user.required' => 'The photo data must contain user information.',
        ];
    }
}
