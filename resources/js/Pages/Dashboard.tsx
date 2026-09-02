import { Head, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

import { Button } from '@/components/ui/button';
import type { SharedProps } from '@/types';

export default function Dashboard() {
    const { auth } = usePage<SharedProps>().props;

    return (
        <>
            <Head title="Dashboard" />

            <div className="bg-background text-foreground min-h-screen px-6 py-10">
                <div className="mx-auto flex max-w-4xl items-start justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Signed in as {auth.user?.name}</p>
                    </div>

                    <Button variant="outline" onClick={() => router.post(route('logout'))}>
                        Log out
                    </Button>
                </div>
            </div>
        </>
    );
}
