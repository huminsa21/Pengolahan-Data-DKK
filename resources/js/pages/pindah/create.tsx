import { Head } from '@inertiajs/react';
import { index } from '@/actions/App/Http/Controllers/PindahController';
import { moduleBreadcrumbs } from '@/components/module-page';
import { PindahForm } from './form';
import type { PindahOptions } from './types';

export default function PindahCreate({ options }: { options: PindahOptions }) {
    return (
        <>
            <Head title="Tambah Pindah" />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div>
                    <p className="text-sm font-medium text-primary">
                        Data Pindah
                    </p>
                    <h1 className="text-2xl font-semibold">Tambah Pindah</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Pilih penduduk aktif lalu lengkapi tujuan, status, dan
                        data pelapor.
                    </p>
                </div>
                <PindahForm mode="create" options={options} />
            </div>
        </>
    );
}

PindahCreate.layout = {
    breadcrumbs: moduleBreadcrumbs('Tambah Pindah', index()),
};
