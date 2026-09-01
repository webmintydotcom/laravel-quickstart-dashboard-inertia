/// <reference types="vite/client" />

import { route as ziggyRoute } from 'ziggy-js';

interface ImportMetaEnv {
    readonly VITE_APP_NAME: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare global {
    var route: typeof ziggyRoute;
}
