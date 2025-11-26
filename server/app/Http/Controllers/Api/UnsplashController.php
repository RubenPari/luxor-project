<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UnsplashSearchRequest;
use App\Services\UnsplashService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class UnsplashController extends Controller
{
    public function __construct(public UnsplashService $unsplashService) {}

    /**
     * Search for photos on Unsplash
     */
    public function search(UnsplashSearchRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            $query = $validated['query'];
            $page = $validated['page'] ?? 1;
            $perPage = $validated['per_page'] ?? config('unsplash.default_per_page', 12);

            $data = $this->unsplashService->searchPhotos($query, $page, $perPage);

            return $this->success($data);
        } catch (Exception $e) {
            Log::error('Failed to search photos', [
                'exception' => $e,
                'query' => $request->input('query'),
            ]);

            return $this->failure('Failed to search photos', $e->getMessage(), 500);
        }
    }
}
