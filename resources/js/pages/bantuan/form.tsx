import { Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { type FormEvent } from 'react';
import {
    index,
    store,
    update,
} from '@/actions/App/Http/Controllers/BantuanController';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Bantuan, BantuanFormData, BantuanOptions } from './types';

type BantuanFormProps = {
    bantuan?: Bantuan;
    options: BantuanOptions;
    mode: 'create' | 'edit';
};

function initialData(bantuan?: Bantuan): BantuanFormData {
    return {
        kode_bantuan: bantuan?.kode_bantuan ?? '',
        nama_bantuan: bantuan?.nama_bantuan ?? '',
        jenis_bantuan: bantuan?.jenis_bantuan ?? '',
        sumber_bantuan: bantuan?.sumber_bantuan ?? '',
        tahun: bantuan?.tahun?.toString() ?? '',
        deskripsi: bantuan?.deskripsi ?? '',
        status: bantuan?.status ?? 'AKTIF',
        tampilkan_penerima: bantuan?.tampilkan_penerima ?? true,
    };
}

export function BantuanForm({ bantuan, options, mode }: BantuanFormProps) {
    const { data, setData, post, put, processing, errors } =
        useForm<BantuanFormData>(initialData(bantuan));

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (mode === 'create') {
            post(store.url());

            return;
        }

        put(update.url(bantuan!.id));
    }

    return (
        <form className="space-y-6" onSubmit={submit}>
            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="kode_bantuan">Kode Bantuan</Label>
                        <Input
                            id="kode_bantuan"
                            value={data.kode_bantuan}
                            onChange={(event) =>
                                setData('kode_bantuan', event.target.value)
                            }
                        />
                        {errors.kode_bantuan && (
                            <p className="text-sm text-destructive">
                                {errors.kode_bantuan}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nama_bantuan">Nama Bantuan</Label>
                        <Input
                            id="nama_bantuan"
                            value={data.nama_bantuan}
                            onChange={(event) =>
                                setData('nama_bantuan', event.target.value)
                            }
                        />
                        {errors.nama_bantuan && (
                            <p className="text-sm text-destructive">
                                {errors.nama_bantuan}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="jenis_bantuan">Jenis</Label>
                        <Input
                            id="jenis_bantuan"
                            value={data.jenis_bantuan}
                            onChange={(event) =>
                                setData('jenis_bantuan', event.target.value)
                            }
                        />
                        {errors.jenis_bantuan && (
                            <p className="text-sm text-destructive">
                                {errors.jenis_bantuan}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="sumber_bantuan">Sumber</Label>
                        <Input
                            id="sumber_bantuan"
                            value={data.sumber_bantuan}
                            onChange={(event) =>
                                setData('sumber_bantuan', event.target.value)
                            }
                        />
                        {errors.sumber_bantuan && (
                            <p className="text-sm text-destructive">
                                {errors.sumber_bantuan}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tahun">Tahun</Label>
                        <Input
                            id="tahun"
                            inputMode="numeric"
                            value={data.tahun}
                            onChange={(event) =>
                                setData('tahun', event.target.value)
                            }
                        />
                        {errors.tahun && (
                            <p className="text-sm text-destructive">
                                {errors.tahun}
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
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="deskripsi">Deskripsi</Label>
                        <textarea
                            className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            id="deskripsi"
                            value={data.deskripsi}
                            onChange={(event) =>
                                setData('deskripsi', event.target.value)
                            }
                        />
                        {errors.deskripsi && (
                            <p className="text-sm text-destructive">
                                {errors.deskripsi}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-3 rounded-md border border-border bg-background px-4 py-3">
                        <Checkbox
                            checked={data.tampilkan_penerima}
                            id="tampilkan_penerima"
                            onCheckedChange={(checked) =>
                                setData('tampilkan_penerima', checked === true)
                            }
                        />
                        <Label htmlFor="tampilkan_penerima">
                            Tampilkan penerima di halaman publik
                        </Label>
                    </div>
                </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button asChild variant="outline">
                    <Link href={index.url()}>Batal</Link>
                </Button>
                <Button disabled={processing} type="submit">
                    <Save />
                    {processing ? 'Menyimpan...' : 'Simpan Bantuan'}
                </Button>
            </div>
        </form>
    );
}
