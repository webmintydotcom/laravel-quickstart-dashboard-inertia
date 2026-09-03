<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\Attributes\ErrorBag;
use Illuminate\Foundation\Http\FormRequest;

// Five forms share the profile page, so each needs its own bag. Laravel 13 dropped
// the old `protected function errorBag(): string` override in favor of this
// class-level attribute — see Illuminate\Foundation\Http\FormRequest::__construct(),
// which only reads the #[ErrorBag] attribute (or the $errorBag property), never a
// method of that name.
#[ErrorBag('deleteAccount')]
final class ProfileDestroyRequest extends FormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'password' => ['required', 'string', 'current_password:web'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'password.current_password' => __('The provided password is incorrect.'),
        ];
    }
}
