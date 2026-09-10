import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { route } from 'ziggy-js';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/AppLayout';

import type { Vehicle } from './list';
import { StatusBadge } from './status-badge';

/** A missing value is an em dash, never blank space - blank reads as a bug. */
function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div>
            <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</dt>
            <dd className="mt-1 text-sm">{children ?? '—'}</dd>
        </div>
    );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
    return (
        <Card>
            <CardContent>
                <h2 className="text-base font-semibold">{title}</h2>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2">{children}</dl>
            </CardContent>
        </Card>
    );
}

export default function VehicleShow({ vehicle, backUrl }: { vehicle: Vehicle; backUrl: string }) {
    return (
        <AppLayout title={`${vehicle.make} ${vehicle.model}`}>
            <div className="max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
                <Link
                    href={backUrl}
                    className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back to vehicles
                </Link>

                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                            {vehicle.stock_number}
                        </p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight lg:text-3xl">
                            {vehicle.make} {vehicle.model}
                        </h1>
                        <div className="mt-2 flex items-center gap-2">
                            <StatusBadge status={vehicle.status} label={vehicle.status_label} />
                            <span className="text-muted-foreground text-sm">
                                {vehicle.year} · {vehicle.color}
                            </span>
                        </div>
                    </div>

                    <Button asChild>
                        <Link href={route('vehicles.edit', vehicle.stock_number)}>Edit vehicle</Link>
                    </Button>
                </div>

                <div className="mt-6 space-y-4">
                    <Group title="Identity">
                        <Field label="Stock number">{vehicle.stock_number}</Field>
                        <Field label="VIN">
                            <span className="font-mono text-xs">{vehicle.vin}</span>
                        </Field>
                        <Field label="License plate">{vehicle.license_plate}</Field>
                    </Group>

                    <Group title="Specification">
                        <Field label="Make">{vehicle.make}</Field>
                        <Field label="Model">{vehicle.model}</Field>
                        <Field label="Year">{vehicle.year}</Field>
                        <Field label="Color">{vehicle.color}</Field>
                        <Field label="Body type">{vehicle.body_type_label}</Field>
                        <Field label="Fuel type">{vehicle.fuel_type_label}</Field>
                        <Field label="Odometer">{vehicle.odometer_label}</Field>
                    </Group>

                    <Group title="Status and assignment">
                        <Field label="Status">{vehicle.status_label}</Field>
                        <Field label="Assigned driver">{vehicle.assigned_driver}</Field>
                        <Field label="Available to book">{vehicle.bookable ? 'Yes' : 'No'}</Field>
                        <Field label="Purchased">{vehicle.purchased_on_label}</Field>
                        <Field label="Last serviced">{vehicle.last_serviced_on_label}</Field>
                        <Field label="Purchase price">{vehicle.purchase_price_label}</Field>
                    </Group>

                    <Group title="Notes">
                        <Field label="Notes">{vehicle.notes}</Field>
                    </Group>
                </div>
            </div>
        </AppLayout>
    );
}
