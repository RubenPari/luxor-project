<?php

/**
 * @file UnsplashSearchRequest.php
 * @description Form Request per la validazione dei parametri di ricerca Unsplash.
 * 
 * Valida i parametri query string per l'endpoint di ricerca foto:
 * - query: termine di ricerca (obbligatorio)
 * - page: numero pagina per paginazione (opzionale)
 * - per_page: risultati per pagina (opzionale, max 30 per limite API)
 */

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Request per la ricerca foto su Unsplash.
 * 
 * Gestisce la validazione dei parametri di ricerca.
 * I parametri di paginazione sono opzionali e hanno valori
 * di default gestiti nel controller.
 */
class UnsplashSearchRequest extends FormRequest
{
    /**
     * Verifica se l'utente è autorizzato a fare questa richiesta.
     * 
     * La ricerca è pubblica - nessuna autenticazione richiesta.
     *
     * @return bool True sempre
     */
    public function authorize(): bool
    {
        return true; // Endpoint pubblico
    }

    /**
     * Regole di validazione per i parametri di ricerca.
     * 
     * Regole utilizzate:
     * - required: campo obbligatorio
     * - nullable: valida solo se presente
     * - string: deve essere una stringa
     * - integer: deve essere un intero
     * - min/max: limiti di valore o lunghezza
     *
     * @return array<string, ValidationRule|array|string> Mappa parametro => regole
     */
    public function rules(): array
    {
        return [
            // Termine di ricerca - obbligatorio, 1-255 caratteri
            'query' => ['required', 'string', 'min:1', 'max:255'],
            
            // Numero pagina - opzionale, minimo 1
            'page' => ['nullable', 'integer', 'min:1'],
            
            // Risultati per pagina - opzionale, 1-30 (limite API Unsplash)
            'per_page' => ['nullable', 'integer', 'min:1', 'max:30'],
        ];
    }

    /**
     * Messaggi di errore personalizzati per la validazione.
     * 
     * Fornisce feedback user-friendly per ogni possibile
     * errore di validazione sui parametri di ricerca.
     *
     * @return array<string, string> Mappa campo.regola => messaggio
     */
    public function messages(): array
    {
        return [
            // Errori per il campo query
            'query.required' => 'The search query is required.',
            'query.min' => 'The search query must be at least 1 character.',
            'query.max' => 'The search query must not exceed 255 characters.',
            
            // Errori per il campo page
            'page.integer' => 'The page must be a valid integer.',
            'page.min' => 'The page must be at least 1.',
            
            // Errori per il campo per_page
            'per_page.integer' => 'The per_page must be a valid integer.',
            'per_page.min' => 'The per_page must be at least 1.',
            'per_page.max' => 'The per_page must not exceed 30.',
        ];
    }
}
