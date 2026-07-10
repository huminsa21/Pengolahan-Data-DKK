import { Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { type FormEvent } from 'react';
import {
    index,
    store,
    update,
} from '@/actions/App/Http/Controllers/PengumumanController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
    Pengumuman,
    PengumumanFormData,
    PengumumanOptions,
} from './types';

type PengumumanFormProps = {
    pengumuman?: Pengumuman;
    options: PengumumanOptions;
    mode: 'create' | 'edit';
};

function initialData(pengumuman?: Pengumuman): PengumumanFormData {
    return {
        judul: pengumuman?.judul ?? '',
        isi: pengumuman?.isi ?? '',
        tanggal_publish: pengumuman?.tanggal_publish?.slice(0, 10) ?? '',
        status: pengumuman?.status ?? 'DRAFT',
    };
}

export function PengumumanForm({
    pengumuman,
    options,
    mode,
}: PengumumanFormProps) {
    const { data, setData, post, put, processing, errors } =
        useForm<PengumumanFormData>(initialData(pengumuman));

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (mode === 'create') {
            post(store.url());

            return;
        }

        put(update.url(pengumuman!.id));
    }

    return (
        <form className="space-y-6" onSubmit={submit}>
            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="judul">Judul</Label>
                        <Input
                            id="judul"
                            value={data.judul}
                            onChange={(event) =>
                                setData('judul', event.target.value)
                            }
                        />
                        {errors.judul && (
                            <p className="text-sm text-destructive">
                                {errors.judul}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <select
                            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            value={data.status}
                            onChange={(event) =>
                                setData('status', event.target.value)
                            }
                        >
                            {options.status.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                        {errors.status && (
                            <p className="text-sm text-destructive">
                                {errors.status}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tanggal_publish">Tanggal Publish</Label>
                        <Input
                            id="tanggal_publish"
                            type="date"
                            value={data.tanggal_publish}
                            onChange={(event) =>
                                setData('tanggal_publish', event.target.value)
                            }
                        />
                        {errors.tanggal_publish && (
                            <p className="text-sm text-destructive">
                                {errors.tanggal_publish}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="isi">Isi</Label>
                        <textarea
                            className="min-h-64 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            id="isi"
                            value={data.isi}
                            onChange={(event) =>
                                setData('isi', event.target.value)
                            }
                        />
                        {errors.isi && (
                            <p className="text-sm text-destructive">
                                {errors.isi}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button asChild variant="outline">
                    <Link href={index.url()}>Batal</Link>
                </Button>
                <Button disabled={processing} type="submit">
                    <Save />
                    {processing ? 'Menyimpan...' : 'Simpan Pengumuman'}
                </Button>
            </div>
        </form>
    );
}
