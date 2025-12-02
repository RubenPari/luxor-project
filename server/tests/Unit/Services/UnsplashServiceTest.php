<?php

namespace Tests\Unit\Services;

use App\Services\UnsplashService;
use Exception;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

/**
 * Test unitari per UnsplashService.
 *
 * Verifica la logica di ricerca e formattazione delle foto.
 */
class UnsplashServiceTest extends TestCase
{
    private UnsplashService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new UnsplashService();
    }

    public function test_search_throws_exception_when_api_key_not_configured(): void
    {
        // Rimuove la chiave API
        config(['unsplash.access_key' => null]);

        $this->expectException(Exception::class);
        $this->expectExceptionMessage('Unsplash access key is not configured');

        $this->service->searchPhotos('test');
    }

    public function test_search_uses_cache(): void
    {
        $cachedResult = [
            'results' => [],
            'total' => 0,
            'total_pages' => 0,
        ];

        // Pre-popola la cache
        $cacheKey = 'unsplash_search_test_1_12';
        Cache::put($cacheKey, $cachedResult, 3600);

        $result = $this->service->searchPhotos('test', 1, 12);

        $this->assertEquals($cachedResult, $result);
    }

    public function test_search_cache_key_format(): void
    {
        $cachedResult = [
            'results' => [],
            'total' => 0,
            'total_pages' => 0,
        ];

        // Verifica che la chiave cache abbia il formato corretto
        $cacheKey = 'unsplash_search_mountain_3_20';
        Cache::put($cacheKey, $cachedResult, 3600);

        $result = $this->service->searchPhotos('mountain', 3, 20);

        $this->assertEquals($cachedResult, $result);
        $this->assertTrue(Cache::has($cacheKey));
    }

    public function test_search_uses_default_per_page(): void
    {
        $cachedResult = [
            'results' => [],
            'total' => 0,
            'total_pages' => 0,
        ];

        // Il default per_page è 12
        $cacheKey = 'unsplash_search_nature_1_12';
        Cache::put($cacheKey, $cachedResult, 3600);

        $result = $this->service->searchPhotos('nature', 1);

        $this->assertEquals($cachedResult, $result);
    }
}
