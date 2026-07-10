import { Head } from '@inertiajs/react';

import { moduleBreadcrumbs } from '@/components/module-page';
import { index } from '@/actions/App/Http/Controllers/PerangkatDesaController';
import { PerangkatDesaForm } from './form';
import type { PerangkatOptions } from './types';

export default function PerangkatDesaCreate({
    options,
}: {
    options: PerangkatOptions;
}) {
    return (
        <>
            <Head title="Tambah Perangkat Desa" />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div>
                    <p className="text-sm font-medium text-primary">
                        Pengaturan
                    </p>
                    <h1 className="text-2xl font-semibold">
                        Tambah Perangkat Desa
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Pilih penduduk aktif dan tetapkan jabatan perangkat
                        desa.
                    </p>
                </div>
                <PerangkatDesaForm mode="create" options={options} />
            </div>
        </>
    );
}

PerangkatDesaCreate.layout = {
    breadcrumbs: moduleBreadcrumbs('Tambah Perangkat Desa', index()),
};
