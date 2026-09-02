import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { route } from 'ziggy-js';

import AppLayout from '@/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { applyAppearance, type Appearance } from '@/lib/appearance';
import { cn } from '@/lib/utils';

interface TimezoneOption {
    value: string;
    label: string;
    offset: string;
}

interface SettingsProps {
    settings: { appearance: string; timezone: string };
    timezones: Record<string, TimezoneOption[]>;
}

const APPEARANCES = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
];

export default function Settings({ settings, timezones }: SettingsProps) {
    const { data, setData, patch, processing, errors } = useForm({
        appearance: settings.appearance,
        timezone: settings.timezone,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        patch(route('settings.update'), {
            preserveScroll: true,
            // The appearance class was already applied optimistically on
            // selection (see the radio's onChange below). If the save is
            // rejected, the document is left showing an appearance the
            // server never persisted, so fall back to the last confirmed
            // value here.
            onError: (formErrors) => {
                if (formErrors.appearance) {
                    applyAppearance(settings.appearance as Appearance);
                }
            },
        });
    };

    return (
        <AppLayout title="Settings">
            <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">Settings</h1>
                <p className="text-muted-foreground mt-2 text-sm">Appearance and regional preferences.</p>

                <form onSubmit={submit} className="mt-6 space-y-6">
                    <Card>
                        <CardContent className="p-5">
                            <h2 className="text-base font-semibold">Appearance</h2>
                            <p className="text-muted-foreground mt-1 text-sm">
                                System follows your device setting.
                            </p>

                            <fieldset className="mt-4">
                                <legend className="sr-only">Appearance</legend>
                                <div className="flex flex-wrap gap-2">
                                    {APPEARANCES.map((option) => (
                                        <label
                                            key={option.value}
                                            className={cn(
                                                'flex min-h-11 cursor-pointer items-center rounded-md border px-4 text-sm',
                                                data.appearance === option.value
                                                    ? 'border-primary bg-accent text-accent-foreground font-medium'
                                                    : 'hover:bg-accent/50',
                                            )}
                                        >
                                            <input
                                                type="radio"
                                                name="appearance"
                                                value={option.value}
                                                checked={data.appearance === option.value}
                                                onChange={(event) => {
                                                    const value = event.target.value as Appearance;
                                                    setData('appearance', value);
                                                    applyAppearance(value);
                                                }}
                                                className="sr-only"
                                            />
                                            {option.label}
                                        </label>
                                    ))}
                                </div>
                            </fieldset>

                            {errors.appearance && (
                                <p className="text-destructive mt-2 text-sm">{errors.appearance}</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-5">
                            <h2 className="text-base font-semibold">General</h2>

                            <div className="mt-4 max-w-sm space-y-2">
                                <label htmlFor="timezone" className="text-sm font-medium">
                                    Timezone
                                </label>
                                <Select value={data.timezone} onValueChange={(value) => setData('timezone', value)}>
                                    <SelectTrigger id="timezone" className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(timezones).map(([region, zones]) =>
                                            zones.map((zone) => (
                                                <SelectItem key={zone.value} value={zone.value}>
                                                    {region} / {zone.label} ({zone.offset})
                                                </SelectItem>
                                            )),
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.timezone && <p className="text-destructive text-sm">{errors.timezone}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Button type="submit" disabled={processing}>
                        Save changes
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
