import { Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    index,
    store,
    update,
} from '@/actions/App/Http/Controllers/PendudukController';
import type {
    DusunOption,
    Penduduk,
    PendudukFormData,
    PendudukOptions,
} from './types';

type PendudukFormProps = {
    penduduk?: Penduduk;
    options: PendudukOptions;
    mode: 'create' | 'edit';
};

type Field = {
    name: keyof PendudukFormData;
    label: string;
    type?: 'text' | 'date' | 'textarea';
    required?: boolean;
};

const textFields: Field[] = [
    { name: 'nik', label: 'NIK', required: true },
    { name: 'nama_lengkap', label: 'Nama Lengkap', required: true },
    { name: 'tempat_lahir', label: 'Tempat Lahir', required: true },
    {
        name: 'tanggal_lahir',
        label: 'Tanggal Lahir',
        type: 'date',
        required: true,
    },
    { name: 'pekerjaan', label: 'Pekerjaan', required: true },
    { name: 'no_hp', label: 'No. HP' },
    { name: 'alamat', label: 'Alamat', type: 'textarea', required: true },
    { name: 'rt', label: 'RT', required: true },
    { name: 'rw', label: 'RW', required: true },
    { name: 'desa', label: 'Desa', required: true },
    { name: 'kecamatan', label: 'Kecamatan', required: true },
    { name: 'kabupaten', label: 'Kabupaten', required: true },
    { name: 'provinsi', label: 'Provinsi', required: true },
    { name: 'no_kk', label: 'No. KK' },
    { name: 'hubungan_keluarga', label: 'Hubungan Keluarga' },
];

function initialData(penduduk?: Penduduk): PendudukFormData {
    return {
        nik: penduduk?.nik ?? '',
        nama_lengkap: penduduk?.nama_lengkap ?? '',
        jenis_kelamin: normalizeGender(penduduk?.jenis_kelamin ?? 'L'),
        tempat_lahir: penduduk?.tempat_lahir ?? '',
        tanggal_lahir: penduduk?.tanggal_lahir?.slice(0, 10) ?? '',
        agama: penduduk?.agama ?? 'Islam',
        status_perkawinan: penduduk?.status_perkawinan ?? 'BELUM KAWIN',
        pendidikan: penduduk?.pendidikan ?? 'SMA',
        pekerjaan: penduduk?.pekerjaan ?? '',
        no_hp: penduduk?.no_hp ?? '',
        alamat: penduduk?.alamat ?? '',
        dusun_id: penduduk?.dusun_id ?? '',
        dusun: penduduk?.dusun ?? '',
        rt: penduduk?.rt ?? '',
        rw: penduduk?.rw ?? '',
        desa: penduduk?.desa ?? 'Desa Sukamaju',
        kecamatan: penduduk?.kecamatan ?? 'Kecamatan Makmur',
        kabupaten: penduduk?.kabupaten ?? 'Kabupaten Sentosa',
        provinsi: penduduk?.provinsi ?? 'Jawa Tengah',
        no_kk: penduduk?.no_kk ?? '',
        hubungan_keluarga: penduduk?.hubungan_keluarga ?? '',
        is_kepala_keluarga: penduduk?.is_kepala_keluarga ?? false,
        status_penduduk: penduduk?.status_penduduk ?? 'AKTIF',
    };
}

function normalizeGender(value: string): string {
    if (value === 'LAKI-LAKI') {
        return 'L';
    }

    if (value === 'PEREMPUAN') {
        return 'P';
    }

    return value;
}

function SelectField({
    label,
    value,
    options,
    labels = {},
    onChange,
    error,
}: {
    label: string;
    value: string;
    options: string[];
    labels?: Record<string, string>;
    onChange: (value: string) => void;
    error?: string;
}) {
    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <select
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                value={value}
                onChange={(event) => onChange(event.target.value)}
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {labels[option] ?? option}
                    </option>
                ))}
            </select>
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}

