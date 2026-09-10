import AppLayout from '@/layouts/AppLayout';

import type { StatusOption, VehicleFilters, VehicleListMeta, VehicleRow } from './list';
import { VehiclesPager } from './vehicles-pager';
import { VehiclesTable } from './vehicles-table';
import { VehiclesToolbar } from './vehicles-toolbar';

interface VehiclesIndexProps {
    vehicles: {
        status: 'ready' | 'empty' | 'loading';
        rows: VehicleRow[];
        meta: VehicleListMeta;
        links: { prev: string | null; next: string | null };
    };
    filters: VehicleFilters;
    statusOptions: StatusOption[];
    listQuery: Record<string, string | number>;
}

export default function VehiclesIndex({ vehicles, filters, statusOptions, listQuery }: VehiclesIndexProps) {
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

                    <VehiclesToolbar filters={filters} statusOptions={statusOptions} />
                    <VehiclesTable rows={vehicles.rows} filters={filters} listQuery={listQuery} />
                    <VehiclesPager meta={vehicles.meta} links={vehicles.links} />
                </section>
            </div>
        </AppLayout>
    );
}
