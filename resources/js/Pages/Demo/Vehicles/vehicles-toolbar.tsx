import { router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { route } from 'ziggy-js';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { listUrl, type SelectOption, type VehicleFilters } from './list';

const ALL_STATUSES = 'all';

export function VehiclesToolbar({
    filters,
    statusOptions,
    hasFilters,
}: {
    filters: VehicleFilters;
    statusOptions: SelectOption[];
    hasFilters: boolean;
}) {
    const [term, setTerm] = useState(filters.q);
    // The first render must not fire a visit - it would replay the search the
    // server has already run and answered.
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // A visit per keystroke would be a request per keystroke. 300ms is long
        // enough to swallow typing and short enough not to feel laggy.
        const timer = setTimeout(() => {
            router.get(
                listUrl(filters, { q: term, page: 1 }),
                {},
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 300);

        return () => clearTimeout(timer);
        // filters is intentionally omitted: this effect reacts to typing, and
        // including it would re-fire the moment the server answers.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [term]);

    return (
        <div className="flex flex-col gap-3 border-b px-4 py-4 sm:flex-row sm:items-center sm:px-5">
            <div className="relative flex-1">
                <Search
                    className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
                    aria-hidden="true"
                />
                <Input
                    id="vehicle-search"
                    type="search"
                    value={term}
                    onChange={(event) => setTerm(event.target.value)}
                    placeholder="Search stock number, VIN, plate, make, model or driver"
                    className="pl-9"
                    aria-label="Search vehicles"
                />
            </div>

            <Select
                value={filters.status === '' ? ALL_STATUSES : filters.status}
                onValueChange={(value) =>
                    router.get(
                        listUrl(filters, { status: value === ALL_STATUSES ? '' : value, page: 1 }),
                        {},
                        { preserveState: true, preserveScroll: true },
                    )
                }
            >
                <SelectTrigger id="vehicle-status" className="sm:w-48" aria-label="Filter by status">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={ALL_STATUSES}>All statuses</SelectItem>
                    {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {hasFilters && (
                <Button asChild variant="ghost">
                    <Link href={route('vehicles.index')}>Reset</Link>
                </Button>
            )}
        </div>
    );
}
