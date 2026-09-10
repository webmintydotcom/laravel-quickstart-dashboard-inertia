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

export interface StatusOption {
    value: string;
    label: string;
}
