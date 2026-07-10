import { Head } from '@inertiajs/react';
import { SuratForm } from './form';
import type { Surat, SuratOptions } from './types';

export default function SuratEdit({
    surat,
    options,
}: {
    surat: Surat;
    options: SuratOptions;
}) {
    return (
        <>
            <Head title="Edit Draft Surat" />
            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
                <div>
                    <p className="text-sm font-medium text-primary">
                        Layanan Surat
                    </p>
                    <h1 className="text-2xl font-semibold">Edit Draft Surat</h1>
                </div>
                <SuratForm options={options} surat={surat} />
            </div>
        </>
    );
}
