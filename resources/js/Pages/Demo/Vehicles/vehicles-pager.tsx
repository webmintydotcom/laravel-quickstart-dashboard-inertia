import { Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';

import type { VehicleListMeta } from './list';

export function VehiclesPager({
    meta,
    links,
}: {
    meta: VehicleListMeta;
    links: { prev: string | null; next: string | null };
}) {
    return (
        <div className="flex min-h-11 items-center justify-between gap-4 border-t px-4 py-3 sm:px-5">
            <p className="text-muted-foreground text-sm" aria-live="polite">
                {meta.total === 0 ? 'No vehicles' : `${meta.from}–${meta.to} of ${meta.total} vehicles`}
            </p>

            <div className="flex items-center gap-2">
                {/* A disabled <Button asChild> wrapping a span is not disabled - asChild
                    hands the prop to the child, and a span has no disabled state. At
                    either end of the list, render an actually-disabled button instead. */}
                {links.prev === null ? (
                    <Button variant="outline" size="sm" disabled>
                        Previous
                    </Button>
                ) : (
                    <Button asChild variant="outline" size="sm">
                        <Link href={links.prev} preserveScroll>
                            Previous
                        </Link>
                    </Button>
                )}
                {links.next === null ? (
                    <Button variant="outline" size="sm" disabled>
                        Next
                    </Button>
                ) : (
                    <Button asChild variant="outline" size="sm">
                        <Link href={links.next} preserveScroll>
                            Next
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    );
}
