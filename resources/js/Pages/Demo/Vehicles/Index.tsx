import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/AppLayout';

import type { StatusOption, VehicleFilters, VehicleListMeta, VehicleRow } from './list';
import { StatusBadge } from './status-badge';

interface VehiclesIndexProps {
    vehicles: {
        status: 'ready' | 'empty' | 'loading';
        rows: VehicleRow[];
        meta: VehicleListMeta;
        links: { prev: string | null; next: string | null };
    };
    filters: VehicleFilters;
    statusOptions: StatusOption[];
}

export default function VehiclesIndex({ vehicles }: VehiclesIndexProps) {
    return (
        <AppLayout title="Vehicles">
            <div className="px-4 py-6 sm:px-6 lg:px-8">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Fleet</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight lg:text-3xl">Vehicles</h1>
                <p className="text-muted-foreground mt-2 text-sm">
                    Every vehicle on the books, what it is, and who has it.
                </p>

                <section aria-labelledby="vehicles-heading" className="bg-card mt-6 overflow-hidden rounded-lg border">
                    <h2 id="vehicles-heading" className="sr-only">
                        Vehicle list
                    </h2>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Vehicle</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Odometer</TableHead>
                                    <TableHead>Driver</TableHead>
                                    <TableHead>Purchased</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vehicles.rows.map((vehicle) => (
                                    <TableRow key={vehicle.stock_number}>
                                        <TableCell className="font-medium">{vehicle.stock_number}</TableCell>
                                        <TableCell>
                                            <span className="font-medium">
                                                {vehicle.make} {vehicle.model}
                                            </span>
                                            <span className="text-muted-foreground block text-xs">
                                                {vehicle.year} · {vehicle.color}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={vehicle.status} label={vehicle.status_label} />
                                        </TableCell>
                                        <TableCell>{vehicle.odometer_label}</TableCell>
                                        <TableCell>{vehicle.assigned_driver ?? '—'}</TableCell>
                                        <TableCell>{vehicle.purchased_on_label}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
