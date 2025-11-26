<?php

namespace Tests\Feature;

use Tests\TestCase;

class UnsplashSearchTest extends TestCase
{
    /**
     * Test that search endpoint requires query parameter
     */
    public function test_search_requires_query_parameter(): void
    {
        $response = $this->getJson('/api/unsplash/search');

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['query']);
    }

    /**
     * Test that search endpoint validates page parameter
     */
    public function test_search_validates_page_parameter(): void
    {
        $response = $this->getJson('/api/unsplash/search?query=nature&page=0');

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['page']);
    }

    /**
     * Test that search endpoint validates per_page parameter
     */
    public function test_search_validates_per_page_parameter(): void
    {
        $response = $this->getJson('/api/unsplash/search?query=nature&per_page=50');

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['per_page']);
    }

    /**
     * Test that search returns error when API key is not configured
     */
    public function test_search_returns_error_when_api_key_not_configured(): void
    {
        config(['unsplash.access_key' => null]);

        $response = $this->getJson('/api/unsplash/search?query=nature');

        $response->assertStatus(500);
        $response->assertJson([
            'success' => false,
        ]);
    }

    /**
     * Test that search endpoint accepts valid parameters
     */
    public function test_search_accepts_valid_parameters(): void
    {
        // Skip if no API key is configured
        if (empty(config('unsplash.access_key'))) {
            $this->markTestSkipped('Unsplash API key not configured');
        }

        $response = $this->getJson('/api/unsplash/search?query=nature&page=1&per_page=10');

        // Should either succeed or fail with a valid error response
        $this->assertContains($response->status(), [200, 500]);
        $response->assertJsonStructure([
            'success',
        ]);
    }
}