function DusunSelectField({
    value,
    options,
    onChange,
    error,
}: {
    value: string;
    options: DusunOption[];
    onChange: (dusun: DusunOption | null) => void;
    error?: string;
}) {
    const [search, setSearch] = useState('');

    const selectedDusun = options.find((dusun) => dusun.id === value) ?? null;
    const filteredOptions = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        if (!normalizedSearch) {
            return options;
        }

        return options.filter((dusun) => {
            const searchableText =
                `${dusun.kode_dusun ?? ''} ${dusun.nama_dusun}`.toLowerCase();

            return searchableText.includes(normalizedSearch);
        });
    }, [options, search]);

    const visibleOptions =
        selectedDusun &&
        !filteredOptions.some((dusun) => dusun.id === selectedDusun.id)
            ? [selectedDusun, ...filteredOptions]
            : filteredOptions;

    return (
        <div className="space-y-2">
            <Label htmlFor="dusun_id">Dusun</Label>
            <Input
                aria-label="Cari dusun"
                placeholder="Cari kode atau nama dusun"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
            />
            <select
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                id="dusun_id"
                value={value}
                onChange={(event) => {
                    const dusun =
                        options.find(
                            (option) => option.id === event.target.value,
                        ) ?? null;

                    onChange(dusun);
                }}
            >
                <option value="">Pilih dusun</option>
                {visibleOptions.map((dusun) => (
                    <option key={dusun.id} value={dusun.id}>
                        {dusun.kode_dusun
                            ? `${dusun.kode_dusun} - ${dusun.nama_dusun}`
                            : dusun.nama_dusun}
                    </option>
                ))}
            </select>
            {selectedDusun && (
                <p className="text-xs text-muted-foreground">
                    Terpilih: {selectedDusun.nama_dusun}
                </p>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}

export function PendudukForm({ penduduk, options, mode }: PendudukFormProps) {
    const { data, setData, post, put, processing, errors } =
        useForm<PendudukFormData>(initialData(penduduk));

    function selectDusun(dusun: DusunOption | null) {
        setData({
            ...data,
            dusun_id: dusun?.id ?? '',
            dusun: dusun?.nama_dusun ?? '',
        });
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (mode === 'create') {
            post(store.url());

            return;
        }

        put(update.url(penduduk!.id));
    }

    return (
        <form className="space-y-6" onSubmit={submit}>
            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    <SelectField
                        label="Jenis Kelamin"
                        value={data.jenis_kelamin}
                        options={options.jenis_kelamin}
                        onChange={(value) => setData('jenis_kelamin', value)}
                        error={errors.jenis_kelamin}
                    />
                    <SelectField
                        label="Agama"
                        value={data.agama}
                        options={options.agama}
                        onChange={(value) => setData('agama', value)}
                        error={errors.agama}
                    />
                    <SelectField
                        label="Status Perkawinan"
                        value={data.status_perkawinan}
                        options={options.status_perkawinan}
                        onChange={(value) =>
                            setData('status_perkawinan', value)
                        }
                        error={errors.status_perkawinan}
                    />
                    <SelectField
                        label="Pendidikan"
                        value={data.pendidikan}
                        options={options.pendidikan}
                        onChange={(value) => setData('pendidikan', value)}
                        error={errors.pendidikan}
                    />
                    <SelectField
                        label="Status Penduduk"
                        value={data.status_penduduk}
                        options={options.status_penduduk}
                        onChange={(value) => setData('status_penduduk', value)}
                        error={errors.status_penduduk}
                    />
                    <DusunSelectField
                        value={data.dusun_id}
                        options={options.dusun}
                        onChange={selectDusun}
                        error={errors.dusun_id}
                    />

                    {textFields.map((field) => (
                        <div
                            className={
                                field.type === 'textarea'
                                    ? 'space-y-2 md:col-span-2 xl:col-span-3'
                                    : 'space-y-2'
                            }
                            key={field.name}
                        >
                            <Label htmlFor={field.name}>
                                {field.label}
                                {field.required && (
                                    <span className="text-destructive"> *</span>
                                )}
                            </Label>
                            {field.type === 'textarea' ? (
                                <textarea
                                    className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                    id={field.name}
                                    value={String(data[field.name])}
                                    onChange={(event) =>
                                        setData(field.name, event.target.value)
                                    }
                                />
                            ) : (
                                <Input
                                    id={field.name}
                                    type={field.type ?? 'text'}
                                    value={String(data[field.name])}
                                    onChange={(event) =>
                                        setData(field.name, event.target.value)
                                    }
                                />
                            )}
                            {errors[field.name] && (
                                <p className="text-sm text-destructive">
                                    {errors[field.name]}
                                </p>
                            )}
                        </div>
                    ))}

                    <div className="flex items-center gap-3 rounded-md border border-border bg-background px-4 py-3">
                        <Checkbox
                            checked={data.is_kepala_keluarga}
                            id="is_kepala_keluarga"
                            onCheckedChange={(checked) =>
                                setData('is_kepala_keluarga', checked === true)
                            }
                        />
                        <Label
                            className="text-sm font-medium"
                            htmlFor="is_kepala_keluarga"
                        >
                            Kepala Keluarga
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
                    {processing ? 'Menyimpan...' : 'Simpan Penduduk'}
                </Button>
            </div>
        </form>
    );
}
