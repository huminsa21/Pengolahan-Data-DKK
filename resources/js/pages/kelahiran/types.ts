export type PendudukOption = {
    id: string;
    dusun_id: string | null;
    nik: string | null;
    nama_lengkap: string;
    jenis_kelamin: string;
    no_hp: string | null;
};

export type KelahiranRelation = {
    id: string;
    nik: string | null;
    nama_lengkap: string;
    status_penduduk?: string;
} | null;

export type Kelahiran = {
    id: string;
    penduduk_id_bayi: string | null;
    nama_bayi: string;
    jenis_kelamin: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    waktu_lahir: string | null;
    ayah_id: string | null;
    ibu_id: string | null;
    pelapor_tipe: PelaporTipe;
    pelapor_id: string | null;
    pelapor_nama: string | null;
    pelapor_kontak: string | null;
    nama_ayah: string | null;
    nama_ibu: string | null;
    alamat: string;
    keterangan: string | null;
    ayah?: KelahiranRelation;
    bayi_penduduk?: KelahiranRelation;
    ibu?: KelahiranRelation;
    pelapor_penduduk?: KelahiranRelation;
};

export type KelahiranFormData = {
    nama_bayi: string;
    jenis_kelamin: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    waktu_lahir: string;
    ayah_id: string;
    ibu_id: string;
    pelapor_tipe: PelaporTipe;
    pelapor_id: string;
    pelapor_nama: string;
    pelapor_kontak: string;
    nama_ayah: string;
    nama_ibu: string;
    alamat: string;
    keterangan: string;
};

export type KelahiranOptions = {
    penduduk: PendudukOption[];
    jenis_kelamin: string[];
    pelapor_tipe: PelaporTipe[];
};

export type PelaporTipe =
    | 'PENDUDUK'
    | 'KELUARGA'
    | 'KEPALA_DUSUN'
    | 'RT'
    | 'RW'
    | 'BIDAN'
    | 'PERANGKAT_DESA'
    | 'LAINNYA';

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedKelahiran = {
    data: Kelahiran[];
    current_page: number;
    from: number | null;
    last_page: number;
    links: PaginationLink[];
    per_page: number;
    to: number | null;
    total: number;
};

export type KelahiranFilters = {
    search: string;
    jenis_kelamin: string;
    tanggal_dari: string;
    tanggal_sampai: string;
};

export type KelahiranStats = {
    total: number;
    laki_laki: number;
    perempuan: number;
    bulan_ini: number;
};
