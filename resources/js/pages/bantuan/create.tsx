import { Head } from '@inertiajs/react';
import { index } from '@/actions/App/Http/Controllers/BantuanController';
import { moduleBreadcrumbs } from '@/components/module-page';
import { BantuanForm } from './form';
import type { BantuanOptions } from './types';

export default function BantuanCreate({
    options,
}: {
    options: BantuanOptions;
}) {
    return (
        <>
            <Head title="Tambah Bantuan" />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div>
                    <p className="text-sm font-medium text-primary">
                        Program Bantuan
                    </p>
                    <h1 className="text-2xl font-semibold">Tambah Bantuan</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Buat master program bantuan desa dan pengaturan
                        publikasinya.
                    </p>
                </div>
                <BantuanForm mode="create" options={options} />
            </div>
        </>
    );
}

BantuanCreate.layout = {
    breadcrumbs: moduleBreadcrumbs('Tambah Bantuan', index()),
};
