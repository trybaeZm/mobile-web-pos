export interface AuthenticatedUser {
    id: string;
    aud: string;
    role: string;
    email: string;
    email_confirmed_at: string | null;
    phone: string;
    confirmed_at: string | null;
    last_sign_in_at: string | null;
    app_metadata: {
        provider?: string;
        providers?: string[];
        [key: string]: unknown;
    };
    user_metadata: {
        email?: string;
        name?: string;
        avatar_url?: string;
        full_name?: string;
        [key: string]: unknown;
    };
    identities?: Array<{
        id: string;
        user_id: string;
        identity_data: GoogleIdentityData;
        provider: string;
        last_sign_in_at: string | null;
        created_at: string | null;
        updated_at: string | null;
    }>;
    created_at: string;
    updated_at: string;
}

export interface GoogleIdentityData {
    avatar_url: string;
    email: string;
    email_verified: boolean;
    full_name: string;
    iss: string; // issuer (Google)
    name: string;
    phone_verified: boolean;
    picture: string;
    provider_id: string;
    sub: string;
}
