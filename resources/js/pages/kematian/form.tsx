import { Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import {
    index,
    store,
    update,
} from '@/actions/App/Http/Controllers/KematianController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
    Kematian,
    KematianFormData,
    KematianOptions,
    PelaporPendudukOption,
    PelaporTipe,
    PendudukOption,
} from './types';

type KematianFormProps = {
    kematian?: Kematian;
    options: KematianOptions;
    mode: 'create' | 'edit';
};

function initialData(kematian?: Kematian): KematianFormData {
    return {
        penduduk_id: kematian?.penduduk_id ?? '',
        tanggal_meninggal: kematian?.tanggal_meninggal?.slice(0, 10) ?? '',
        tempat_meninggal: kematian?.tempat_meninggal ?? '',
        sebab_meninggal: kematian?.sebab_meninggal ?? '',
        keterangan: kematian?.keterangan ?? '',
        pelapor_tipe: kematian?.pelapor_tipe ?? 'PENDUDUK',
        pelapor_id: kematian?.pelapor_id ?? '',
        pelapor_nama: kematian?.pelapor_nama ?? '',
        pelapor_kontak: kematian?.pelapor_kontak ?? '',
    };
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
}

function pendudukDusun(penduduk: PendudukOption): string {
    return penduduk.wilayah_dusun?.nama_dusun ?? penduduk.dusun ?? '-';
}

function SearchablePendudukSelect({
    label,
    value,
    options,
    onChange,
    error,
}: {
    label: string;
    value: string;
    options: PendudukOption[];
    onChange: (penduduk: PendudukOption | null) => void;
    error?: string;
}) {
    const [search, setSearch] = useState('');
    const selectedPenduduk =
        options.find((penduduk) => penduduk.id === value) ?? null;

    const filteredOptions = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return options;
        }

        return options.filter((penduduk) =>
            `${penduduk.nik} ${penduduk.nama_lengkap} ${pendudukDusun(penduduk)}`
                .toLowerCase()
                .includes(query),
        );
    }, [options, search]);

    const visibleOptions =
        selectedPenduduk &&
        !filteredOptions.some((penduduk) => penduduk.id === selectedPenduduk.id)
            ? [selectedPenduduk, ...filteredOptions]
            : filteredOptions;

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <Input
                placeholder="Cari NIK, nama, atau dusun"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
            />
            <select
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                value={value}
                onChange={(event) => {
                    const penduduk =
                        options.find(
                            (option) => option.id === event.target.value,
                        ) ?? null;

                    onChange(penduduk);
                }}
            >
                <option value="">Pilih penduduk</option>
                {visibleOptions.map((penduduk) => (
                    <option key={penduduk.id} value={penduduk.id}>
                        {penduduk.nama_lengkap} - {penduduk.nik}
                    </option>
                ))}
            </select>
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}

function SearchablePelaporSelect({
    value,
    options,
    onChange,
    error,
}: {
    value: string;
    options: PelaporPendudukOption[];
    onChange: (penduduk: PelaporPendudukOption | null) => void;
    error?: string;
}) {
    const [search, setSearch] = useState('');
    const selectedPenduduk =
        options.find((penduduk) => penduduk.id === value) ?? null;

    const filteredOptions = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return options;
        }

        return options.filter((penduduk) =>
            `${penduduk.nik} ${penduduk.nama_lengkap}`
                .toLowerCase()
                .includes(query),
        );
    }, [options, search]);

    const visibleOptions =
        selectedPenduduk &&
        !filteredOptions.some((penduduk) => penduduk.id === selectedPenduduk.id)
            ? [selectedPenduduk, ...filteredOptions]
            : filteredOptions;

    return (
        <div className="space-y-2">
            <Label>Pelapor Penduduk</Label>
            <Input
                placeholder="Cari NIK atau nama pelapor"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
            />
            <select
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                value={value}
                onChange={(event) => {
                    const penduduk =
                        options.find(
                            (option) => option.id === event.target.value,
                        ) ?? null;

                    onChange(penduduk);
                }}
            >
                <option value="">Pilih pelapor</option>
                {visibleOptions.map((penduduk) => (
                    <option key={penduduk.id} value={penduduk.id}>
                        {penduduk.nama_lengkap} - {penduduk.nik}
                    </option>
                ))}
            </select>
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}

