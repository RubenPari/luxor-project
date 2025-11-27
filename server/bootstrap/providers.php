<?php

/**
 * @file providers.php
 * @description Registro dei Service Provider dell'applicazione.
 * 
 * I Service Provider sono classi responsabili del bootstrap
 * dei vari componenti dell'applicazione.
 * 
 * Laravel carica automaticamente questi provider all'avvio:
 * 1. Chiama register() su tutti i provider
 * 2. Chiama boot() su tutti i provider
 * 
 * Provider di default di Laravel (caricati automaticamente):
 * - EventServiceProvider
 * - RouteServiceProvider
 * - AuthServiceProvider
 * - etc.
 * 
 * Qui si registrano solo i provider personalizzati dell'app.
 */

return [
    // Provider principale dell'applicazione
    // Usato per binding custom nel service container
    App\Providers\AppServiceProvider::class,
];
