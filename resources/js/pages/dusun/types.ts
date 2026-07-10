export type Dusun = {
    id: string;
    kode_dusun: string | null;
    nama_dusun: string;
    kepala_dusun: string | null;
    no_hp_kepala_dusun: string | null;
    keterangan: string | null;
    is_active: boolean;
    penduduk_count?: number;
};

export type DusunFormData = {
    kode_dusun: string;
    nama_dusun: string;
    kepala_dusun: string;
    no_hp_kepala_dusun: string;
    keterangan: string;
    is_active: boolean;
};

export type PendudukOption = {
    id: string;
    nik: string;
    nama_lengkap: string;
    no_hp: string | null;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedDusun = {
    data: Dusun[];
    current_page: number;
    from: number | null;
    last_page: number;
    links: PaginationLink[];
    per_page: number;
    to: number | null;
    total: number;
};

export type DusunFilters = {
    search: string;
};

export type DusunStats = {
    total: number;
    aktif: number;
    nonaktif: number;
};
