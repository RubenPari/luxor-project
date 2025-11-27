<?php

/**
 * @file UnsplashService.php
 * @description Servizio per l'integrazione con l'API Unsplash.
 * 
 * Questo servizio incapsula tutta la logica di comunicazione con l'API Unsplash:
 * - Inizializzazione del client HTTP con credenziali
 * - Esecuzione delle ricerche foto
 * - Formattazione dei dati per il frontend
 * 
 * Utilizza la libreria ufficiale unsplash/unsplash per le chiamate API.
 * Le credenziali vengono lette dalla configurazione (config/unsplash.php).
 */

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Log;
use Unsplash\HttpClient;
use Unsplash\Photo;
use Unsplash\Search;

/**
 * Servizio per le operazioni con l'API Unsplash.
 * 
 * Responsabilità:
 * - Gestire l'autenticazione con Unsplash
 * - Eseguire ricerche di foto
 * - Trasformare i dati nel formato richiesto dal frontend
 */
class UnsplashService
{
    /**
     * Cerca foto su Unsplash.
     * 
     * Inizializza il client Unsplash con le credenziali configurate,
     * esegue la ricerca e restituisce i risultati formattati.
     * 
     * La risposta include metadati per la paginazione lato client.
     *
     * @param string $query Termine di ricerca
     * @param int $page Numero di pagina (default: 1)
     * @param int $perPage Risultati per pagina (default: 12, max: 30)
     * @return array{results: array, total: int, total_pages: int} Risultati formattati
     * @throws Exception Se la chiave API non è configurata o la richiesta fallisce
     * 
     * @example
     * $service->searchPhotos('montagna', 1, 12);
     * // Restituisce: ['results' => [...], 'total' => 1000, 'total_pages' => 84]
     */
    public function searchPhotos(string $query, int $page = 1, int $perPage = 12): array
    {
        try {
            // Recupera la chiave API dalla configurazione
            $accessKey = config('unsplash.access_key');

            // Verifica che la chiave sia configurata
            if (empty($accessKey)) {
                throw new Exception('Unsplash access key is not configured');
            }

            // Inizializza il client HTTP Unsplash
            // utmSource è richiesto per l'attribuzione nelle statistiche Unsplash
            HttpClient::init([
                'applicationId' => $accessKey,
                'utmSource' => 'Luxor Project',
            ]);

            // Esegue la ricerca tramite la libreria Unsplash
            $pageResult = Search::photos($query, $page, $perPage);
            $photos = $pageResult->getArrayObject();

            // Restituisce i dati formattati con metadati paginazione
            return [
                'results' => $this->formatPhotos($photos->getArrayCopy()),
                'total' => $pageResult->getTotal(),
                'total_pages' => $pageResult->getTotalPages(),
            ];
        } catch (Exception $e) {
            // Logga l'errore con contesto per debugging
            Log::error('Unsplash API error: '.$e->getMessage(), [
                'query' => $query,
                'page' => $page,
                'per_page' => $perPage,
            ]);

            // Rilancia l'eccezione per gestirla nel controller
            throw $e;
        }
    }

    /**
     * Formatta i dati delle foto per la risposta API.
     * 
     * Trasforma l'array di oggetti Photo in un formato pulito
     * contenente solo i campi necessari al frontend.
     * Usa il null coalescing (??) per gestire campi mancanti.
     *
     * @param array<Photo> $photos Array di oggetti Photo da Unsplash
     * @return array<array> Array di foto formattate
     */
    private function formatPhotos(array $photos): array
    {
        return array_map(function ($photo) {
            // Converte l'oggetto Photo in array
            $photoData = $photo->toArray();

            // Estrae e struttura solo i campi necessari
            return [
                // Identificativo univoco della foto
                'id' => $photoData['id'] ?? null,
                
                // Dimensioni originali
                'width' => $photoData['width'] ?? null,
                'height' => $photoData['height'] ?? null,
                
                // Testi descrittivi
                'description' => $photoData['description'] ?? null,
                'alt_description' => $photoData['alt_description'] ?? null,
                
                // URL delle varie dimensioni dell'immagine
                'urls' => [
                    'raw' => $photoData['urls']['raw'] ?? null,       // Originale
                    'full' => $photoData['urls']['full'] ?? null,     // Alta risoluzione
                    'regular' => $photoData['urls']['regular'] ?? null, // 1080px
                    'small' => $photoData['urls']['small'] ?? null,   // 400px
                    'thumb' => $photoData['urls']['thumb'] ?? null,   // 200px
                ],
                
                // Link correlati
                'links' => [
                    'self' => $photoData['links']['self'] ?? null,       // API endpoint
                    'html' => $photoData['links']['html'] ?? null,       // Pagina web
                    'download' => $photoData['links']['download'] ?? null, // Download
                ],
                
                // Informazioni sul fotografo
                'user' => [
                    'id' => $photoData['user']['id'] ?? null,
                    'username' => $photoData['user']['username'] ?? null,
                    'name' => $photoData['user']['name'] ?? null,
                    'portfolio_url' => $photoData['user']['portfolio_url'] ?? null,
                    'profile_image' => $photoData['user']['profile_image']['medium'] ?? null,
                ],
                
                // Data di caricamento
                'created_at' => $photoData['created_at'] ?? null,
            ];
        }, $photos);
    }
}
