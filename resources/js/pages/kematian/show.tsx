import { Head, Link } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import { edit, index } from '@/actions/App/Http/Controllers/KematianController';
import { moduleBreadcrumbs } from '@/components/module-page';
import { Button } from '@/components/ui/button';
import type { Kematian } from './types';

function formatDate(value: string): string {
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
}

function reporterName(kematian: Kematian): string {
    return (
        kematian.pelapor_nama ?? kematian.pelapor_penduduk?.nama_lengkap ?? '-'
    );
}

function dusunName(kematian: Kematian): string {
    return (
        kematian.penduduk.wilayah_dusun?.nama_dusun ??
        kematian.penduduk.dusun ??
        '-'
    );
}

const detailFields: {
    label: string;
    value: (kematian: Kematian) => string;
}[] = [
    { label: 'NIK', value: (kematian) => kematian.penduduk.nik },
    {
        label: 'Nama Penduduk',
        value: (kematian) => kematian.penduduk.nama_lengkap,
    },
    {
        label: 'Jenis Kelamin',
        value: (kematian) => kematian.penduduk.jenis_kelamin,
    },
    { label: 'Dusun', value: (kematian) => dusunName(kematian) },
    { label: 'Alamat', value: (kematian) => kematian.penduduk.alamat },
    {
        label: 'Tanggal Meninggal',
        value: (kematian) => formatDate(kematian.tanggal_meninggal),
    },
    {
        label: 'Tempat Meninggal',
        value: (kematian) => kematian.tempat_meninggal ?? '-',
    },
    {
        label: 'Sebab Meninggal',
        value: (kematian) => kematian.sebab_meninggal ?? '-',
    },
    { label: 'Pelapor', value: (kematian) => reporterName(kematian) },
    {
        label: 'Tipe Pelapor',
        value: (kematian) => kematian.pelapor_tipe.replaceAll('_', ' '),
    },
    {
        label: 'Kontak Pelapor',
        value: (kematian) => kematian.pelapor_kontak ?? '-',
    },
    {
        label: 'Keterangan',
        value: (kematian) => kematian.keterangan ?? '-',
    },
];

export default function KematianShow({ kematian }: { kematian: Kematian }) {
    return (
        <>
            <Head title={kematian.penduduk.nama_lengkap} />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Detail Kematian
                        </p>
                        <h1 className="text-2xl font-semibold">
                            {kematian.penduduk.nama_lengkap}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {kematian.penduduk.nik} -{' '}
                            {formatDate(kematian.tanggal_meninggal)}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href={index.url()}>Kembali</Link>
                        </Button>
                        <Button asChild>
                            <Link href={edit.url(kematian.id)}>
                                <Edit />
                                Edit
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {detailFields.map((field) => (
                            <div
                                className="rounded-md border border-border bg-background p-4"
                                key={field.label}
                            >
                                <p className="text-xs font-medium text-muted-foreground uppercase">
                                    {field.label}
                                </p>
                                <p className="mt-2 text-sm font-medium text-foreground">
                                    {field.value(kematian)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

KematianShow.layout = {
    breadcrumbs: moduleBreadcrumbs('Detail Kematian', index()),
};
