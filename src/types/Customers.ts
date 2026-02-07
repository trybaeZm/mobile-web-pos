export type Customers = {
    id: string; // uuid
    customer_id?: number; // integer (optional as likely auto-increment/read-only)
    business_id: string; // uuid
    int_business_id?: number; // integer
    name: string; // character varying
    email: string; // character varying
    phone: string; // character varying
    location: string; // character varying
    gender: 'male' | 'female' | string; // character varying
    created_at: string; // timestamp without time zone

    // Keeping these as optional if frontend still references them briefly, 
    // but arguably they should be removed if completely gone from DB.
    password?: string;
    image_url?: string;
    role?: string;
};

export type UsersType = {
    id: string; // uuid
    user_id: number; // integer
    name: string; // character varying
    email: string; // character varying
    password_hash: string; // character varying
    role: string; // character varying
    created_at: string; // timestamp without time zone
    phone: string; // text
    location: string; // text
    hasSubscription: boolean; // boolean
    ref_code: string; // uuid
    image_url: string; // text
};

export type CustomerPrice = {
    id: string;
    name: string;
    amount: number;
};

export type LocationType = {
    location: string;
    number: number
}
export type genderType = { male: number; female: number }
