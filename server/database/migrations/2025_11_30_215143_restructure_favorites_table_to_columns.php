<?php

/**
 * @file 2025_11_30_215143_restructure_favorites_table_to_columns.php
 * @description Migrazione per ristrutturare la tabella favorites.
 *
 * Sostituisce il campo JSON photo_data con colonne separate per ogni campo,
 * migliorando le performance delle query e la manutenibilità.
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Esegue la migrazione - ristruttura la tabella favorites.
     *
     * 1. Backup dei dati esistenti
     * 2. Aggiunge le nuove colonne
     * 3. Migra i dati dal JSON alle nuove colonne
     * 4. Rimuove la colonna photo_data JSON
     *
     * @return void
     */
    public function up(): void
    {
        // STEP 1: Aggiungere nuove colonne alla tabella
        Schema::table('favorites', function (Blueprint $table) {
            // Metadati base della foto
            $table->integer('width')->nullable()->after('user_id');
            $table->integer('height')->nullable()->after('width');
            $table->text('description')->nullable()->after('height');
            $table->text('alt_description')->nullable()->after('description');
            
            // URLs della foto (diverse risoluzioni)
            $table->text('url_raw')->nullable()->after('alt_description');
            $table->text('url_full')->nullable()->after('url_raw');
            $table->text('url_regular')->nullable()->after('url_full');
            $table->text('url_small')->nullable()->after('url_regular');
            $table->text('url_thumb')->nullable()->after('url_small');
            
            // Links correlati alla foto
            $table->text('link_self')->nullable()->after('url_thumb');
            $table->text('link_html')->nullable()->after('link_self');
            $table->text('link_download')->nullable()->after('link_html');
            
            // Informazioni fotografo
            $table->string('user_unsplash_id')->nullable()->after('link_download');
            $table->string('user_username')->nullable()->after('user_unsplash_id');
            $table->string('user_name')->nullable()->after('user_username');
            $table->text('user_portfolio_url')->nullable()->after('user_name');
            $table->text('user_profile_image')->nullable()->after('user_portfolio_url');
            
            // Data creazione foto su Unsplash
            $table->timestamp('photo_created_at')->nullable()->after('user_profile_image');
        });
        
        // STEP 2: Migrare i dati esistenti dal JSON alle nuove colonne
        $favorites = DB::table('favorites')->get();
        
        foreach ($favorites as $favorite) {
            $photoData = json_decode($favorite->photo_data, true);
            
            if ($photoData) {
                DB::table('favorites')
                    ->where('id', $favorite->id)
                    ->update([
                        'width' => $photoData['width'] ?? null,
                        'height' => $photoData['height'] ?? null,
                        'description' => $photoData['description'] ?? null,
                        'alt_description' => $photoData['alt_description'] ?? null,
                        
                        'url_raw' => $photoData['urls']['raw'] ?? null,
                        'url_full' => $photoData['urls']['full'] ?? null,
                        'url_regular' => $photoData['urls']['regular'] ?? null,
                        'url_small' => $photoData['urls']['small'] ?? null,
                        'url_thumb' => $photoData['urls']['thumb'] ?? null,
                        
                        'link_self' => $photoData['links']['self'] ?? null,
                        'link_html' => $photoData['links']['html'] ?? null,
                        'link_download' => $photoData['links']['download'] ?? null,
                        
                        'user_unsplash_id' => $photoData['user']['id'] ?? null,
                        'user_username' => $photoData['user']['username'] ?? null,
                        'user_name' => $photoData['user']['name'] ?? null,
                        'user_portfolio_url' => $photoData['user']['portfolio_url'] ?? null,
                        'user_profile_image' => $photoData['user']['profile_image'] ?? null,
                        
                        'photo_created_at' => isset($photoData['created_at']) 
                            ? date('Y-m-d H:i:s', strtotime($photoData['created_at']))
                            : null,
                    ]);
            }
        }
        
        // STEP 3: Rimuovere la vecchia colonna photo_data
        Schema::table('favorites', function (Blueprint $table) {
            $table->dropColumn('photo_data');
        });
    }

    /**
     * Annulla la migrazione - ripristina la struttura originale.
     *
     * Ricrea la colonna photo_data JSON e rimuove le colonne separate.
     * ATTENZIONE: questa operazione comporta perdita di dati se eseguita
     * dopo aver aggiunto nuovi preferiti con la nuova struttura.
     *
     * @return void
     */
    public function down(): void
    {
        // STEP 1: Riaggiungere la colonna photo_data
        Schema::table('favorites', function (Blueprint $table) {
            $table->json('photo_data')->after('user_id');
        });
        
        // STEP 2: Ricostruire i dati JSON dalle colonne separate
        $favorites = DB::table('favorites')->get();
        
        foreach ($favorites as $favorite) {
            $photoData = [
                'id' => $favorite->photo_id,
                'width' => $favorite->width,
                'height' => $favorite->height,
                'description' => $favorite->description,
                'alt_description' => $favorite->alt_description,
                'urls' => [
                    'raw' => $favorite->url_raw,
                    'full' => $favorite->url_full,
                    'regular' => $favorite->url_regular,
                    'small' => $favorite->url_small,
                    'thumb' => $favorite->url_thumb,
                ],
                'links' => [
                    'self' => $favorite->link_self,
                    'html' => $favorite->link_html,
                    'download' => $favorite->link_download,
                ],
                'user' => [
                    'id' => $favorite->user_unsplash_id,
                    'username' => $favorite->user_username,
                    'name' => $favorite->user_name,
                    'portfolio_url' => $favorite->user_portfolio_url,
                    'profile_image' => $favorite->user_profile_image,
                ],
                'created_at' => $favorite->photo_created_at,
            ];
            
            DB::table('favorites')
                ->where('id', $favorite->id)
                ->update(['photo_data' => json_encode($photoData)]);
        }
        
        // STEP 3: Rimuovere le colonne separate
        Schema::table('favorites', function (Blueprint $table) {
            $table->dropColumn([
                'width', 'height', 'description', 'alt_description',
                'url_raw', 'url_full', 'url_regular', 'url_small', 'url_thumb',
                'link_self', 'link_html', 'link_download',
                'user_unsplash_id', 'user_username', 'user_name', 
                'user_portfolio_url', 'user_profile_image',
                'photo_created_at'
            ]);
        });
    }
};
