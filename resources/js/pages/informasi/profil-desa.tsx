import { ExternalLink, Mail, MapPin, Phone, UserRound } from 'lucide-react';
import { PublicLayout } from './layout';
import type { ProfilDesa } from '../profil-desa/types';

type InformasiProfilDesaProps = {
    profilDesa: ProfilDesa;
};

function valueOrFallback(value: string | null, fallback: string): string {
    return value?.trim() ? value : fallback;
}

function paragraph(value: string | null, fallback: string): string {
    return valueOrFallback(value, fallback);
}

function mapsSource(value: string | null): string | null {
    if (!value?.trim()) {
        return null;
    }

    const srcMatch = value.match(/src=["']([^"']+)["']/i);

    if (srcMatch?.[1]) {
        return srcMatch[1];
    }

    if (value.startsWith('https://') || value.startsWith('http://')) {
        return value;
    }

    return null;
}

export default function InformasiProfilDesa({
    profilDesa,
}: InformasiProfilDesaProps) {
    const contactItems = [
        ['Alamat', valueOrFallback(profilDesa.alamat, 'Alamat belum tersedia')],
        ['Kode Pos', valueOrFallback(profilDesa.kode_pos, '-')],
        ['Telepon', valueOrFallback(profilDesa.telepon, '-')],
        ['Email', valueOrFallback(profilDesa.email, '-')],
        ['Website', valueOrFallback(profilDesa.website, '-')],
        [
            'Jam Pelayanan',
            valueOrFallback(
                profilDesa.jam_pelayanan,
                'Jam pelayanan belum tersedia',
            ),
        ],
    ];
    const socialLinks = [
        ['Facebook', profilDesa.facebook],
        ['Instagram', profilDesa.instagram],
        ['YouTube', profilDesa.youtube],
    ].filter(([, url]) => Boolean(url));
    const mapSrc = mapsSource(profilDesa.maps_embed);

    return (
        <PublicLayout title="Profil Desa">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="p-6 md:p-8">
                    <div>
                        <p className="text-sm font-medium text-emerald-700">
                            Profil Desa
                        </p>
                        <h1 className="mt-2 text-3xl font-semibold text-slate-950">
                            {profilDesa.nama_desa}
                        </h1>
                        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                            Kecamatan {profilDesa.kecamatan}, Kabupaten{' '}
                            {profilDesa.kabupaten}, Provinsi{' '}
                            {profilDesa.provinsi}
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-[1.35fr_0.85fr]">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold">Informasi Umum</h2>
                    <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                        {contactItems.map(([label, value]) => (
                            <div key={label}>
                                <dt className="text-sm text-slate-500">
                                    {label}
                                </dt>
                                <dd className="mt-1 text-sm leading-6 font-medium break-words text-slate-950">
                                    {value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold">Pemerintahan Desa</h2>
                    <div className="mt-5 flex items-start gap-3">
                        <UserRound className="mt-1 size-5 text-emerald-700" />
                        <div>
                            <p className="font-medium">
                                {valueOrFallback(
                                    profilDesa.nama_kepala_desa,
                                    'Kepala Desa',
                                )}
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                                {profilDesa.nip_kepala_desa
                                    ? `NIP. ${profilDesa.nip_kepala_desa}`
                                    : 'NIP belum tersedia'}
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 grid gap-3 text-sm text-slate-600">
                        <div className="flex gap-3">
                            <MapPin className="size-4 shrink-0 text-emerald-700" />
                            <span>
                                {valueOrFallback(
                                    profilDesa.alamat,
                                    'Alamat belum tersedia',
                                )}
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <Phone className="size-4 shrink-0 text-emerald-700" />
                            <span>
                                {valueOrFallback(profilDesa.telepon, '-')}
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <Mail className="size-4 shrink-0 text-emerald-700" />
                            <span>
                                {valueOrFallback(profilDesa.email, '-')}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold">Visi</h2>
                    <p className="mt-4 text-sm leading-7 whitespace-pre-line text-slate-600">
                        {paragraph(
                            profilDesa.visi,
                            'Visi desa belum dipublikasikan.',
                        )}
                    </p>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold">Misi</h2>
                    <p className="mt-4 text-sm leading-7 whitespace-pre-line text-slate-600">
                        {paragraph(
                            profilDesa.misi,
                            'Misi desa belum dipublikasikan.',
                        )}
                    </p>
                </article>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Sejarah Desa</h2>
                <p className="mt-4 text-sm leading-7 whitespace-pre-line text-slate-600">
                    {paragraph(
                        profilDesa.sejarah,
                        'Sejarah desa belum dipublikasikan.',
                    )}
                </p>
            </section>

            <section className="grid gap-4 lg:grid-cols-[1.35fr_0.85fr]">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-6">
                        <h2 className="text-xl font-semibold">Peta Desa</h2>
                    </div>
                    {mapSrc ? (
                        <iframe
                            className="h-80 w-full"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            sandbox="allow-scripts allow-same-origin allow-popups"
                            src={mapSrc}
                            title={`Peta ${profilDesa.nama_desa}`}
                        />
                    ) : (
                        <div className="flex h-80 items-center justify-center bg-slate-50 p-6 text-center text-sm text-slate-600">
                            Peta desa belum tersedia.
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold">Media Sosial</h2>
                    <div className="mt-5 flex flex-col gap-3">
                        {socialLinks.map(([label, url]) => (
                            <a
                                className="inline-flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-50"
                                href={url ?? '#'}
                                key={label}
                                rel="noreferrer"
                                target="_blank"
                            >
                                {label}
                                <ExternalLink className="size-4" />
                            </a>
                        ))}
                        {socialLinks.length === 0 && (
                            <p className="text-sm leading-6 text-slate-600">
                                Media sosial desa belum tersedia.
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
