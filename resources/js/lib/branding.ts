export const appBrand = 'Sistem Informasi Kependudukan Desa';
export const desaLogo = '/img/logo.png';

export type PublicBackgroundStyle = {
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
};

export type DesaBrand = {
    nama_desa: string;
    kecamatan: string;
    kabupaten: string;
    provinsi: string;
    alamat: string | null;
    kode_pos: string | null;
    telepon: string | null;
    email: string | null;
    website: string | null;
    nama_kepala_desa: string | null;
    nip_kepala_desa: string | null;
    logo_path: string | null;
    visi: string | null;
    misi: string | null;
    sejarah: string | null;
    jam_pelayanan: string | null;
    maps_embed: string | null;
    facebook: string | null;
    instagram: string | null;
    youtube: string | null;
    background_path: string | null;
    background_type: 'IMAGE' | 'COLOR' | 'GRADIENT' | null;
    background_color: string | null;
    background_overlay_opacity: string | number | null;
    background_url: string | null;
    public_background_style: PublicBackgroundStyle;
    logo: string;
    logo_url: string;
    nama_aplikasi: string;
};
