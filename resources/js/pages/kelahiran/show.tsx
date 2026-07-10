import { Head, Link } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import {
    edit,
    index,
} from '@/actions/App/Http/Controllers/KelahiranController';
import { show as showPenduduk } from '@/actions/App/Http/Controllers/PendudukController';
import { moduleBreadcrumbs } from '@/components/module-page';
import { Button } from '@/components/ui/button';
import type { Kelahiran } from './types';

function relationName(
    relation: Kelahiran['ayah'] | Kelahiran['ibu'],
    backup: string | null,
): string {
    return relation?.nama_lengkap ?? backup ?? '-';
}

function reporterName(kelahiran: Kelahiran): string {
    return (
        kelahiran.pelapor_nama ??
        kelahiran.pelapor_penduduk?.nama_lengkap ??
        '-'
    );
}

const detailFields: {
    label: string;
    value: (kelahiran: Kelahiran) => string;
}[] = [
    { label: 'Nama Bayi', value: (kelahiran) => kelahiran.nama_bayi },
    { label: 'Jenis Kelamin', value: (kelahiran) => kelahiran.jenis_kelamin },
    { label: 'Tempat Lahir', value: (kelahiran) => kelahiran.tempat_lahir },
    { label: 'Tanggal Lahir', value: (kelahiran) => kelahiran.tanggal_lahir },
    {
        label: 'Waktu Lahir',
        value: (kelahiran) => kelahiran.waktu_lahir?.slice(0, 5) ?? '-',
    },
    {
        label: 'Ayah',
        value: (kelahiran) => relationName(kelahiran.ayah, kelahiran.nama_ayah),
    },
    {
        label: 'Ibu',
        value: (kelahiran) => relationName(kelahiran.ibu, kelahiran.nama_ibu),
    },
    {
        label: 'Pelapor',
        value: (kelahiran) => reporterName(kelahiran),
    },
    {
        label: 'Tipe Pelapor',
        value: (kelahiran) => kelahiran.pelapor_tipe.replaceAll('_', ' '),
    },
    {
        label: 'Kontak Pelapor',
        value: (kelahiran) => kelahiran.pelapor_kontak ?? '-',
    },
    { label: 'Alamat', value: (kelahiran) => kelahiran.alamat },
    {
        label: 'Keterangan',
        value: (kelahiran) => kelahiran.keterangan ?? '-',
    },
];

export default function KelahiranShow({ kelahiran }: { kelahiran: Kelahiran }) {
    return (
        <>
            <Head title={kelahiran.nama_bayi} />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Detail Kelahiran
                        </p>
                        <h1 className="text-2xl font-semibold">
                            {kelahiran.nama_bayi}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {kelahiran.tempat_lahir}, {kelahiran.tanggal_lahir}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href={index.url()}>Kembali</Link>
                        </Button>
                        <Button asChild>
                            <Link href={edit.url(kelahiran.id)}>
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
                                    {field.value(kelahiran)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {kelahiran.penduduk_id_bayi && kelahiran.bayi_penduduk && (
                    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground uppercase">
                                    Penduduk Bayi
                                </p>
                                <h2 className="mt-1 text-lg font-semibold">
                                    {kelahiran.bayi_penduduk.nama_lengkap}
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    NIK:{' '}
                                    {kelahiran.bayi_penduduk.nik ??
                                        'Belum tersedia'}{' '}
                                    · Status:{' '}
                                    {kelahiran.bayi_penduduk.status_penduduk ??
                                        '-'}
                                </p>
                            </div>
                            <Button asChild variant="outline">
                                <Link
                                    href={showPenduduk.url(
                                        kelahiran.penduduk_id_bayi,
                                    )}
                                >
                                    Lihat Penduduk
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

KelahiranShow.layout = {
    breadcrumbs: moduleBreadcrumbs('Detail Kelahiran', index()),
};
