import { Head, Link } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import { edit, index } from '@/actions/App/Http/Controllers/PendudukController';
import { moduleBreadcrumbs } from '@/components/module-page';
import { Button } from '@/components/ui/button';
import type { Penduduk } from './types';

const detailFields: {
    label: string;
    value: (penduduk: Penduduk) => string;
}[] = [
    { label: 'NIK', value: (penduduk) => penduduk.nik },
    { label: 'Nama Lengkap', value: (penduduk) => penduduk.nama_lengkap },
    { label: 'Jenis Kelamin', value: (penduduk) => penduduk.jenis_kelamin },
    { label: 'Tempat Lahir', value: (penduduk) => penduduk.tempat_lahir },
    { label: 'Tanggal Lahir', value: (penduduk) => penduduk.tanggal_lahir },
    { label: 'Agama', value: (penduduk) => penduduk.agama },
    {
        label: 'Status Perkawinan',
        value: (penduduk) => penduduk.status_perkawinan,
    },
    { label: 'Pendidikan', value: (penduduk) => penduduk.pendidikan },
    { label: 'Pekerjaan', value: (penduduk) => penduduk.pekerjaan },
    { label: 'No. HP', value: (penduduk) => penduduk.no_hp ?? '-' },
    { label: 'Alamat', value: (penduduk) => penduduk.alamat },
    {
        label: 'Dusun',
        value: (penduduk) =>
            penduduk.wilayah_dusun?.nama_dusun ?? penduduk.dusun ?? '-',
    },
    { label: 'RT', value: (penduduk) => penduduk.rt },
    { label: 'RW', value: (penduduk) => penduduk.rw },
    { label: 'Desa', value: (penduduk) => penduduk.desa },
    { label: 'Kecamatan', value: (penduduk) => penduduk.kecamatan },
    { label: 'Kabupaten', value: (penduduk) => penduduk.kabupaten },
    { label: 'Provinsi', value: (penduduk) => penduduk.provinsi },
    { label: 'No. KK', value: (penduduk) => penduduk.no_kk ?? '-' },
    {
        label: 'Hubungan Keluarga',
        value: (penduduk) => penduduk.hubungan_keluarga ?? '-',
    },
    { label: 'Status Penduduk', value: (penduduk) => penduduk.status_penduduk },
];

export default function PendudukShow({ penduduk }: { penduduk: Penduduk }) {
    return (
        <>
            <Head title={penduduk.nama_lengkap} />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Detail Penduduk
                        </p>
                        <h1 className="text-2xl font-semibold">
                            {penduduk.nama_lengkap}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {penduduk.nik}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href={index.url()}>Kembali</Link>
                        </Button>
                        <Button asChild>
                            <Link href={edit.url(penduduk.id)}>
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
                                    {field.value(penduduk)}
                                </p>
                            </div>
                        ))}
                        <div className="rounded-md border border-border bg-background p-4">
                            <p className="text-xs font-medium text-muted-foreground uppercase">
                                Kepala Keluarga
                            </p>
                            <p className="mt-2 text-sm font-medium text-foreground">
                                {penduduk.is_kepala_keluarga ? 'Ya' : 'Tidak'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

PendudukShow.layout = {
    breadcrumbs: moduleBreadcrumbs('Detail Penduduk', index()),
};
