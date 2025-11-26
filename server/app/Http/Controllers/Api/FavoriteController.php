<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
            
            return response()->json([
                'success' => true,
                'data' => $favorites,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch favorites',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Add a photo to favorites
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'photo_id' => 'required|string',
            'photo_data' => 'required|array',
            'user_id' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $favorite = Favorite::updateOrCreate(
                [
                    'user_id' => $request->input('user_id'),
                    'photo_id' => $request->input('photo_id'),
                ],
                [
                    'photo_data' => $request->input('photo_data'),
                ]
            );

            return response()->json([
                'success' => true,
                'data' => $favorite,
                'message' => 'Photo added to favorites',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add favorite',
                'error' => $e->getMessage(),
            ], 500);
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
                return response()->json([
                    'success' => false,
                    'message' => 'Favorite not found',
                ], 404);
            }
            
            $favorite->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Photo removed from favorites',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove favorite',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
