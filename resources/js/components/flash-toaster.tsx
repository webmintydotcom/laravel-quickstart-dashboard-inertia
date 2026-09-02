import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { GooeyToaster, gooeyToast } from 'goey-toast';

import type { SharedProps } from '@/types';

const MESSAGES: Record<string, string> = {
    'settings-updated': 'Settings saved.',
};

/**
 * Turns the shared flash.status prop into a toast exactly once per value.
 * Toasts supplement validation and error UI; they never replace it.
 *
 * Renders the GooeyToaster viewport itself, so this must be mounted exactly
 * once — in AppLayout, not on individual pages — or no toast ever appears
 * (or a page-level mount would double-render the viewport).
 */
export function FlashToaster() {
    const { flash } = usePage<SharedProps>().props;
    const lastShown = useRef<string | null>(null);

    useEffect(() => {
        if (!flash.status || flash.status === lastShown.current) {
            return;
        }

        lastShown.current = flash.status;
        gooeyToast.success(MESSAGES[flash.status] ?? flash.status);
    }, [flash.status]);

    return <GooeyToaster />;
}
