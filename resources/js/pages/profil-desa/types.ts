import type { DesaBrand } from '@/lib/branding';

export type ProfilDesa = DesaBrand;

export type ProfilDesaFormData = {
    nama_desa: string;
    kecamatan: string;
    kabupaten: string;
    provinsi: string;
    alamat: string;
    kode_pos: string;
    telepon: string;
    email: string;
    website: string;
    nama_kepala_desa: string;
    nip_kepala_desa: string;
    visi: string;
    misi: string;
    sejarah: string;
    jam_pelayanan: string;
    maps_embed: string;
    facebook: string;
    instagram: string;
    youtube: string;
    background_type: '' | 'IMAGE' | 'COLOR' | 'GRADIENT';
    background_color: string;
    background_overlay_opacity: string;
    logo: File | null;
    background_image: File | null;
};

export type KepalaDesaOption = {
    id: string;
    nama_lengkap: string;
    nik: string;
    nomor_sk: string | null;
};
