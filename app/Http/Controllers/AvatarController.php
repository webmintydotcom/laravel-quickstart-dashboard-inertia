<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Profile\StoreAvatar;
use App\Http\Requests\AvatarUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

final class AvatarController extends Controller
{
    public function store(AvatarUpdateRequest $request, StoreAvatar $storeAvatar): RedirectResponse
    {
        $storeAvatar($request->user(), $request->file('avatar'));

        return to_route('profile')->with('status', 'avatar-updated');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();

        $path = $user->avatar_path;

        $user->forceFill(['avatar_path' => null])->save();

        if ($path !== null) {
            Storage::disk('public')->delete($path);
        }

        return to_route('profile')->with('status', 'avatar-removed');
    }
}
