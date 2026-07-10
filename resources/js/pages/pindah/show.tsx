import { Head, Link } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import { edit, index } from '@/actions/App/Http/Controllers/PindahController';
import { moduleBreadcrumbs } from '@/components/module-page';
import { Button } from '@/components/ui/button';
import type { Pindah } from './types';

function formatDate(value: string): string {
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
}

function reporterName(pindah: Pindah): string {
    return pindah.pelapor_nama ?? pindah.pelapor_penduduk?.nama_lengkap ?? '-';
}

function dusunName(pindah: Pindah): string {
    return (
        pindah.penduduk.wilayah_dusun?.nama_dusun ??
        pindah.penduduk.dusun ??
        '-'
    );
}

const detailFields: {
    label: string;
    value: (pindah: Pindah) => string;
}[] = [
    { label: 'NIK', value: (pindah) => pindah.penduduk.nik },
    { label: 'Nama Penduduk', value: (pindah) => pindah.penduduk.nama_lengkap },
    {
        label: 'Jenis Kelamin',
        value: (pindah) => pindah.penduduk.jenis_kelamin,
    },
    { label: 'Dusun', value: (pindah) => dusunName(pindah) },
    { label: 'Alamat Asal', value: (pindah) => pindah.penduduk.alamat },
    {
        label: 'Tanggal Pindah',
        value: (pindah) => formatDate(pindah.tanggal_pindah),
    },
    { label: 'Alamat Tujuan', value: (pindah) => pindah.alamat_tujuan ?? '-' },
    { label: 'Desa Tujuan', value: (pindah) => pindah.desa_tujuan ?? '-' },
    {
        label: 'Kecamatan Tujuan',
        value: (pindah) => pindah.kecamatan_tujuan ?? '-',
    },
    {
        label: 'Kabupaten Tujuan',
        value: (pindah) => pindah.kabupaten_tujuan ?? '-',
    },
    {
        label: 'Provinsi Tujuan',
        value: (pindah) => pindah.provinsi_tujuan ?? '-',
    },
    { label: 'Alasan Pindah', value: (pindah) => pindah.alasan_pindah ?? '-' },
    { label: 'Status', value: (pindah) => pindah.status },
    { label: 'Pelapor', value: (pindah) => reporterName(pindah) },
    {
        label: 'Tipe Pelapor',
        value: (pindah) => pindah.pelapor_tipe.replaceAll('_', ' '),
    },
    {
        label: 'Kontak Pelapor',
        value: (pindah) => pindah.pelapor_kontak ?? '-',
    },
    { label: 'Keterangan', value: (pindah) => pindah.keterangan ?? '-' },
];

export default function PindahShow({ pindah }: { pindah: Pindah }) {
    return (
        <>
            <Head title={pindah.penduduk.nama_lengkap} />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Detail Pindah
                        </p>
                        <h1 className="text-2xl font-semibold">
                            {pindah.penduduk.nama_lengkap}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {pindah.penduduk.nik} -{' '}
                            {formatDate(pindah.tanggal_pindah)}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href={index.url()}>Kembali</Link>
                        </Button>
                        <Button asChild>
                            <Link href={edit.url(pindah.id)}>
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
                                    {field.value(pindah)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

PindahShow.layout = {
    breadcrumbs: moduleBreadcrumbs('Detail Pindah', index()),
};
