export type JenisSurat = {
    id: string;
    kode_surat: string;
    nama_surat: string;
    template_surat: string | null;
    is_active: boolean;
    surat_count?: number;
    created_at?: string;
    updated_at?: string;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type Paginated<T> = {
    data: T[];
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
};
