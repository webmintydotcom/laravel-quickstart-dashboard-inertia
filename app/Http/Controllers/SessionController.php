<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\LogoutOtherSessionsRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

final class SessionController extends Controller
{
    public function destroy(LogoutOtherSessionsRequest $request): RedirectResponse
    {
        // Captured before logoutOtherDevices() runs, not after: that call rehashes
        // the user's password (and may, depending on what else is listening for
        // the resulting OtherDeviceLogout event) touch the current session, so
        // reading the id afterwards risks either deleting the row we meant to
        // keep or keeping the row we meant to delete. A local variable captured
        // up front is unaffected by anything the call below does.
        $currentSessionId = $request->session()->getId();

        // Rehashes the password so other sessions stop authenticating. This is why
        // the plaintext password is a form field rather than password.confirm
        // middleware - the middleware keeps only a timestamp.
        Auth::logoutOtherDevices($request->string('password')->value());

        // This DELETE is the only thing that actually evicts other devices. The
        // rehash above only forces other sessions to fail re-authentication if the
        // AuthenticateSession middleware is checking the password hash on every
        // request, and this starter does not register it (see the Profile Page
        // section of the README). Without SESSION_DRIVER=database this query has
        // no rows to act on, so nothing is logged out even though the flash
        // message below still claims success.
        DB::table('sessions')
            ->where('user_id', $request->user()->id)
            ->where('id', '!=', $currentSessionId)
            ->delete();

        return to_route('profile')->with('status', 'other-sessions-logged-out');
    }
}
