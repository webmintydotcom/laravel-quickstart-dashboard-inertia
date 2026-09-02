<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\Appearance;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class SettingsUpdateRequest extends FormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'appearance' => ['required', Rule::enum(Appearance::class)],
            'timezone'   => ['required', 'string', 'timezone'],
        ];
    }
}
