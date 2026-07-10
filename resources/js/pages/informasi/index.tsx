import { Link, usePage } from '@inertiajs/react';
import {
    Baby,
    HandCoins,
    HeartPulse,
    Mail,
    MapPin,
    Phone,
    Skull,
    Users,
} from 'lucide-react';
import {
    bantuanIndex,
    profilDesa,
} from '@/actions/App/Http/Controllers/InformasiController';
import { SectionHeading } from '@/components/public/section-heading';
import { StatCard } from '@/components/public/stat-card';
import { Button } from '@/components/ui/button';
import { PublicLayout } from './layout';
import type { PaginatedPublicPengumuman } from './types';

function formatDate(value: string | null): string {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(value));
}

export default function InformasiIndex({
    pengumuman,
}: {
    pengumuman: PaginatedPublicPengumuman;
}) {
    const { desa } = usePage().props;
    const latestPengumuman = pengumuman.data.slice(0, 6);
    const stats = [
        {
            icon: Users,
            label: 'Total Penduduk',
            value: 'Terdata',
            description: 'Data kependudukan dikelola melalui sistem desa.',
        },
        {
            icon: Baby,
            label: 'Kelahiran Tahun Ini',
            value: 'Terkelola',
            description: 'Peristiwa kelahiran dicatat sebagai data desa.',
        },
        {
            icon: Skull,
            label: 'Kematian Tahun Ini',
            value: 'Terkelola',
            description: 'Pelaporan kematian warga tersimpan rapi.',
        },
        {
            icon: HandCoins,
            label: 'Program Bantuan Aktif',
            value: 'Publik',
            description: 'Informasi bantuan yang dipublikasikan tersedia.',
        },
    ];

    return (
        <PublicLayout title="Informasi Desa">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </section>

            <section className="grid gap-8 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-[1.1fr_0.9fr] md:p-8">
                <div>
                    <SectionHeading
                        description="Layanan publik dan administrasi kependudukan desa disajikan secara terbuka agar warga mudah mendapatkan informasi resmi."
                        eyebrow="Tentang Desa"
                        title={desa.nama_desa}
                    />
                    <div className="mt-6 grid gap-5">
                        <div>
                            <h3 className="font-semibold text-slate-950">
                                Visi
                            </h3>
                            <p className="mt-2 text-sm leading-7 whitespace-pre-line text-slate-600">
                                {desa.visi || 'Visi desa belum dipublikasikan.'}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-950">
                                Misi
                            </h3>
                            <p className="mt-2 line-clamp-6 text-sm leading-7 whitespace-pre-line text-slate-600">
                                {desa.misi || 'Misi desa belum dipublikasikan.'}
                            </p>
                        </div>
                    </div>
                    <Button
                        asChild
                        className="mt-6 bg-emerald-700 hover:bg-emerald-800"
                    >
                        <Link href={profilDesa.url()}>Lihat Profil Desa</Link>
                    </Button>
                </div>
                <div className="flex min-h-72 items-center justify-center rounded-[1.5rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-slate-50 p-8">
                    <div className="text-center">
                        <div className="mx-auto flex size-32 items-center justify-center rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                            <img
                                alt={`Logo ${desa.nama_desa}`}
                                className="size-24 object-contain"
                                src={desa.logo_url}
                            />
                        </div>
                        <p className="mt-5 text-sm font-semibold text-slate-950">
                            {desa.nama_desa}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                            Kecamatan {desa.kecamatan}, Kabupaten{' '}
                            {desa.kabupaten}
                        </p>
                    </div>
                </div>
            </section>

            <section className="space-y-6" id="pengumuman">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <SectionHeading
                        description="Pengumuman resmi terbaru yang dipublikasikan oleh pemerintah desa."
                        eyebrow="Informasi Publik"
                        title="Pengumuman Terbaru"
                    />
                    <Button asChild variant="outline">
                        <Link href={bantuanIndex.url()}>
                            Lihat Program Bantuan
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {latestPengumuman.map((item) => (
                        <article
                            className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            key={item.id}
                        >
                            <p className="text-xs font-semibold text-emerald-700">
                                {formatDate(item.tanggal_publish)}
                            </p>
                            <h3 className="mt-3 text-lg leading-7 font-semibold text-slate-950">
                                {item.judul}
                            </h3>
                            <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">
                                {item.isi}
                            </p>
                            <span className="mt-5 text-sm font-semibold text-emerald-700 transition group-hover:text-emerald-800">
                                Baca Selengkapnya
                            </span>
                        </article>
                    ))}
                    {latestPengumuman.length === 0 && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-600 shadow-sm md:col-span-2 lg:col-span-3">
                            Belum ada pengumuman yang dipublikasikan.
                        </div>
                    )}
                </div>
            </section>

            <section className="grid gap-6 rounded-[2rem] bg-emerald-800 p-6 text-white md:grid-cols-[1fr_auto] md:items-center md:p-8">
                <div>
                    <p className="text-sm font-semibold text-emerald-100">
                        Program Bantuan
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold">
                        Informasi bantuan desa tersedia untuk warga.
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-50">
                        Lihat daftar program bantuan yang telah dipublikasikan,
                        jumlah penerima, dan detail pelaksanaannya.
                    </p>
                </div>
                <Button
                    asChild
                    className="bg-white text-emerald-800 hover:bg-emerald-50"
                >
                    <Link href={bantuanIndex.url()}>Buka Program Bantuan</Link>
                </Button>
            </section>

            <section className="grid gap-6 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-[1fr_1fr] md:p-8">
                <div>
                    <SectionHeading
                        description="Hubungi pemerintah desa melalui kanal resmi atau datang langsung ke kantor desa pada jam pelayanan."
                        eyebrow="Lokasi & Kontak"
                        title="Kantor Desa"
                    />
                    <div className="mt-6 grid gap-4 text-sm text-slate-600">
                        <div className="flex gap-3">
                            <MapPin className="size-5 shrink-0 text-emerald-700" />
                            <span>
                                {desa.alamat || 'Alamat belum tersedia.'}
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <Phone className="size-5 shrink-0 text-emerald-700" />
                            <span>
                                {desa.telepon || 'Telepon belum tersedia.'}
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <Mail className="size-5 shrink-0 text-emerald-700" />
                            <span>{desa.email || 'Email belum tersedia.'}</span>
                        </div>
                    </div>
                </div>
                <div className="flex min-h-64 items-center justify-center rounded-3xl bg-slate-50 p-8 text-center">
                    <div>
                        <HeartPulse className="mx-auto size-12 text-emerald-700" />
                        <p className="mt-4 font-semibold text-slate-950">
                            Pelayanan Administrasi Desa
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            {desa.jam_pelayanan ||
                                'Jam pelayanan belum tersedia.'}
                        </p>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
