import { Head } from '@inertiajs/react';
import { index as pendudukIndex } from '@/actions/App/Http/Controllers/PendudukController';
import { moduleBreadcrumbs } from '@/components/module-page';
import { PendudukForm } from './form';
import type { Penduduk, PendudukOptions } from './types';

export default function PendudukEdit({
    penduduk,
    options,
}: {
    penduduk: Penduduk;
    options: PendudukOptions;
}) {
    return (
        <>
            <Head title={`Edit ${penduduk.nama_lengkap}`} />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div>
                    <p className="text-sm font-medium text-primary">
                        Data Penduduk
                    </p>
                    <h1 className="text-2xl font-semibold">Edit Penduduk</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Perbarui data {penduduk.nama_lengkap}.
                    </p>
                </div>
                <PendudukForm
                    mode="edit"
                    options={options}
                    penduduk={penduduk}
                />
            </div>
        </>
    );
}

PendudukEdit.layout = {
    breadcrumbs: moduleBreadcrumbs('Edit Penduduk', pendudukIndex()),
};
