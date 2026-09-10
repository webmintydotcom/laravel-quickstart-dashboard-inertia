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
