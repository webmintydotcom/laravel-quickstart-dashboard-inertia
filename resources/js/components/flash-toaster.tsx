import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { GooeyToaster, gooeyToast } from 'goey-toast';

import type { SharedProps } from '@/types';

const MESSAGES: Record<string, string> = {
    'settings-updated': 'Settings saved.',
};

/**
 * Turns the shared flash.status prop into a toast exactly once per server
 * response. Toasts supplement validation and error UI; they never replace it.
 *
 * Renders the GooeyToaster viewport itself, so this must be mounted exactly
 * once — in AppLayout, not on individual pages — or no toast ever appears
 * (or a page-level mount would double-render the viewport).
 */
export function FlashToaster() {
    const { flash } = usePage<SharedProps>().props;

    useEffect(() => {
        if (flash.status) {
            gooeyToast.success(MESSAGES[flash.status] ?? flash.status);
        }
    }, [flash]);

    return <GooeyToaster />;
}
