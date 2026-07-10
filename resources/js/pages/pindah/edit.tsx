import { Head } from '@inertiajs/react';
import { index } from '@/actions/App/Http/Controllers/PindahController';
import { moduleBreadcrumbs } from '@/components/module-page';
import { PindahForm } from './form';
import type { Pindah, PindahOptions } from './types';

export default function PindahEdit({
    pindah,
    options,
}: {
    pindah: Pindah;
    options: PindahOptions;
}) {
    return (
        <>
            <Head title={`Edit ${pindah.penduduk.nama_lengkap}`} />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div>
                    <p className="text-sm font-medium text-primary">
                        Data Pindah
                    </p>
                    <h1 className="text-2xl font-semibold">Edit Pindah</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Perbarui data pindah {pindah.penduduk.nama_lengkap}.
                    </p>
                </div>
                <PindahForm pindah={pindah} mode="edit" options={options} />
            </div>
        </>
    );
}

PindahEdit.layout = {
    breadcrumbs: moduleBreadcrumbs('Edit Pindah', index()),
};
