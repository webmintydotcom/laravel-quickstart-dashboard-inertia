import { Link, useForm } from '@inertiajs/react';
import type { FormEvent, ReactNode } from 'react';
import { route } from 'ziggy-js';

import { FormField } from '@/components/form-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/AppLayout';

import type { SelectOption, Vehicle } from './list';

interface VehicleEditProps {
    vehicle: Vehicle;
    backUrl: string;
    listQuery: Record<string, string | number>;
    statusOptions: SelectOption[];
    bodyTypeOptions: SelectOption[];
    fuelTypeOptions: SelectOption[];
}

function Group({ title, children }: { title: string; children: ReactNode }) {
    return (
        <Card>
            <CardContent>
                <h2 className="text-base font-semibold">{title}</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
            </CardContent>
        </Card>
    );
}

function SelectField({
    id,
    label,
    value,
    options,
    error,
    onChange,
}: {
    id: string;
    label: string;
    value: string;
    options: SelectOption[];
    error?: string;
    onChange: (value: string) => void;
}) {
    const errorId = `${id}-error`;

    return (
        <div className="space-y-2">
            <label htmlFor={id} className="text-sm font-medium">
                {label}
            </label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger
                    id={id}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : undefined}
                    className="w-full"
                >
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && (
                <p id={errorId} className="text-destructive text-sm">
                    {error}
                </p>
            )}
        </div>
    );
}

export default function VehicleEdit({
    vehicle,
    backUrl,
    listQuery,
    statusOptions,
    bodyTypeOptions,
    fuelTypeOptions,
}: VehicleEditProps) {
    const { data, setData, patch, processing, errors } = useForm({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        license_plate: vehicle.license_plate ?? '',
        body_type: vehicle.body_type,
        fuel_type: vehicle.fuel_type,
        odometer: vehicle.odometer,
        status: vehicle.status,
        assigned_driver: vehicle.assigned_driver ?? '',
        bookable: vehicle.bookable,
        purchased_on: vehicle.purchased_on,
        last_serviced_on: vehicle.last_serviced_on ?? '',
        purchase_price: vehicle.purchase_price,
        notes: vehicle.notes ?? '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        patch(route('vehicles.update', { vehicle: vehicle.stock_number, ...listQuery }));
    };

    return (
        <AppLayout title={`Edit ${vehicle.stock_number}`}>
            <div className="max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    {vehicle.stock_number}
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight lg:text-3xl">
                    Edit {vehicle.make} {vehicle.model}
                </h1>

                <form onSubmit={submit} className="mt-6 space-y-4">
                    <Group title="Identity">
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Stock number</p>
                            <p className="text-muted-foreground text-sm">{vehicle.stock_number}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium">VIN</p>
                            <p className="text-muted-foreground font-mono text-xs">{vehicle.vin}</p>
                        </div>
                        <p className="text-muted-foreground text-sm sm:col-span-2">
                            A VIN doesn't change, and the stock number is this vehicle's address — editing either one
                            would break every link to this record.
                        </p>
                        <FormField
                            id="license_plate"
                            label="License plate"
                            value={data.license_plate}
                            error={errors.license_plate}
                            onChange={(event) => setData('license_plate', event.target.value)}
                        />
                    </Group>

                    <Group title="Specification">
                        <FormField
                            id="make"
                            label="Make"
                            value={data.make}
                            error={errors.make}
                            onChange={(event) => setData('make', event.target.value)}
                        />
                        <FormField
                            id="model"
                            label="Model"
                            value={data.model}
                            error={errors.model}
                            onChange={(event) => setData('model', event.target.value)}
                        />
                        <FormField
                            id="year"
                            label="Year"
                            type="number"
                            value={data.year}
                            error={errors.year}
                            onChange={(event) => setData('year', Number(event.target.value))}
                        />
                        <FormField
                            id="color"
                            label="Color"
                            value={data.color}
                            error={errors.color}
                            onChange={(event) => setData('color', event.target.value)}
                        />
                        <SelectField
                            id="body_type"
                            label="Body type"
                            value={data.body_type}
                            options={bodyTypeOptions}
                            error={errors.body_type}
                            onChange={(value) => setData('body_type', value)}
                        />
                        <SelectField
                            id="fuel_type"
                            label="Fuel type"
                            value={data.fuel_type}
                            options={fuelTypeOptions}
                            error={errors.fuel_type}
                            onChange={(value) => setData('fuel_type', value)}
                        />
                        <FormField
                            id="odometer"
                            label="Odometer (miles)"
                            type="number"
                            value={data.odometer}
                            error={errors.odometer}
                            onChange={(event) => setData('odometer', Number(event.target.value))}
                        />
                    </Group>

                    <Group title="Status and assignment">
                        <SelectField
                            id="status"
                            label="Status"
                            value={data.status}
                            options={statusOptions}
                            error={errors.status}
                            onChange={(value) => setData('status', value)}
                        />
                        <FormField
                            id="assigned_driver"
                            label="Assigned driver"
                            value={data.assigned_driver}
                            error={errors.assigned_driver}
                            onChange={(event) => setData('assigned_driver', event.target.value)}
                        />
                        <FormField
                            id="purchased_on"
                            label="Purchased"
                            type="date"
                            value={data.purchased_on}
                            error={errors.purchased_on}
                            onChange={(event) => setData('purchased_on', event.target.value)}
                        />
                        <FormField
                            id="last_serviced_on"
                            label="Last serviced"
                            type="date"
                            value={data.last_serviced_on}
                            error={errors.last_serviced_on}
                            onChange={(event) => setData('last_serviced_on', event.target.value)}
                        />
                        <FormField
                            id="purchase_price"
                            label="Purchase price (USD)"
                            type="number"
                            step="0.01"
                            value={data.purchase_price}
                            error={errors.purchase_price}
                            onChange={(event) => setData('purchase_price', event.target.value)}
                        />
                        <div className="flex items-center justify-between gap-4 sm:col-span-2">
                            <label htmlFor="bookable" className="text-sm font-medium">
                                Available to book
                                <span className="text-muted-foreground block text-xs font-normal">
                                    Off means nobody can reserve this vehicle, whatever its status.
                                </span>
                            </label>
                            <Switch
                                id="bookable"
                                checked={data.bookable}
                                onCheckedChange={(checked) => setData('bookable', checked)}
                            />
                        </div>
                    </Group>

                    <Group title="Notes">
                        <div className="space-y-2 sm:col-span-2">
                            <label htmlFor="notes" className="text-sm font-medium">
                                Notes
                            </label>
                            <Textarea
                                id="notes"
                                rows={4}
                                value={data.notes}
                                aria-invalid={Boolean(errors.notes)}
                                aria-describedby={errors.notes ? 'notes-error' : undefined}
                                onChange={(event) => setData('notes', event.target.value)}
                            />
                            {errors.notes && (
                                <p id="notes-error" className="text-destructive text-sm">
                                    {errors.notes}
                                </p>
                            )}
                        </div>
                    </Group>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            Save changes
                        </Button>
                        <Button asChild variant="ghost">
                            <Link href={backUrl}>Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
