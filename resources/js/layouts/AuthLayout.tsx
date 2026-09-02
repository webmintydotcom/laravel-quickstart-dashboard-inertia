import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
    title: string;
    description: string;
    children: ReactNode;
}

export default function AuthLayout({ title, description, children }: AuthLayoutProps) {
    return (
        <>
            <Head title={title} />

            <div className="bg-muted/40 text-foreground flex min-h-screen flex-col items-center justify-center px-4 py-12">
                <div className="w-full max-w-sm">
                    <Link href="/" className="text-primary block text-center text-lg font-bold tracking-tight">
                        Webminty
                    </Link>

                    <div className="bg-card mt-6 rounded-xl border p-6 shadow-sm">
                        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
                        <p className="text-muted-foreground mt-1 text-sm">{description}</p>

                        <div className="mt-6">{children}</div>
                    </div>
                </div>
            </div>
        </>
    );
}
