import { Head, Link, router } from '@inertiajs/react';
import { Archive, Edit, Megaphone } from 'lucide-react';
import {
    archive,
    edit,
    index,
    publish,
} from '@/actions/App/Http/Controllers/PengumumanController';
import { moduleBreadcrumbs } from '@/components/module-page';
import { Button } from '@/components/ui/button';
import type { Pengumuman } from './types';

function statusBadge(status: string): string {
    if (status === 'PUBLISHED') {
        return 'border-[#16A34A]/20 bg-[#16A34A]/10 text-[#166534]';
    }

    if (status === 'ARCHIVED') {
        return 'border-[#DC2626]/20 bg-[#DC2626]/10 text-[#DC2626]';
    }

    return 'border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#92400E]';
}

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

export default function PengumumanShow({
    pengumuman,
}: {
    pengumuman: Pengumuman;
}) {
    function publishPengumuman() {
        router.post(publish.url(pengumuman.id), {}, { preserveScroll: true });
    }

    function archivePengumuman() {
        router.post(archive.url(pengumuman.id), {}, { preserveScroll: true });
    }

    return (
        <>
            <Head title={pengumuman.judul} />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Detail Pengumuman
                        </p>
                        <h1 className="mt-1 text-2xl font-semibold">
                            {pengumuman.judul}
                        </h1>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <span
                                className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${statusBadge(pengumuman.status)}`}
                            >
                                {pengumuman.status}
                            </span>
                            <span className="inline-flex rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-muted-foreground">
                                Publish:{' '}
                                {formatDate(pengumuman.tanggal_publish)}
                            </span>
                            <span className="inline-flex rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-muted-foreground">
                                Pembuat: {pengumuman.pembuat?.name ?? '-'}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline">
                            <Link href={index.url()}>Kembali</Link>
                        </Button>
                        <Button asChild>
                            <Link href={edit.url(pengumuman.id)}>
                                <Edit />
                                Edit
                            </Link>
                        </Button>
                        {pengumuman.status !== 'PUBLISHED' && (
                            <Button onClick={publishPengumuman}>
                                <Megaphone />
                                Publish
                            </Button>
                        )}
                        {pengumuman.status !== 'ARCHIVED' && (
                            <Button
                                onClick={archivePengumuman}
                                variant="outline"
                            >
                                <Archive />
                                Archive
                            </Button>
                        )}
                    </div>
                </div>

                {Boolean(pengumuman.bantuan_count) && (
                    <div className="rounded-lg border border-[#F59E0B]/20 bg-[#F59E0B]/10 p-4 text-sm text-[#92400E]">
                        Pengumuman ini terhubung ke bantuan. Gunakan archive
                        jika tidak ingin menampilkannya di halaman publik.
                    </div>
                )}

                <article className="rounded-lg border border-border bg-card p-5 shadow-sm">
                    <div className="prose prose-sm max-w-none whitespace-pre-line text-foreground">
                        {pengumuman.isi}
                    </div>
                </article>
            </div>
        </>
    );
}

PengumumanShow.layout = {
    breadcrumbs: moduleBreadcrumbs('Detail Pengumuman', index()),
};
