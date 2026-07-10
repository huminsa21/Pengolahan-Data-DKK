import { Head, Link, router, useForm } from '@inertiajs/react';
import { Edit, Plus, Search, Trash2, X } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import {
    edit,
    index,
    show,
} from '@/actions/App/Http/Controllers/BantuanController';
import {
    destroy as destroyPenerima,
    store as storePenerima,
    update as updatePenerima,
} from '@/actions/App/Http/Controllers/PenerimaBantuanController';
import { moduleBreadcrumbs } from '@/components/module-page';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
    Bantuan,
    PaginatedPenerimaBantuan,
    PenerimaBantuan,
    PenerimaFilters,
    PenerimaFormData,
    PendudukOption,
} from './types';

type BantuanShowProps = {
    bantuan: Bantuan;
    penerima: PaginatedPenerimaBantuan;
    filters: PenerimaFilters;
    options: {
        penduduk: PendudukOption[];
        status: string[];
    };
};

function statusBadge(status: string): string {
    if (status === 'AKTIF') {
        return 'border-[#16A34A]/20 bg-[#16A34A]/10 text-[#166534]';
    }

    if (status === 'SELESAI') {
        return 'border-primary/20 bg-primary/10 text-primary';
    }

    return 'border-[#DC2626]/20 bg-[#DC2626]/10 text-[#DC2626]';
}

function formatCurrency(value: string | number | null): string {
    if (value === null || value === '') {
        return '-';
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value));
}

function formatDate(value: string | null): string {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
}

function pendudukLabel(penduduk: PendudukOption): string {
    const dusun = penduduk.wilayah_dusun?.nama_dusun ?? penduduk.dusun;

    return `${penduduk.nama_lengkap} - ${penduduk.nik ?? 'NIK belum ada'} - ${dusun}`;
}

function initialPenerimaData(penerima?: PenerimaBantuan): PenerimaFormData {
    return {
        penduduk_id: penerima?.penduduk_id ?? '',
        tanggal_terima: penerima?.tanggal_terima?.slice(0, 10) ?? '',
        nominal: penerima?.nominal?.toString() ?? '',
        status: penerima?.status ?? 'AKTIF',
        keterangan: penerima?.keterangan ?? '',
    };
}

