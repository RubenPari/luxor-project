<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Log;
use Unsplash\HttpClient;
use Unsplash\Photo;
use Unsplash\Search;

class UnsplashService
{
    /**
     * Search for photos on Unsplash
     *
     * @return array{results: array, total: int, total_pages: int}
     * @throws Exception
     */
    public function searchPhotos(string $query, int $page = 1, int $perPage = 12): array
    {
        try {
            $accessKey = config('unsplash.access_key');

            if (empty($accessKey)) {
                throw new Exception('Unsplash access key is not configured');
            }

            HttpClient::init([
                'applicationId' => $accessKey,
                'utmSource' => 'Luxor Project',
            ]);

            $pageResult = Search::photos($query, $page, $perPage);
            $photos = $pageResult->getArrayObject();

            return [
                'results' => $this->formatPhotos($photos->getArrayCopy()),
                'total' => $pageResult->getTotal(),
                'total_pages' => $pageResult->getTotalPages(),
            ];
        } catch (Exception $e) {
            Log::error('Unsplash API error: '.$e->getMessage(), [
                'query' => $query,
                'page' => $page,
                'per_page' => $perPage,
            ]);

            throw $e;
        }
    }

    /**
     * Format photo data for API response
     *
     * @param  array<Photo>  $photos
     * @return array<array>
     */
    private function formatPhotos(array $photos): array
    {
        return array_map(function ($photo) {
            $photoData = $photo->toArray();

            return [
                'id' => $photoData['id'] ?? null,
                'width' => $photoData['width'] ?? null,
                'height' => $photoData['height'] ?? null,
                'description' => $photoData['description'] ?? null,
                'alt_description' => $photoData['alt_description'] ?? null,
                'urls' => [
                    'raw' => $photoData['urls']['raw'] ?? null,
                    'full' => $photoData['urls']['full'] ?? null,
                    'regular' => $photoData['urls']['regular'] ?? null,
                    'small' => $photoData['urls']['small'] ?? null,
                    'thumb' => $photoData['urls']['thumb'] ?? null,
                ],
                'links' => [
                    'self' => $photoData['links']['self'] ?? null,
                    'html' => $photoData['links']['html'] ?? null,
                    'download' => $photoData['links']['download'] ?? null,
                ],
                'user' => [
                    'id' => $photoData['user']['id'] ?? null,
                    'username' => $photoData['user']['username'] ?? null,
                    'name' => $photoData['user']['name'] ?? null,
                    'portfolio_url' => $photoData['user']['portfolio_url'] ?? null,
                    'profile_image' => $photoData['user']['profile_image']['medium'] ?? null,
                ],
                'created_at' => $photoData['created_at'] ?? null,
            ];
        }, $photos);
    }
}
