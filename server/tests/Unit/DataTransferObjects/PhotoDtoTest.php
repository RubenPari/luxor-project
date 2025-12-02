<?php

namespace Tests\Unit\DataTransferObjects;

use App\DataTransferObjects\PhotoLinks;
use App\DataTransferObjects\PhotoUrls;
use App\DataTransferObjects\PhotoUser;
use PHPUnit\Framework\TestCase;

/**
 * Test unitari per i DTO: PhotoUrls, PhotoLinks, PhotoUser.
 *
 * Verifica la creazione e serializzazione dei DTO.
 */
class PhotoDtoTest extends TestCase
{
    // ============================================
    // PhotoUrls Tests
    // ============================================

    public function test_photo_urls_creates_from_array(): void
    {
        $data = [
            'raw' => 'https://example.com/raw.jpg',
            'full' => 'https://example.com/full.jpg',
            'regular' => 'https://example.com/regular.jpg',
            'small' => 'https://example.com/small.jpg',
            'thumb' => 'https://example.com/thumb.jpg',
        ];

        $urls = PhotoUrls::fromArray($data);

        $this->assertEquals('https://example.com/raw.jpg', $urls->raw);
        $this->assertEquals('https://example.com/full.jpg', $urls->full);
        $this->assertEquals('https://example.com/regular.jpg', $urls->regular);
        $this->assertEquals('https://example.com/small.jpg', $urls->small);
        $this->assertEquals('https://example.com/thumb.jpg', $urls->thumb);
    }

    public function test_photo_urls_handles_missing_fields(): void
    {
        $data = [
            'regular' => 'https://example.com/regular.jpg',
        ];

        $urls = PhotoUrls::fromArray($data);

        $this->assertNull($urls->raw);
        $this->assertNull($urls->full);
        $this->assertEquals('https://example.com/regular.jpg', $urls->regular);
        $this->assertNull($urls->small);
        $this->assertNull($urls->thumb);
    }

    public function test_photo_urls_creates_from_empty_array(): void
    {
        $urls = PhotoUrls::fromArray([]);

        $this->assertNull($urls->raw);
        $this->assertNull($urls->full);
        $this->assertNull($urls->regular);
        $this->assertNull($urls->small);
        $this->assertNull($urls->thumb);
    }

    public function test_photo_urls_to_array(): void
    {
        $urls = new PhotoUrls(
            raw: 'https://example.com/raw.jpg',
            full: 'https://example.com/full.jpg',
            regular: 'https://example.com/regular.jpg',
            small: 'https://example.com/small.jpg',
            thumb: 'https://example.com/thumb.jpg'
        );

        $array = $urls->toArray();

        $this->assertEquals([
            'raw' => 'https://example.com/raw.jpg',
            'full' => 'https://example.com/full.jpg',
            'regular' => 'https://example.com/regular.jpg',
            'small' => 'https://example.com/small.jpg',
            'thumb' => 'https://example.com/thumb.jpg',
        ], $array);
    }

    public function test_photo_urls_is_readonly(): void
    {
        $urls = PhotoUrls::fromArray(['regular' => 'test.jpg']);

        $reflection = new \ReflectionClass($urls);
        $this->assertTrue($reflection->isReadOnly());
    }

    // ============================================
    // PhotoLinks Tests
    // ============================================

    public function test_photo_links_creates_from_array(): void
    {
        $data = [
            'self' => 'https://api.unsplash.com/photos/123',
            'html' => 'https://unsplash.com/photos/123',
            'download' => 'https://unsplash.com/photos/123/download',
        ];

        $links = PhotoLinks::fromArray($data);

        $this->assertEquals('https://api.unsplash.com/photos/123', $links->self);
        $this->assertEquals('https://unsplash.com/photos/123', $links->html);
        $this->assertEquals('https://unsplash.com/photos/123/download', $links->download);
    }

    public function test_photo_links_handles_missing_fields(): void
    {
        $data = [
            'html' => 'https://unsplash.com/photos/123',
        ];

        $links = PhotoLinks::fromArray($data);

        $this->assertNull($links->self);
        $this->assertEquals('https://unsplash.com/photos/123', $links->html);
        $this->assertNull($links->download);
    }

    public function test_photo_links_creates_from_empty_array(): void
    {
        $links = PhotoLinks::fromArray([]);

        $this->assertNull($links->self);
        $this->assertNull($links->html);
        $this->assertNull($links->download);
    }

