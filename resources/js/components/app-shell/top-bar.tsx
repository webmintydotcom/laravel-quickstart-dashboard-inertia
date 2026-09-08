import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import type { RefObject } from 'react';

import { UserMenu } from '@/components/app-shell/user-menu';

interface TopBarProps {
    title: string;
    collapsed: boolean;
    drawerOpen: boolean;
    onToggleCollapse: () => void;
    onOpenDrawer: () => void;
    drawerTriggerRef: RefObject<HTMLButtonElement | null>;
}

export function TopBar({
    title,
    collapsed,
    drawerOpen,
    onToggleCollapse,
    onOpenDrawer,
    drawerTriggerRef,
}: TopBarProps) {
    return (
        <header className="bg-shell-raised text-shell-foreground flex h-16 shrink-0 items-center gap-3 px-4 sm:px-6">
            <button
                ref={drawerTriggerRef}
                type="button"
                onClick={onOpenDrawer}
                aria-label="Open navigation"
                aria-expanded={drawerOpen}
                className="grid size-11 place-items-center rounded-md hover:bg-white/10 lg:hidden"
            >
                <Menu className="size-5" aria-hidden="true" />
            </button>

            <button
                type="button"
                onClick={onToggleCollapse}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-expanded={!collapsed}
                aria-controls="app-sidebar"
                className="hidden size-11 place-items-center rounded-md hover:bg-white/10 lg:grid"
            >
                {collapsed ? (
                    <PanelLeftOpen className="size-5" aria-hidden="true" />
                ) : (
                    <PanelLeftClose className="size-5" aria-hidden="true" />
                )}
            </button>

            <p className="text-shell-muted-foreground truncate text-sm">{title}</p>

            <div className="flex-1" />

            <UserMenu />
        </header>
    );
}
