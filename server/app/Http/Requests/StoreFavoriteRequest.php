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
     * Verifica se l'utente è autorizzato a fare questa richiesta.
     * 
     * Restituisce sempre true perché l'applicazione attualmente
     * non richiede autenticazione per salvare preferiti.
     *
     * @return bool True se autorizzato
     */
    public function authorize(): bool
    {
        return true; // Nessuna autenticazione richiesta
    }

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
        ];
    }
}
