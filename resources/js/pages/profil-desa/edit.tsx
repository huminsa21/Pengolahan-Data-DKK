import { Head, Link, useForm } from '@inertiajs/react';
import { Image, Save, Upload } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import {
    show,
    update,
} from '@/actions/App/Http/Controllers/ProfilDesaController';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit as editRoute } from '@/routes/profil-desa';
import type { KepalaDesaOption, ProfilDesa, ProfilDesaFormData } from './types';

type ProfilDesaEditProps = {
    profilDesa: ProfilDesa;
    kepalaDesaOptions: KepalaDesaOption[];
};

const SERVER_BACKGROUND_IMAGE_MAX_BYTES = 2 * 1024 * 1024;
const BACKGROUND_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function initialData(profilDesa: ProfilDesa): ProfilDesaFormData {
    return {
        nama_desa: profilDesa.nama_desa,
        kecamatan: profilDesa.kecamatan,
        kabupaten: profilDesa.kabupaten,
        provinsi: profilDesa.provinsi,
        alamat: profilDesa.alamat ?? '',
        kode_pos: profilDesa.kode_pos ?? '',
        telepon: profilDesa.telepon ?? '',
        email: profilDesa.email ?? '',
        website: profilDesa.website ?? '',
        nama_kepala_desa: profilDesa.nama_kepala_desa ?? '',
        nip_kepala_desa: profilDesa.nip_kepala_desa ?? '',
        visi: profilDesa.visi ?? '',
        misi: profilDesa.misi ?? '',
        sejarah: profilDesa.sejarah ?? '',
        jam_pelayanan: profilDesa.jam_pelayanan ?? '',
        maps_embed: profilDesa.maps_embed ?? '',
        facebook: profilDesa.facebook ?? '',
        instagram: profilDesa.instagram ?? '',
        youtube: profilDesa.youtube ?? '',
        background_type: profilDesa.background_type ?? '',
        background_color: profilDesa.background_color ?? '#047857',
        background_overlay_opacity: (
            profilDesa.background_overlay_opacity ?? 0.35
        ).toString(),
        logo: null,
        background_image: null,
    };
}

