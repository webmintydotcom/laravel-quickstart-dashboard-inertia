import { Link } from '@inertiajs/react';

import { SidebarLink } from '@/components/app-shell/sidebar-link';
import { footerNavigation, primaryNavigation } from '@/components/app-shell/navigation';
import { cn } from '@/lib/utils';

interface SidebarProps {
    collapsed: boolean;
    onNavigate?: () => void;
}

export function Sidebar({ collapsed, onNavigate }: SidebarProps) {
    return (
        <div className="flex h-full flex-col bg-stone-950 text-white">
            <Link
                href="/"
                className={cn('flex h-16 items-center gap-3 px-4 font-semibold', collapsed && 'justify-center px-0')}
            >
                <span className="bg-mint-500 text-mint-950 grid size-7 shrink-0 place-items-center rounded-md text-sm font-semibold">
                    W
                </span>
                {!collapsed && <span className="truncate">Webminty</span>}
            </Link>

            <nav aria-label="Primary" className="flex-1 space-y-1 overflow-y-auto py-3">
                {primaryNavigation.map((group, index) => (
                    <div key={group.heading ?? index} className="space-y-1 py-1">
                        {group.heading && !collapsed && (
                            <p className="px-4 py-1 text-[11px] font-semibold tracking-wider text-stone-500 uppercase">
                                {group.heading}
                            </p>
                        )}
                        {group.items.map((item) => (
                            <SidebarLink key={item.route} item={item} collapsed={collapsed} onNavigate={onNavigate} />
                        ))}
                    </div>
                ))}
            </nav>

            <div className="border-t border-white/10 py-2">
                {footerNavigation.items.map((item) => (
                    <SidebarLink key={item.route} item={item} collapsed={collapsed} onNavigate={onNavigate} />
                ))}
            </div>
        </div>
    );
}
