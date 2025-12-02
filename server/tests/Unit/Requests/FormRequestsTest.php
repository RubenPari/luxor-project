<?php

namespace Tests\Unit\Requests;

use App\Http\Requests\StoreFavoriteRequest;
use App\Http\Requests\UnsplashSearchRequest;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

/**
 * Test unitari per i Form Request.
 *
 * Verifica le regole di validazione per StoreFavoriteRequest e UnsplashSearchRequest.
 */
class FormRequestsTest extends TestCase
{
    // ============================================
    // StoreFavoriteRequest Tests
    // ============================================

    public function test_store_favorite_requires_photo_id(): void
    {
        $request = new StoreFavoriteRequest();
        $validator = Validator::make([
            'photo_data' => ['id' => 'test', 'urls' => ['regular' => 'test.jpg'], 'user' => ['name' => 'Test']],
        ], $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('photo_id', $validator->errors()->toArray());
    }

    public function test_store_favorite_requires_photo_data(): void
    {
        $request = new StoreFavoriteRequest();
        $validator = Validator::make([
            'photo_id' => 'test_123',
        ], $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('photo_data', $validator->errors()->toArray());
    }

    public function test_store_favorite_requires_photo_data_id(): void
    {
        $request = new StoreFavoriteRequest();
        $validator = Validator::make([
            'photo_id' => 'test_123',
            'photo_data' => [
                'urls' => ['regular' => 'test.jpg'],
                'user' => ['name' => 'Test'],
            ],
        ], $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('photo_data.id', $validator->errors()->toArray());
    }

    public function test_store_favorite_requires_photo_data_urls(): void
    {
        $request = new StoreFavoriteRequest();
        $validator = Validator::make([
            'photo_id' => 'test_123',
            'photo_data' => [
                'id' => 'test_123',
                'user' => ['name' => 'Test'],
            ],
        ], $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('photo_data.urls', $validator->errors()->toArray());
    }

    public function test_store_favorite_requires_photo_data_urls_regular(): void
    {
        $request = new StoreFavoriteRequest();
        $validator = Validator::make([
            'photo_id' => 'test_123',
            'photo_data' => [
                'id' => 'test_123',
                'urls' => ['thumb' => 'thumb.jpg'],
                'user' => ['name' => 'Test'],
            ],
        ], $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('photo_data.urls.regular', $validator->errors()->toArray());
    }

    public function test_store_favorite_requires_photo_data_user(): void
    {
        $request = new StoreFavoriteRequest();
        $validator = Validator::make([
            'photo_id' => 'test_123',
            'photo_data' => [
                'id' => 'test_123',
                'urls' => ['regular' => 'test.jpg'],
            ],
        ], $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('photo_data.user', $validator->errors()->toArray());
    }

    public function test_store_favorite_requires_photo_data_user_name(): void
    {
        $request = new StoreFavoriteRequest();
        $validator = Validator::make([
            'photo_id' => 'test_123',
            'photo_data' => [
                'id' => 'test_123',
                'urls' => ['regular' => 'test.jpg'],
                'user' => ['username' => 'test'],
            ],
        ], $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('photo_data.user.name', $validator->errors()->toArray());
    }

    public function test_store_favorite_passes_with_valid_data(): void
    {
        $request = new StoreFavoriteRequest();
        $validator = Validator::make([
            'photo_id' => 'test_123',
            'photo_data' => [
                'id' => 'test_123',
                'urls' => ['regular' => 'https://example.com/photo.jpg'],
                'user' => ['name' => 'Test User'],
            ],
        ], $request->rules());

        $this->assertFalse($validator->fails());
    }

    public function test_store_favorite_passes_with_all_optional_fields(): void
    {
        $request = new StoreFavoriteRequest();
        $validator = Validator::make([
            'photo_id' => 'test_123',
            'photo_data' => [
                'id' => 'test_123',
                'width' => 1920,
                'height' => 1080,
                'description' => 'A beautiful photo',
                'alt_description' => 'Mountain landscape',
                'created_at' => '2024-01-01T00:00:00Z',
                'urls' => [
                    'raw' => 'https://example.com/raw.jpg',
                    'full' => 'https://example.com/full.jpg',
                    'regular' => 'https://example.com/regular.jpg',
                    'small' => 'https://example.com/small.jpg',
                    'thumb' => 'https://example.com/thumb.jpg',
                ],
                'links' => [
                    'self' => 'https://api.unsplash.com/photos/123',
                    'html' => 'https://unsplash.com/photos/123',
                    'download' => 'https://unsplash.com/photos/123/download',
                ],
                'user' => [
                    'id' => 'user_123',
                    'username' => 'testuser',
                    'name' => 'Test User',
                    'portfolio_url' => 'https://example.com',
                    'profile_image' => 'https://example.com/avatar.jpg',
                ],
            ],
        ], $request->rules());

        $this->assertFalse($validator->fails());
    }

    // ============================================
    // UnsplashSearchRequest Tests
    // ============================================

    public function test_unsplash_search_requires_query(): void
    {
        $request = new UnsplashSearchRequest();
        $validator = Validator::make([], $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('query', $validator->errors()->toArray());
    }

    public function test_unsplash_search_query_must_not_be_empty(): void
    {
        $request = new UnsplashSearchRequest();
        $validator = Validator::make(['query' => ''], $request->rules());

        $this->assertTrue($validator->fails());
    }

    public function test_unsplash_search_query_max_255_chars(): void
    {
        $request = new UnsplashSearchRequest();
        $validator = Validator::make([
            'query' => str_repeat('a', 256),
        ], $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('query', $validator->errors()->toArray());
    }

    public function test_unsplash_search_page_must_be_at_least_1(): void
    {
        $request = new UnsplashSearchRequest();
        $validator = Validator::make([
            'query' => 'nature',
            'page' => 0,
        ], $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('page', $validator->errors()->toArray());
    }

    public function test_unsplash_search_per_page_must_be_at_least_1(): void
    {
        $request = new UnsplashSearchRequest();
        $validator = Validator::make([
            'query' => 'nature',
            'per_page' => 0,
        ], $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('per_page', $validator->errors()->toArray());
    }

    public function test_unsplash_search_per_page_max_30(): void
    {
        $request = new UnsplashSearchRequest();
        $validator = Validator::make([
            'query' => 'nature',
            'per_page' => 50,
        ], $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('per_page', $validator->errors()->toArray());
    }

    public function test_unsplash_search_passes_with_only_query(): void
    {
        $request = new UnsplashSearchRequest();
        $validator = Validator::make([
            'query' => 'nature',
        ], $request->rules());

        $this->assertFalse($validator->fails());
    }

    public function test_unsplash_search_passes_with_all_params(): void
    {
        $request = new UnsplashSearchRequest();
        $validator = Validator::make([
            'query' => 'nature',
            'page' => 5,
            'per_page' => 20,
        ], $request->rules());

        $this->assertFalse($validator->fails());
    }

    public function test_unsplash_search_page_can_be_null(): void
    {
        $request = new UnsplashSearchRequest();
        $validator = Validator::make([
            'query' => 'nature',
            'page' => null,
        ], $request->rules());

        $this->assertFalse($validator->fails());
    }
}
