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

// Decommentare per resettare il DB tra i test
// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Test di esempio - verifica funzionamento base.
 * 
 * Questo test conferma che:
 * - L'ambiente di test è configurato correttamente
 * - L'applicazione risponde alle richieste HTTP
 * - Il routing base funziona
 */
class ExampleTest extends TestCase
{
    /**
     * Test: la homepage risponde con status 200.
     * 
     * Verifica che la route '/' sia raggiungibile e restituisca
     * una risposta HTTP 200 (OK).
     * 
     * Metodo di test:
     * - $this->get('/') simula una richiesta GET
     * - assertStatus() verifica il codice HTTP
     *
     * @return void
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        // Simula una richiesta GET alla homepage
        $response = $this->get('/');

        // Verifica che la risposta sia 200 OK
        $response->assertStatus(200);
    }
}
