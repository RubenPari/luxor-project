<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class HealthController extends Controller
{
    /**
     * Check API health status
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'status' => 'ok',
            'timestamp' => now()->toIso8601String(),
            'service' => 'Luxor API',
        ]);
    }

    /**
     * Get detailed health information
     */
    public function detailed(): JsonResponse
    {
        return response()->json([
            'status' => 'ok',
            'timestamp' => now()->toIso8601String(),
            'service' => 'Luxor API',
            'database' => $this->checkDatabase(),
            'cache' => $this->checkCache(),
        ]);
    }

    /**
     * Check database connection
     */
    private function checkDatabase(): string
    {
        try {
            \DB::connection()->getPdo();
            return 'connected';
        } catch (\Exception $e) {
            return 'disconnected';
        }
    }

    /**
     * Check cache connection
     */
    private function checkCache(): string
    {
        try {
            \Cache::has('health_check');
            return 'connected';
        } catch (\Exception $e) {
            return 'disconnected';
        }
    }
}
