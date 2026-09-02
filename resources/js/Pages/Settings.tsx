import { Head } from '@inertiajs/react';

interface SettingsProps {
    settings: {
        appearance: string;
        timezone: string;
    };
    timezones: Record<string, Array<{ value: string; label: string; offset: string }>>;
}

export default function Settings({ settings, timezones }: SettingsProps) {
    return (
        <>
            <Head title="Settings" />

            <div className="bg-background text-foreground min-h-screen px-6 py-10">
                <div className="mx-auto max-w-4xl">
                    <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
                </div>
            </div>
        </>
    );
}
