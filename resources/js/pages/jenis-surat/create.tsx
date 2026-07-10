import { Head } from '@inertiajs/react';
import { JenisSuratForm } from './form';

export default function JenisSuratCreate() {
    return (
        <>
            <Head title="Tambah Jenis Surat" />
            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
                <div>
                    <p className="text-sm font-medium text-primary">
                        Master Surat
                    </p>
                    <h1 className="text-2xl font-semibold">
                        Tambah Jenis Surat
                    </h1>
                </div>
                <JenisSuratForm />
            </div>
        </>
    );
}
