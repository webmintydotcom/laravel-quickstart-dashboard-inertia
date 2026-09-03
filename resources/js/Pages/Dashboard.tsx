import { usePage } from '@inertiajs/react';

import AppLayout from '@/layouts/AppLayout';
import type { SharedProps } from '@/types';

// Intentionally unrouted while the demo dashboard is installed. This is the
// fallback that removing the demo dashboard's code restores: point the
// /dashboard route back at DashboardController and this page renders again
// unmodified.
export default function Dashboard() {
    const { auth } = usePage<SharedProps>().props;

    return (
        <AppLayout title="Dashboard">
            <div className="px-4 py-6 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">Dashboard</h1>
                <p className="text-muted-foreground mt-2 text-sm">Signed in as {auth.user?.name}</p>
            </div>
        </AppLayout>
    );
}
