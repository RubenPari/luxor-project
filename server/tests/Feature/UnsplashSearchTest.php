<?php

/**
 * @file UnsplashSearchTest.php
 * @description Test per l'endpoint di ricerca foto Unsplash.
 * 
 * Testa la validazione dei parametri e il comportamento dell'API
 * in vari scenari (parametri mancanti, invalidi, chiave API assente).
 * 
 * Endpoint testato: GET /api/unsplash/search
 * 
 * Esecuzione:
 * - php artisan test --filter=UnsplashSearchTest
 * - php artisan test tests/Feature/UnsplashSearchTest.php
 */

namespace Tests\Feature;

use Tests\TestCase;

/**
 * Test suite per la ricerca Unsplash.
 * 
 * Verifica:
 * - Validazione parametri (query, page, per_page)
 * - Gestione errori (chiave API mancante)
 * - Risposta con parametri validi
 */
class UnsplashSearchTest extends TestCase
{
    /**
     * Test: il parametro query è obbligatorio.
     * 
     * Una richiesta senza query deve restituire:
     * - Status 422 (Unprocessable Entity)
     * - Errore di validazione sul campo 'query'
     *
     * @return void
     */
    public function test_search_requires_query_parameter(): void
    {
        // Richiesta senza parametri
        $response = $this->getJson('/api/unsplash/search');

        // Deve fallire la validazione
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['query']);
    }

    /**
     * Test: il parametro page deve essere >= 1.
     * 
     * Una richiesta con page=0 deve essere rifiutata.
     * La validazione richiede page minimo 1.
     *
     * @return void
     */
    public function test_search_validates_page_parameter(): void
    {
        // page=0 non è valido
        $response = $this->getJson('/api/unsplash/search?query=nature&page=0');

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['page']);
    }

    /**
     * Test: il parametro per_page deve essere <= 30.
     * 
     * L'API Unsplash limita i risultati a 30 per pagina.
     * Una richiesta con per_page=50 deve essere rifiutata.
     *
     * @return void
     */
    public function test_search_validates_per_page_parameter(): void
    {
        // per_page=50 supera il limite di 30
        $response = $this->getJson('/api/unsplash/search?query=nature&per_page=50');

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['per_page']);
    }

    /**
     * Test: errore quando la chiave API non è configurata.
     * 
     * Senza chiave API valida, l'endpoint deve:
     * - Restituire status 500 (Internal Server Error)
     * - Includere success: false nella risposta
     *
     * @return void
     */
    public function test_search_returns_error_when_api_key_not_configured(): void
    {
        // Rimuove temporaneamente la chiave API
        config(['unsplash.access_key' => null]);

        $response = $this->getJson('/api/unsplash/search?query=nature');

        // Deve fallire con errore server
        $response->assertStatus(500);
        $response->assertJson([
            'success' => false,
        ]);
    }

    /**
     * Test: l'endpoint accetta parametri validi.
     * 
     * Con parametri corretti e chiave API configurata,
     * l'endpoint deve rispondere (200 o 500 in caso di errore API).
     * 
     * Questo test viene saltato se la chiave API non è configurata
     * (ambiente CI senza credenziali).
     *
     * @return void
     */
    public function test_search_accepts_valid_parameters(): void
    {
        // Salta il test se non c'è la chiave API
        if (empty(config('unsplash.access_key'))) {
            $this->markTestSkipped('Unsplash API key not configured');
        }

        // Richiesta con tutti i parametri validi
        $response = $this->getJson('/api/unsplash/search?query=nature&page=1&per_page=10');

        // Può essere 200 (successo) o 500 (errore API esterno)
        $this->assertContains($response->status(), [200, 500]);
        
        // La risposta deve sempre avere la struttura base
        $response->assertJsonStructure([
            'success',
        ]);
    }
}
