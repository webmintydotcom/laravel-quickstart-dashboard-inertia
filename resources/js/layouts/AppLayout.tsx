import { Head, usePage } from '@inertiajs/react';
import { useState, type ReactNode } from 'react';

import { MobileDrawer } from '@/components/app-shell/mobile-drawer';
import { Sidebar } from '@/components/app-shell/sidebar';
import { TopBar } from '@/components/app-shell/top-bar';
import type { SharedProps } from '@/types';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
    title: string;
    children: ReactNode;
}

export default function AppLayout({ title, children }: AppLayoutProps) {
    const { sidebarCollapsed } = usePage<SharedProps>().props;

    // Seeded from a server-rendered prop, never from localStorage: this repo has
    // SSR wired, and a render-time browser API read would break it.
    const [collapsed, setCollapsed] = useState(sidebarCollapsed);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleCollapse = () => {
        const next = !collapsed;
        setCollapsed(next);
        document.cookie = `sidebar_collapsed=${next ? '1' : '0'};path=/;max-age=31536000;SameSite=Lax`;
    };

    return (
        <>
            <Head title={title} />

            <a
                href="#main-content"
                className="bg-background focus:ring-ring sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:ring-2"
            >
                Skip to content
            </a>

            <div className="flex min-h-screen">
                <aside
                    id="app-sidebar"
                    aria-label="Primary navigation"
                    className={cn('hidden shrink-0 lg:block', collapsed ? 'w-18' : 'w-64')}
                >
                    <div className="sticky top-0 h-screen">
                        <Sidebar collapsed={collapsed} />
                    </div>
                </aside>

                <div id="app-drawer">
                    <MobileDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                    <TopBar
                        title={title}
                        collapsed={collapsed}
                        onToggleCollapse={toggleCollapse}
                        onOpenDrawer={() => setDrawerOpen(true)}
                    />

                    <main id="main-content" tabIndex={-1} className="bg-background flex-1 focus:outline-none">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
