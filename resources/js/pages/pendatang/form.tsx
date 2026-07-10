import { Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import {
    index,
    store,
    update,
} from '@/actions/App/Http/Controllers/PendatangController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
    PelaporPendudukOption,
    PelaporTipe,
    Pendatang,
    PendatangFormData,
    PendatangOptions,
    PendatangStatus,
} from './types';

type PendatangFormProps = {
    pendatang?: Pendatang;
    options: PendatangOptions;
    mode: 'create' | 'edit';
};

function initialData(pendatang?: Pendatang): PendatangFormData {
    return {
        nik: pendatang?.nik ?? '',
        nama_lengkap: pendatang?.nama_lengkap ?? '',
        jenis_kelamin: pendatang?.jenis_kelamin ?? 'L',
        tempat_lahir: pendatang?.tempat_lahir ?? '',
        tanggal_lahir: pendatang?.tanggal_lahir?.slice(0, 10) ?? '',
        agama: pendatang?.agama ?? '',
        status_perkawinan: pendatang?.status_perkawinan ?? '',
        pendidikan: pendatang?.pendidikan ?? '',
        pekerjaan: pendatang?.pekerjaan ?? '',
        no_hp: pendatang?.no_hp ?? '',
        alamat_asal: pendatang?.alamat_asal ?? '',
        desa_asal: pendatang?.desa_asal ?? '',
        kecamatan_asal: pendatang?.kecamatan_asal ?? '',
        kabupaten_asal: pendatang?.kabupaten_asal ?? '',
        provinsi_asal: pendatang?.provinsi_asal ?? '',
        dusun_id: pendatang?.dusun_id ?? '',
        alamat_tujuan: pendatang?.alamat_tujuan ?? '',
        rt: pendatang?.rt ?? '',
        rw: pendatang?.rw ?? '',
        tanggal_datang: pendatang?.tanggal_datang?.slice(0, 10) ?? '',
        alasan_datang: pendatang?.alasan_datang ?? '',
        keterangan: pendatang?.keterangan ?? '',
        status: pendatang?.status ?? 'PROSES',
        pelapor_tipe: pendatang?.pelapor_tipe ?? 'PENDUDUK',
        pelapor_id: pendatang?.pelapor_id ?? '',
        pelapor_nama: pendatang?.pelapor_nama ?? '',
        pelapor_kontak: pendatang?.pelapor_kontak ?? '',
    };
}

