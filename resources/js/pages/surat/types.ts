import type { JenisSurat, Paginated } from '../jenis-surat/types';

export type SimpleUser = { id: number; name: string };
export type SimplePenduduk = {
    id: string;
    nik: string;
    nama_lengkap: string;
    jenis_kelamin?: string | null;
    tempat_lahir?: string | null;
    tanggal_lahir?: string | null;
    pekerjaan?: string | null;
    alamat?: string | null;
    dusun?: string | null;
    rt?: string | null;
    rw?: string | null;
    desa?: string | null;
    kecamatan?: string | null;
    kabupaten?: string | null;
};

export type Surat = {
    id: string;
    nomor_surat: string | null;
    jenis_surat_id: string;
    penduduk_id: string | null;
    referensi_tipe: string | null;
    referensi_id: string | null;
    tanggal_surat: string;
    keperluan: string | null;
    data_json: Record<string, unknown> | null;
    status: 'DRAFT' | 'SELESAI' | 'DIBATALKAN';
    jenis_surat?: JenisSurat;
    penduduk?: SimplePenduduk | null;
    pembuat?: SimpleUser | null;
};

export type KelahiranOption = {
    id: string;
    nama_bayi: string;
    tanggal_lahir: string | null;
    ayah?: { nama_lengkap: string } | null;
    ibu?: { nama_lengkap: string } | null;
};

export type KematianOption = {
    id: string;
    tanggal_meninggal: string | null;
    sebab_meninggal: string | null;
    penduduk?: Pick<
        SimplePenduduk,
        'id' | 'nik' | 'nama_lengkap' | 'tanggal_lahir'
    > | null;
};

export type PindahOption = {
    id: string;
    tanggal_pindah: string | null;
    desa_tujuan: string | null;
    kecamatan_tujuan: string | null;
    kabupaten_tujuan: string | null;
    penduduk?: Pick<
        SimplePenduduk,
        'id' | 'nik' | 'nama_lengkap' | 'tanggal_lahir'
    > | null;
};

export type PendatangOption = {
    id: string;
    penduduk_id: string | null;
    nik: string | null;
    nama_lengkap: string;
    tanggal_lahir: string | null;
    tanggal_datang: string | null;
    desa_asal: string | null;
    penduduk?: Pick<
        SimplePenduduk,
        'id' | 'nik' | 'nama_lengkap' | 'tanggal_lahir'
    > | null;
};

export type SuratOptions = {
    jenisSurat: JenisSurat[];
    penduduk: SimplePenduduk[];
    kelahiran: KelahiranOption[];
    kematian: KematianOption[];
    pindah: PindahOption[];
    pendatang: PendatangOption[];
    status: string[];
    referensiTipe: string[];
};

export type PaginatedSurat = Paginated<Surat>;
