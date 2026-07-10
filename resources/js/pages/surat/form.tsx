import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store, update } from '@/routes/surat';
import type { Surat, SuratOptions } from './types';

type FormData = {
    jenis_surat_id: string;
    penduduk_id: string;
    tanggal_surat: string;
    keperluan: string;
    status: 'DRAFT' | 'SELESAI';
    referensi_tipe: string;
    referensi_id: string;
};

function isoDate(value?: string | null): string {
    return value ? value.slice(0, 10) : new Date().toISOString().slice(0, 10);
}

function formatBirthDate(value?: string | null): string {
    if (!value) {
        return 'Tanggal lahir belum ada';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
}

export function SuratForm({
    surat,
    options,
}: {
    surat?: Surat;
    options: SuratOptions;
}) {
    const form = useForm<FormData>({
        jenis_surat_id: surat?.jenis_surat_id ?? '',
        penduduk_id: surat?.penduduk_id ?? '',
        tanggal_surat: isoDate(surat?.tanggal_surat),
        keperluan: surat?.keperluan ?? '',
        status: surat?.status === 'SELESAI' ? 'SELESAI' : 'DRAFT',
        referensi_tipe: surat?.referensi_tipe ?? '',
        referensi_id: surat?.referensi_id ?? '',
    });

    const selectedJenis = options.jenisSurat.find(
        (item) => item.id === form.data.jenis_surat_id,
    );
    const kodeSurat = selectedJenis?.kode_surat;

    function changeJenis(jenisSuratId: string) {
        const jenis = options.jenisSurat.find(
            (item) => item.id === jenisSuratId,
        );
        const kode = jenis?.kode_surat ?? '';

        form.setData((data) => ({
            ...data,
            jenis_surat_id: jenisSuratId,
            penduduk_id: '',
            referensi_tipe:
                kode === 'KELAHIRAN'
                    ? 'KELAHIRAN'
                    : kode === 'KEMATIAN'
                      ? 'KEMATIAN'
                      : kode === 'PINDAH'
                        ? 'PINDAH'
                        : kode === 'DATANG'
                          ? 'PENDATANG'
                          : '',
            referensi_id: '',
        }));
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (surat) {
            form.put(update.url(surat.id));
            return;
        }

        form.post(store.url());
    }

    return (
        <form
            className="rounded-lg border border-border bg-card p-5 shadow-sm"
            onSubmit={submit}
        >
            <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                    <Label>Jenis Surat</Label>
                    <select
                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                        value={form.data.jenis_surat_id}
                        onChange={(event) => changeJenis(event.target.value)}
                    >
                        <option value="">Pilih jenis surat</option>
                        {options.jenisSurat.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.kode_surat} - {item.nama_surat}
                            </option>
                        ))}
                    </select>
                    {form.errors.jenis_surat_id && (
                        <p className="text-sm text-destructive">
                            {form.errors.jenis_surat_id}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tanggal_surat">Tanggal Surat</Label>
                    <Input
                        id="tanggal_surat"
                        type="date"
                        value={form.data.tanggal_surat}
                        onChange={(event) =>
                            form.setData('tanggal_surat', event.target.value)
                        }
                    />
                    {form.errors.tanggal_surat && (
                        <p className="text-sm text-destructive">
                            {form.errors.tanggal_surat}
                        </p>
                    )}
                </div>

                {(kodeSurat === 'DOMISILI' || kodeSurat === 'DATANG') && (
                    <div className="space-y-2">
                        <Label>Penduduk</Label>
                        <select
                            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                            value={form.data.penduduk_id}
                            onChange={(event) =>
                                form.setData('penduduk_id', event.target.value)
                            }
                        >
                            <option value="">Pilih penduduk</option>
                            {options.penduduk.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.nik} - {item.nama_lengkap} -{' '}
                                    {formatBirthDate(item.tanggal_lahir)}
                                </option>
                            ))}
                        </select>
                        {form.errors.penduduk_id && (
                            <p className="text-sm text-destructive">
                                {form.errors.penduduk_id}
                            </p>
                        )}
                    </div>
                )}

                {kodeSurat === 'KELAHIRAN' && (
                    <ReferenceSelect
                        error={form.errors.referensi_id}
                        label="Data Kelahiran"
                        value={form.data.referensi_id}
                        onChange={(value) =>
                            form.setData('referensi_id', value)
                        }
                        options={options.kelahiran.map((item) => ({
                            id: item.id,
                            label: `${item.nama_bayi} - ${item.ayah?.nama_lengkap ?? '-'} / ${item.ibu?.nama_lengkap ?? '-'}`,
                        }))}
                    />
                )}

                {kodeSurat === 'KEMATIAN' && (
                    <ReferenceSelect
                        error={form.errors.referensi_id}
                        label="Data Kematian"
                        value={form.data.referensi_id}
                        onChange={(value) =>
                            form.setData('referensi_id', value)
                        }
                        options={options.kematian.map((item) => ({
                            id: item.id,
                            label: `${item.penduduk?.nik ?? '-'} - ${item.penduduk?.nama_lengkap ?? '-'} - ${formatBirthDate(item.penduduk?.tanggal_lahir)}`,
                        }))}
                    />
                )}

                {kodeSurat === 'PINDAH' && (
                    <ReferenceSelect
                        error={form.errors.referensi_id}
                        label="Data Pindah"
                        value={form.data.referensi_id}
                        onChange={(value) =>
                            form.setData('referensi_id', value)
                        }
                        options={options.pindah.map((item) => ({
                            id: item.id,
                            label: `${item.penduduk?.nik ?? '-'} - ${item.penduduk?.nama_lengkap ?? '-'} - ${formatBirthDate(item.penduduk?.tanggal_lahir)} ke ${item.desa_tujuan ?? '-'}`,
                        }))}
                    />
                )}

                {kodeSurat === 'DATANG' && (
                    <ReferenceSelect
                        error={form.errors.referensi_id}
                        label="Data Pendatang"
                        value={form.data.referensi_id}
                        onChange={(value) =>
                            form.setData('referensi_id', value)
                        }
                        options={options.pendatang.map((item) => ({
                            id: item.id,
                            label: `${item.nik ?? item.penduduk?.nik ?? '-'} - ${item.nama_lengkap} - ${formatBirthDate(item.tanggal_lahir ?? item.penduduk?.tanggal_lahir)}`,
                        }))}
                    />
                )}

                <div className="space-y-2">
                    <Label>Status Simpan</Label>
                    <select
                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                        value={form.data.status}
                        onChange={(event) =>
                            form.setData(
                                'status',
                                event.target.value as FormData['status'],
                            )
                        }
                    >
                        <option value="DRAFT">Draft</option>
                        <option value="SELESAI">Selesaikan</option>
                    </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="keperluan">Keperluan</Label>
                    <Input
                        id="keperluan"
                        value={form.data.keperluan}
                        onChange={(event) =>
                            form.setData('keperluan', event.target.value)
                        }
                    />
                    {form.errors.keperluan && (
                        <p className="text-sm text-destructive">
                            {form.errors.keperluan}
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <Button disabled={form.processing} type="submit">
                    {surat ? 'Simpan Draft' : 'Simpan Surat'}
                </Button>
            </div>
        </form>
    );
}

function ReferenceSelect({
    label,
    value,
    options,
    error,
    onChange,
}: {
    label: string;
    value: string;
    error?: string;
    options: { id: string; label: string }[];
    onChange: (value: string) => void;
}) {
    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <select
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={value}
                onChange={(event) => onChange(event.target.value)}
            >
                <option value="">Pilih referensi</option>
                {options.map((item) => (
                    <option key={item.id} value={item.id}>
                        {item.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
