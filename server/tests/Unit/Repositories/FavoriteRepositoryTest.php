<?php

namespace Tests\Unit\Repositories;

use App\Models\Favorite;
use App\Repositories\FavoriteRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Test unitari per FavoriteRepository.
 *
 * Verifica le operazioni CRUD del repository.
 */
class FavoriteRepositoryTest extends TestCase
{
    use RefreshDatabase;

    private FavoriteRepository $repository;
    private const TEST_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = new FavoriteRepository();
    }

    private function getTestPhotoData(): array
    {
        return [
            'id' => 'photo_123',
            'width' => 1920,
            'height' => 1080,
            'description' => 'Test photo',
            'alt_description' => 'Test alt',
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
            'created_at' => '2024-01-01T00:00:00Z',
        ];
    }

    public function test_all_returns_empty_collection_when_no_favorites(): void
    {
        $result = $this->repository->all(self::TEST_USER_ID);

        $this->assertCount(0, $result);
    }

    public function test_all_returns_favorites_for_user(): void
    {
        Favorite::create([
            'user_id' => self::TEST_USER_ID,
            'photo_id' => 'photo_1',
            'photo_data' => ['id' => 'photo_1'],
        ]);

        Favorite::create([
            'user_id' => self::TEST_USER_ID,
            'photo_id' => 'photo_2',
            'photo_data' => ['id' => 'photo_2'],
        ]);

        $result = $this->repository->all(self::TEST_USER_ID);

        $this->assertCount(2, $result);
    }

    public function test_all_does_not_return_other_users_favorites(): void
    {
        Favorite::create([
            'user_id' => self::TEST_USER_ID,
            'photo_id' => 'photo_1',
            'photo_data' => ['id' => 'photo_1'],
        ]);

        Favorite::create([
            'user_id' => 'other-user-id-12345678-1234-1234-1234',
            'photo_id' => 'photo_2',
            'photo_data' => ['id' => 'photo_2'],
        ]);

        $result = $this->repository->all(self::TEST_USER_ID);

        $this->assertCount(1, $result);
        $this->assertEquals('photo_1', $result->first()->photo_id);
    }

    public function test_all_returns_favorites_ordered_by_created_at_desc(): void
    {
        // Usa Carbon::create per timestamp precisi
        $oldDate = \Carbon\Carbon::create(2020, 1, 1, 12, 0, 0);
        $newDate = \Carbon\Carbon::create(2024, 1, 1, 12, 0, 0);

        $oldFavorite = new Favorite([
            'user_id' => self::TEST_USER_ID,
            'photo_id' => 'photo_old',
        ]);
        $oldFavorite->created_at = $oldDate;
        $oldFavorite->save();

        $newFavorite = new Favorite([
            'user_id' => self::TEST_USER_ID,
            'photo_id' => 'photo_new',
        ]);
        $newFavorite->created_at = $newDate;
        $newFavorite->save();

        $result = $this->repository->all(self::TEST_USER_ID);

        $this->assertEquals('photo_new', $result->first()->photo_id);
        $this->assertEquals('photo_old', $result->last()->photo_id);
    }

    public function test_find_by_photo_id_returns_favorite_when_exists(): void
    {
        Favorite::create([
            'user_id' => self::TEST_USER_ID,
            'photo_id' => 'photo_123',
            'photo_data' => ['id' => 'photo_123'],
        ]);

        $result = $this->repository->findByPhotoId('photo_123', self::TEST_USER_ID);

        $this->assertNotNull($result);
        $this->assertEquals('photo_123', $result->photo_id);
    }

    public function test_find_by_photo_id_returns_null_when_not_exists(): void
    {
        $result = $this->repository->findByPhotoId('nonexistent', self::TEST_USER_ID);

        $this->assertNull($result);
    }

    public function test_find_by_photo_id_does_not_find_other_users_favorite(): void
    {
        Favorite::create([
            'user_id' => 'other-user-id-12345678-1234-1234-1234',
            'photo_id' => 'photo_123',
            'photo_data' => ['id' => 'photo_123'],
        ]);

        $result = $this->repository->findByPhotoId('photo_123', self::TEST_USER_ID);

        $this->assertNull($result);
    }

    public function test_save_creates_new_favorite(): void
    {
        $photoData = $this->getTestPhotoData();

        $result = $this->repository->save('photo_123', $photoData, self::TEST_USER_ID);

        $this->assertInstanceOf(Favorite::class, $result);
        $this->assertEquals('photo_123', $result->photo_id);
        $this->assertEquals(self::TEST_USER_ID, $result->user_id);
        $this->assertDatabaseHas('favorites', [
            'photo_id' => 'photo_123',
            'user_id' => self::TEST_USER_ID,
        ]);
    }

    public function test_save_updates_existing_favorite(): void
    {
        $photoData = $this->getTestPhotoData();
        
        // Crea il preferito iniziale
        $this->repository->save('photo_123', $photoData, self::TEST_USER_ID);

        // Aggiorna con nuovi dati
        $updatedData = $photoData;
        $updatedData['description'] = 'Updated description';
        
        $result = $this->repository->save('photo_123', $updatedData, self::TEST_USER_ID);

        $this->assertEquals('Updated description', $result->description);
        $this->assertDatabaseCount('favorites', 1);
    }

    public function test_delete_removes_favorite(): void
    {
        $favorite = Favorite::create([
            'user_id' => self::TEST_USER_ID,
            'photo_id' => 'photo_123',
            'photo_data' => ['id' => 'photo_123'],
        ]);

        $result = $this->repository->delete($favorite);

        $this->assertTrue($result);
        $this->assertDatabaseMissing('favorites', [
            'photo_id' => 'photo_123',
            'user_id' => self::TEST_USER_ID,
        ]);
    }

    public function test_save_stores_all_photo_fields(): void
    {
        $photoData = $this->getTestPhotoData();

        $result = $this->repository->save('photo_123', $photoData, self::TEST_USER_ID);

        $this->assertEquals(1920, $result->width);
        $this->assertEquals(1080, $result->height);
        $this->assertEquals('Test photo', $result->description);
        $this->assertEquals('testuser', $result->user_username);
        $this->assertEquals('https://example.com/regular.jpg', $result->url_regular);
    }
}
