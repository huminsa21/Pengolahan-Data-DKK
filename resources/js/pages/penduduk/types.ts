export type Penduduk = {
    id: string;
    dusun_id: string | null;
    nik: string;
    nama_lengkap: string;
    jenis_kelamin: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    agama: string;
    status_perkawinan: string;
    pendidikan: string;
    pekerjaan: string;
    no_hp: string | null;
    alamat: string;
    dusun: string;
    rt: string;
    rw: string;
    desa: string;
    kecamatan: string;
    kabupaten: string;
    provinsi: string;
    no_kk: string | null;
    hubungan_keluarga: string | null;
    is_kepala_keluarga: boolean;
    status_penduduk: 'AKTIF' | 'PINDAH' | 'MENINGGAL' | string;
    wilayah_dusun?: DusunOption | null;
};

export type PendudukFormData = {
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
    alamat: string;
    dusun_id: string;
    dusun: string;
    rt: string;
    rw: string;
    desa: string;
    kecamatan: string;
    kabupaten: string;
    provinsi: string;
    no_kk: string;
    hubungan_keluarga: string;
    is_kepala_keluarga: boolean;
    status_penduduk: string;
};

export type PendudukOptions = {
    dusun: DusunOption[];
    jenis_kelamin: string[];
    agama: string[];
    status_perkawinan: string[];
    pendidikan: string[];
    status_penduduk: string[];
};

export type DusunOption = {
    id: string;
    kode_dusun: string | null;
    nama_dusun: string;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedPenduduk = {
    data: Penduduk[];
    current_page: number;
    from: number | null;
    last_page: number;
    links: PaginationLink[];
    per_page: number;
    to: number | null;
    total: number;
};

export type PendudukFilters = {
    search: string;
    jenis_kelamin: string;
    status_penduduk: string;
    dusun_id: string;
};

export type PendudukStats = {
    total: number;
    aktif: number;
    pindah: number;
    meninggal: number;
    kepala_keluarga: number;
};
