import { Head, Link } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import {
    edit,
    index,
} from '@/actions/App/Http/Controllers/PendatangController';
import { show as showPenduduk } from '@/actions/App/Http/Controllers/PendudukController';
import { moduleBreadcrumbs } from '@/components/module-page';
import { Button } from '@/components/ui/button';
import type { Pendatang } from './types';

function formatDate(value: string | null): string {
    if (!value) return '-';

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
}

function reporterName(pendatang: Pendatang): string {
    return (
        pendatang.pelapor_nama ??
        pendatang.pelapor_penduduk?.nama_lengkap ??
        '-'
    );
}

const detailFields: {
    label: string;
    value: (pendatang: Pendatang) => string;
}[] = [
    { label: 'NIK', value: (pendatang) => pendatang.nik ?? '-' },
    { label: 'Nama Lengkap', value: (pendatang) => pendatang.nama_lengkap },
    { label: 'Jenis Kelamin', value: (pendatang) => pendatang.jenis_kelamin },
    {
        label: 'Tempat Lahir',
        value: (pendatang) => pendatang.tempat_lahir ?? '-',
    },
    {
        label: 'Tanggal Lahir',
        value: (pendatang) => formatDate(pendatang.tanggal_lahir),
    },
    { label: 'Agama', value: (pendatang) => pendatang.agama ?? '-' },
    {
        label: 'Status Perkawinan',
        value: (pendatang) => pendatang.status_perkawinan ?? '-',
    },
    { label: 'Pendidikan', value: (pendatang) => pendatang.pendidikan ?? '-' },
    { label: 'Pekerjaan', value: (pendatang) => pendatang.pekerjaan ?? '-' },
    { label: 'No HP', value: (pendatang) => pendatang.no_hp ?? '-' },
    {
        label: 'Alamat Asal',
        value: (pendatang) => pendatang.alamat_asal ?? '-',
    },
    { label: 'Desa Asal', value: (pendatang) => pendatang.desa_asal ?? '-' },
    {
        label: 'Kecamatan Asal',
        value: (pendatang) => pendatang.kecamatan_asal ?? '-',
    },
    {
        label: 'Kabupaten Asal',
        value: (pendatang) => pendatang.kabupaten_asal ?? '-',
    },
    {
        label: 'Provinsi Asal',
        value: (pendatang) => pendatang.provinsi_asal ?? '-',
    },
    {
        label: 'Dusun Tujuan',
        value: (pendatang) => pendatang.dusun?.nama_dusun ?? '-',
    },
    {
        label: 'Alamat Tujuan',
        value: (pendatang) => pendatang.alamat_tujuan ?? '-',
    },
    {
        label: 'RT/RW',
        value: (pendatang) => `${pendatang.rt ?? '-'} / ${pendatang.rw ?? '-'}`,
    },
    {
        label: 'Tanggal Datang',
        value: (pendatang) => formatDate(pendatang.tanggal_datang),
    },
    {
        label: 'Alasan Datang',
        value: (pendatang) => pendatang.alasan_datang ?? '-',
    },
    { label: 'Status', value: (pendatang) => pendatang.status },
    { label: 'Pelapor', value: (pendatang) => reporterName(pendatang) },
    {
        label: 'Tipe Pelapor',
        value: (pendatang) => pendatang.pelapor_tipe.replaceAll('_', ' '),
    },
    {
        label: 'Kontak Pelapor',
        value: (pendatang) => pendatang.pelapor_kontak ?? '-',
    },
    { label: 'Keterangan', value: (pendatang) => pendatang.keterangan ?? '-' },
];

export default function PendatangShow({ pendatang }: { pendatang: Pendatang }) {
    return (
        <>
            <Head title={pendatang.nama_lengkap} />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Detail Pendatang
                        </p>
                        <h1 className="text-2xl font-semibold">
                            {pendatang.nama_lengkap}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {pendatang.nik ?? 'NIK belum diisi'} -{' '}
                            {pendatang.status}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href={index.url()}>Kembali</Link>
                        </Button>
                        {pendatang.penduduk_id && (
                            <Button asChild variant="outline">
                                <Link
                                    href={showPenduduk.url(
                                        pendatang.penduduk_id,
                                    )}
                                >
                                    Detail Penduduk
                                </Link>
                            </Button>
                        )}
                        <Button asChild>
                            <Link href={edit.url(pendatang.id)}>
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
                                    {field.value(pendatang)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

PendatangShow.layout = {
    breadcrumbs: moduleBreadcrumbs('Detail Pendatang', index()),
};
