export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: 'super_admin' | 'tenant_admin' | 'staff' | 'customer';
    is_active: boolean;
    email_verified_at?: string;
    created_at?: string;
}

export interface Tenant {
    id: number;
    name: string;
    slug: string;
    logo?: string;
    address?: string;
    phone?: string;
    email?: string;
    plan: 'free' | 'starter' | 'pro' | 'enterprise';
    is_active: boolean;
    bookings_count?: number;
}

export interface Court {
    id: number;
    tenant_id: number;
    name: string;
    type: string;
    location?: string;
    capacity: number;
    price_per_hour: number;
    open_time: string;
    close_time: string;
    weekend_open_time?: string;
    weekend_close_time?: string;
    is_active: boolean;
}

export interface Booking {
    id: number;
    tenant_id: number;
    user_id: number;
    court_id: number;
    date: string;
    start_time: string;
    end_time: string;
    team_name: string;
    phone: string;
    notes?: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
    created_at?: string;
    court?: Court;
    user?: User;
    payment?: Payment;
}

export interface Payment {
    id: number;
    booking_id: number;
    method: string;
    amount: number;
    proof?: string;
    status: 'unpaid' | 'paid' | 'verified' | 'refunded';
}

export interface TarifRule {
    id: number;
    type: string;
    slot: string;
    weekday_price: number;
    weekend_price: number;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: { user: User };
};
