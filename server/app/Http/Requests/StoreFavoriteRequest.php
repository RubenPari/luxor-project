<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreFavoriteRequest extends FormRequest
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
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'photo_id' => ['required', 'string'],
            'photo_data' => ['required', 'array'],
            'user_id' => ['nullable', 'exists:users,id'],
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
            'photo_id.required' => 'The photo_id field is required.',
            'photo_id.string' => 'The photo_id must be a string.',
            'photo_data.required' => 'The photo_data field is required.',
            'photo_data.array' => 'The photo_data must be a valid JSON object.',
            'user_id.exists' => 'The selected user_id is invalid.',
        ];
    }
}
