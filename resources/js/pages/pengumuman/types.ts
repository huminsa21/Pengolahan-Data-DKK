export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type Pengumuman = {
    id: string;
    judul: string;
    isi: string;
    tanggal_publish: string | null;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | string;
    created_by: number;
    bantuan_count?: number;
    pembuat?: {
        id: number;
        name: string;
    } | null;
};

export type PengumumanFormData = {
    judul: string;
    isi: string;
    tanggal_publish: string;
    status: string;
};

export type PengumumanOptions = {
    status: string[];
};

export type PengumumanFilters = {
    search: string;
    status: string;
};

export type PengumumanStats = {
    total: number;
    draft: number;
    published: number;
    archived: number;
};

export type PaginatedPengumuman = {
    data: Pengumuman[];
    current_page: number;
    from: number | null;
    last_page: number;
    links: PaginationLink[];
    per_page: number;
    to: number | null;
    total: number;
};
