import type { Paginated } from '../jenis-surat/types';

export type PendudukOption = {
    id: string;
    nik: string;
    nama_lengkap: string;
    status_penduduk: string;
};

export type PerangkatUser = {
    id: number;
    name: string;
    email: string | null;
    nik: string | null;
    is_active: boolean;
    must_change_password: boolean;
    last_login_at: string | null;
    roles?: Array<{ id: number; name: string }> | string[];
};

export type PerangkatPenduduk = {
    id: string;
    nik: string;
    nama_lengkap: string;
    no_hp?: string | null;
    alamat?: string | null;
    dusun?: string | null;
    wilayah_dusun?: { nama_dusun: string } | null;
};

export type PerangkatDesa = {
    id: string;
    penduduk_id: string;
    jabatan: string;
    nomor_sk: string | null;
    tanggal_mulai: string | null;
    tanggal_selesai: string | null;
    status: 'AKTIF' | 'NONAKTIF';
    user_id: number | null;
    penduduk?: PerangkatPenduduk | null;
    user?: PerangkatUser | null;
    created_by?: { id: number; name: string } | null;
};

export type PerangkatFilters = {
    search: string;
    jabatan: string;
    status: string;
    akun: string;
};

export type PerangkatStats = {
    total: number;
    aktif: number;
    nonaktif: number;
    punya_akun: number;
};

export type PerangkatOptions = {
    jabatan: string[];
    status: string[];
    penduduk: PendudukOption[];
};

export type PerangkatFormData = {
    penduduk_id: string;
    jabatan: string;
    nomor_sk: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    status: 'AKTIF' | 'NONAKTIF';
};

export type PaginatedPerangkatDesa = Paginated<PerangkatDesa>;
