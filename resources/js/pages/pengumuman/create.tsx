import { Head } from '@inertiajs/react';
import { index } from '@/actions/App/Http/Controllers/PengumumanController';
import { moduleBreadcrumbs } from '@/components/module-page';
import { PengumumanForm } from './form';
import type { PengumumanOptions } from './types';

export default function PengumumanCreate({
    options,
}: {
    options: PengumumanOptions;
}) {
    return (
        <>
            <Head title="Tambah Pengumuman" />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div>
                    <p className="text-sm font-medium text-primary">
                        Informasi Desa
                    </p>
                    <h1 className="text-2xl font-semibold">
                        Tambah Pengumuman
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Buat informasi publik desa selain publikasi bantuan.
                    </p>
                </div>
                <PengumumanForm mode="create" options={options} />
            </div>
        </>
    );
}

PengumumanCreate.layout = {
    breadcrumbs: moduleBreadcrumbs('Tambah Pengumuman', index()),
};
