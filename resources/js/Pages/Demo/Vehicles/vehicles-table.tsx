import { Link } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { route } from 'ziggy-js';

import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { PanelEmpty } from '../panel-state';
import { listUrl, type VehicleFilters, type VehicleRow } from './list';
import { StatusBadge } from './status-badge';

const COLUMNS: { key: string; label: string; sortable: boolean }[] = [
    { key: 'stock_number', label: 'Stock', sortable: true },
    { key: 'make', label: 'Vehicle', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'odometer', label: 'Odometer', sortable: true },
    { key: 'assigned_driver', label: 'Driver', sortable: false },
    { key: 'purchased_on', label: 'Purchased', sortable: true },
];

function SortHeader({ column, label, filters }: { column: string; label: string; filters: VehicleFilters }) {
    const isActive = filters.sort === column;
    const nextDirection = isActive && filters.direction === 'asc' ? 'desc' : 'asc';
    const Icon = !isActive ? ChevronsUpDown : filters.direction === 'asc' ? ArrowUp : ArrowDown;

    return (
        <Link
            href={listUrl(filters, { sort: column, direction: nextDirection, page: 1 })}
            preserveScroll
            className="inline-flex items-center gap-1.5 hover:underline"
            aria-label={`Sort by ${label}, ${nextDirection === 'asc' ? 'ascending' : 'descending'}`}
        >
            {label}
            <Icon className={isActive ? 'h-3.5 w-3.5' : 'text-muted-foreground h-3.5 w-3.5'} aria-hidden="true" />
        </Link>
    );
}

export function VehiclesTable({
    rows,
    filters,
    listQuery,
    status,
    hasFilters,
}: {
    rows: VehicleRow[];
    filters: VehicleFilters;
    listQuery: Record<string, string | number>;
    status: 'ready' | 'empty' | 'loading';
    hasFilters: boolean;
}) {
    if (status === 'loading') {
        return (
            <div className="divide-y" aria-busy="true">
                <span className="sr-only">Loading vehicles…</span>
                {Array.from({ length: 10 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
                        <div className="min-w-0 flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-3 w-1/3" />
                        </div>
                        <Skeleton className="h-4 w-20 shrink-0" />
                    </div>
                ))}
            </div>
        );
    }

    if (status === 'empty' || rows.length === 0) {
        // Two different nothings. "No vehicles yet" is a fleet waiting to be
        // filled; "nothing matches" is a filter the visitor can undo - and only
        // the second one gets an escape hatch.
        return hasFilters ? (
            <PanelEmpty
                title="No vehicles match those filters"
                detail="Clear the search or choose a different status."
                className="py-16"
            />
        ) : (
            <PanelEmpty
                title="No vehicles yet"
                detail="Vehicles appear here once they're added to the fleet."
                className="py-16"
            />
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        {COLUMNS.map((column) => (
                            <TableHead
                                key={column.key}
                                aria-sort={
                                    filters.sort === column.key
                                        ? filters.direction === 'asc'
                                            ? 'ascending'
                                            : 'descending'
                                        : undefined
                                }
                            >
                                {column.sortable ? (
                                    <SortHeader column={column.key} label={column.label} filters={filters} />
                                ) : (
                                    column.label
                                )}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((vehicle) => (
                        <TableRow key={vehicle.stock_number}>
                            <TableCell className="font-medium">
                                <Link
                                    href={route('vehicles.show', { vehicle: vehicle.stock_number, ...listQuery })}
                                    className="hover:underline focus-visible:underline"
                                >
                                    {vehicle.stock_number}
                                    <span className="sr-only">
                                        {' '}
                                        — {vehicle.make} {vehicle.model}
                                    </span>
                                </Link>
                            </TableCell>
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
    );
}
