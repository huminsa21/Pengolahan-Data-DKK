import { Link, router } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import {
    bantuanIndex,
    bantuanShow,
} from '@/actions/App/Http/Controllers/InformasiController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PublicLayout } from '../layout';
import type { PaginatedPublicBantuan } from '../types';

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

export default function InformasiBantuanIndex({
    bantuan,
    filters,
}: {
    bantuan: PaginatedPublicBantuan;
    filters: { search: string };
}) {
    const [search, setSearch] = useState(filters.search);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        router.get(bantuanIndex.url(), { search }, { preserveState: true });
    }

    function reset() {
        setSearch('');
        router.get(bantuanIndex.url(), { search: '' }, { preserveState: true });
    }

    return (
        <PublicLayout title="Bantuan Desa">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-emerald-700">
                    Program Publik
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-950">
                    Program Bantuan Desa
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Daftar program bantuan yang sudah dipublikasikan pemerintah
                    desa untuk warga.
                </p>
            </section>

            <form
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                onSubmit={submit}
            >
                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500" />
                        <Input
                            className="h-11 pl-9"
                            placeholder="Cari nama, jenis, atau sumber bantuan"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>
                    <Button
                        className="h-11 bg-emerald-700 px-5 hover:bg-emerald-800"
                        type="submit"
                    >
                        Cari
                    </Button>
                    <Button
                        className="h-11 px-3"
                        onClick={reset}
                        type="button"
                        variant="outline"
                    >
                        <X />
                    </Button>
                </div>
            </form>

            <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {bantuan.data.map((item) => (
                    <article
                        className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        key={item.id}
                    >
                        <p className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                            Dipublikasikan {formatDate(item.published_at)}
                        </p>
                        <h2 className="mt-4 text-lg leading-7 font-semibold text-slate-950">
                            {item.nama_bantuan}
                        </h2>
                        <p className="mt-1 text-sm text-slate-600">
                            {[
                                item.jenis_bantuan,
                                item.sumber_bantuan,
                                item.tahun ?? '-',
                            ].join(' · ')}
                        </p>
                        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">
                            {item.deskripsi ?? 'Tidak ada deskripsi.'}
                        </p>
                        <div className="mt-5 flex items-center justify-between gap-3">
                            <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                                {item.penerima_bantuan_count ?? 0} penerima
                            </span>
                            <Button asChild size="sm" variant="outline">
                                <Link href={bantuanShow.url(item.id)}>
                                    Detail
                                </Link>
                            </Button>
                        </div>
                    </article>
                ))}
                {bantuan.data.length === 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-600 shadow-sm md:col-span-2 lg:col-span-3">
                        Belum ada bantuan yang dipublikasikan.
                    </div>
                )}
            </section>
        </PublicLayout>
    );
}
