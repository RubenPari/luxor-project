<?php

/**
 * @file Favorite.php
 * @description Modello Eloquent per i preferiti.
 *
 * Rappresenta una foto salvata dall'utente come preferito.
 * Memorizza l'ID della foto e tutti i metadati in formato JSON.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Modello per le foto preferite.
 *
 * Estende il Model base di Eloquent.
 *
 * Schema tabella 'favorites':
 * - id: chiave primaria auto-increment
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
        'user_id',
        'photo_id',
        'width',
        'height',
        'description',
        'alt_description',
        'url_raw',
        'url_full',
        'url_regular',
        'url_small',
        'url_thumb',
        'link_self',
        'link_html',
        'link_download',
        'user_unsplash_id',
        'user_username',
        'user_name',
        'user_portfolio_url',
        'user_profile_image',
        'photo_created_at',
    ];

    /**
     * Cast degli attributi.
     *
     * @var array<string, string> Mappa campo => tipo di cast
     */
    protected $casts = [
        'width' => 'integer',
        'height' => 'integer',
        'photo_created_at' => 'datetime',
    ];

    /**
     * Accessor per photo_data.
     * 
     * Ricostruisce l'oggetto photo_data nel formato atteso dal frontend
     * a partire dalle colonne separate del database.
     *
     * @return array<string, mixed>
     */
    protected function photoData(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(
            get: fn () => [
                'id' => $this->photo_id,
                'width' => $this->width,
                'height' => $this->height,
                'description' => $this->description,
                'alt_description' => $this->alt_description,
                'urls' => [
                    'raw' => $this->url_raw,
                    'full' => $this->url_full,
                    'regular' => $this->url_regular,
                    'small' => $this->url_small,
                    'thumb' => $this->url_thumb,
                ],
                'links' => [
                    'self' => $this->link_self,
                    'html' => $this->link_html,
                    'download' => $this->link_download,
                ],
                'user' => [
                    'id' => $this->user_unsplash_id,
                    'username' => $this->user_username,
                    'name' => $this->user_name,
                    'portfolio_url' => $this->user_portfolio_url,
                    'profile_image' => $this->user_profile_image,
                ],
                'created_at' => $this->photo_created_at?->toIso8601String(),
            ],
        );
    }

    /**
     * Aggiunge photo_data all'array di serializzazione.
     *
     * @var array<int, string>
     */
    protected $appends = ['photo_data'];
}
