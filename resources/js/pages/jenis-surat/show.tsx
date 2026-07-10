import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { edit } from '@/routes/jenis-surat';
import type { JenisSurat } from './types';

export default function JenisSuratShow({
    jenisSurat,
}: {
    jenisSurat: JenisSurat;
}) {
    return (
        <>
            <Head title={jenisSurat.nama_surat} />
            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
                <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            {jenisSurat.kode_surat}
                        </p>
                        <h1 className="text-2xl font-semibold">
                            {jenisSurat.nama_surat}
                        </h1>
                        <div className="mt-3 flex gap-2">
                            <Badge
                                variant={
                                    jenisSurat.is_active
                                        ? 'default'
                                        : 'secondary'
                                }
                            >
                                {jenisSurat.is_active ? 'Aktif' : 'Nonaktif'}
                            </Badge>
                            <Badge variant="outline">
                                {jenisSurat.surat_count ?? 0} surat
                            </Badge>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={edit.url(jenisSurat.id)}>Edit</Link>
                    </Button>
                </section>
                <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
                    <h2 className="text-base font-semibold">Template</h2>
                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                        {jenisSurat.template_surat || 'Belum ada template.'}
                    </p>
                </section>
            </div>
        </>
    );
}
