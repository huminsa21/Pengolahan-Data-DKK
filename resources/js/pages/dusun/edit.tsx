import { Head } from '@inertiajs/react';
import { index } from '@/actions/App/Http/Controllers/DusunController';
import { moduleBreadcrumbs } from '@/components/module-page';
import { DusunForm } from './form';
import type { Dusun, PendudukOption } from './types';

export default function DusunEdit({
    dusun,
    pendudukOptions,
}: {
    dusun: Dusun;
    pendudukOptions: PendudukOption[];
}) {
    return (
        <>
            <Head title={`Edit ${dusun.nama_dusun}`} />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div>
                    <p className="text-sm font-medium text-primary">
                        Master Data
                    </p>
                    <h1 className="text-2xl font-semibold">Edit Dusun</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Perbarui data {dusun.nama_dusun}.
                    </p>
                </div>
                <DusunForm
                    dusun={dusun}
                    mode="edit"
                    pendudukOptions={pendudukOptions}
                />
            </div>
        </>
    );
}

DusunEdit.layout = {
    breadcrumbs: moduleBreadcrumbs('Edit Dusun', index()),
};
