import type { RefObject } from 'react';

import { Sidebar } from '@/components/app-shell/sidebar';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';

interface MobileDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    triggerRef: RefObject<HTMLButtonElement | null>;
}

export function MobileDrawer({ open, onOpenChange, triggerRef }: MobileDrawerProps) {
    return (
        <Sheet
            open={open}
            onOpenChange={(details) => onOpenChange(details.open)}
            // Ark restores focus to whatever held it when the sheet opened. Safari does
            // not focus a button on tap, so on the drawer's primary platform that would be
            // <body>. Restore to the trigger explicitly instead.
            finalFocusEl={() => triggerRef.current}
        >
            {/* Always full labelled width - desktop collapse must never reach the drawer. */}
            <SheetContent placement="left" className="bg-shell text-shell-foreground w-64 max-w-none border-none p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <Sidebar collapsed={false} onNavigate={() => onOpenChange(false)} />
            </SheetContent>
        </Sheet>
    );
}
