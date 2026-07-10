import { Head } from '@inertiajs/react';
import { index } from '@/actions/App/Http/Controllers/KelahiranController';
import { moduleBreadcrumbs } from '@/components/module-page';
import { KelahiranForm } from './form';
import type { KelahiranOptions } from './types';

export default function KelahiranCreate({
    options,
}: {
    options: KelahiranOptions;
}) {
    return (
        <>
            <Head title="Tambah Kelahiran" />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div>
                    <p className="text-sm font-medium text-primary">
                        Data Kelahiran
                    </p>
                    <h1 className="text-2xl font-semibold">Tambah Kelahiran</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Catat peristiwa kelahiran dan relasikan dengan data
                        penduduk jika tersedia.
                    </p>
                </div>
                <KelahiranForm mode="create" options={options} />
            </div>
        </>
    );
}

KelahiranCreate.layout = {
    breadcrumbs: moduleBreadcrumbs('Tambah Kelahiran', index()),
};
