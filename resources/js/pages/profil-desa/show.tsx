import { Head, Link } from '@inertiajs/react';
import { Edit, Mail, MapPin, Phone, UserRound } from 'lucide-react';
import { edit } from '@/actions/App/Http/Controllers/ProfilDesaController';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { show } from '@/routes/profil-desa';
import type { ProfilDesa } from './types';

type ProfilDesaShowProps = {
    profilDesa: ProfilDesa;
};

function valueOrDash(value: string | null): string {
    return value?.trim() ? value : '-';
}

export default function ProfilDesaShow({ profilDesa }: ProfilDesaShowProps) {
    const details = [
        ['Nama Desa', profilDesa.nama_desa],
        ['Kecamatan', profilDesa.kecamatan],
        ['Kabupaten', profilDesa.kabupaten],
        ['Provinsi', profilDesa.provinsi],
        ['Kode Pos', valueOrDash(profilDesa.kode_pos)],
        ['Website', valueOrDash(profilDesa.website)],
    ];

    return (
        <>
            <Head title="Profil Desa" />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex size-20 shrink-0 items-center justify-center rounded-lg border border-border bg-white p-3 shadow-sm">
                            <AppLogoIcon className="size-16 object-contain" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-primary">
                                Profil Desa
                            </p>
                            <h1 className="text-2xl font-semibold">
                                {profilDesa.nama_desa}
                            </h1>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                Kecamatan {profilDesa.kecamatan}, Kabupaten{' '}
                                {profilDesa.kabupaten}, Provinsi{' '}
                                {profilDesa.provinsi}
                            </p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={edit.url()}>
                            <Edit />
                            Edit Profil
                        </Link>
                    </Button>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border border-border bg-card p-5 shadow-sm md:col-span-2">
                        <h2 className="text-base font-semibold">
                            Data Administrasi
                        </h2>
                        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                            {details.map(([label, value]) => (
                                <div key={label}>
                                    <dt className="text-sm text-muted-foreground">
                                        {label}
                                    </dt>
                                    <dd className="mt-1 font-medium">
                                        {value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                        <h2 className="text-base font-semibold">
                            Kepala Desa
                        </h2>
                        <div className="mt-4 flex items-start gap-3">
                            <UserRound className="mt-1 size-5 text-primary" />
                            <div>
                                <p className="font-medium">
                                    {valueOrDash(profilDesa.nama_kepala_desa)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {profilDesa.nip_kepala_desa
                                        ? `NIP. ${profilDesa.nip_kepala_desa}`
                                        : 'NIP belum diisi'}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-start gap-3">
                            <MapPin className="mt-1 size-5 text-primary" />
                            <div>
                                <p className="font-medium">Alamat</p>
                                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                    {valueOrDash(profilDesa.alamat)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-start gap-3">
                            <Phone className="mt-1 size-5 text-primary" />
                            <div>
                                <p className="font-medium">Telepon</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {valueOrDash(profilDesa.telepon)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                        <div className="flex items-start gap-3">
                            <Mail className="mt-1 size-5 text-primary" />
                            <div>
                                <p className="font-medium">Email</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {valueOrDash(profilDesa.email)}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                        <h2 className="text-base font-semibold">Visi</h2>
                        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                            {valueOrDash(profilDesa.visi)}
                        </p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                        <h2 className="text-base font-semibold">Misi</h2>
                        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                            {valueOrDash(profilDesa.misi)}
                        </p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-5 shadow-sm lg:col-span-2">
                        <h2 className="text-base font-semibold">
                            Sejarah dan Publikasi
                        </h2>
                        <dl className="mt-4 grid gap-4 md:grid-cols-2">
                            {[
                                ['Sejarah', valueOrDash(profilDesa.sejarah)],
                                [
                                    'Jam Pelayanan',
                                    valueOrDash(profilDesa.jam_pelayanan),
                                ],
                                [
                                    'Embed Maps',
                                    valueOrDash(profilDesa.maps_embed),
                                ],
                                ['Facebook', valueOrDash(profilDesa.facebook)],
                                [
                                    'Instagram',
                                    valueOrDash(profilDesa.instagram),
                                ],
                                ['YouTube', valueOrDash(profilDesa.youtube)],
                                [
                                    'Tipe Background',
                                    valueOrDash(profilDesa.background_type),
                                ],
                                [
                                    'Warna Background',
                                    valueOrDash(profilDesa.background_color),
                                ],
                                [
                                    'Overlay Background',
                                    profilDesa.background_overlay_opacity
                                        ? String(
                                              profilDesa.background_overlay_opacity,
                                          )
                                        : '-',
                                ],
                            ].map(([label, value]) => (
                                <div key={label}>
                                    <dt className="text-sm text-muted-foreground">
                                        {label}
                                    </dt>
                                    <dd className="mt-1 break-words text-sm font-medium leading-6">
                                        {value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </section>
            </div>
        </>
    );
}

ProfilDesaShow.layout = {
    breadcrumbs: [
        {
            title: 'Profil Desa',
            href: show(),
        },
    ],
};
