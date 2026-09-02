<?php

declare(strict_types=1);

use App\Models\User;

test('authenticated users can log out', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('logout'))
        ->assertRedirect('/');

    $this->assertGuest();
});
