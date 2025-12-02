<?php

namespace Tests\Unit\Middleware;

use App\Http\Middleware\UserIdentifierMiddleware;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Tests\TestCase;

/**
 * Test unitari per UserIdentifierMiddleware.
 *
 * Verifica la validazione dell'header X-User-ID.
 */
class UserIdentifierMiddlewareTest extends TestCase
{
    private UserIdentifierMiddleware $middleware;

    protected function setUp(): void
    {
        parent::setUp();
        $this->middleware = new UserIdentifierMiddleware();
    }

    /**
     * Helper per creare una request mock con header.
     */
    private function createRequest(?string $userId): Request
    {
        $request = new Request();
        
        if ($userId !== null) {
            $request->headers->set('X-User-ID', $userId);
        }
        
        return $request;
    }

    /**
     * Helper per eseguire il middleware e ottenere la risposta.
     */
    private function executeMiddleware(Request $request): mixed
    {
        $nextCalled = false;
        $next = function ($req) use (&$nextCalled) {
            $nextCalled = true;
            return new JsonResponse(['success' => true]);
        };

        $response = $this->middleware->handle($request, $next);
        
        return ['response' => $response, 'nextCalled' => $nextCalled];
    }

    public function test_returns_error_when_header_is_missing(): void
    {
        $request = $this->createRequest(null);
        $result = $this->executeMiddleware($request);

        $this->assertFalse($result['nextCalled']);
        $this->assertEquals(400, $result['response']->getStatusCode());
        
        $content = json_decode($result['response']->getContent(), true);
        $this->assertFalse($content['success']);
        $this->assertStringContainsString('Missing X-User-ID', $content['message']);
    }

    public function test_returns_error_when_uuid_format_is_invalid(): void
    {
        $invalidUuids = [
            'invalid-uuid',
            '12345',
            'not-a-uuid-at-all',
            '550e8400-e29b-41d4-a716', // Incompleto
            '550e8400-e29b-31d4-a716-446655440000', // Versione 3 invece di 4
            '550e8400e29b41d4a716446655440000', // Senza trattini
            '',
        ];

        foreach ($invalidUuids as $invalidUuid) {
            $request = $this->createRequest($invalidUuid);
            $result = $this->executeMiddleware($request);

            $this->assertFalse(
                $result['nextCalled'],
                "Expected next() to NOT be called for UUID: {$invalidUuid}"
            );
            $this->assertEquals(
                400,
                $result['response']->getStatusCode(),
                "Expected 400 status for UUID: {$invalidUuid}"
            );
        }
    }

    public function test_passes_request_with_valid_uuid_v4(): void
    {
        $validUuids = [
            '550e8400-e29b-41d4-a716-446655440000',
            'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            '6ba7b810-9dad-41d8-80b4-00c04fd430c8',
            'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        ];

        foreach ($validUuids as $validUuid) {
            $request = $this->createRequest($validUuid);
            $result = $this->executeMiddleware($request);

            $this->assertTrue(
                $result['nextCalled'],
                "Expected next() to be called for UUID: {$validUuid}"
            );
            $this->assertEquals(
                200,
                $result['response']->getStatusCode(),
                "Expected 200 status for UUID: {$validUuid}"
            );
        }
    }

    public function test_uuid_validation_is_case_insensitive(): void
    {
        $upperCaseUuid = '550E8400-E29B-41D4-A716-446655440000';
        $mixedCaseUuid = '550e8400-E29B-41d4-A716-446655440000';

        foreach ([$upperCaseUuid, $mixedCaseUuid] as $uuid) {
            $request = $this->createRequest($uuid);
            $result = $this->executeMiddleware($request);

            $this->assertTrue(
                $result['nextCalled'],
                "Expected next() to be called for UUID: {$uuid}"
            );
        }
    }

    public function test_error_response_contains_required_fields(): void
    {
        $request = $this->createRequest(null);
        $result = $this->executeMiddleware($request);

        $content = json_decode($result['response']->getContent(), true);

        $this->assertArrayHasKey('success', $content);
        $this->assertArrayHasKey('message', $content);
        $this->assertArrayHasKey('error', $content);
    }

    public function test_invalid_uuid_error_mentions_uuid_format(): void
    {
        $request = $this->createRequest('invalid');
        $result = $this->executeMiddleware($request);

        $content = json_decode($result['response']->getContent(), true);

        $this->assertStringContainsString('Invalid', $content['message']);
        $this->assertStringContainsString('UUID', $content['error']);
    }
}
