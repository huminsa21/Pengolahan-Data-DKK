import { Head } from '@inertiajs/react';
import { index } from '@/actions/App/Http/Controllers/KelahiranController';
import { moduleBreadcrumbs } from '@/components/module-page';
import { KelahiranForm } from './form';
import type { Kelahiran, KelahiranOptions } from './types';

export default function KelahiranEdit({
    kelahiran,
    options,
}: {
    kelahiran: Kelahiran;
    options: KelahiranOptions;
}) {
    return (
        <>
            <Head title={`Edit ${kelahiran.nama_bayi}`} />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div>
                    <p className="text-sm font-medium text-primary">
                        Data Kelahiran
                    </p>
                    <h1 className="text-2xl font-semibold">Edit Kelahiran</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Perbarui data kelahiran {kelahiran.nama_bayi}.
                    </p>
                </div>
                <KelahiranForm
                    kelahiran={kelahiran}
                    mode="edit"
                    options={options}
                />
            </div>
        </>
    );
}

KelahiranEdit.layout = {
    breadcrumbs: moduleBreadcrumbs('Edit Kelahiran', index()),
};
