import { createInertiaApp } from '@inertiajs/react';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// SSR is not wired up yet. `npm run build:ssr` does produce a bundle - the @inertiajs/vite
// plugin injects page resolution and the server bootstrap into this entry - but rendering
// an auth page in Node still throws: every screen under Pages/Auth calls route() from
// ziggy-js, and Ziggy reads its route list from a global that only the @routes Blade
// directive defines in the browser. There is no window and no document server side, so the
// first route() call fails. Enabling SSR means handing Ziggy its config here, before
// createInertiaApp renders anything.
createInertiaApp({
    title: (title) => `${title} - ${appName}`,
});
