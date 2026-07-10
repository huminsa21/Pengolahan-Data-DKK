import { Head, Link, usePage } from '@inertiajs/react';
import {
    bantuanIndex,
    index as informasiIndex,
} from '@/actions/App/Http/Controllers/InformasiController';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { appBrand } from '@/lib/branding';
import { dashboard, login } from '@/routes';
import { register } from '@/routes';

export default function Welcome() {
    const { auth, desa } = usePage().props;

    return (
        <>
            <Head title={desa.nama_desa} />
            <div className="min-h-screen bg-[#F8FAFC] text-[#1F2937]">
                <header className="border-b border-[#E5E7EB] bg-white">
                    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <span className="flex size-14 items-center justify-center rounded-md border border-[#E5E7EB] bg-white p-2 shadow-sm">
                                <AppLogoIcon className="size-10 object-contain" />
                            </span>
                            <div className="min-w-0">
                                <p className="truncate text-lg font-semibold text-[#2E7D32]">
                                    {desa.nama_desa}
                                </p>
                                <p className="truncate text-sm text-slate-600">
                                    Kecamatan {desa.kecamatan}, Kabupaten{' '}
                                    {desa.kabupaten}
                                </p>
                            </div>
                        </div>
                        <nav className="flex flex-wrap gap-2 text-sm">
                            <Link
                                className="rounded-md px-3 py-2 text-[#1F2937] hover:bg-[#F8FAFC]"
                                href={informasiIndex.url()}
                            >
                                Informasi
                            </Link>
                            <Link
                                className="rounded-md px-3 py-2 text-[#1F2937] hover:bg-[#F8FAFC]"
                                href={bantuanIndex.url()}
                            >
                                Bantuan
                            </Link>
                            {auth.user ? (
                                <Button asChild size="sm">
                                    <Link href={dashboard()}>Dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild size="sm" variant="outline">
                                        <Link href={login()}>Masuk</Link>
                                    </Button>
                                    <Button asChild size="sm">
                                        <Link href={register()}>Daftar</Link>
                                    </Button>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="mx-auto grid min-h-[calc(100vh-89px)] max-w-6xl items-center gap-8 px-4 py-10 lg:grid-cols-[1.1fr_0.9fr]">
                    <section>
                        <p className="text-sm font-medium text-[#2E7D32]">
                            {appBrand}
                        </p>
                        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-normal text-[#111827] sm:text-5xl">
                            Layanan informasi kependudukan untuk{' '}
                            {desa.nama_desa}
                        </h1>
                        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                            Akses pengumuman resmi, informasi program bantuan,
                            dan layanan administrasi desa dari satu sistem yang
                            mudah dikelola.
                        </p>
                        <div className="mt-7 flex flex-wrap gap-3">
                            <Button asChild>
                                <Link href={informasiIndex.url()}>
                                    Lihat Informasi Desa
                                </Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href={bantuanIndex.url()}>
                                    Program Bantuan
                                </Link>
                            </Button>
                        </div>
                    </section>

                    <section className="flex justify-center lg:justify-end">
                        <div className="flex aspect-square w-full max-w-sm items-center justify-center rounded-lg border border-[#E5E7EB] bg-white p-10 shadow-sm">
                            <AppLogoIcon className="size-48 object-contain" />
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
