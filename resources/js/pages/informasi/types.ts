import type { PaginationLink } from '../bantuan/types';

export type PublicPengumuman = {
    id: string;
    judul: string;
    isi: string;
    tanggal_publish: string | null;
};

export type PublicBantuan = {
    id: string;
    kode_bantuan: string;
    nama_bantuan: string;
    jenis_bantuan: string;
    sumber_bantuan: string;
    tahun: number | null;
    deskripsi: string | null;
    published_at: string | null;
    tampilkan_penerima?: boolean;
    penerima_bantuan_count?: number;
    penerima_bantuan?: Array<{
        id: string;
        status: string;
        penduduk: {
            id: string;
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
    }>;
};

export type PaginatedPublicPengumuman = {
    data: PublicPengumuman[];
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
};

export type PaginatedPublicBantuan = {
    data: PublicBantuan[];
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
};