export default function ProfilDesaEdit({
    profilDesa,
    kepalaDesaOptions,
}: ProfilDesaEditProps) {
    const [logoPreview, setLogoPreview] = useState(profilDesa.logo);
    const [backgroundPreview, setBackgroundPreview] = useState(
        profilDesa.background_url,
    );
    const { data, setData, post, processing, errors, setError, clearErrors } =
        useForm<ProfilDesaFormData>(initialData(profilDesa));

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        post(update.form().action, {
            forceFormData: true,
        });
    }

    function setLogo(file: File | null) {
        setData('logo', file);

        if (!file) {
            setLogoPreview(profilDesa.logo);

            return;
        }

        setLogoPreview(URL.createObjectURL(file));
    }

    function setBackgroundImage(file: File | null): boolean {
        setData('background_image', file);

        if (!file) {
            setBackgroundPreview(profilDesa.background_url);
            clearErrors('background_image');

            return true;
        }

        if (!BACKGROUND_IMAGE_TYPES.includes(file.type)) {
            setData('background_image', null);
            setBackgroundPreview(profilDesa.background_url);
            setError(
                'background_image',
                'Format background harus JPG, PNG, atau WEBP.',
            );

            return false;
        }

        if (file.size > SERVER_BACKGROUND_IMAGE_MAX_BYTES) {
            setData('background_image', null);
            setBackgroundPreview(profilDesa.background_url);
            setError(
                'background_image',
                'Ukuran background maksimal 2MB pada server lokal saat ini. Kompres gambar atau naikkan upload_max_filesize PHP.',
            );

            return false;
        }

        clearErrors('background_image');
        setBackgroundPreview(URL.createObjectURL(file));

        return true;
    }

    function setKepalaDesaFromPerangkat(perangkatId: string) {
        const kepalaDesa = kepalaDesaOptions.find(
            (option) => option.id === perangkatId,
        );

        if (!kepalaDesa) {
            return;
        }

        setData((current) => ({
            ...current,
            nama_kepala_desa: kepalaDesa.nama_lengkap,
            nip_kepala_desa: kepalaDesa.nik,
        }));
    }

    const previewStyle =
        data.background_type === 'IMAGE' && backgroundPreview
            ? { backgroundImage: `url('${backgroundPreview}')` }
            : data.background_type === 'COLOR'
              ? { backgroundColor: data.background_color || '#047857' }
              : data.background_type === 'GRADIENT'
                ? {
                      backgroundImage:
                          'linear-gradient(135deg, #047857, #14532d)',
                  }
                : { backgroundColor: '#F8FAFC' };

    return (
        <>
            <Head title="Edit Profil Desa" />
            <form
                className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6"
                onSubmit={submit}
            >
                <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Profil Desa
                        </p>
                        <h1 className="text-2xl font-semibold">
                            Edit Profil Desa
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Data ini dipakai untuk branding aplikasi, header
                            publik, dan kop surat PDF.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href={show.url()}>Batal</Link>
                        </Button>
                        <Button disabled={processing} type="submit">
                            <Save />
                            {processing ? 'Menyimpan...' : 'Simpan Profil'}
                        </Button>
                    </div>
                </section>

                <section className="grid gap-5 lg:grid-cols-[280px_1fr]">
                    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                        <h2 className="text-base font-semibold">Logo Desa</h2>
                        <div className="mt-4 flex flex-col items-center gap-4">
                            <div className="flex size-32 items-center justify-center rounded-lg border border-border bg-white p-4 shadow-sm">
                                {logoPreview ? (
                                    <img
                                        alt="Preview logo desa"
                                        className="size-24 object-contain"
                                        src={logoPreview}
                                    />
                                ) : (
                                    <AppLogoIcon className="size-24 object-contain" />
                                )}
                            </div>
                            <Label
                                className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground"
                                htmlFor="logo"
                            >
                                <Upload className="size-4" />
                                Ganti Logo
                            </Label>
                            <Input
                                accept="image/png,image/jpeg"
                                className="sr-only"
                                id="logo"
                                type="file"
                                onChange={(event) =>
                                    setLogo(event.target.files?.[0] ?? null)
                                }
                            />
                            {errors.logo && (
                                <p className="text-center text-sm text-destructive">
                                    {errors.logo}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                        <h2 className="text-base font-semibold">
                            Identitas Desa
                        </h2>
                        <div className="mt-4 grid gap-5 md:grid-cols-2">
                            <Field
                                error={errors.nama_desa}
                                label="Nama Desa"
                                name="nama_desa"
                                value={data.nama_desa}
                                onChange={(value) =>
                                    setData('nama_desa', value)
                                }
                            />
                            <Field
                                error={errors.kecamatan}
                                label="Kecamatan"
                                name="kecamatan"
                                value={data.kecamatan}
                                onChange={(value) =>
                                    setData('kecamatan', value)
                                }
                            />
                            <Field
                                error={errors.kabupaten}
                                label="Kabupaten"
                                name="kabupaten"
                                value={data.kabupaten}
                                onChange={(value) =>
                                    setData('kabupaten', value)
                                }
                            />
                            <Field
                                error={errors.provinsi}
                                label="Provinsi"
                                name="provinsi"
                                value={data.provinsi}
                                onChange={(value) => setData('provinsi', value)}
                            />
                            <Field
                                error={errors.kode_pos}
                                label="Kode Pos"
                                name="kode_pos"
                                value={data.kode_pos}
                                onChange={(value) => setData('kode_pos', value)}
                            />
                            <Field
                                error={errors.telepon}
                                label="Telepon"
                                name="telepon"
                                value={data.telepon}
                                onChange={(value) => setData('telepon', value)}
                            />
                            <Field
                                error={errors.email}
                                label="Email"
                                name="email"
                                type="email"
                                value={data.email}
                                onChange={(value) => setData('email', value)}
                            />
                            <Field
                                error={errors.website}
                                label="Website"
                                name="website"
                                value={data.website}
                                onChange={(value) => setData('website', value)}
                            />
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="alamat">Alamat</Label>
                                <textarea
                                    className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                    id="alamat"
                                    value={data.alamat}
                                    onChange={(event) =>
                                        setData('alamat', event.target.value)
                                    }
                                />
                                {errors.alamat && (
                                    <p className="text-sm text-destructive">
                                        {errors.alamat}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
                    <h2 className="text-base font-semibold">Kepala Desa</h2>
                    <div className="mt-4 grid gap-5 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="kepala_desa_perangkat">
                                Ambil dari Perangkat Desa
                            </Label>
                            <select
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                id="kepala_desa_perangkat"
                                onChange={(event) =>
                                    setKepalaDesaFromPerangkat(
                                        event.target.value,
                                    )
                                }
                            >
                                <option value="">
                                    Pilih Kepala Desa aktif
                                </option>
                                {kepalaDesaOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.nama_lengkap} - NIK {option.nik}
                                        {option.nomor_sk
                                            ? ` - SK ${option.nomor_sk}`
                                            : ''}
                                    </option>
                                ))}
                            </select>
                            {kepalaDesaOptions.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    Belum ada perangkat desa aktif dengan
                                    jabatan Kepala Desa.
                                </p>
                            )}
                        </div>
                        <Field
                            error={errors.nama_kepala_desa}
                            label="Nama Kepala Desa"
                            name="nama_kepala_desa"
                            value={data.nama_kepala_desa}
                            onChange={(value) =>
                                setData('nama_kepala_desa', value)
                            }
                        />
                        <Field
                            error={errors.nip_kepala_desa}
                            label="NIP/NIK Kepala Desa"
                            name="nip_kepala_desa"
                            value={data.nip_kepala_desa}
                            onChange={(value) =>
                                setData('nip_kepala_desa', value)
                            }
                        />
                    </div>
                </section>

                <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
                    <h2 className="text-base font-semibold">
                        Profil Publik Desa
                    </h2>
                    <div className="mt-4 grid gap-5 md:grid-cols-2">
                        <TextAreaField
                            error={errors.visi}
                            label="Visi"
                            name="visi"
                            value={data.visi}
                            onChange={(value) => setData('visi', value)}
                        />
                        <TextAreaField
                            error={errors.misi}
                            label="Misi"
                            name="misi"
                            value={data.misi}
                            onChange={(value) => setData('misi', value)}
                        />
                        <div className="md:col-span-2">
                            <TextAreaField
                                error={errors.sejarah}
                                label="Sejarah"
                                name="sejarah"
                                value={data.sejarah}
                                onChange={(value) => setData('sejarah', value)}
                            />
                        </div>
                        <Field
                            error={errors.jam_pelayanan}
                            label="Jam Pelayanan"
                            name="jam_pelayanan"
                            value={data.jam_pelayanan}
                            onChange={(value) =>
                                setData('jam_pelayanan', value)
                            }
                        />
                        <Field
                            error={errors.facebook}
                            label="Facebook"
                            name="facebook"
                            value={data.facebook}
                            onChange={(value) => setData('facebook', value)}
                        />
                        <Field
                            error={errors.instagram}
                            label="Instagram"
                            name="instagram"
                            value={data.instagram}
                            onChange={(value) => setData('instagram', value)}
                        />
                        <Field
                            error={errors.youtube}
                            label="YouTube"
                            name="youtube"
                            value={data.youtube}
                            onChange={(value) => setData('youtube', value)}
                        />
                        <div className="md:col-span-2">
                            <TextAreaField
                                error={errors.maps_embed}
                                label="Embed Maps"
                                name="maps_embed"
                                value={data.maps_embed}
                                onChange={(value) =>
                                    setData('maps_embed', value)
                                }
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
                    <h2 className="text-base font-semibold">
                        Pengaturan Tampilan Website Publik
                    </h2>
                    <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_280px]">
                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="background_type">
                                    Tipe Background
                                </Label>
                                <select
                                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                    id="background_type"
                                    value={data.background_type}
                                    onChange={(event) =>
                                        setData(
                                            'background_type',
                                            event.target.value as
                                                | ''
                                                | 'IMAGE'
                                                | 'COLOR'
                                                | 'GRADIENT',
                                        )
                                    }
                                >
                                    <option value="">Default</option>
                                    <option value="IMAGE">IMAGE</option>
                                    <option value="COLOR">COLOR</option>
                                    <option value="GRADIENT">GRADIENT</option>
                                </select>
                                {errors.background_type && (
                                    <p className="text-sm text-destructive">
                                        {errors.background_type}
                                    </p>
                                )}
                            </div>

                            {data.background_type === 'COLOR' && (
                                <div className="space-y-2">
                                    <Label htmlFor="background_color">
                                        Background Color
                                    </Label>
                                    <div className="flex gap-3">
                                        <Input
                                            className="h-9 w-16 p-1"
                                            id="background_color"
                                            type="color"
                                            value={
                                                data.background_color ||
                                                '#047857'
                                            }
                                            onChange={(event) =>
                                                setData(
                                                    'background_color',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                        <Input
                                            value={data.background_color}
                                            onChange={(event) =>
                                                setData(
                                                    'background_color',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    {errors.background_color && (
                                        <p className="text-sm text-destructive">
                                            {errors.background_color}
                                        </p>
                                    )}
                                </div>
                            )}

                            {data.background_type === 'IMAGE' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="background_image">
                                            Upload Background Image
                                        </Label>
                                        <Input
                                            accept="image/png,image/jpeg,image/webp"
                                            id="background_image"
                                            type="file"
                                            onChange={(event) => {
                                                const accepted =
                                                    setBackgroundImage(
                                                        event.target
                                                            .files?.[0] ?? null,
                                                    );

                                                if (!accepted) {
                                                    event.target.value = '';
                                                }
                                            }}
                                        />
                                        {errors.background_image && (
                                            <p className="text-sm text-destructive">
                                                {errors.background_image}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="background_overlay_opacity">
                                            Background Overlay Opacity:{' '}
                                            {data.background_overlay_opacity}
                                        </Label>
                                        <Input
                                            id="background_overlay_opacity"
                                            max="1"
                                            min="0"
                                            step="0.05"
                                            type="range"
                                            value={
                                                data.background_overlay_opacity
                                            }
                                            onChange={(event) =>
                                                setData(
                                                    'background_overlay_opacity',
                                                    event.target.value,
                                                )
                                            }
                                        />
                                        {errors.background_overlay_opacity && (
                                            <p className="text-sm text-destructive">
                                                {
                                                    errors.background_overlay_opacity
                                                }
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        <div>
                            <p className="text-sm font-medium">
                                Preview Background
                            </p>
                            <div
                                className="relative mt-2 flex h-40 overflow-hidden rounded-lg border border-border bg-cover bg-center shadow-sm"
                                style={previewStyle}
                            >
                                {data.background_type === 'IMAGE' && (
                                    <div
                                        className="absolute inset-0 bg-black"
                                        style={{
                                            opacity:
                                                Number(
                                                    data.background_overlay_opacity,
                                                ) || 0,
                                        }}
                                    />
                                )}
                                <div className="relative z-10 m-4 flex items-center gap-3 self-end text-white">
                                    <span className="flex size-10 items-center justify-center rounded-md bg-white p-2">
                                        <AppLogoIcon className="size-7 object-contain" />
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold">
                                            {data.nama_desa}
                                        </p>
                                        <p className="text-xs text-white/80">
                                            {data.kecamatan}, {data.kabupaten}
                                        </p>
                                    </div>
                                </div>
                                {data.background_type === '' && (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                                        <Image className="size-8" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </form>
        </>
    );
}

function TextAreaField({
    error,
    label,
    name,
    value,
    onChange,
}: {
    error?: string;
    label: string;
    name: keyof ProfilDesaFormData;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            <textarea
                className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                id={name}
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}

function Field({
    error,
    label,
    name,
    type = 'text',
    value,
    onChange,
}: {
    error?: string;
    label: string;
    name: keyof ProfilDesaFormData;
    type?: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            <Input
                id={name}
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}

ProfilDesaEdit.layout = {
    breadcrumbs: [
        {
            title: 'Edit Profil Desa',
            href: editRoute(),
        },
    ],
};
