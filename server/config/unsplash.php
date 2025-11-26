<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Unsplash API Configuration
    |--------------------------------------------------------------------------
    |
    | Configure your Unsplash API credentials here. You can get your API keys
    | by creating an application at https://unsplash.com/oauth/applications
    |
    */

    'access_key' => env('UNSPLASH_ACCESS_KEY'),
    'secret_key' => env('UNSPLASH_SECRET_KEY'),

    /*
    |--------------------------------------------------------------------------
    | Default Search Parameters
    |--------------------------------------------------------------------------
    |
    | Default parameters for photo searches
    |
    */

    'default_per_page' => 12,
    'max_per_page' => 30,
];
