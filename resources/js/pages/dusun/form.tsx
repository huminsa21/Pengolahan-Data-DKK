import { Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import {
    index,
    store,
    update,
} from '@/actions/App/Http/Controllers/DusunController';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Dusun, DusunFormData, PendudukOption } from './types';

type DusunFormProps = {
    dusun?: Dusun;
    mode: 'create' | 'edit';
    pendudukOptions: PendudukOption[];
};

function initialData(dusun?: Dusun): DusunFormData {
    return {
        kode_dusun: dusun?.kode_dusun ?? '',
        nama_dusun: dusun?.nama_dusun ?? '',
        kepala_dusun: dusun?.kepala_dusun ?? '',
        no_hp_kepala_dusun: dusun?.no_hp_kepala_dusun ?? '',
        keterangan: dusun?.keterangan ?? '',
        is_active: dusun?.is_active ?? true,
    };
}

export function DusunForm({ dusun, mode, pendudukOptions }: DusunFormProps) {
    const initialSelectedKepalaId =
        pendudukOptions.find(
            (penduduk) => penduduk.nama_lengkap === dusun?.kepala_dusun,
        )?.id ?? '';

    const [kepalaSearch, setKepalaSearch] = useState('');
    const [selectedKepalaId, setSelectedKepalaId] = useState(
        initialSelectedKepalaId,
    );

    const { data, setData, post, put, processing, errors } =
        useForm<DusunFormData>(initialData(dusun));

    const filteredPendudukOptions = useMemo(() => {
        const normalizedSearch = kepalaSearch.trim().toLowerCase();

        if (!normalizedSearch) {
            return pendudukOptions;
        }

        return pendudukOptions.filter((penduduk) => {
            const searchableText =
                `${penduduk.nik} ${penduduk.nama_lengkap}`.toLowerCase();

            return searchableText.includes(normalizedSearch);
        });
    }, [kepalaSearch, pendudukOptions]);

    function selectKepalaDusun(pendudukId: string) {
        setSelectedKepalaId(pendudukId);

        const selectedPenduduk = pendudukOptions.find(
            (penduduk) => penduduk.id === pendudukId,
        );

        setData({
            ...data,
            kepala_dusun: selectedPenduduk?.nama_lengkap ?? '',
            no_hp_kepala_dusun: selectedPenduduk?.no_hp ?? '',
        });
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (mode === 'create') {
            post(store.url());

            return;
        }

        put(update.url(dusun!.id));
    }

    return (
        <form className="space-y-6" onSubmit={submit}>
            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="kode_dusun">Kode Dusun</Label>
                        <Input
                            id="kode_dusun"
                            value={data.kode_dusun}
                            onChange={(event) =>
                                setData('kode_dusun', event.target.value)
                            }
                        />
                        {errors.kode_dusun && (
                            <p className="text-sm text-destructive">
                                {errors.kode_dusun}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nama_dusun">
                            Nama Dusun{' '}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="nama_dusun"
                            value={data.nama_dusun}
                            onChange={(event) =>
                                setData('nama_dusun', event.target.value)
                            }
                        />
                        {errors.nama_dusun && (
                            <p className="text-sm text-destructive">
                                {errors.nama_dusun}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="kepala_dusun">Kepala Dusun</Label>
                        <Input
                            aria-label="Cari kepala dusun dari penduduk"
                            placeholder="Cari NIK atau nama penduduk"
                            value={kepalaSearch}
                            onChange={(event) =>
                                setKepalaSearch(event.target.value)
                            }
                        />
                        <select
                            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            id="kepala_dusun"
                            value={selectedKepalaId}
                            onChange={(event) =>
                                selectKepalaDusun(event.target.value)
                            }
                        >
                            <option value="">Tidak dipilih</option>
                            {filteredPendudukOptions.map((penduduk) => (
                                <option key={penduduk.id} value={penduduk.id}>
                                    {penduduk.nama_lengkap} - {penduduk.nik}
                                </option>
                            ))}
                        </select>
                        {data.kepala_dusun && (
                            <p className="text-xs text-muted-foreground">
                                Terpilih: {data.kepala_dusun}
                            </p>
                        )}
                        {errors.kepala_dusun && (
                            <p className="text-sm text-destructive">
                                {errors.kepala_dusun}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="no_hp_kepala_dusun">No HP</Label>
                        <Input
                            id="no_hp_kepala_dusun"
                            value={data.no_hp_kepala_dusun}
                            onChange={(event) =>
                                setData(
                                    'no_hp_kepala_dusun',
                                    event.target.value,
                                )
                            }
                        />
                        {errors.no_hp_kepala_dusun && (
                            <p className="text-sm text-destructive">
                                {errors.no_hp_kepala_dusun}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="keterangan">Keterangan</Label>
                        <textarea
                            className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            id="keterangan"
                            value={data.keterangan}
                            onChange={(event) =>
                                setData('keterangan', event.target.value)
                            }
                        />
                        {errors.keterangan && (
                            <p className="text-sm text-destructive">
                                {errors.keterangan}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3 rounded-md border border-border bg-background px-4 py-3">
                        <Checkbox
                            checked={data.is_active}
                            id="is_active"
                            onCheckedChange={(checked) =>
                                setData('is_active', checked === true)
                            }
                        />
                        <Label
                            className="text-sm font-medium"
                            htmlFor="is_active"
                        >
                            Aktif
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
                    {processing ? 'Menyimpan...' : 'Simpan Dusun'}
                </Button>
            </div>
        </form>
    );
}
