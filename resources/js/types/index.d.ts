export interface User {
    id: number;
    first_name: string;
    last_name: string;
    name: string;
    email: string;
    avatar_url: string | null;
}

export interface SharedProps {
    auth: {
        user: User | null;
    };
    flash: {
        status: string | null;
    };
    appearance: 'light' | 'dark' | 'system';
    sidebarCollapsed: boolean;
    [key: string]: unknown;
}
