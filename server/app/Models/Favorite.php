<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    protected $fillable = [
        'user_id',
        'photo_id',
        'photo_data',
    ];

    protected $casts = [
        'photo_data' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
