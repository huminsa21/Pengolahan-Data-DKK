import { Head } from '@inertiajs/react';
import { index } from '@/actions/App/Http/Controllers/PendatangController';
import { moduleBreadcrumbs } from '@/components/module-page';
import { PendatangForm } from './form';
import type { Pendatang, PendatangOptions } from './types';

export default function PendatangEdit({
    pendatang,
    options,
}: {
    pendatang: Pendatang;
    options: PendatangOptions;
}) {
    return (
        <>
            <Head title={`Edit ${pendatang.nama_lengkap}`} />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div>
                    <p className="text-sm font-medium text-primary">
                        Data Pendatang
                    </p>
                    <h1 className="text-2xl font-semibold">Edit Pendatang</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Perbarui data pendatang {pendatang.nama_lengkap}.
                    </p>
                </div>
                <PendatangForm
                    mode="edit"
                    options={options}
                    pendatang={pendatang}
                />
            </div>
        </>
    );
}

PendatangEdit.layout = {
    breadcrumbs: moduleBreadcrumbs('Edit Pendatang', index()),
};
