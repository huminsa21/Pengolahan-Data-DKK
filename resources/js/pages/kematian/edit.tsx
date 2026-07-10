import { Head } from '@inertiajs/react';
import { index } from '@/actions/App/Http/Controllers/KematianController';
import { moduleBreadcrumbs } from '@/components/module-page';
import { KematianForm } from './form';
import type { Kematian, KematianOptions } from './types';

export default function KematianEdit({
    kematian,
    options,
}: {
    kematian: Kematian;
    options: KematianOptions;
}) {
    return (
        <>
            <Head title={`Edit ${kematian.penduduk.nama_lengkap}`} />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div>
                    <p className="text-sm font-medium text-primary">
                        Data Kematian
                    </p>
                    <h1 className="text-2xl font-semibold">Edit Kematian</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Perbarui catatan kematian{' '}
                        {kematian.penduduk.nama_lengkap}.
                    </p>
                </div>
                <KematianForm
                    kematian={kematian}
                    mode="edit"
                    options={options}
                />
            </div>
        </>
    );
}

KematianEdit.layout = {
    breadcrumbs: moduleBreadcrumbs('Edit Kematian', index()),
};