    public function test_photo_links_to_array(): void
    {
        $links = new PhotoLinks(
            self: 'https://api.unsplash.com/photos/123',
            html: 'https://unsplash.com/photos/123',
            download: 'https://unsplash.com/photos/123/download'
        );

        $array = $links->toArray();

        $this->assertEquals([
            'self' => 'https://api.unsplash.com/photos/123',
            'html' => 'https://unsplash.com/photos/123',
            'download' => 'https://unsplash.com/photos/123/download',
        ], $array);
    }

    public function test_photo_links_is_readonly(): void
    {
        $links = PhotoLinks::fromArray(['html' => 'test']);

        $reflection = new \ReflectionClass($links);
        $this->assertTrue($reflection->isReadOnly());
    }

    // ============================================
    // PhotoUser Tests
    // ============================================

    public function test_photo_user_creates_from_array(): void
    {
        $data = [
            'id' => 'user_123',
            'username' => 'testuser',
            'name' => 'Test User',
            'portfolio_url' => 'https://example.com',
            'profile_image' => 'https://example.com/avatar.jpg',
        ];

        $user = PhotoUser::fromArray($data);

        $this->assertEquals('user_123', $user->id);
        $this->assertEquals('testuser', $user->username);
        $this->assertEquals('Test User', $user->name);
        $this->assertEquals('https://example.com', $user->portfolioUrl);
        $this->assertEquals('https://example.com/avatar.jpg', $user->profileImage);
    }

    public function test_photo_user_handles_nested_profile_image(): void
    {
        $data = [
            'id' => 'user_123',
            'username' => 'testuser',
            'name' => 'Test User',
            'profile_image' => [
                'small' => 'https://example.com/small.jpg',
                'medium' => 'https://example.com/medium.jpg',
                'large' => 'https://example.com/large.jpg',
            ],
        ];

        $user = PhotoUser::fromArray($data);

        // Dovrebbe usare 'medium' dalla struttura annidata
        $this->assertEquals('https://example.com/medium.jpg', $user->profileImage);
    }

    public function test_photo_user_handles_missing_fields(): void
    {
        $data = [
            'name' => 'Test User',
        ];

        $user = PhotoUser::fromArray($data);

        $this->assertNull($user->id);
        $this->assertNull($user->username);
        $this->assertEquals('Test User', $user->name);
        $this->assertNull($user->portfolioUrl);
        $this->assertNull($user->profileImage);
    }

    public function test_photo_user_creates_from_empty_array(): void
    {
        $user = PhotoUser::fromArray([]);

        $this->assertNull($user->id);
        $this->assertNull($user->username);
        $this->assertNull($user->name);
        $this->assertNull($user->portfolioUrl);
        $this->assertNull($user->profileImage);
    }

    public function test_photo_user_to_array(): void
    {
        $user = new PhotoUser(
            id: 'user_123',
            username: 'testuser',
            name: 'Test User',
            portfolioUrl: 'https://example.com',
            profileImage: 'https://example.com/avatar.jpg'
        );

        $array = $user->toArray();

        $this->assertEquals([
            'id' => 'user_123',
            'username' => 'testuser',
            'name' => 'Test User',
            'portfolio_url' => 'https://example.com',
            'profile_image' => 'https://example.com/avatar.jpg',
        ], $array);
    }

    public function test_photo_user_is_readonly(): void
    {
        $user = PhotoUser::fromArray(['name' => 'Test']);

        $reflection = new \ReflectionClass($user);
        $this->assertTrue($reflection->isReadOnly());
    }

    public function test_photo_user_roundtrip(): void
    {
        $data = [
            'id' => 'user_123',
            'username' => 'testuser',
            'name' => 'Test User',
            'portfolio_url' => 'https://example.com',
            'profile_image' => 'https://example.com/avatar.jpg',
        ];

        $user = PhotoUser::fromArray($data);
        $exported = $user->toArray();
        $reimported = PhotoUser::fromArray($exported);

        $this->assertEquals($user->id, $reimported->id);
        $this->assertEquals($user->username, $reimported->username);
        $this->assertEquals($user->name, $reimported->name);
        $this->assertEquals($user->portfolioUrl, $reimported->portfolioUrl);
        $this->assertEquals($user->profileImage, $reimported->profileImage);
    }
}