function PendudukPreview({ penduduk }: { penduduk: PendudukOption | null }) {
    if (!penduduk) {
        return null;
    }

    const fields = [
        ['NIK', penduduk.nik],
        ['Nama Lengkap', penduduk.nama_lengkap],
        ['Jenis Kelamin', penduduk.jenis_kelamin],
        [
            'Tempat/Tanggal Lahir',
            `${penduduk.tempat_lahir}, ${formatDate(penduduk.tanggal_lahir)}`,
        ],
        ['Dusun', pendudukDusun(penduduk)],
        ['Alamat', penduduk.alamat],
        ['Status Penduduk', penduduk.status_penduduk],
    ];

    return (
        <div className="rounded-lg border border-border bg-background p-4 md:col-span-2 xl:col-span-3">
            <p className="text-sm font-semibold text-foreground">
                Preview Penduduk
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {fields.map(([label, value]) => (
                    <div key={label}>
                        <p className="text-xs font-medium text-muted-foreground uppercase">
                            {label}
                        </p>
                        <p className="mt-1 text-sm font-medium">{value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function KematianForm({ kematian, options, mode }: KematianFormProps) {
    const { data, setData, post, put, processing, errors } =
        useForm<KematianFormData>(initialData(kematian));

    const selectedPenduduk =
        options.penduduk.find((penduduk) => penduduk.id === data.penduduk_id) ??
        kematian?.penduduk ??
        null;

    function selectPenduduk(penduduk: PendudukOption | null) {
        setData('penduduk_id', penduduk?.id ?? '');
    }

    function selectPelaporType(value: PelaporTipe) {
        setData({
            ...data,
            pelapor_tipe: value,
            pelapor_id: '',
            pelapor_nama: '',
            pelapor_kontak: '',
        });
    }

    function selectPelaporPenduduk(penduduk: PelaporPendudukOption | null) {
        setData({
            ...data,
            pelapor_id: penduduk?.id ?? '',
            pelapor_nama: penduduk?.nama_lengkap ?? '',
            pelapor_kontak: penduduk?.no_hp ?? '',
        });
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (mode === 'create') {
            post(store.url());

            return;
        }

        put(update.url(kematian!.id));
    }

    return (
        <form className="space-y-6" onSubmit={submit}>
            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    <SearchablePendudukSelect
                        label="Penduduk Meninggal"
                        value={data.penduduk_id}
                        options={options.penduduk}
                        onChange={selectPenduduk}
                        error={errors.penduduk_id}
                    />

                    <div className="space-y-2">
                        <Label htmlFor="tanggal_meninggal">
                            Tanggal Meninggal{' '}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="tanggal_meninggal"
                            type="date"
                            value={data.tanggal_meninggal}
                            onChange={(event) =>
                                setData('tanggal_meninggal', event.target.value)
                            }
                        />
                        {errors.tanggal_meninggal && (
                            <p className="text-sm text-destructive">
                                {errors.tanggal_meninggal}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tempat_meninggal">
                            Tempat Meninggal
                        </Label>
                        <Input
                            id="tempat_meninggal"
                            value={data.tempat_meninggal}
                            onChange={(event) =>
                                setData('tempat_meninggal', event.target.value)
                            }
                        />
                        {errors.tempat_meninggal && (
                            <p className="text-sm text-destructive">
                                {errors.tempat_meninggal}
                            </p>
                        )}
                    </div>

                    <PendudukPreview penduduk={selectedPenduduk} />

                    <div className="space-y-2">
                        <Label htmlFor="sebab_meninggal">Sebab Meninggal</Label>
                        <Input
                            id="sebab_meninggal"
                            value={data.sebab_meninggal}
                            onChange={(event) =>
                                setData('sebab_meninggal', event.target.value)
                            }
                        />
                        {errors.sebab_meninggal && (
                            <p className="text-sm text-destructive">
                                {errors.sebab_meninggal}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Tipe Pelapor</Label>
                        <select
                            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            value={data.pelapor_tipe}
                            onChange={(event) =>
                                selectPelaporType(
                                    event.target.value as PelaporTipe,
                                )
                            }
                        >
                            {options.pelapor_tipe.map((pelaporTipe) => (
                                <option key={pelaporTipe} value={pelaporTipe}>
                                    {pelaporTipe.replaceAll('_', ' ')}
                                </option>
                            ))}
                        </select>
                        {errors.pelapor_tipe && (
                            <p className="text-sm text-destructive">
                                {errors.pelapor_tipe}
                            </p>
                        )}
                    </div>

                    {data.pelapor_tipe === 'PENDUDUK' ? (
                        <SearchablePelaporSelect
                            value={data.pelapor_id}
                            options={options.pelapor_penduduk}
                            onChange={selectPelaporPenduduk}
                            error={errors.pelapor_id}
                        />
                    ) : (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="pelapor_nama">
                                    Nama Pelapor{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="pelapor_nama"
                                    value={data.pelapor_nama}
                                    onChange={(event) =>
                                        setData(
                                            'pelapor_nama',
                                            event.target.value,
                                        )
                                    }
                                />
                                {errors.pelapor_nama && (
                                    <p className="text-sm text-destructive">
                                        {errors.pelapor_nama}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pelapor_kontak">
                                    Kontak Pelapor
                                </Label>
                                <Input
                                    id="pelapor_kontak"
                                    value={data.pelapor_kontak}
                                    onChange={(event) =>
                                        setData(
                                            'pelapor_kontak',
                                            event.target.value,
                                        )
                                    }
                                />
                                {errors.pelapor_kontak && (
                                    <p className="text-sm text-destructive">
                                        {errors.pelapor_kontak}
                                    </p>
                                )}
                            </div>
                        </>
                    )}

                    <div className="space-y-2 md:col-span-2 xl:col-span-3">
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
                </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button asChild variant="outline">
                    <Link href={index.url()}>Batal</Link>
                </Button>
                <Button disabled={processing} type="submit">
                    <Save />
                    {processing ? 'Menyimpan...' : 'Simpan Kematian'}
                </Button>
            </div>
        </form>
    );
}
