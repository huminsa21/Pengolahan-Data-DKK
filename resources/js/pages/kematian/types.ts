export type PelaporTipe =
    | 'PENDUDUK'
    | 'KELUARGA'
    | 'KEPALA_DUSUN'
    | 'RT'
    | 'RW'
    | 'BIDAN'
    | 'PERANGKAT_DESA'
    | 'LAINNYA';

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
    tempat_lahir: string;
    tanggal_lahir: string;
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

export type Kematian = {
    id: string;
    penduduk_id: string;
    pelapor_tipe: PelaporTipe;
    pelapor_id: string | null;
    pelapor_nama: string | null;
    pelapor_kontak: string | null;
    tanggal_meninggal: string;
    tempat_meninggal: string | null;
    sebab_meninggal: string | null;
    keterangan: string | null;
    penduduk: PendudukOption;
    pelapor_penduduk?: PelaporPendudukOption | null;
};

export type KematianFormData = {
    penduduk_id: string;
    tanggal_meninggal: string;
    tempat_meninggal: string;
    sebab_meninggal: string;
    keterangan: string;
    pelapor_tipe: PelaporTipe;
    pelapor_id: string;
    pelapor_nama: string;
    pelapor_kontak: string;
};

export type KematianOptions = {
    penduduk: PendudukOption[];
    pelapor_penduduk: PelaporPendudukOption[];
    pelapor_tipe: PelaporTipe[];
};

export type KematianFilterOptions = {
    dusun: DusunOption[];
    pelapor_tipe: PelaporTipe[];
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedKematian = {
    data: Kematian[];
    current_page: number;
    from: number | null;
    last_page: number;
    links: PaginationLink[];
    per_page: number;
    to: number | null;
    total: number;
};

export type KematianFilters = {
    search: string;
    jenis_kelamin: string;
    dusun_id: string;
    tanggal_dari: string;
    tanggal_sampai: string;
    pelapor_tipe: string;
};

export type KematianStats = {
    total: number;
    bulan_ini: number;
    tahun_ini: number;
    laki_laki: number;
    perempuan: number;
};
