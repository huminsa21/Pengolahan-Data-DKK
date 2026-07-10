import { Head, Link } from '@inertiajs/react';
import { Download, Eye, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { download, edit, preview } from '@/routes/surat';
import { StatusBadge } from './index';
import type { Surat } from './types';

export default function SuratShow({
    surat,
    reference,
}: {
    surat: Surat;
    reference: Record<string, unknown> | null;
}) {
    return (
        <>
            <Head title={surat.nomor_surat ?? 'Draft Surat'} />
            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
                <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            {surat.jenis_surat?.nama_surat}
                        </p>
                        <h1 className="text-2xl font-semibold">
                            {surat.nomor_surat ?? 'Draft Surat'}
                        </h1>
                        <div className="mt-3">
                            <StatusBadge status={surat.status} />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {surat.status === 'DRAFT' && (
                            <Button asChild variant="outline">
                                <Link href={edit.url(surat.id)}>
                                    <Pencil />
                                    Edit
                                </Link>
                            </Button>
                        )}
                        <Button asChild variant="outline">
                            <a href={preview.url(surat.id)} target="_blank">
                                <Eye />
                                Preview PDF
                            </a>
                        </Button>
                        {surat.status === 'SELESAI' && (
                            <Button asChild>
                                <a href={download.url(surat.id)}>
                                    <Download />
                                    Download PDF
                                </a>
                            </Button>
                        )}
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                    <InfoCard
                        items={[
                            ['Jenis Surat', surat.jenis_surat?.nama_surat],
                            ['Tanggal Surat', surat.tanggal_surat?.slice(0, 10)],
                            ['Keperluan', surat.keperluan],
                            ['Dibuat Oleh', surat.pembuat?.name],
                        ]}
                        title="Data Surat"
                    />
                    <InfoCard
                        items={[
                            ['NIK', surat.penduduk?.nik],
                            ['Nama', surat.penduduk?.nama_lengkap],
                            ['Alamat', surat.penduduk?.alamat],
                            [
                                'Dusun/RT/RW',
                                surat.penduduk
                                    ? `${surat.penduduk.dusun ?? '-'} / ${surat.penduduk.rt ?? '-'} / ${surat.penduduk.rw ?? '-'}`
                                    : '-',
                            ],
                        ]}
                        title="Data Penduduk"
                    />
                </section>

                <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
                    <h2 className="text-base font-semibold">Data Referensi</h2>
                    <pre className="mt-3 overflow-auto rounded-md bg-muted p-4 text-xs">
                        {JSON.stringify(reference ?? surat.data_json ?? {}, null, 2)}
                    </pre>
                </section>
            </div>
        </>
    );
}

function InfoCard({
    title,
    items,
}: {
    title: string;
    items: [string, unknown][];
}) {
    return (
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <h2 className="text-base font-semibold">{title}</h2>
            <dl className="mt-4 space-y-3 text-sm">
                {items.map(([label, value]) => (
                    <div className="grid grid-cols-[135px_1fr] gap-3" key={label}>
                        <dt className="text-muted-foreground">{label}</dt>
                        <dd>{String(value ?? '-')}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
