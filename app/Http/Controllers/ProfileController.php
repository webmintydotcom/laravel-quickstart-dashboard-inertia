<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Profile\DeleteAccount;
use App\Data\SessionData;
use App\Data\UserData;
use App\Http\Requests\ProfileDestroyRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

final class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile', [
            'profile'  => UserData::from($request->user()),
            'sessions' => $this->sessions($request),
        ]);
    }

    public function destroy(ProfileDestroyRequest $request, DeleteAccount $deleteAccount): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $deleteAccount($user);

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    /**
     * @return array<int, SessionData>
     */
    private function sessions(Request $request): array
    {
        $currentSessionId = $request->session()->getId();

        return DB::table('sessions')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('last_activity')
            ->get()
            ->map(fn (object $row): SessionData => SessionData::fromRow($row, $currentSessionId))
            ->all();
    }
}
