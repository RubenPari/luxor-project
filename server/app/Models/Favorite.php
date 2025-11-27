<?php

/**
 * @file Favorite.php
 * @description Modello Eloquent per i preferiti.
 * 
 * Rappresenta una foto salvata dall'utente come preferito.
 * Memorizza l'ID della foto e tutti i metadati in formato JSON
 * per consentire la visualizzazione offline senza richiamare l'API.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modello per le foto preferite.
 * 
 * Estende il Model base di Eloquent.
 * Ogni preferito è associato opzionalmente a un utente.
 * 
 * Schema tabella 'favorites':
 * - id: chiave primaria auto-increment
 * - user_id: FK opzionale verso users (per future implementazioni auth)
 * - photo_id: ID univoco Unsplash della foto
 * - photo_data: JSON con tutti i metadati della foto
 * - created_at, updated_at: timestamp automatici
 */
class Favorite extends Model
{
    /**
     * Attributi assegnabili in massa.
     * 
     * Definisce i campi che possono essere popolati tramite
     * Favorite::create([...]) o $favorite->fill([...]).
     *
     * @var array<int, string> Lista dei nomi dei campi fillable
     */
    protected $fillable = [
        'user_id',    // ID utente (opzionale, per auth futura)
        'photo_id',   // ID univoco Unsplash (es: "abc123")
        'photo_data', // JSON completo dei dati foto
    ];

    /**
     * Cast degli attributi.
     * 
     * Converte automaticamente photo_data da JSON a array PHP
     * quando viene letto, e da array a JSON quando viene salvato.
     *
     * @var array<string, string> Mappa campo => tipo di cast
     */
    protected $casts = [
        'photo_data' => 'array', // JSON <-> array automatico
    ];

    /**
     * Relazione con l'utente proprietario.
     * 
     * Definisce la relazione belongsTo verso il modello User.
     * Attualmente opzionale (user_id può essere null).
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
