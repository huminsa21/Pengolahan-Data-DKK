import { Head } from '@inertiajs/react';
import { index } from '@/actions/App/Http/Controllers/KematianController';
import { moduleBreadcrumbs } from '@/components/module-page';
import { KematianForm } from './form';
import type { KematianOptions } from './types';

export default function KematianCreate({
    options,
}: {
    options: KematianOptions;
}) {
    return (
        <>
            <Head title="Tambah Kematian" />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div>
                    <p className="text-sm font-medium text-primary">
                        Data Kematian
                    </p>
                    <h1 className="text-2xl font-semibold">Tambah Kematian</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Pilih penduduk dari master data lalu lengkapi informasi
                        kematian dan pelapor.
                    </p>
                </div>
                <KematianForm mode="create" options={options} />
            </div>
        </>
    );
}

KematianCreate.layout = {
    breadcrumbs: moduleBreadcrumbs('Tambah Kematian', index()),
};
