export interface User {
    id: number;
    first_name: string;
    last_name: string;
    name: string;
    email: string;
}

export interface SharedProps {
    auth: {
        user: User | null;
    };
    flash: {
        status: string | null;
    };
    [key: string]: unknown;
}
