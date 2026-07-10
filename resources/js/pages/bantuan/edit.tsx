import { Head } from '@inertiajs/react';
import { index } from '@/actions/App/Http/Controllers/BantuanController';
import { moduleBreadcrumbs } from '@/components/module-page';
import { BantuanForm } from './form';
import type { Bantuan, BantuanOptions } from './types';

export default function BantuanEdit({
    bantuan,
    options,
}: {
    bantuan: Bantuan;
    options: BantuanOptions;
}) {
    return (
        <>
            <Head title={`Edit ${bantuan.nama_bantuan}`} />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div>
                    <p className="text-sm font-medium text-primary">
                        Program Bantuan
                    </p>
                    <h1 className="text-2xl font-semibold">Edit Bantuan</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Perbarui data program {bantuan.nama_bantuan}.
                    </p>
                </div>
                <BantuanForm bantuan={bantuan} mode="edit" options={options} />
            </div>
        </>
    );
}

BantuanEdit.layout = {
    breadcrumbs: moduleBreadcrumbs('Edit Bantuan', index()),
};
