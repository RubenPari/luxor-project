<?php

namespace Tests\Unit\Services;

use App\Contracts\FavoriteRepositoryInterface;
use App\DataTransferObjects\PhotoData;
use App\Models\Favorite;
use App\Services\FavoriteService;
use Illuminate\Database\Eloquent\Collection;
use Mockery;
use Mockery\MockInterface;
use PHPUnit\Framework\TestCase;

/**
 * Test unitari per FavoriteService.
 *
 * Verifica che il service deleghi correttamente le operazioni
 * al repository e applichi la logica di business.
 */
class FavoriteServiceTest extends TestCase
{
    private FavoriteService $service;
    private MockInterface $repository;

    private const TEST_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

    protected function setUp(): void
    {
        parent::setUp();

        $this->repository = Mockery::mock(FavoriteRepositoryInterface::class);
        $this->service = new FavoriteService($this->repository);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /**
     * Helper per creare dati foto mock.
     */
    private function getMockPhotoData(): array
    {
        return [
            'id' => 'photo_123',
            'width' => 1920,
            'height' => 1080,
            'description' => 'Test photo description',
            'alt_description' => 'Test alt description',
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

    public function test_all_delegates_to_repository(): void
    {
        $expectedCollection = new Collection([]);

        $this->repository
            ->shouldReceive('all')
            ->once()
            ->with(self::TEST_USER_ID)
            ->andReturn($expectedCollection);

        $result = $this->service->all(self::TEST_USER_ID);

        $this->assertSame($expectedCollection, $result);
    }

    public function test_find_by_photo_id_delegates_to_repository(): void
    {
        $photoId = 'photo_123';
        $expectedFavorite = Mockery::mock(Favorite::class);

        $this->repository
            ->shouldReceive('findByPhotoId')
            ->once()
            ->with($photoId, self::TEST_USER_ID)
            ->andReturn($expectedFavorite);

        $result = $this->service->findByPhotoId($photoId, self::TEST_USER_ID);

        $this->assertSame($expectedFavorite, $result);
    }

    public function test_find_by_photo_id_returns_null_when_not_found(): void
    {
        $photoId = 'nonexistent';

        $this->repository
            ->shouldReceive('findByPhotoId')
            ->once()
            ->with($photoId, self::TEST_USER_ID)
            ->andReturnNull();

        $result = $this->service->findByPhotoId($photoId, self::TEST_USER_ID);

        $this->assertNull($result);
    }

    public function test_save_validates_and_saves_photo_data(): void
    {
        $photoId = 'photo_123';
        $photoData = $this->getMockPhotoData();
        $expectedFavorite = Mockery::mock(Favorite::class);

        $this->repository
            ->shouldReceive('save')
            ->once()
            ->withArgs(function ($id, $data, $userId) use ($photoId) {
                // Verifica che i dati siano stati trasformati dal DTO
                return $id === $photoId
                    && $userId === self::TEST_USER_ID
                    && is_array($data)
                    && isset($data['id']);
            })
            ->andReturn($expectedFavorite);

        $result = $this->service->save($photoId, $photoData, self::TEST_USER_ID);

        $this->assertSame($expectedFavorite, $result);
    }

    public function test_save_handles_minimal_photo_data(): void
    {
        $photoId = 'photo_minimal';
        $minimalData = [
            'id' => 'photo_minimal',
        ];
        $expectedFavorite = Mockery::mock(Favorite::class);

        $this->repository
            ->shouldReceive('save')
            ->once()
            ->andReturn($expectedFavorite);

        $result = $this->service->save($photoId, $minimalData, self::TEST_USER_ID);

        $this->assertSame($expectedFavorite, $result);
    }

    public function test_delete_delegates_to_repository(): void
    {
        $favorite = Mockery::mock(Favorite::class);

        $this->repository
            ->shouldReceive('delete')
            ->once()
            ->with($favorite)
            ->andReturn(true);

        $result = $this->service->delete($favorite);

        $this->assertTrue($result);
    }

    public function test_delete_returns_false_on_failure(): void
    {
        $favorite = Mockery::mock(Favorite::class);

        $this->repository
            ->shouldReceive('delete')
            ->once()
            ->with($favorite)
            ->andReturn(false);

        $result = $this->service->delete($favorite);

        $this->assertFalse($result);
    }
}
