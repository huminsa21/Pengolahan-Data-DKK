import { Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import {
    index,
    store,
    update,
} from '@/actions/App/Http/Controllers/KelahiranController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
    Kelahiran,
    KelahiranFormData,
    KelahiranOptions,
    PelaporTipe,
    PendudukOption,
} from './types';

type KelahiranFormProps = {
    kelahiran?: Kelahiran;
    options: KelahiranOptions;
    mode: 'create' | 'edit';
};

function initialData(kelahiran?: Kelahiran): KelahiranFormData {
    return {
        nama_bayi: kelahiran?.nama_bayi ?? '',
        jenis_kelamin: kelahiran?.jenis_kelamin ?? 'L',
        tempat_lahir: kelahiran?.tempat_lahir ?? '',
        tanggal_lahir: kelahiran?.tanggal_lahir?.slice(0, 10) ?? '',
        waktu_lahir: kelahiran?.waktu_lahir?.slice(0, 5) ?? '',
        ayah_id: kelahiran?.ayah_id ?? '',
        ibu_id: kelahiran?.ibu_id ?? '',
        pelapor_tipe: kelahiran?.pelapor_tipe ?? 'PENDUDUK',
        pelapor_id: kelahiran?.pelapor_id ?? '',
        pelapor_nama: kelahiran?.pelapor_nama ?? '',
        pelapor_kontak: kelahiran?.pelapor_kontak ?? '',
        nama_ayah: kelahiran?.nama_ayah ?? '',
        nama_ibu: kelahiran?.nama_ibu ?? '',
        alamat: kelahiran?.alamat ?? '',
        keterangan: kelahiran?.keterangan ?? '',
    };
}

