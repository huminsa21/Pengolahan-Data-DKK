export type User = {
    id: number;
    name: string;
    email: string | null;
    nik?: string | null;
    login_type?: 'EMAIL' | 'NIK';
    must_change_password?: boolean;
    is_active?: boolean;
    last_login_at?: string | null;
    roles?: string[];
    permissions?: string[];
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User | null;
};

/* @chisel-passkeys */
export type Passkey = {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};
/* @end-chisel-passkeys */
