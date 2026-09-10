import { Link } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { route } from 'ziggy-js';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
}: {
    rows: VehicleRow[];
    filters: VehicleFilters;
    listQuery: Record<string, string | number>;
}) {
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
