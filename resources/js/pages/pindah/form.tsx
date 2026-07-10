import { Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import {
    index,
    store,
    update,
} from '@/actions/App/Http/Controllers/PindahController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
    PelaporPendudukOption,
    PelaporTipe,
    PendudukOption,
    Pindah,
    PindahFormData,
    PindahOptions,
    PindahStatus,
} from './types';

type PindahFormProps = {
    pindah?: Pindah;
    options: PindahOptions;
    mode: 'create' | 'edit';
};

function initialData(pindah?: Pindah): PindahFormData {
    return {
        penduduk_id: pindah?.penduduk_id ?? '',
        tanggal_pindah: pindah?.tanggal_pindah?.slice(0, 10) ?? '',
        alamat_tujuan: pindah?.alamat_tujuan ?? '',
        desa_tujuan: pindah?.desa_tujuan ?? '',
        kecamatan_tujuan: pindah?.kecamatan_tujuan ?? '',
        kabupaten_tujuan: pindah?.kabupaten_tujuan ?? '',
        provinsi_tujuan: pindah?.provinsi_tujuan ?? '',
        alasan_pindah: pindah?.alasan_pindah ?? '',
        status: pindah?.status ?? 'PROSES',
        keterangan: pindah?.keterangan ?? '',
        pelapor_tipe: pindah?.pelapor_tipe ?? 'PENDUDUK',
        pelapor_id: pindah?.pelapor_id ?? '',
        pelapor_nama: pindah?.pelapor_nama ?? '',
        pelapor_kontak: pindah?.pelapor_kontak ?? '',
    };
}

function dusunName(penduduk: PendudukOption): string {
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
    const selected = options.find((penduduk) => penduduk.id === value) ?? null;
    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return options;
        }

        return options.filter((penduduk) =>
            `${penduduk.nik} ${penduduk.nama_lengkap} ${dusunName(penduduk)}`
                .toLowerCase()
                .includes(query),
        );
    }, [options, search]);
    const visible =
        selected && !filtered.some((penduduk) => penduduk.id === selected.id)
            ? [selected, ...filtered]
            : filtered;

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
                onChange={(event) =>
                    onChange(
                        options.find(
                            (option) => option.id === event.target.value,
                        ) ?? null,
                    )
                }
            >
                <option value="">Pilih penduduk</option>
                {visible.map((penduduk) => (
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
    const selected = options.find((penduduk) => penduduk.id === value) ?? null;
    const filtered = useMemo(() => {
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
    const visible =
        selected && !filtered.some((penduduk) => penduduk.id === selected.id)
            ? [selected, ...filtered]
            : filtered;

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
                onChange={(event) =>
                    onChange(
                        options.find(
                            (option) => option.id === event.target.value,
                        ) ?? null,
                    )
                }
            >
                <option value="">Pilih pelapor</option>
                {visible.map((penduduk) => (
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
        ['Dusun', dusunName(penduduk)],
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

export function PindahForm({ pindah, options, mode }: PindahFormProps) {
    const { data, setData, post, put, processing, errors } =
        useForm<PindahFormData>(initialData(pindah));

    const selectedPenduduk =
        options.penduduk.find((penduduk) => penduduk.id === data.penduduk_id) ??
        pindah?.penduduk ??
        null;

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

        put(update.url(pindah!.id));
    }

    return (
        <form className="space-y-6" onSubmit={submit}>
            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    <SearchablePendudukSelect
                        label="Penduduk Pindah"
                        value={data.penduduk_id}
                        options={options.penduduk}
                        onChange={(penduduk) =>
                            setData('penduduk_id', penduduk?.id ?? '')
                        }
                        error={errors.penduduk_id}
                    />

                    <div className="space-y-2">
                        <Label htmlFor="tanggal_pindah">
                            Tanggal Pindah{' '}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="tanggal_pindah"
                            type="date"
                            value={data.tanggal_pindah}
                            onChange={(event) =>
                                setData('tanggal_pindah', event.target.value)
                            }
                        />
                        {errors.tanggal_pindah && (
                            <p className="text-sm text-destructive">
                                {errors.tanggal_pindah}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <select
                            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            value={data.status}
                            onChange={(event) =>
                                setData(
                                    'status',
                                    event.target.value as PindahStatus,
                                )
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

                    <PendudukPreview penduduk={selectedPenduduk} />

                    {[
                        ['alamat_tujuan', 'Alamat Tujuan'],
                        ['desa_tujuan', 'Desa Tujuan'],
                        ['kecamatan_tujuan', 'Kecamatan Tujuan'],
                        ['kabupaten_tujuan', 'Kabupaten Tujuan'],
                        ['provinsi_tujuan', 'Provinsi Tujuan'],
                        ['alasan_pindah', 'Alasan Pindah'],
                    ].map(([name, label]) => (
                        <div
                            className={
                                name === 'alamat_tujuan'
                                    ? 'space-y-2 md:col-span-2 xl:col-span-3'
                                    : 'space-y-2'
                            }
                            key={name}
                        >
                            <Label htmlFor={name}>{label}</Label>
                            {name === 'alamat_tujuan' ? (
                                <textarea
                                    className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                    id={name}
                                    value={String(
                                        data[name as keyof PindahFormData],
                                    )}
                                    onChange={(event) =>
                                        setData(
                                            name as keyof PindahFormData,
                                            event.target.value,
                                        )
                                    }
                                />
                            ) : (
                                <Input
                                    id={name}
                                    value={String(
                                        data[name as keyof PindahFormData],
                                    )}
                                    onChange={(event) =>
                                        setData(
                                            name as keyof PindahFormData,
                                            event.target.value,
                                        )
                                    }
                                />
                            )}
                            {errors[name as keyof PindahFormData] && (
                                <p className="text-sm text-destructive">
                                    {errors[name as keyof PindahFormData]}
                                </p>
                            )}
                        </div>
                    ))}

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
                    {processing ? 'Menyimpan...' : 'Simpan Pindah'}
                </Button>
            </div>
        </form>
    );
}
