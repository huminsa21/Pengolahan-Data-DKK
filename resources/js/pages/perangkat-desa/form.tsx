import { Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';

import {
    index,
    store,
    update,
} from '@/actions/App/Http/Controllers/PerangkatDesaController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
    PerangkatDesa,
    PerangkatFormData,
    PerangkatOptions,
} from './types';

function isoDate(value?: string | null): string {
    return value ? value.slice(0, 10) : '';
}

function initialData(perangkatDesa?: PerangkatDesa): PerangkatFormData {
    return {
        penduduk_id: perangkatDesa?.penduduk_id ?? '',
        jabatan: perangkatDesa?.jabatan ?? '',
        nomor_sk: perangkatDesa?.nomor_sk ?? '',
        tanggal_mulai: isoDate(perangkatDesa?.tanggal_mulai),
        tanggal_selesai: isoDate(perangkatDesa?.tanggal_selesai),
        status: perangkatDesa?.status ?? 'AKTIF',
    };
}

export function PerangkatDesaForm({
    perangkatDesa,
    options,
    mode,
}: {
    perangkatDesa?: PerangkatDesa;
    options: PerangkatOptions;
    mode: 'create' | 'edit';
}) {
    const [pendudukSearch, setPendudukSearch] = useState('');
    const { data, setData, post, put, processing, errors } =
        useForm<PerangkatFormData>(initialData(perangkatDesa));

    const filteredPenduduk = useMemo(() => {
        const search = pendudukSearch.trim().toLowerCase();

        if (!search) {
            return options.penduduk;
        }

        return options.penduduk.filter((penduduk) =>
            `${penduduk.nik} ${penduduk.nama_lengkap}`
                .toLowerCase()
                .includes(search),
        );
    }, [options.penduduk, pendudukSearch]);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (mode === 'create') {
            post(store.url());
            return;
        }

        put(update.url(perangkatDesa!.id));
    }

    return (
        <form className="space-y-6" onSubmit={submit}>
            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="penduduk_search">Cari Penduduk</Label>
                        <Input
                            id="penduduk_search"
                            placeholder="Cari NIK atau nama penduduk"
                            value={pendudukSearch}
                            onChange={(event) =>
                                setPendudukSearch(event.target.value)
                            }
                        />
                        <select
                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            value={data.penduduk_id}
                            onChange={(event) =>
                                setData('penduduk_id', event.target.value)
                            }
                        >
                            <option value="">Pilih penduduk aktif</option>
                            {filteredPenduduk.map((penduduk) => (
                                <option key={penduduk.id} value={penduduk.id}>
                                    {penduduk.nama_lengkap} - {penduduk.nik}
                                </option>
                            ))}
                        </select>
                        {errors.penduduk_id && (
                            <p className="text-sm text-destructive">
                                {errors.penduduk_id}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="jabatan">Jabatan</Label>
                        <select
                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            id="jabatan"
                            value={data.jabatan}
                            onChange={(event) =>
                                setData('jabatan', event.target.value)
                            }
                        >
                            <option value="">Pilih jabatan</option>
                            {options.jabatan.map((jabatan) => (
                                <option key={jabatan} value={jabatan}>
                                    {jabatan}
                                </option>
                            ))}
                        </select>
                        {errors.jabatan && (
                            <p className="text-sm text-destructive">
                                {errors.jabatan}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nomor_sk">Nomor SK</Label>
                        <Input
                            id="nomor_sk"
                            value={data.nomor_sk}
                            onChange={(event) =>
                                setData('nomor_sk', event.target.value)
                            }
                        />
                        {errors.nomor_sk && (
                            <p className="text-sm text-destructive">
                                {errors.nomor_sk}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            id="status"
                            value={data.status}
                            onChange={(event) =>
                                setData(
                                    'status',
                                    event.target
                                        .value as PerangkatFormData['status'],
                                )
                            }
                        >
                            {options.status.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
                        <Input
                            id="tanggal_mulai"
                            type="date"
                            value={data.tanggal_mulai}
                            onChange={(event) =>
                                setData('tanggal_mulai', event.target.value)
                            }
                        />
                        {errors.tanggal_mulai && (
                            <p className="text-sm text-destructive">
                                {errors.tanggal_mulai}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
                        <Input
                            id="tanggal_selesai"
                            type="date"
                            value={data.tanggal_selesai}
                            onChange={(event) =>
                                setData('tanggal_selesai', event.target.value)
                            }
                        />
                        {errors.tanggal_selesai && (
                            <p className="text-sm text-destructive">
                                {errors.tanggal_selesai}
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
                    {processing ? 'Menyimpan...' : 'Simpan Perangkat'}
                </Button>
            </div>
        </form>
    );
}
