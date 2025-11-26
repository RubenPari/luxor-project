<?php

namespace Tests\Feature\Api;

use Tests\TestCase;

class HealthControllerTest extends TestCase
{
    public function test_health_endpoint_returns_successful_response(): void
    {
        $response = $this->getJson('/api/health');

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'timestamp',
                'service',
            ])
            ->assertJson([
                'status' => 'ok',
                'service' => 'Luxor API',
            ]);
    }

    public function test_detailed_health_endpoint_returns_full_information(): void
    {
        $response = $this->getJson('/api/health/detailed');

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'timestamp',
                'service',
                'database',
                'cache',
            ])
            ->assertJson([
                'status' => 'ok',
                'service' => 'Luxor API',
            ]);
    }

    public function test_health_endpoint_has_valid_timestamp(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200);
        
        $data = $response->json();
        $this->assertArrayHasKey('timestamp', $data);
        $this->assertNotEmpty($data['timestamp']);
        
        // Verify timestamp is in ISO8601 format
        $timestamp = \DateTime::createFromFormat(\DateTime::ATOM, $data['timestamp']);
        $this->assertInstanceOf(\DateTime::class, $timestamp);
    }
}
