export interface User {
    id: number;
    first_name: string;
    last_name: string;
    name: string;
    email: string;
    avatar_url: string | null;
}

/**
 * One row of the profile page's session list. Deliberately has no id field -
 * a session id is a credential and the backend never sends one (see
 * App\Data\SessionData).
 */
export interface Session {
    device: string;
    ip_address: string | null;
    last_active: string;
    is_current: boolean;
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
