<?php

/**
 * @file console.php
 * @description Comandi Artisan personalizzati.
 * 
 * Questo file è il punto dove definire comandi CLI personalizzati
 * usando la closure syntax di Artisan.
 * 
 * I comandi definiti qui sono eseguibili con:
 * php artisan nome-comando
 * 
 * Per comandi più complessi, si possono creare classi dedicate:
 * php artisan make:command NomeComando
 * 
 * Attualmente contiene solo il comando 'inspire' di default.
 */

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

/**
 * Comando: inspire
 * 
 * Comando di esempio che mostra una citazione ispirazionale.
 * Utile per verificare che Artisan funzioni correttamente.
 * 
 * Utilizzo: php artisan inspire
 * 
 * @example
 * $ php artisan inspire
 * "The only way to do great work is to love what you do." - Steve Jobs
 */
Artisan::command('inspire', function () {
    // $this->comment() stampa in giallo nella console
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote'); // Descrizione in php artisan list
