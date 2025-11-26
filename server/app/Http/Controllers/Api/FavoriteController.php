<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFavoriteRequest;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FavoriteController extends Controller
{
    /**
     * Get all favorites
     */
    public function index(Request $request)
    {
        try {
            $userId = $request->input('user_id');

            $query = Favorite::query();

            if ($userId) {
                $query->where('user_id', $userId);
            } else {
                $query->whereNull('user_id');
            }

            $favorites = $query->orderBy('created_at', 'desc')->get();

            return $this->success($favorites);
        } catch (\Exception $e) {
            Log::error('Failed to fetch favorites', [
                'exception' => $e,
                'user_id' => $request->input('user_id'),
            ]);

            return $this->failure('Failed to fetch favorites', $e->getMessage(), 500);
        }
    }

    /**
     * Add a photo to favorites
     */
    public function store(StoreFavoriteRequest $request)
    {
        $data = $request->validated();

        try {
            $favorite = Favorite::updateOrCreate(
                [
                    'user_id' => $data['user_id'] ?? null,
                    'photo_id' => $data['photo_id'],
                ],
                [
                    'photo_data' => $data['photo_data'],
                ]
            );

            return $this->success($favorite, 'Photo added to favorites', 201);
        } catch (\Exception $e) {
            Log::error('Failed to add favorite', [
                'exception' => $e,
                'payload' => $data,
            ]);

            return $this->failure('Failed to add favorite', $e->getMessage(), 500);
        }
    }

    /**
     * Remove a photo from favorites
     */
    public function destroy(Request $request, $photoId)
    {
        try {
            $userId = $request->input('user_id');

            $query = Favorite::where('photo_id', $photoId);

            if ($userId) {
                $query->where('user_id', $userId);
            } else {
                $query->whereNull('user_id');
            }

            $favorite = $query->first();

            if (!$favorite) {
                return $this->failure('Favorite not found', null, 404);
            }

            $favorite->delete();

            return $this->success(null, 'Photo removed from favorites');
        } catch (\Exception $e) {
            Log::error('Failed to remove favorite', [
                'exception' => $e,
                'photo_id' => $photoId,
                'user_id' => $request->input('user_id'),
            ]);

            return $this->failure('Failed to remove favorite', $e->getMessage(), 500);
        }
    }
}
