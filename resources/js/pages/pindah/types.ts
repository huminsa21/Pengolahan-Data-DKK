export type PelaporTipe =
    | 'PENDUDUK'
    | 'KELUARGA'
    | 'KEPALA_DUSUN'
    | 'RT'
    | 'RW'
    | 'BIDAN'
    | 'PERANGKAT_DESA'
    | 'LAINNYA';

export type PindahStatus = 'PROSES' | 'SELESAI' | 'DIBATALKAN';

export type DusunOption = {
    id: string;
    nama_dusun: string;
};

export type PendudukOption = {
    id: string;
    dusun_id: string | null;
    nik: string;
    nama_lengkap: string;
    jenis_kelamin: string;
    dusun: string | null;
    alamat: string;
    status_penduduk: string;
    wilayah_dusun?: DusunOption | null;
};

export type PelaporPendudukOption = {
    id: string;
    nik: string;
    nama_lengkap: string;
    no_hp: string | null;
};

export type Pindah = {
    id: string;
    penduduk_id: string;
    pelapor_tipe: PelaporTipe;
    pelapor_id: string | null;
    pelapor_nama: string | null;
    pelapor_kontak: string | null;
    tanggal_pindah: string;
    alamat_tujuan: string | null;
    desa_tujuan: string | null;
    kecamatan_tujuan: string | null;
    kabupaten_tujuan: string | null;
    provinsi_tujuan: string | null;
    alasan_pindah: string | null;
    status: PindahStatus;
    keterangan: string | null;
    penduduk: PendudukOption;
    pelapor_penduduk?: PelaporPendudukOption | null;
};

export type PindahFormData = {
    penduduk_id: string;
    tanggal_pindah: string;
    alamat_tujuan: string;
    desa_tujuan: string;
    kecamatan_tujuan: string;
    kabupaten_tujuan: string;
    provinsi_tujuan: string;
    alasan_pindah: string;
    status: PindahStatus;
    keterangan: string;
    pelapor_tipe: PelaporTipe;
    pelapor_id: string;
    pelapor_nama: string;
    pelapor_kontak: string;
};

export type PindahOptions = {
    penduduk: PendudukOption[];
    pelapor_penduduk: PelaporPendudukOption[];
    status: PindahStatus[];
    pelapor_tipe: PelaporTipe[];
};

export type PindahFilterOptions = {
    dusun: DusunOption[];
    status: PindahStatus[];
    pelapor_tipe: PelaporTipe[];
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedPindah = {
    data: Pindah[];
    current_page: number;
    from: number | null;
    last_page: number;
    links: PaginationLink[];
    per_page: number;
    to: number | null;
    total: number;
};

export type PindahFilters = {
    search: string;
    status: string;
    dusun_id: string;
    tanggal_dari: string;
    tanggal_sampai: string;
    pelapor_tipe: string;
};

export type PindahStats = {
    total: number;
    proses: number;
    selesai: number;
    dibatalkan: number;
    bulan_ini: number;
};
