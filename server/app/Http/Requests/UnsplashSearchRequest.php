<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UnsplashSearchRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'query' => ['required', 'string', 'min:1', 'max:255'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:30'],
        ];
    }

    /**
     * Get custom messages for validation errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'query.required' => 'The search query is required.',
            'query.min' => 'The search query must be at least 1 character.',
            'query.max' => 'The search query must not exceed 255 characters.',
            'page.integer' => 'The page must be a valid integer.',
            'page.min' => 'The page must be at least 1.',
            'per_page.integer' => 'The per_page must be a valid integer.',
            'per_page.min' => 'The per_page must be at least 1.',
            'per_page.max' => 'The per_page must not exceed 30.',
        ];
    }
}
