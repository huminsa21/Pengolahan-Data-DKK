import { Head, Link } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import { edit, index } from '@/actions/App/Http/Controllers/DusunController';
import { moduleBreadcrumbs } from '@/components/module-page';
import { Button } from '@/components/ui/button';
import type { Dusun } from './types';

const detailFields: {
    label: string;
    value: (dusun: Dusun) => string;
}[] = [
    { label: 'Kode Dusun', value: (dusun) => dusun.kode_dusun ?? '-' },
    { label: 'Nama Dusun', value: (dusun) => dusun.nama_dusun },
    { label: 'Kepala Dusun', value: (dusun) => dusun.kepala_dusun ?? '-' },
    {
        label: 'No HP Kepala Dusun',
        value: (dusun) => dusun.no_hp_kepala_dusun ?? '-',
    },
    {
        label: 'Status',
        value: (dusun) => (dusun.is_active ? 'Aktif' : 'Nonaktif'),
    },
    {
        label: 'Jumlah Penduduk',
        value: (dusun) => String(dusun.penduduk_count ?? 0),
    },
    { label: 'Keterangan', value: (dusun) => dusun.keterangan ?? '-' },
];

export default function DusunShow({ dusun }: { dusun: Dusun }) {
    return (
        <>
            <Head title={dusun.nama_dusun} />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Detail Dusun
                        </p>
                        <h1 className="text-2xl font-semibold">
                            {dusun.nama_dusun}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {dusun.kode_dusun ?? 'Tanpa kode'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href={index.url()}>Kembali</Link>
                        </Button>
                        <Button asChild>
                            <Link href={edit.url(dusun.id)}>
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
                                    {field.value(dusun)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

DusunShow.layout = {
    breadcrumbs: moduleBreadcrumbs('Detail Dusun', index()),
};
