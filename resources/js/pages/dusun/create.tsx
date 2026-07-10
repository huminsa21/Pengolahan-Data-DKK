import { Head } from '@inertiajs/react';
import { index } from '@/actions/App/Http/Controllers/DusunController';
import { moduleBreadcrumbs } from '@/components/module-page';
import { DusunForm } from './form';
import type { PendudukOption } from './types';

export default function DusunCreate({
    pendudukOptions,
}: {
    pendudukOptions: PendudukOption[];
}) {
    return (
        <>
            <Head title="Tambah Dusun" />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div>
                    <p className="text-sm font-medium text-primary">
                        Master Data
                    </p>
                    <h1 className="text-2xl font-semibold">Tambah Dusun</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Tambahkan wilayah dusun untuk dipakai pada data
                        penduduk.
                    </p>
                </div>
                <DusunForm mode="create" pendudukOptions={pendudukOptions} />
            </div>
        </>
    );
}

DusunCreate.layout = {
    breadcrumbs: moduleBreadcrumbs('Tambah Dusun', index()),
};
