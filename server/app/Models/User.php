<?php

/**
 * @file User.php
 * @description Modello Eloquent per gli utenti dell'applicazione.
 * 
 * Modello predefinito Laravel per l'autenticazione utenti.
 * Attualmente non utilizzato attivamente nell'app (i preferiti
 * funzionano senza autenticazione), ma predisposto per future
 * implementazioni di login/registrazione.
 * 
 * Estende Authenticatable per supportare:
 * - Login/logout
 * - Remember me
 * - Verifica email
 * - Reset password
 */

namespace App\Models;

// Decommentare per richiedere verifica email
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * Modello User per l'autenticazione.
 * 
 * Estende Authenticatable (alias di Illuminate\Foundation\Auth\User)
 * che fornisce tutte le funzionalità di autenticazione Laravel.
 * 
 * Traits utilizzati:
 * - HasFactory: supporto per factory nei test
 * - Notifiable: supporto per notifiche (email, SMS, etc.)
 * 
 * Schema tabella 'users':
 * - id: BIGINT UNSIGNED PRIMARY KEY
 * - name: VARCHAR(255)
 * - email: VARCHAR(255) UNIQUE
 * - email_verified_at: TIMESTAMP NULLABLE
 * - password: VARCHAR(255) (hashed)
 * - remember_token: VARCHAR(100) NULLABLE
 * - created_at, updated_at: TIMESTAMP
 */
class User extends Authenticatable
{
    /**
     * Trait per supporto factory e notifiche.
     * 
     * @use HasFactory<\Database\Factories\UserFactory>
     */
    use HasFactory, Notifiable;

    /**
     * Attributi assegnabili in massa.
     * 
     * Solo questi campi possono essere popolati tramite
     * User::create([...]) o $user->fill([...]).
     * Protezione contro mass assignment vulnerability.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',     // Nome completo dell'utente
        'email',    // Indirizzo email (usato per login)
        'password', // Password hashata
    ];

    /**
     * Attributi nascosti nella serializzazione.
     * 
     * Questi campi vengono esclusi quando il modello viene
     * convertito in array o JSON (es. nelle risposte API).
     * Importante per la sicurezza.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',        // Mai esporre la password hashata
        'remember_token',  // Token per "ricordami" - sensibile
    ];

    /**
     * Definisce i cast degli attributi.
     * 
     * Specifica come certi attributi devono essere convertiti
     * quando vengono letti dal database.
     *
     * @return array<string, string> Mappa attributo => tipo di cast
     */
    protected function casts(): array
    {
        return [
            // Converte automaticamente in oggetto Carbon
            'email_verified_at' => 'datetime',
            
            // Hasha automaticamente quando viene assegnata una nuova password
            'password' => 'hashed',
        ];
    }
}
