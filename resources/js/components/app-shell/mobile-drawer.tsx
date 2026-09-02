import { Sidebar } from '@/components/app-shell/sidebar';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';

interface MobileDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MobileDrawer({ open, onOpenChange }: MobileDrawerProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            {/* Always full labelled width - desktop collapse must never reach the drawer. */}
            <SheetContent side="left" className="w-64 border-none bg-stone-950 p-0 text-white">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <Sidebar collapsed={false} onNavigate={() => onOpenChange(false)} />
            </SheetContent>
        </Sheet>
    );
}
