<?php

/**
 * @file UnsplashController.php
 * @description Controller API per la ricerca di foto su Unsplash.
 * 
 * Espone l'endpoint per cercare foto sulla piattaforma Unsplash.
 * Delega la logica di business al servizio UnsplashService.
 * 
 * Endpoint:
 * - GET /api/unsplash/search?query=...&page=...&per_page=...
 */

namespace App\Http\Controllers\Api;

use App\Constants\ApiConstants;
use App\Http\Controllers\Controller;
use App\Http\Requests\UnsplashSearchRequest;
use App\Services\UnsplashService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

/**
 * Controller per l'integrazione con l'API Unsplash.
 * 
 * Utilizza dependency injection per ricevere il servizio UnsplashService.
 * Gestisce la validazione tramite UnsplashSearchRequest e delega
 * la comunicazione con l'API esterna al servizio dedicato.
 */
class UnsplashController extends Controller
{
    /**
     * Costruttore con dependency injection.
     * 
     * PHP 8 constructor property promotion: il servizio viene
     * automaticamente assegnato alla proprietà pubblica $unsplashService.
     *
     * @param UnsplashService $unsplashService Servizio per l'API Unsplash
     */
    public function __construct(public UnsplashService $unsplashService) {}

    /**
     * Cerca foto su Unsplash.
     * 
     * Riceve una query di ricerca e parametri di paginazione opzionali.
     * La validazione è gestita automaticamente da UnsplashSearchRequest.
     * 
     * Restituisce:
     * - results: array di foto formattate
     * - total: numero totale di risultati
     * - total_pages: numero totale di pagine
     *
     * @param UnsplashSearchRequest $request Richiesta validata
     * @return JsonResponse Risultati della ricerca o errore
     * 
     * @example GET /api/unsplash/search?query=montagna
     * @example GET /api/unsplash/search?query=tramonto&page=2&per_page=20
     */
    public function search(UnsplashSearchRequest $request): JsonResponse
    {
        try {
            // Estrae i parametri validati
            $validated = $request->validated();

            // Parametri di ricerca con valori di default
            $query = $validated['query'];
            $page = $validated['page'] ?? 1;
            $perPage = $validated['per_page'] ?? config('unsplash.default_per_page', ApiConstants::DEFAULT_PER_PAGE);

            // Delega al servizio la chiamata all'API Unsplash
            $data = $this->unsplashService->searchPhotos($query, $page, $perPage);

            return $this->success($data);
        } catch (Exception $e) {
            // Logga l'errore per debugging
            Log::error('Failed to search photos', [
                'exception' => $e,
                'query' => $request->input('query'),
            ]);

            return $this->failure('Failed to search photos', $e->getMessage(), 500);
        }
    }
}
