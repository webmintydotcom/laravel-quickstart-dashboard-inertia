<?php

declare(strict_types=1);

namespace App\Demo;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class VehicleUpdateRequest extends FormRequest
{
    /**
     * stock_number and vin are deliberately absent. They are the two fields the
     * form renders read-only, and leaving them out of the rules means
     * validated() cannot carry them into update() even if a crafted request
     * includes them.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'make'             => ['required', 'string', 'max:80'],
            'model'            => ['required', 'string', 'max:80'],
            'color'            => ['required', 'string', 'max:80'],
            // A fleet with a 1749 van in it is a data-entry error, not a museum.
            'year'             => ['required', 'integer', 'min:1950', 'max:' . (date('Y') + 1)],
            'license_plate'    => ['nullable', 'string', 'max:12'],
            'body_type'        => ['required', Rule::enum(BodyType::class)],
            'fuel_type'        => ['required', Rule::enum(FuelType::class)],
            'status'           => ['required', Rule::enum(VehicleStatus::class)],
            'odometer'         => ['required', 'integer', 'min:0', 'max:2000000'],
            'assigned_driver'  => ['nullable', 'string', 'max:80'],
            'bookable'         => ['required', 'boolean'],
            'purchased_on'     => ['required', 'date', 'before_or_equal:today'],
            'last_serviced_on' => ['nullable', 'date', 'after_or_equal:purchased_on', 'before_or_equal:today'],
            // Dollars here; the column holds cents. See vehicleAttributes().
            'purchase_price'   => ['required', 'numeric', 'min:0', 'max:500000'],
            'notes'            => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * The validated data in the shape the columns want. The one conversion is
     * money: the form edits dollars, the column stores cents, and doing it here
     * means the controller never has to know that.
     *
     * @return array<string, mixed>
     */
    public function vehicleAttributes(): array
    {
        $attributes = $this->validated();
        $attributes['purchase_price'] = (int) round(((float) $attributes['purchase_price']) * 100);

        return $attributes;
    }
}
