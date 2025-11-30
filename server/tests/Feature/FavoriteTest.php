<?php

namespace Tests\Feature;

use App\Models\Favorite;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FavoriteTest extends TestCase
{
    use RefreshDatabase;

    private const TEST_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

    protected function getJsonWithHeaders(string $uri)
    {
        return $this->withHeaders([
            'X-User-ID' => self::TEST_USER_ID,
        ])->getJson($uri);
    }

    protected function postJsonWithHeaders(string $uri, array $data)
    {
        return $this->withHeaders([
            'X-User-ID' => self::TEST_USER_ID,
        ])->postJson($uri, $data);
    }

    protected function deleteJsonWithHeaders(string $uri)
    {
        return $this->withHeaders([
            'X-User-ID' => self::TEST_USER_ID,
        ])->deleteJson($uri);
    }

    public function test_index_returns_favorites()
    {
        Favorite::create([
            'user_id' => self::TEST_USER_ID,
            'photo_id' => 'test_123',
            'photo_data' => ['id' => 'test_123', 'urls' => [], 'user' => []]
        ]);

        $response = $this->getJsonWithHeaders('/api/favorites');

        $response->assertStatus(200)
            ->assertJsonStructure(['success', 'data']);
    }

    public function test_store_validates_data()
    {
        $response = $this->postJsonWithHeaders('/api/favorites', [
            'photo_id' => 'test_123',
            // Missing photo_data
        ]);

        $response->assertStatus(422);
    }

    public function test_store_saves_favorite()
    {
        $photoData = [
            'id' => 'test_123',
            'width' => 100,
            'height' => 100,
            'urls' => ['regular' => 'http://example.com/img.jpg'],
            'user' => ['name' => 'John Doe'],
            'links' => [],
        ];

        $response = $this->postJsonWithHeaders('/api/favorites', [
            'photo_id' => 'test_123',
            'photo_data' => $photoData,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('favorites', [
            'user_id' => self::TEST_USER_ID,
            'photo_id' => 'test_123',
        ]);
    }

    public function test_destroy_removes_favorite()
    {
        Favorite::create([
            'user_id' => self::TEST_USER_ID,
            'photo_id' => 'test_123',
            'photo_data' => ['id' => 'test_123']
        ]);

        $response = $this->deleteJsonWithHeaders('/api/favorites/test_123');

        $response->assertStatus(200);
        $this->assertDatabaseMissing('favorites', [
            'user_id' => self::TEST_USER_ID,
            'photo_id' => 'test_123',
        ]);
    }
}
