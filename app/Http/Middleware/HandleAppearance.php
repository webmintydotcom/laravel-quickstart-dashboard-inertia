<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Enums\Appearance;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

final class HandleAppearance
{
    /**
     * Resolves the appearance for any context that needs it (the shared view
     * and the Inertia shared prop), so both stay in agreement for guests too.
     */
    public static function resolve(Request $request): string
    {
        return $request->user()?->appearance->value ?? self::fromCookie($request);
    }

    /**
     * Shares the resolved appearance with the root view so the class lands on
     * <html> in the server response. Without this the page paints in the wrong
     * theme and corrects itself after hydration, which reads as a flash.
     *
     * The user record is the source of truth; the cookie only covers guests and
     * the window before props are read.
     */
    public function handle(Request $request, Closure $next): Response
    {
        View::share('appearance', self::resolve($request));

        return $next($request);
    }

    private static function fromCookie(Request $request): string
    {
        $cookie = $request->cookie('appearance');

        return is_string($cookie) && Appearance::tryFrom($cookie) instanceof Appearance
            ? $cookie
            : Appearance::System->value;
    }
}