function PelaporSelect({
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

function SelectField({
    label,
    value,
    options,
    disabled = false,
    onChange,
    error,
}: {
    label: string;
    value: string;
    options: string[];
    disabled?: boolean;
    onChange: (value: string) => void;
    error?: string;
}) {
    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <select
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-60"
                disabled={disabled}
                value={value}
                onChange={(event) => onChange(event.target.value)}
            >
                <option value="">Pilih {label.toLowerCase()}</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}

export function PendatangForm({
    pendatang,
    options,
    mode,
}: PendatangFormProps) {
    const { data, setData, post, put, processing, errors } =
        useForm<PendatangFormData>(initialData(pendatang));
    const identityReadonly =
        pendatang?.status === 'DITERIMA' && Boolean(pendatang.penduduk_id);

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

        put(update.url(pendatang!.id));
    }

    const identityFields: Array<[keyof PendatangFormData, string, string?]> = [
        ['nik', 'NIK'],
        ['nama_lengkap', 'Nama Lengkap'],
        ['tempat_lahir', 'Tempat Lahir'],
        ['tanggal_lahir', 'Tanggal Lahir', 'date'],
        ['pekerjaan', 'Pekerjaan'],
        ['no_hp', 'No HP'],
    ];
    const originFields: Array<
        [keyof PendatangFormData, string, 'text' | 'textarea']
    > = [
        ['alamat_asal', 'Alamat Asal', 'textarea'],
        ['desa_asal', 'Desa Asal', 'text'],
        ['kecamatan_asal', 'Kecamatan Asal', 'text'],
        ['kabupaten_asal', 'Kabupaten Asal', 'text'],
        ['provinsi_asal', 'Provinsi Asal', 'text'],
    ];

    return (
        <form className="space-y-6" onSubmit={submit}>
            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {identityFields.map(([name, label, type]) => (
                        <div className="space-y-2" key={name}>
                            <Label htmlFor={name}>
                                {label}
                                {name === 'nama_lengkap' && (
                                    <span className="text-destructive"> *</span>
                                )}
                            </Label>
                            <Input
                                disabled={identityReadonly}
                                id={name}
                                type={type ?? 'text'}
                                value={String(data[name])}
                                onChange={(event) =>
                                    setData(name, event.target.value)
                                }
                            />
                            {errors[name] && (
                                <p className="text-sm text-destructive">
                                    {errors[name]}
                                </p>
                            )}
                        </div>
                    ))}

                    <div className="space-y-2">
                        <Label>Jenis Kelamin</Label>
                        <select
                            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-60"
                            disabled={identityReadonly}
                            value={data.jenis_kelamin}
                            onChange={(event) =>
                                setData('jenis_kelamin', event.target.value)
                            }
                        >
                            {options.jenis_kelamin.map((jenisKelamin) => (
                                <option key={jenisKelamin} value={jenisKelamin}>
                                    {jenisKelamin}
                                </option>
                            ))}
                        </select>
                        {errors.jenis_kelamin && (
                            <p className="text-sm text-destructive">
                                {errors.jenis_kelamin}
                            </p>
                        )}
                    </div>

                    <SelectField
                        disabled={identityReadonly}
                        error={errors.agama}
                        label="Agama"
                        options={options.agama}
                        value={data.agama}
                        onChange={(value) => setData('agama', value)}
                    />

                    <SelectField
                        disabled={identityReadonly}
                        error={errors.status_perkawinan}
                        label="Status Perkawinan"
                        options={options.status_perkawinan}
                        value={data.status_perkawinan}
                        onChange={(value) =>
                            setData('status_perkawinan', value)
                        }
                    />

                    <SelectField
                        disabled={identityReadonly}
                        error={errors.pendidikan}
                        label="Pendidikan"
                        options={options.pendidikan}
                        value={data.pendidikan}
                        onChange={(value) => setData('pendidikan', value)}
                    />

                    {originFields.map(([name, label, type]) => (
                        <div
                            className={
                                type === 'textarea'
                                    ? 'space-y-2 md:col-span-2 xl:col-span-3'
                                    : 'space-y-2'
                            }
                            key={name}
                        >
                            <Label htmlFor={name}>{label}</Label>
                            {type === 'textarea' ? (
                                <textarea
                                    className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                    id={name}
                                    value={String(data[name])}
                                    onChange={(event) =>
                                        setData(name, event.target.value)
                                    }
                                />
                            ) : (
                                <Input
                                    id={name}
                                    value={String(data[name])}
                                    onChange={(event) =>
                                        setData(name, event.target.value)
                                    }
                                />
                            )}
                            {errors[name] && (
                                <p className="text-sm text-destructive">
                                    {errors[name]}
                                </p>
                            )}
                        </div>
                    ))}

                    <div className="space-y-2">
                        <Label>Dusun Tujuan</Label>
                        <select
                            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            value={data.dusun_id}
                            onChange={(event) =>
                                setData('dusun_id', event.target.value)
                            }
                        >
                            <option value="">Pilih dusun</option>
                            {options.dusun.map((dusun) => (
                                <option key={dusun.id} value={dusun.id}>
                                    {dusun.nama_dusun}
                                </option>
                            ))}
                        </select>
                        {errors.dusun_id && (
                            <p className="text-sm text-destructive">
                                {errors.dusun_id}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="alamat_tujuan">Alamat Tujuan</Label>
                        <textarea
                            className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            id="alamat_tujuan"
                            value={data.alamat_tujuan}
                            onChange={(event) =>
                                setData('alamat_tujuan', event.target.value)
                            }
                        />
                    </div>

                    {[
                        ['rt', 'RT'],
                        ['rw', 'RW'],
                        ['tanggal_datang', 'Tanggal Datang'],
                        ['alasan_datang', 'Alasan Datang'],
                    ].map(([name, label]) => (
                        <div className="space-y-2" key={name}>
                            <Label htmlFor={name}>
                                {label}
                                {name === 'tanggal_datang' && (
                                    <span className="text-destructive"> *</span>
                                )}
                            </Label>
                            <Input
                                id={name}
                                type={
                                    name === 'tanggal_datang' ? 'date' : 'text'
                                }
                                value={String(
                                    data[name as keyof PendatangFormData],
                                )}
                                onChange={(event) =>
                                    setData(
                                        name as keyof PendatangFormData,
                                        event.target.value,
                                    )
                                }
                            />
                            {errors[name as keyof PendatangFormData] && (
                                <p className="text-sm text-destructive">
                                    {errors[name as keyof PendatangFormData]}
                                </p>
                            )}
                        </div>
                    ))}

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <select
                            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            value={data.status}
                            onChange={(event) =>
                                setData(
                                    'status',
                                    event.target.value as PendatangStatus,
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
                    </div>

                    {data.pelapor_tipe === 'PENDUDUK' ? (
                        <PelaporSelect
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
                    </div>
                </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button asChild variant="outline">
                    <Link href={index.url()}>Batal</Link>
                </Button>
                <Button disabled={processing} type="submit">
                    <Save />
                    {processing ? 'Menyimpan...' : 'Simpan Pendatang'}
                </Button>
            </div>
        </form>
    );
}
