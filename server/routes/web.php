<?php

/**
 * @file web.php
 * @description Route web dell'applicazione.
 * 
 * Questo file contiene le route per le pagine web tradizionali
 * (non API). Queste route hanno il middleware group 'web' che
 * include: sessioni, CSRF protection, cookies.
 * 
 * In questa applicazione le route web non sono usate attivamente
 * perché il frontend è un'app React separata. L'unica route
 * definita è la homepage di default di Laravel.
 * 
 * Per applicazioni SPA come questa, tutto il traffico utente
 * passa attraverso le route API (/api/*).
 */

use Illuminate\Support\Facades\Route;

/**
 * Homepage di default.
 * 
 * Restituisce la view 'welcome' di Laravel.
 * Non usata nell'applicazione - il frontend React
 * è servito separatamente da Vite (localhost:3000).
 * 
 * @route GET /
 */
Route::get('/', function () {
    return view('welcome');
});
