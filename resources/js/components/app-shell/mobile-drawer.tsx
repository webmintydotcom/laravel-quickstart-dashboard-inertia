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
        <Sheet open={open} onOpenChange={onOpenChange}>
            {/* Always full labelled width - desktop collapse must never reach the drawer. */}
            <SheetContent
                side="left"
                className="w-64 border-none bg-stone-950 p-0 text-white"
                onCloseAutoFocus={(event) => {
                    // Radix restores focus to whatever held it when the sheet opened. Safari does
                    // not focus a button on tap, so on the drawer's primary platform that would be
                    // <body>. Restore explicitly instead.
                    event.preventDefault();
                    triggerRef.current?.focus();
                }}
            >
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <Sidebar collapsed={false} onNavigate={() => onOpenChange(false)} />
            </SheetContent>
        </Sheet>
    );
}
