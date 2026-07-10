export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type Bantuan = {
    id: string;
    kode_bantuan: string;
    nama_bantuan: string;
    jenis_bantuan: string;
    sumber_bantuan: string;
    tahun: number | null;
    deskripsi: string | null;
    status: 'AKTIF' | 'NONAKTIF' | string;
    is_published: boolean;
    published_at: string | null;
    pengumuman_id: string | null;
    tampilkan_penerima: boolean;
    penerima_bantuan_count?: number;
    pengumuman?: {
        id: string;
        judul: string;
        status: string;
        tanggal_publish: string | null;
    } | null;
};

export type BantuanFormData = {
    kode_bantuan: string;
    nama_bantuan: string;
    jenis_bantuan: string;
    sumber_bantuan: string;
    tahun: string;
    deskripsi: string;
    status: string;
    tampilkan_penerima: boolean;
};

export type BantuanOptions = {
    status: string[];
};

export type BantuanFilters = {
    search: string;
    status: string;
    tahun: string;
    is_published: string;
};

export type BantuanStats = {
    total: number;
    aktif: number;
    nonaktif: number;
    dipublikasikan: number;
    total_penerima: number;
};

export type PaginatedBantuan = {
    data: Bantuan[];
    current_page: number;
    from: number | null;
    last_page: number;
    links: PaginationLink[];
    per_page: number;
    to: number | null;
    total: number;
};

export type PendudukOption = {
    id: string;
    dusun_id: string | null;
    nik: string | null;
    nama_lengkap: string;
    dusun: string;
    rt: string;
    rw: string;
    wilayah_dusun?: {
        id: string;
        nama_dusun: string;
    } | null;
};

export type PenerimaBantuan = {
    id: string;
    bantuan_id: string;
    penduduk_id: string;
    tanggal_terima: string | null;
    nominal: string | number | null;
    status: 'AKTIF' | 'SELESAI' | 'DIBATALKAN' | string;
    keterangan: string | null;
    penduduk: PendudukOption;
};

export type PenerimaFormData = {
    penduduk_id: string;
    tanggal_terima: string;
    nominal: string;
    status: string;
    keterangan: string;
};

export type PaginatedPenerimaBantuan = {
    data: PenerimaBantuan[];
    current_page: number;
    from: number | null;
    last_page: number;
    links: PaginationLink[];
    per_page: number;
    to: number | null;
    total: number;
};

export type PenerimaFilters = {
    search: string;
    status: string;
};
