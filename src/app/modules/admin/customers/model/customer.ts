export interface Customer {
    id?: number | null;
    name: string;
    type: string;
    email: string;
    city: string;
    state: string;
    address: string;
    postalCode: string;
}

export interface Links {
    first: string;
    last: string;
    prev: string;
    next: string;
}

export interface Meta {
    current_page: number;
    from: number;
    last_page: number;
    links: any;
    path: string;
    per_page: number;
    to: number;
    total: number;
}
export interface CustomerResponse {
    data: Customer[];
    links: Links;
    meta: Meta;
}