<?php

/**
 * @file AppServiceProvider.php
 * @description Service Provider principale dell'applicazione.
 * 
 * I Service Provider sono il punto centrale di bootstrap di Laravel.
 * Qui vengono registrati servizi, binding nel container IoC,
 * e configurazioni iniziali dell'applicazione.
 * 
 * Questo provider viene caricato automaticamente (config/app.php).
 */

namespace App\Providers;

use App\Contracts\FavoriteRepositoryInterface;
use App\Repositories\FavoriteRepository;
use Illuminate\Support\ServiceProvider;

/**
 * Provider principale dell'applicazione.
 * 
 * Estende ServiceProvider per fornire due metodi chiave:
 * - register(): registrazione servizi nel container (prima del boot)
 * - boot(): configurazioni dopo che tutti i provider sono registrati
 * 
 * Attualmente vuoto - l'app usa le configurazioni di default.
 * Qui si possono aggiungere:
 * - Binding di interfacce a implementazioni concrete
 * - Registrazione di singleton
 * - Configurazioni globali
 * - Macro e mixins
 */
class AppServiceProvider extends ServiceProvider
{
    /**
     * Registra i servizi dell'applicazione.
     * 
     * Chiamato PRIMA del boot di tutti i provider.
     * Usare per registrare binding nel service container.
     * 
     * Esempio di utilizzo:
     * ```php
     * $this->app->bind(Interface::class, Implementation::class);
     * $this->app->singleton(Service::class, fn() => new Service());
     * ```
     *
     * @return void
     */
    public function register(): void
    {
        // Binding interfaccia -> implementazione concreta
        // Permette di iniettare FavoriteRepositoryInterface nei controller
        $this->app->bind(
            FavoriteRepositoryInterface::class,
            FavoriteRepository::class
        );
    }

    /**
     * Esegue il bootstrap dei servizi dell'applicazione.
     * 
     * Chiamato DOPO che tutti i provider sono stati registrati.
     * Usare per configurazioni che dipendono da altri servizi.
     * 
     * Esempio di utilizzo:
     * ```php
     * View::share('appName', config('app.name'));
     * Blade::directive('datetime', fn($expr) => "<?php echo ...");
     * ```
     *
     * @return void
     */
    public function boot(): void
    {
        // Nessuna configurazione aggiuntiva al momento
    }
}