function RelationSelect({
    label,
    value,
    options,
    onChange,
    error,
}: {
    label: string;
    value: string;
    options: PendudukOption[];
    onChange: (value: string) => void;
    error?: string;
}) {
    const [search, setSearch] = useState('');
    const selectedOption =
        options.find((penduduk) => penduduk.id === value) ?? null;
    const filteredOptions = useMemo(() => {
        const query = search.toLowerCase();

        return options.filter((penduduk) =>
            `${penduduk.nik} ${penduduk.nama_lengkap}`
                .toLowerCase()
                .includes(query),
        );
    }, [options, search]);
    const visibleOptions =
        selectedOption &&
        !filteredOptions.some((penduduk) => penduduk.id === selectedOption.id)
            ? [selectedOption, ...filteredOptions]
            : filteredOptions;

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <Input
                placeholder={`Cari ${label.toLowerCase()}...`}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
            />
            <select
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                value={value}
                onChange={(event) => onChange(event.target.value)}
            >
                <option value="">Tidak dipilih</option>
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

function PelaporFields({
    data,
    options,
    errors,
    onChange,
}: {
    data: KelahiranFormData;
    options: KelahiranOptions;
    errors: Partial<Record<keyof KelahiranFormData, string>>;
    onChange: (data: KelahiranFormData) => void;
}) {
    function selectPelaporType(value: PelaporTipe) {
        onChange({
            ...data,
            pelapor_tipe: value,
            pelapor_id: '',
            pelapor_nama: '',
            pelapor_kontak: '',
        });
    }

    function selectPelaporPenduduk(pendudukId: string) {
        const selectedPenduduk =
            options.penduduk.find((penduduk) => penduduk.id === pendudukId) ??
            null;

        onChange({
            ...data,
            pelapor_id: selectedPenduduk?.id ?? '',
            pelapor_nama: selectedPenduduk?.nama_lengkap ?? '',
            pelapor_kontak: selectedPenduduk?.no_hp ?? '',
        });
    }

    return (
        <>
            <div className="space-y-2">
                <Label>Tipe Pelapor</Label>
                <select
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    value={data.pelapor_tipe}
                    onChange={(event) =>
                        selectPelaporType(event.target.value as PelaporTipe)
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
                <RelationSelect
                    label="Pelapor Penduduk"
                    value={data.pelapor_id}
                    options={options.penduduk}
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
                                onChange({
                                    ...data,
                                    pelapor_nama: event.target.value,
                                })
                            }
                        />
                        {errors.pelapor_nama && (
                            <p className="text-sm text-destructive">
                                {errors.pelapor_nama}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pelapor_kontak">Kontak Pelapor</Label>
                        <Input
                            id="pelapor_kontak"
                            value={data.pelapor_kontak}
                            onChange={(event) =>
                                onChange({
                                    ...data,
                                    pelapor_kontak: event.target.value,
                                })
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
        </>
    );
}

export function KelahiranForm({
    kelahiran,
    options,
    mode,
}: KelahiranFormProps) {
    const { data, setData, post, put, processing, errors } =
        useForm<KelahiranFormData>(initialData(kelahiran));
    const selectedAyah =
        options.penduduk.find((penduduk) => penduduk.id === data.ayah_id) ??
        null;
    const selectedIbu =
        options.penduduk.find((penduduk) => penduduk.id === data.ibu_id) ??
        null;
    const ayahOptions = options.penduduk.filter((penduduk) => {
        const isMale =
            penduduk.jenis_kelamin === 'L' ||
            penduduk.jenis_kelamin === 'LAKI-LAKI';
        const isSameDusun =
            !selectedIbu?.dusun_id ||
            penduduk.dusun_id === selectedIbu.dusun_id;

        return isMale && isSameDusun;
    });
    const ibuOptions = options.penduduk.filter((penduduk) => {
        const isFemale =
            penduduk.jenis_kelamin === 'P' ||
            penduduk.jenis_kelamin === 'PEREMPUAN';
        const isSameDusun =
            !selectedAyah?.dusun_id ||
            penduduk.dusun_id === selectedAyah.dusun_id;

        return isFemale && isSameDusun;
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (mode === 'create') {
            post(store.url());

            return;
        }

        put(update.url(kelahiran!.id));
    }

    return (
        <form className="space-y-6" onSubmit={submit}>
            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="nama_bayi">
                            Nama Bayi{' '}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="nama_bayi"
                            value={data.nama_bayi}
                            onChange={(event) =>
                                setData('nama_bayi', event.target.value)
                            }
                        />
                        {errors.nama_bayi && (
                            <p className="text-sm text-destructive">
                                {errors.nama_bayi}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Jenis Kelamin</Label>
                        <select
                            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
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

                    <div className="space-y-2">
                        <Label htmlFor="tempat_lahir">
                            Tempat Lahir{' '}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="tempat_lahir"
                            value={data.tempat_lahir}
                            onChange={(event) =>
                                setData('tempat_lahir', event.target.value)
                            }
                        />
                        {errors.tempat_lahir && (
                            <p className="text-sm text-destructive">
                                {errors.tempat_lahir}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tanggal_lahir">
                            Tanggal Lahir{' '}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="tanggal_lahir"
                            type="date"
                            value={data.tanggal_lahir}
                            onChange={(event) =>
                                setData('tanggal_lahir', event.target.value)
                            }
                        />
                        {errors.tanggal_lahir && (
                            <p className="text-sm text-destructive">
                                {errors.tanggal_lahir}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="waktu_lahir">Waktu Lahir</Label>
                        <Input
                            id="waktu_lahir"
                            type="time"
                            value={data.waktu_lahir}
                            onChange={(event) =>
                                setData('waktu_lahir', event.target.value)
                            }
                        />
                        {errors.waktu_lahir && (
                            <p className="text-sm text-destructive">
                                {errors.waktu_lahir}
                            </p>
                        )}
                    </div>

                    <RelationSelect
                        label="Ayah"
                        value={data.ayah_id}
                        options={ayahOptions}
                        onChange={(value) =>
                            setData({
                                ...data,
                                ayah_id: value,
                                ibu_id:
                                    value &&
                                    selectedIbu?.dusun_id &&
                                    options.penduduk.find(
                                        (penduduk) => penduduk.id === value,
                                    )?.dusun_id !== selectedIbu.dusun_id
                                        ? ''
                                        : data.ibu_id,
                            })
                        }
                        error={errors.ayah_id}
                    />
                    <RelationSelect
                        label="Ibu"
                        value={data.ibu_id}
                        options={ibuOptions}
                        onChange={(value) =>
                            setData({
                                ...data,
                                ibu_id: value,
                                ayah_id:
                                    value &&
                                    selectedAyah?.dusun_id &&
                                    options.penduduk.find(
                                        (penduduk) => penduduk.id === value,
                                    )?.dusun_id !== selectedAyah.dusun_id
                                        ? ''
                                        : data.ayah_id,
                            })
                        }
                        error={errors.ibu_id}
                    />
                    <PelaporFields
                        data={data}
                        errors={errors}
                        options={options}
                        onChange={setData}
                    />

                    <div className="space-y-2">
                        <Label htmlFor="nama_ayah">Nama Ayah Backup</Label>
                        <Input
                            id="nama_ayah"
                            value={data.nama_ayah}
                            onChange={(event) =>
                                setData('nama_ayah', event.target.value)
                            }
                        />
                        {errors.nama_ayah && (
                            <p className="text-sm text-destructive">
                                {errors.nama_ayah}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nama_ibu">Nama Ibu Backup</Label>
                        <Input
                            id="nama_ibu"
                            value={data.nama_ibu}
                            onChange={(event) =>
                                setData('nama_ibu', event.target.value)
                            }
                        />
                        {errors.nama_ibu && (
                            <p className="text-sm text-destructive">
                                {errors.nama_ibu}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2 md:col-span-2 xl:col-span-3">
                        <Label htmlFor="alamat">
                            Alamat <span className="text-destructive">*</span>
                        </Label>
                        <textarea
                            className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            id="alamat"
                            value={data.alamat}
                            onChange={(event) =>
                                setData('alamat', event.target.value)
                            }
                        />
                        {errors.alamat && (
                            <p className="text-sm text-destructive">
                                {errors.alamat}
                            </p>
                        )}
                    </div>

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
                    {processing ? 'Menyimpan...' : 'Simpan Kelahiran'}
                </Button>
            </div>
        </form>
    );
}