function PenerimaForm({
    bantuan,
    options,
    editTarget,
    onDone,
}: {
    bantuan: Bantuan;
    options: BantuanShowProps['options'];
    editTarget?: PenerimaBantuan;
    onDone?: () => void;
}) {
    const [search, setSearch] = useState('');
    const { data, setData, post, put, processing, errors, reset } =
        useForm<PenerimaFormData>(initialPenerimaData(editTarget));

    const filteredPenduduk = useMemo(() => {
        const normalized = search.trim().toLowerCase();

        if (!normalized) {
            return options.penduduk;
        }

        return options.penduduk.filter((penduduk) =>
            pendudukLabel(penduduk).toLowerCase().includes(normalized),
        );
    }, [options.penduduk, search]);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (editTarget) {
            put(updatePenerima.url(editTarget.id), {
                preserveScroll: true,
                onSuccess: () => onDone?.(),
            });

            return;
        }

        post(storePenerima.url(bantuan.id), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    }

    return (
        <form className="space-y-4" onSubmit={submit}>
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                    <Label>Cari Penduduk</Label>
                    <Input
                        placeholder="Cari NIK, nama, atau dusun"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    <select
                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        value={data.penduduk_id}
                        onChange={(event) =>
                            setData('penduduk_id', event.target.value)
                        }
                    >
                        <option value="">Pilih penduduk</option>
                        {filteredPenduduk.map((penduduk) => (
                            <option key={penduduk.id} value={penduduk.id}>
                                {pendudukLabel(penduduk)}
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
                    <Label htmlFor="tanggal_terima">Tanggal Terima</Label>
                    <Input
                        id="tanggal_terima"
                        type="date"
                        value={data.tanggal_terima}
                        onChange={(event) =>
                            setData('tanggal_terima', event.target.value)
                        }
                    />
                    {errors.tanggal_terima && (
                        <p className="text-sm text-destructive">
                            {errors.tanggal_terima}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="nominal">Nominal</Label>
                    <Input
                        id="nominal"
                        inputMode="numeric"
                        value={data.nominal}
                        onChange={(event) =>
                            setData('nominal', event.target.value)
                        }
                    />
                    {errors.nominal && (
                        <p className="text-sm text-destructive">
                            {errors.nominal}
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
                    <Label htmlFor="keterangan">Keterangan</Label>
                    <textarea
                        className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
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
            <Button disabled={processing} type="submit">
                <Plus />
                {editTarget ? 'Simpan Perubahan' : 'Tambah Penerima'}
            </Button>
        </form>
    );
}

export default function BantuanShow({
    bantuan,
    penerima,
    filters,
    options,
}: BantuanShowProps) {
    const [filterData, setFilterData] = useState<PenerimaFilters>(filters);
    const [editTarget, setEditTarget] = useState<PenerimaBantuan | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<PenerimaBantuan | null>(
        null,
    );

    function submitFilters(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        router.get(show.url(bantuan.id), filterData, {
            preserveScroll: true,
            preserveState: true,
        });
    }

    function resetFilters() {
        const emptyFilters = { search: '', status: '' };
        setFilterData(emptyFilters);
        router.get(show.url(bantuan.id), emptyFilters, {
            preserveScroll: true,
            preserveState: true,
        });
    }

    function removePenerima() {
        if (!deleteTarget) {
            return;
        }

        router.delete(destroyPenerima.url(deleteTarget.id), {
            preserveScroll: true,
            onFinish: () => setDeleteTarget(null),
        });
    }

    return (
        <>
            <Head title={bantuan.nama_bantuan} />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Detail Bantuan
                        </p>
                        <h1 className="text-2xl font-semibold">
                            {bantuan.nama_bantuan}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {bantuan.kode_bantuan} · {bantuan.jenis_bantuan} ·{' '}
                            {bantuan.sumber_bantuan}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href={index.url()}>Kembali</Link>
                        </Button>
                        <Button asChild>
                            <Link href={edit.url(bantuan.id)}>
                                <Edit />
                                Edit
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    {[
                        ['Status', bantuan.status],
                        [
                            'Publikasi',
                            bantuan.is_published ? 'Published' : 'Draft',
                        ],
                        ['Tahun', bantuan.tahun ?? '-'],
                        [
                            'Jumlah Penerima',
                            bantuan.penerima_bantuan_count ?? penerima.total,
                        ],
                    ].map(([label, value]) => (
                        <div
                            className="rounded-lg border border-border bg-card p-4 shadow-sm"
                            key={label}
                        >
                            <p className="text-sm text-muted-foreground">
                                {label}
                            </p>
                            <p className="mt-2 text-xl font-semibold text-foreground">
                                {value}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                    <h2 className="text-base font-semibold">
                        Tambah Penerima Bantuan
                    </h2>
                    <div className="mt-4">
                        <PenerimaForm bantuan={bantuan} options={options} />
                    </div>
                </div>

                <form
                    className="rounded-lg border border-border bg-card p-4 shadow-sm"
                    onSubmit={submitFilters}
                >
                    <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_auto]">
                        <div className="space-y-2">
                            <Label htmlFor="search_penerima">
                                Search Penerima
                            </Label>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    id="search_penerima"
                                    placeholder="NIK, nama, atau dusun"
                                    value={filterData.search}
                                    onChange={(event) =>
                                        setFilterData({
                                            ...filterData,
                                            search: event.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <select
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                value={filterData.status}
                                onChange={(event) =>
                                    setFilterData({
                                        ...filterData,
                                        status: event.target.value,
                                    })
                                }
                            >
                                <option value="">Semua</option>
                                {options.status.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end gap-2">
                            <Button type="submit">Terapkan</Button>
                            <Button
                                onClick={resetFilters}
                                type="button"
                                variant="outline"
                            >
                                <X />
                            </Button>
                        </div>
                    </div>
                </form>

                <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1040px] text-left text-sm">
                            <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground uppercase">
                                <tr>
                                    <th className="px-4 py-3">NIK</th>
                                    <th className="px-4 py-3">Nama</th>
                                    <th className="px-4 py-3">Dusun</th>
                                    <th className="px-4 py-3">RT/RW</th>
                                    <th className="px-4 py-3">
                                        Tanggal Terima
                                    </th>
                                    <th className="px-4 py-3">Nominal</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Keterangan</th>
                                    <th className="px-4 py-3 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {penerima.data.map((item) => (
                                    <tr
                                        className="hover:bg-muted/30"
                                        key={item.id}
                                    >
                                        <td className="px-4 py-3">
                                            {item.penduduk.nik ?? '-'}
                                        </td>
                                        <td className="px-4 py-3 font-medium">
                                            {item.penduduk.nama_lengkap}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.penduduk.wilayah_dusun
                                                ?.nama_dusun ??
                                                item.penduduk.dusun}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.penduduk.rt}/
                                            {item.penduduk.rw}
                                        </td>
                                        <td className="px-4 py-3">
                                            {formatDate(item.tanggal_terima)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {formatCurrency(item.nominal)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${statusBadge(item.status)}`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.keterangan ?? '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    onClick={() =>
                                                        setEditTarget(item)
                                                    }
                                                    size="icon"
                                                    type="button"
                                                    variant="ghost"
                                                >
                                                    <Edit />
                                                </Button>
                                                <Button
                                                    onClick={() =>
                                                        setDeleteTarget(item)
                                                    }
                                                    size="icon"
                                                    type="button"
                                                    variant="ghost"
                                                >
                                                    <Trash2 className="text-destructive" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {penerima.data.length === 0 && (
                                    <tr>
                                        <td
                                            className="px-4 py-10 text-center text-muted-foreground"
                                            colSpan={9}
                                        >
                                            Belum ada penerima bantuan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-col gap-3 border-t border-border px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            Menampilkan {penerima.from ?? 0}-{penerima.to ?? 0}{' '}
                            dari {penerima.total} data
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {penerima.links.map((link) => (
                                <Button
                                    asChild={Boolean(link.url)}
                                    disabled={!link.url}
                                    key={`${link.label}-${link.url}`}
                                    size="sm"
                                    variant={
                                        link.active ? 'default' : 'outline'
                                    }
                                >
                                    {link.url ? (
                                        <Link
                                            href={link.url}
                                            preserveScroll
                                            preserveState
                                        >
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        </Link>
                                    ) : (
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    )}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Dialog
                open={Boolean(editTarget)}
                onOpenChange={(open) => !open && setEditTarget(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit penerima bantuan</DialogTitle>
                        <DialogDescription>
                            Perbarui status, tanggal, nominal, atau keterangan
                            penerima.
                        </DialogDescription>
                    </DialogHeader>
                    {editTarget && (
                        <PenerimaForm
                            bantuan={bantuan}
                            editTarget={editTarget}
                            onDone={() => setEditTarget(null)}
                            options={options}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <Dialog
                open={Boolean(deleteTarget)}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus penerima bantuan?</DialogTitle>
                        <DialogDescription>
                            {deleteTarget?.penduduk.nama_lengkap} akan dihapus
                            dari daftar penerima program ini.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            onClick={() => setDeleteTarget(null)}
                            variant="outline"
                        >
                            Batal
                        </Button>
                        <Button onClick={removePenerima} variant="destructive">
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

BantuanShow.layout = {
    breadcrumbs: moduleBreadcrumbs('Detail Bantuan', index()),
};
