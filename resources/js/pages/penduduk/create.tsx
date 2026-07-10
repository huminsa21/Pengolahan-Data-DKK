import { Head } from '@inertiajs/react';
import { PendudukForm } from './form';
import { index as pendudukIndex } from '@/actions/App/Http/Controllers/PendudukController';
import { moduleBreadcrumbs } from '@/components/module-page';
import type { PendudukOptions } from './types';

export default function PendudukCreate({
    options,
}: {
    options: PendudukOptions;
}) {
    return (
        <>
            <Head title="Tambah Penduduk" />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div>
                    <p className="text-sm font-medium text-primary">
                        Data Penduduk
                    </p>
                    <h1 className="text-2xl font-semibold">Tambah Penduduk</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Lengkapi data warga sesuai dokumen kependudukan.
                    </p>
                </div>
                <PendudukForm mode="create" options={options} />
            </div>
        </>
    );
}

PendudukCreate.layout = {
    breadcrumbs: moduleBreadcrumbs('Tambah Penduduk', pendudukIndex()),
};
