<?php

declare(strict_types=1);

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\Appearance;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable([
    'first_name',
    'last_name',
    'email',
    'password',
    'appearance',
    'timezone',
])]
#[Hidden([
    'password',
    'remember_token',
])]
final class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Mirrors the appearance/timezone migration defaults so a freshly
     * instantiated model (including right after create(), before any
     * round trip back to the database) already has them in memory. Without
     * this, reading $user->appearance on an unrefreshed model created
     * without those keys explicitly set throws a MissingAttributeException
     * under Model::preventAccessingMissingAttributes().
     *
     * @var array<string, mixed>
     */
    // Must match the column defaults in the
    // 2026_09_02_000000_add_appearance_and_timezone_to_users_table migration.
    protected $attributes = [
        'appearance' => 'system',
        'timezone'   => 'UTC',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'appearance'        => Appearance::class,
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    /**
     * @return Attribute<string, never>
     */
    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn (): string => $this->first_name . ' ' . $this->last_name
        )->shouldCache();
    }
}
