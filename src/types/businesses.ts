export type businessType = {
    business_id: string
    created_at: string
    id: string
    int_business_id: number
    int_user_id: number
    owner_id: number
    user_id: string
}

export type businessesType = {
    id: string;
    business_id: string;
    user_id: string;
    owner_id: number;
    int_user_id: number;
    int_business_id: number;
    created_at: string; // or `Date` if you parse it
}

export type businessOnwersType = {
    business_id: string;
    created_at: string; // ISO date string
    id: string;
    int_business_id: number;
    int_user_id: number;
    owner_id: number;
    user_id: string;
}

export type BusinessType = {
    hasWallet: boolean;
    id?: string;
    imageName: string;
    business_id: number;
    company_alias: string;
    business_name: string;
    industry?: string;
    registration_number?: string;
    created_at?: string;
    deleted_at?: string | null;
    phone?: string;
    is_deleted: boolean;
    business_type: string;
    is_active: boolean
    status: string;
    types: string
}

export interface BusinessReferralType {
    id: string
}
