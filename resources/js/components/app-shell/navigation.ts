import { LayoutDashboard, Settings, UserCircle, type LucideIcon } from 'lucide-react';

export interface NavItem {
    label: string;
    icon: LucideIcon;
    /** Ziggy route name. */
    route: string;
    /** Parameters for the Ziggy route, when it needs any. */
    params?: Record<string, string | number>;
    /** Ziggy pattern for the active check, when the route name alone is too narrow. */
    activeMatch?: string;
}

export interface NavGroup {
    heading?: string;
    items: NavItem[];
}

/**
 * The one file an application built on this starter edits to change its
 * navigation. Adding a destination is a single entry here.
 */
export const primaryNavigation: NavGroup[] = [
    {
        items: [{ label: 'Dashboard', icon: LayoutDashboard, route: 'dashboard' }],
    },
];

/** Anchored to the bottom of the sidebar in expanded, collapsed and drawer states. */
export const footerNavigation: NavGroup = {
    items: [
        { label: 'Profile', icon: UserCircle, route: 'profile' },
        { label: 'Settings', icon: Settings, route: 'settings', activeMatch: 'settings*' },
    ],
};
