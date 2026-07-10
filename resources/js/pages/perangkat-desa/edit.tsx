import { Head } from '@inertiajs/react';

import { moduleBreadcrumbs } from '@/components/module-page';
import { index } from '@/actions/App/Http/Controllers/PerangkatDesaController';
import { PerangkatDesaForm } from './form';
import type { PerangkatDesa, PerangkatOptions } from './types';

export default function PerangkatDesaEdit({
    perangkatDesa,
    options,
}: {
    perangkatDesa: PerangkatDesa;
    options: PerangkatOptions;
}) {
    return (
        <>
            <Head title="Edit Perangkat Desa" />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div>
                    <p className="text-sm font-medium text-primary">
                        Pengaturan
                    </p>
                    <h1 className="text-2xl font-semibold">
                        Edit Perangkat Desa
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Perbarui data jabatan dan status perangkat desa.
                    </p>
                </div>
                <PerangkatDesaForm
                    mode="edit"
                    options={options}
                    perangkatDesa={perangkatDesa}
                />
            </div>
        </>
    );
}

PerangkatDesaEdit.layout = {
    breadcrumbs: moduleBreadcrumbs('Edit Perangkat Desa', index()),
};
