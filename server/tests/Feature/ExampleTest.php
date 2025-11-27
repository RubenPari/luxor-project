<?php

/**
 * @file ExampleTest.php
 * @description Test di esempio per verificare il setup del testing.
 * 
 * I Feature Test simulano richieste HTTP complete attraverso
 * l'intera applicazione, testando l'integrazione di:
 * - Routing
 * - Middleware
 * - Controller
 * - Database (opzionale)
 * 
 * Questo file è un template per creare nuovi test.
 * Può essere cancellato o modificato.
 */

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Test di esempio - verifica funzionamento base.
 * 
 * Questo test conferma che:
 * - L'ambiente di test è configurato correttamente
 * - L'applicazione risponde alle richieste HTTP
 * - Il routing API funziona
 */
class ExampleTest extends TestCase
{
    use RefreshDatabase;
    /**
     * Test: l'API dei preferiti risponde con status 200.
     * 
     * Verifica che la route '/api/favorites' sia raggiungibile
     * e restituisca una risposta HTTP 200 (OK).
     *
     * @return void
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        // Simula una richiesta GET all'API dei preferiti
        $response = $this->get('/api/favorites');

        // Verifica che la risposta sia 200 OK
        $response->assertStatus(200);
    }
}
