/// <reference types="vite/client" />

import { route as ziggyRoute, type Config as ZiggyConfig } from 'ziggy-js';

interface ImportMetaEnv {
    readonly VITE_APP_NAME: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare global {
    var route: typeof ziggyRoute;

    /**
     * Ziggy reads its route list from this global. The @routes Blade directive
     * defines it in the browser; resources/js/ssr.tsx assigns it from a shared
     * Inertia prop so route() also works under server-side rendering.
     */
    var Ziggy: ZiggyConfig | undefined;
}
