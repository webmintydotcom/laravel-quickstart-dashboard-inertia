import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

import type { NavItem } from '@/components/app-shell/navigation';
import { cn } from '@/lib/utils';

interface SidebarLinkProps {
    item: NavItem;
    collapsed: boolean;
    onNavigate?: () => void;
}

export function SidebarLink({ item, collapsed, onNavigate }: SidebarLinkProps) {
    const Icon = item.icon;
    const isActive = route().current(item.activeMatch ?? item.route);

    return (
        <Link
            href={route(item.route, item.params)}
            onClick={onNavigate}
            aria-current={isActive ? 'page' : undefined}
            aria-label={collapsed ? item.label : undefined}
            title={collapsed ? item.label : undefined}
            className={cn(
                'flex min-h-11 items-center gap-3 border-l-[3px] px-4 text-sm transition-colors',
                collapsed && 'justify-center px-0',
                isActive
                    ? 'border-l-mint-500 text-shell-foreground bg-white/5 font-medium'
                    : 'text-shell-muted-foreground hover:text-shell-foreground border-l-transparent',
            )}
        >
            <Icon className="size-5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
            {!collapsed && <span className="truncate">{item.label}</span>}
        </Link>
    );
}
