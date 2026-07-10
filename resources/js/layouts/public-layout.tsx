import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import {
    bantuanIndex,
    index,
    profilDesa,
} from '@/actions/App/Http/Controllers/InformasiController';
import AppLogoIcon from '@/components/app-logo-icon';
import { login } from '@/routes';

type PublicLayoutProps = {
    title: string;
    children: ReactNode;
};

function activeClass(currentUrl: string, href: string): string {
    return currentUrl === href ||
        currentUrl.startsWith(`${href}/`) ||
        currentUrl.startsWith(`${href}?`)
        ? 'bg-emerald-50 text-emerald-700'
        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950';
}

export function PublicLayout({ title, children }: PublicLayoutProps) {
    const { desa } = usePage().props;
    const { url } = usePage();
    const isImageBackground =
        desa.background_type === 'IMAGE' && Boolean(desa.background_url);
    const hasCustomBackground =
        isImageBackground ||
        (desa.background_type === 'COLOR' && Boolean(desa.background_color)) ||
        desa.background_type === 'GRADIENT';
    const overlayOpacity = Number(desa.background_overlay_opacity ?? 0.35);
    const headerStyle = desa.public_background_style as CSSProperties;
    const heroTextClass = hasCustomBackground ? 'text-white' : 'text-slate-950';
    const heroMutedClass = hasCustomBackground
        ? 'text-white/85'
        : 'text-slate-600';

    const navItems = [
        ['Beranda', index.url()],
        ['Pengumuman', `${index.url()}#pengumuman`],
        ['Bantuan', bantuanIndex.url()],
        ['Profil Desa', profilDesa.url()],
        ['Login Admin', login.url()],
    ] as const;

    return (
        <>
            <Head title={title} />
            <div className="flex min-h-screen flex-col bg-slate-50 text-slate-950">
                <header
                    className="relative min-h-[420px] overflow-hidden border-b border-slate-200"
                    style={headerStyle}
                >
                    {isImageBackground && (
                        <div
                            className="absolute inset-0 bg-black"
                            style={{ opacity: overlayOpacity }}
                        />
                    )}
                    <div className="relative z-10 border-b border-white/20 bg-white/85 backdrop-blur">
                        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                            <Link
                                className="flex min-w-0 items-center gap-3"
                                href={index.url()}
                            >
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 shadow-sm">
                                    <AppLogoIcon className="size-8 object-contain" />
                                </span>
                                <span className="min-w-0 leading-tight">
                                    <span className="block truncate text-sm font-semibold text-slate-950 sm:text-base">
                                        {desa.nama_desa}
                                    </span>
                                    <span className="hidden truncate text-xs text-slate-500 sm:block">
                                        Kecamatan {desa.kecamatan}, Kabupaten{' '}
                                        {desa.kabupaten}
                                    </span>
                                </span>
                            </Link>
                            <nav className="flex shrink-0 flex-wrap justify-end gap-1 text-sm">
                                {navItems.map(([label, href]) => (
                                    <Link
                                        className={`rounded-lg px-3 py-2 font-medium transition ${activeClass(url, href)}`}
                                        href={href}
                                        key={label}
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>

                    <div className="relative z-10 mx-auto flex min-h-[356px] max-w-7xl items-center px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
                        <div className="flex w-full flex-col gap-6 md:flex-row md:items-center md:justify-between">
                            <div className="flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center">
                                <div className="flex size-[72px] shrink-0 items-center justify-center rounded-2xl border border-white/50 bg-white p-3 shadow-sm">
                                    <AppLogoIcon className="size-14 object-contain" />
                                </div>
                                <div className={heroTextClass}>
                                    <p
                                        className={`text-sm font-medium ${hasCustomBackground ? 'text-white/85' : 'text-emerald-700'}`}
                                    >
                                        {desa.nama_aplikasi}
                                    </p>
                                    <h1 className="mt-1 text-3xl font-semibold tracking-normal sm:text-4xl">
                                        {desa.nama_desa}
                                    </h1>
                                    <p
                                        className={`mt-2 text-sm leading-6 ${heroMutedClass}`}
                                    >
                                        Kecamatan {desa.kecamatan}, Kabupaten{' '}
                                        {desa.kabupaten}, Provinsi{' '}
                                        {desa.provinsi}
                                    </p>
                                    {desa.alamat && (
                                        <p
                                            className={`mt-1 line-clamp-1 text-sm ${heroMutedClass}`}
                                        >
                                            {desa.alamat}
                                        </p>
                                    )}
                                    <div className="mt-6 flex flex-wrap gap-3">
                                        <Link
                                            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                            href={`${index.url()}#pengumuman`}
                                        >
                                            Lihat Pengumuman
                                            <ArrowRight className="size-4" />
                                        </Link>
                                        <Link
                                            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-md ${
                                                hasCustomBackground
                                                    ? 'border-white/50 text-white hover:bg-white/10'
                                                    : 'border-emerald-200 text-emerald-800 hover:bg-emerald-50'
                                            }`}
                                            href={bantuanIndex.url()}
                                        >
                                            Program Bantuan
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2 md:w-80">
                                <div className="rounded-2xl border border-white/50 bg-white/90 p-4 shadow-sm">
                                    <p className="text-xs font-medium text-slate-500">
                                        Kecamatan
                                    </p>
                                    <p className="mt-1 font-semibold text-slate-950">
                                        {desa.kecamatan}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/50 bg-white/90 p-4 shadow-sm">
                                    <p className="text-xs font-medium text-slate-500">
                                        Kabupaten
                                    </p>
                                    <p className="mt-1 font-semibold text-slate-950">
                                        {desa.kabupaten}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="mx-auto -mt-6 flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 pb-8 sm:px-6 lg:px-8">
                    {children}
                </main>

                <footer className="mt-16 border-t border-slate-200 bg-white">
                    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm text-slate-600 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
                        <div className="flex items-start gap-3">
                            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
                                <AppLogoIcon className="size-7 object-contain" />
                            </span>
                            <div>
                                <p className="font-semibold text-slate-950">
                                    {desa.nama_desa}
                                </p>
                                <p className="mt-2 leading-6">
                                    {desa.alamat ||
                                        'Alamat desa belum tersedia.'}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-950">Menu</p>
                            <div className="mt-2 flex flex-col gap-2">
                                <Link href={index.url()}>Pengumuman</Link>
                                <Link href={bantuanIndex.url()}>Bantuan</Link>
                                <Link href={profilDesa.url()}>Profil</Link>
                            </div>
                        </div>
                        <div className="md:text-right">
                            <p className="font-semibold text-slate-950">
                                Kontak
                            </p>
                            <p className="mt-2 leading-6">
                                {[desa.telepon, desa.email, desa.website]
                                    .filter(Boolean)
                                    .join(' / ') ||
                                    'Kontak desa belum tersedia.'}
                            </p>
                            <p className="mt-4 text-xs">
                                © {desa.nama_aplikasi}
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
