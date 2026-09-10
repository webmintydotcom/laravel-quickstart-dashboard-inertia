<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    Storage::fake('public');
});

test('a user can upload an avatar and it is resized to a square', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('profile.avatar.store'), [
            'avatar' => UploadedFile::fake()->image('portrait.jpg', 900, 1400),
        ])
        ->assertRedirect();

    $path = $user->refresh()->avatar_path;

    expect($path)->not->toBeNull();
    Storage::disk('public')->assertExists($path);

    // Read the stored bytes back rather than trusting the action.
    $size = getimagesizefromstring(Storage::disk('public')->get($path));

    expect($size[0])->toBe(256)
        ->and($size[1])->toBe(256)
        ->and($size['mime'])->toBe('image/webp');
});

test('replacing an avatar deletes the previous file', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)->post(route('profile.avatar.store'), [
        'avatar' => UploadedFile::fake()->image('first.jpg', 400, 400),
    ]);

    $first = $user->refresh()->avatar_path;

    $this->actingAs($user)->post(route('profile.avatar.store'), [
        'avatar' => UploadedFile::fake()->image('second.jpg', 400, 400),
    ]);

    $second = $user->refresh()->avatar_path;

    expect($second)->not->toBe($first);
    Storage::disk('public')->assertMissing($first);
    Storage::disk('public')->assertExists($second);
});

test('a user can remove their avatar', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)->post(route('profile.avatar.store'), [
        'avatar' => UploadedFile::fake()->image('portrait.jpg', 400, 400),
    ]);

    $path = $user->refresh()->avatar_path;

    $this->actingAs($user)->delete(route('profile.avatar.destroy'))->assertRedirect();

    expect($user->refresh()->avatar_path)->toBeNull();
    Storage::disk('public')->assertMissing($path);
});

test('a non-image is rejected', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('profile.avatar.store'), [
            'avatar' => UploadedFile::fake()->create('resume.pdf', 100, 'application/pdf'),
        ])
        ->assertSessionHasErrors('avatar', errorBag: 'updateAvatar');

    expect($user->refresh()->avatar_path)->toBeNull();
});

test('an oversized image is rejected', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('profile.avatar.store'), [
            'avatar' => UploadedFile::fake()->image('huge.jpg')->size(5000),
        ])
        ->assertSessionHasErrors('avatar', errorBag: 'updateAvatar');
});

test('an image with excessive pixel dimensions is rejected', function (): void {
    $user = User::factory()->create();

    // A small file can still decode to a huge bitmap - a solid-colour 8000x8000
    // PNG is only a few KB on disk but needs hundreds of MB once GD decodes it.
    // The dimensions rule reads the header via getimagesize() and rejects this
    // before Intervention ever touches the file. UploadedFile::fake()->image()
    // calls imagecreatetruecolor() to build the fixture, which needs ~256MB for
    // an 8000x8000 buffer - so the limit is lifted around the fixture and
    // restored immediately after. It is set to -1 rather than a number: a
    // hardcoded ceiling silently *lowers* the limit on any environment
    // configured above it, which is what happened here, and the failure
    // surfaces as an unrelated fatal in whichever test runs when the suite's
    // cumulative heap crosses the cap.
    $previousLimit = ini_set('memory_limit', '-1');

    try {
        $this->actingAs($user)
            ->post(route('profile.avatar.store'), [
                'avatar' => UploadedFile::fake()->image('huge.png', 8000, 8000),
            ])
            ->assertSessionHasErrors('avatar', errorBag: 'updateAvatar');
    } finally {
        ini_set('memory_limit', $previousLimit);
    }

    expect($user->refresh()->avatar_path)->toBeNull();
});

test('guests cannot upload an avatar', function (): void {
    $this->post(route('profile.avatar.store'), [])->assertRedirect(route('login'));
});
