<?php

/**
 * @file TestCase.php
 * @description Classe base per tutti i test dell'applicazione.
 * 
 * Estende TestCase di Laravel fornendo un punto centralizzato
 * per configurazioni comuni a tutti i test.
 * 
 * Tutti i test Feature e Unit devono estendere questa classe
 * per avere accesso ai metodi di test Laravel:
 * - $this->get(), $this->post(), etc. per HTTP tests
 * - $this->assertDatabaseHas(), etc. per DB assertions
 * - $this->actingAs() per autenticazione fake
 * 
 * Esecuzione test:
 * - php artisan test - esegue tutti i test
 * - php artisan test --filter=NomeTest - test specifico
 * - ./vendor/bin/phpunit - PHPUnit diretto
 */

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

/**
 * Classe base per i test.
 * 
 * Qui si possono aggiungere:
 * - setUp() e tearDown() comuni a tutti i test
 * - Metodi helper riutilizzabili
 * - Trait per funzionalità condivise
 * - Configurazioni database di test
 */
abstract class TestCase extends BaseTestCase
{
    // Punto di estensione per configurazioni comuni
    // Esempio: use RefreshDatabase; per reset DB tra test
}
