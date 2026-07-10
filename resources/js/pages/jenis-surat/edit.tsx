import { Head } from '@inertiajs/react';
import { JenisSuratForm } from './form';
import type { JenisSurat } from './types';

export default function JenisSuratEdit({
    jenisSurat,
}: {
    jenisSurat: JenisSurat;
}) {
    return (
        <>
            <Head title={`Edit ${jenisSurat.kode_surat}`} />
            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
                <div>
                    <p className="text-sm font-medium text-primary">
                        Master Surat
                    </p>
                    <h1 className="text-2xl font-semibold">
                        Edit Jenis Surat
                    </h1>
                </div>
                <JenisSuratForm jenisSurat={jenisSurat} />
            </div>
        </>
    );
}
