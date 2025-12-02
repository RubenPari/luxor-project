<?php

namespace Tests\Unit\DataTransferObjects;

use App\DataTransferObjects\PhotoData;
use App\DataTransferObjects\PhotoLinks;
use App\DataTransferObjects\PhotoUrls;
use App\DataTransferObjects\PhotoUser;
use PHPUnit\Framework\TestCase;

/**
 * Test unitari per PhotoData DTO.
 *
 * Verifica la corretta creazione e serializzazione del DTO.
 */
class PhotoDataTest extends TestCase
{
    /**
     * Dati completi di una foto per i test.
     */
    private function getFullPhotoData(): array
    {
        return [
            'id' => 'photo_123',
            'width' => 1920,
            'height' => 1080,
            'description' => 'A beautiful mountain landscape',
            'alt_description' => 'Mountain at sunset',
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
                'username' => 'photographer',
                'name' => 'John Doe',
                'portfolio_url' => 'https://portfolio.example.com',
                'profile_image' => 'https://example.com/avatar.jpg',
            ],
            'created_at' => '2024-01-01T00:00:00Z',
        ];
    }

    public function test_creates_from_array_with_all_fields(): void
    {
        $data = $this->getFullPhotoData();
        $photo = PhotoData::fromArray($data);

        $this->assertEquals('photo_123', $photo->id);
        $this->assertEquals(1920, $photo->width);
        $this->assertEquals(1080, $photo->height);
        $this->assertEquals('A beautiful mountain landscape', $photo->description);
        $this->assertEquals('Mountain at sunset', $photo->altDescription);
        $this->assertEquals('2024-01-01T00:00:00Z', $photo->createdAt);
    }

    public function test_creates_from_array_with_minimal_fields(): void
    {
        $data = ['id' => 'minimal_photo'];
        $photo = PhotoData::fromArray($data);

        $this->assertEquals('minimal_photo', $photo->id);
        $this->assertNull($photo->width);
        $this->assertNull($photo->height);
        $this->assertNull($photo->description);
        $this->assertNull($photo->altDescription);
        $this->assertNull($photo->createdAt);
    }

    public function test_creates_with_empty_id_when_missing(): void
    {
        $data = [];
        $photo = PhotoData::fromArray($data);

        $this->assertEquals('', $photo->id);
    }

    public function test_urls_are_created_correctly(): void
    {
        $data = $this->getFullPhotoData();
        $photo = PhotoData::fromArray($data);

        $this->assertInstanceOf(PhotoUrls::class, $photo->urls);
        $this->assertEquals('https://example.com/raw.jpg', $photo->urls->raw);
        $this->assertEquals('https://example.com/regular.jpg', $photo->urls->regular);
    }

    public function test_links_are_created_correctly(): void
    {
        $data = $this->getFullPhotoData();
        $photo = PhotoData::fromArray($data);

        $this->assertInstanceOf(PhotoLinks::class, $photo->links);
        $this->assertEquals('https://unsplash.com/photos/123', $photo->links->html);
    }

    public function test_user_is_created_correctly(): void
    {
        $data = $this->getFullPhotoData();
        $photo = PhotoData::fromArray($data);

        $this->assertInstanceOf(PhotoUser::class, $photo->user);
        $this->assertEquals('photographer', $photo->user->username);
        $this->assertEquals('John Doe', $photo->user->name);
    }

    public function test_to_array_returns_correct_structure(): void
    {
        $data = $this->getFullPhotoData();
        $photo = PhotoData::fromArray($data);
        $result = $photo->toArray();

        $this->assertArrayHasKey('id', $result);
        $this->assertArrayHasKey('width', $result);
        $this->assertArrayHasKey('height', $result);
        $this->assertArrayHasKey('description', $result);
        $this->assertArrayHasKey('alt_description', $result);
        $this->assertArrayHasKey('urls', $result);
        $this->assertArrayHasKey('links', $result);
        $this->assertArrayHasKey('user', $result);
        $this->assertArrayHasKey('created_at', $result);
    }

    public function test_to_array_preserves_values(): void
    {
        $data = $this->getFullPhotoData();
        $photo = PhotoData::fromArray($data);
        $result = $photo->toArray();

        $this->assertEquals('photo_123', $result['id']);
        $this->assertEquals(1920, $result['width']);
        $this->assertEquals(1080, $result['height']);
        $this->assertEquals('A beautiful mountain landscape', $result['description']);
        $this->assertEquals('Mountain at sunset', $result['alt_description']);
    }

    public function test_to_array_includes_nested_objects_as_arrays(): void
    {
        $data = $this->getFullPhotoData();
        $photo = PhotoData::fromArray($data);
        $result = $photo->toArray();

        $this->assertIsArray($result['urls']);
        $this->assertIsArray($result['links']);
        $this->assertIsArray($result['user']);
    }

    public function test_handles_null_nested_arrays(): void
    {
        $data = [
            'id' => 'test',
            'urls' => null,
            'links' => null,
            'user' => null,
        ];
        $photo = PhotoData::fromArray($data);

        // Deve creare DTO vuoti invece di null
        $this->assertInstanceOf(PhotoUrls::class, $photo->urls);
        $this->assertInstanceOf(PhotoLinks::class, $photo->links);
        $this->assertInstanceOf(PhotoUser::class, $photo->user);
    }

    public function test_roundtrip_preserves_data(): void
    {
        $data = $this->getFullPhotoData();
        
        $photo = PhotoData::fromArray($data);
        $exported = $photo->toArray();
        $reimported = PhotoData::fromArray($exported);
        $reexported = $reimported->toArray();

        $this->assertEquals($exported, $reexported);
    }

    public function test_is_immutable(): void
    {
        $data = $this->getFullPhotoData();
        $photo = PhotoData::fromArray($data);

        // Le proprietà readonly non possono essere modificate
        // Questo test verifica che la classe sia definita come readonly
        $reflection = new \ReflectionClass($photo);
        $this->assertTrue($reflection->isReadOnly());
    }
}
