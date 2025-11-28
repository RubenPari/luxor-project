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

use App\Constants\ApiConstants;
use App\DataTransferObjects\PhotoData;
use Exception;
use Illuminate\Support\Facades\Log;
use Unsplash\HttpClient;
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
    public function searchPhotos(string $query, int $page = 1, int $perPage = ApiConstants::DEFAULT_PER_PAGE): array
    {
        try {
            $accessKey = config('unsplash.access_key');

            if (empty($accessKey)) {
                throw new Exception('Unsplash access key is not configured');
            }

            HttpClient::init([
                'applicationId' => $accessKey,
                'utmSource' => ApiConstants::UNSPLASH_UTM_SOURCE,
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
     * Converte gli oggetti Photo in DTO PhotoData tipizzati,
     * poi li serializza in array per la risposta JSON.
     *
     * @param array $photos Array di oggetti Photo da Unsplash
     * @return array<array> Array di foto formattate
     */
    private function formatPhotos(array $photos): array
    {
        return array_map(function ($photo): array {
            $photoData = $photo->toArray();

            return PhotoData::fromArray($photoData)->toArray();
        }, $photos);
    }
}
