export type Appearance = 'light' | 'dark' | 'system';

/** Mirrors the inline script in app.blade.php. Inertia swaps by XHR and never
 *  re-renders the Blade root, so the class has to be applied client side too. */
export function applyAppearance(appearance: Appearance): void {
    const resolved =
        appearance === 'system'
            ? window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light'
            : appearance;

    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'system');
    root.classList.add(resolved);
}
