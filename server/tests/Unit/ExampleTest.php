<?php

/**
 * @file ExampleTest.php
 * @description Test unitario di esempio.
 * 
 * I test unitari testano singole unità di codice (classi, metodi)
 * in isolamento, senza dipendenze esterne come database o HTTP.
 * 
 * A differenza dei Feature Test:
 * - Non caricano l'intera applicazione Laravel
 * - Sono più veloci da eseguire
 * - Estendono PHPUnit\Framework\TestCase direttamente
 * 
 * Uso tipico:
 * - Testare logica di business pura
 * - Testare helper e utility
 * - Testare trasformazioni dati
 */

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

/**
 * Test unitario di esempio.
 * 
 * Questo test verifica solo che PHPUnit funzioni correttamente.
 * Può essere cancellato o usato come template.
 */
class ExampleTest extends TestCase
{
    /**
     * Test: verifica che true sia true.
     * 
     * Test minimale per confermare che:
     * - PHPUnit è installato correttamente
     * - La suite di test funziona
     * - L'assertion base funziona
     * 
     * Questo test non dovrebbe mai fallire!
     *
     * @return void
     */
    public function test_that_true_is_true(): void
    {
        // Asserzione sempre vera - test di sanità
        $this->assertTrue(true);
    }
}
