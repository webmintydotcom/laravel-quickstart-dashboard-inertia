import { route } from 'ziggy-js';

export interface VehicleRow {
    stock_number: string;
    make: string;
    model: string;
    year: number;
    color: string;
    status: string;
    status_label: string;
    odometer: number;
    odometer_label: string;
    assigned_driver: string | null;
    purchased_on_label: string;
}

export interface VehicleFilters {
    q: string;
    status: string;
    sort: string;
    direction: string;
}

export interface VehicleListMeta {
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
}

/** Shared by every status/body-type/fuel-type dropdown the demo renders. */
export interface SelectOption {
    value: string;
    label: string;
}

export interface Vehicle {
    stock_number: string;
    vin: string;
    license_plate: string | null;
    make: string;
    model: string;
    year: number;
    color: string;
    body_type: string;
    body_type_label: string;
    fuel_type: string;
    fuel_type_label: string;
    odometer: number;
    odometer_label: string;
    status: string;
    status_label: string;
    assigned_driver: string | null;
    bookable: boolean;
    purchased_on: string;
    purchased_on_label: string;
    last_serviced_on: string | null;
    last_serviced_on_label: string | null;
    purchase_price: string;
    purchase_price_label: string;
    notes: string | null;
}

/**
 * Every link on this page is the current filters with one thing changed. Built
 * here rather than from location.search so it works under SSR, and defaults are
 * dropped so the URL stays short and shareable.
 */
export function listUrl(
    filters: VehicleFilters,
    overrides: Partial<Record<'q' | 'status' | 'sort' | 'direction' | 'page', string | number>>,
): string {
    const merged = { page: 1, ...filters, ...overrides };
    const query: Record<string, string | number> = {};

    if (merged.q) query.q = merged.q;
    if (merged.status) query.status = merged.status;
    if (merged.sort && merged.sort !== 'stock_number') query.sort = merged.sort;
    if (merged.direction && merged.direction !== 'asc') query.direction = merged.direction;
    if (Number(merged.page) > 1) query.page = Number(merged.page);

    return route('vehicles.index', query);
}
