import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import { UserMenu } from '@/components/app-shell/user-menu';

interface TopBarProps {
    title: string;
    collapsed: boolean;
    onToggleCollapse: () => void;
    onOpenDrawer: () => void;
}

export function TopBar({ title, collapsed, onToggleCollapse, onOpenDrawer }: TopBarProps) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-3 bg-stone-900 px-4 text-white sm:px-6">
            <button
                type="button"
                onClick={onOpenDrawer}
                aria-label="Open navigation"
                aria-controls="app-drawer"
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

            <p className="truncate text-sm text-stone-400">{title}</p>

            <div className="flex-1" />

            <UserMenu />
        </header>
    );
}
