export type PelaporTipe =
    | 'PENDUDUK'
    | 'KELUARGA'
    | 'KEPALA_DUSUN'
    | 'RT'
    | 'RW'
    | 'BIDAN'
    | 'PERANGKAT_DESA'
    | 'LAINNYA';

export type PendatangStatus = 'PROSES' | 'DITERIMA' | 'DITOLAK';

export type DusunOption = { id: string; nama_dusun: string };
export type PendudukRelation = {
    id: string;
    nik: string;
    nama_lengkap: string;
} | null;
export type PelaporPendudukOption = {
    id: string;
    nik: string;
    nama_lengkap: string;
    no_hp: string | null;
};

export type Pendatang = {
    id: string;
    penduduk_id: string | null;
    pelapor_tipe: PelaporTipe;
    pelapor_id: string | null;
    pelapor_nama: string | null;
    pelapor_kontak: string | null;
    dusun_id: string | null;
    nik: string | null;
    nama_lengkap: string;
    jenis_kelamin: string;
    tempat_lahir: string | null;
    tanggal_lahir: string | null;
    agama: string | null;
    status_perkawinan: string | null;
    pendidikan: string | null;
    pekerjaan: string | null;
    no_hp: string | null;
    alamat_asal: string | null;
    desa_asal: string | null;
    kecamatan_asal: string | null;
    kabupaten_asal: string | null;
    provinsi_asal: string | null;
    alamat_tujuan: string | null;
    rt: string | null;
    rw: string | null;
    tanggal_datang: string;
    alasan_datang: string | null;
    status: PendatangStatus;
    keterangan: string | null;
    penduduk?: PendudukRelation;
    dusun?: DusunOption | null;
    pelapor_penduduk?: PelaporPendudukOption | null;
};

export type PendatangFormData = {
    nik: string;
    nama_lengkap: string;
    jenis_kelamin: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    agama: string;
    status_perkawinan: string;
    pendidikan: string;
    pekerjaan: string;
    no_hp: string;
    alamat_asal: string;
    desa_asal: string;
    kecamatan_asal: string;
    kabupaten_asal: string;
    provinsi_asal: string;
    dusun_id: string;
    alamat_tujuan: string;
    rt: string;
    rw: string;
    tanggal_datang: string;
    alasan_datang: string;
    keterangan: string;
    status: PendatangStatus;
    pelapor_tipe: PelaporTipe;
    pelapor_id: string;
    pelapor_nama: string;
    pelapor_kontak: string;
};

export type PendatangOptions = {
    dusun: DusunOption[];
    pelapor_penduduk: PelaporPendudukOption[];
    jenis_kelamin: string[];
    agama: string[];
    status_perkawinan: string[];
    pendidikan: string[];
    status: PendatangStatus[];
    pelapor_tipe: PelaporTipe[];
};

export type PendatangFilterOptions = {
    status: PendatangStatus[];
    jenis_kelamin: string[];
    pelapor_tipe: PelaporTipe[];
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedPendatang = {
    data: Pendatang[];
    current_page: number;
    from: number | null;
    last_page: number;
    links: PaginationLink[];
    per_page: number;
    to: number | null;
    total: number;
};

export type PendatangFilters = {
    search: string;
    status: string;
    jenis_kelamin: string;
    tanggal_dari: string;
    tanggal_sampai: string;
    pelapor_tipe: string;
};

export type PendatangStats = {
    total: number;
    proses: number;
    diterima: number;
    ditolak: number;
    bulan_ini: number;
};
