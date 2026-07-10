import { Head } from '@inertiajs/react';
import { index } from '@/actions/App/Http/Controllers/PendatangController';
import { moduleBreadcrumbs } from '@/components/module-page';
import { PendatangForm } from './form';
import type { PendatangOptions } from './types';

export default function PendatangCreate({
    options,
}: {
    options: PendatangOptions;
}) {
    return (
        <>
            <Head title="Tambah Pendatang" />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div>
                    <p className="text-sm font-medium text-primary">
                        Data Pendatang
                    </p>
                    <h1 className="text-2xl font-semibold">Tambah Pendatang</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Catat identitas, asal, tujuan, status, dan data pelapor.
                    </p>
                </div>
                <PendatangForm mode="create" options={options} />
            </div>
        </>
    );
}

PendatangCreate.layout = {
    breadcrumbs: moduleBreadcrumbs('Tambah Pendatang', index()),
};
