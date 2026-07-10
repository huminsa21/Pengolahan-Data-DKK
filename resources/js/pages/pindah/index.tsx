import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, MoveRight, Plus, Search, Trash2, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import {
    create,
    destroy,
    edit,
    index,
    show,
} from '@/actions/App/Http/Controllers/PindahController';
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
    PaginatedPindah,
    Pindah,
    PindahFilterOptions,
    PindahFilters,
    PindahStats,
} from './types';

type PindahIndexProps = {
    pindah: PaginatedPindah;
    filters: PindahFilters;
    filterOptions: PindahFilterOptions;
    stats: PindahStats;
};

const statCards: {
    key: keyof PindahStats;
    label: string;
    className: string;
}[] = [
    { key: 'total', label: 'Total Data Pindah', className: 'text-primary' },
    { key: 'proses', label: 'Proses', className: 'text-[#F59E0B]' },
    { key: 'selesai', label: 'Selesai', className: 'text-[#16A34A]' },
    { key: 'dibatalkan', label: 'Dibatalkan', className: 'text-[#DC2626]' },
    { key: 'bulan_ini', label: 'Bulan Ini', className: 'text-[#F9A826]' },
];

function formatDate(value: string): string {
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
}

function genderBadge(value: string): string {
    if (value === 'L' || value === 'LAKI-LAKI') {
        return 'border-primary/20 bg-primary/10 text-primary';
    }

    return 'border-[#F9A826]/20 bg-[#F9A826]/10 text-[#9A5F00]';
}

function statusBadge(value: string): string {
    if (value === 'SELESAI') {
        return 'border-[#16A34A]/20 bg-[#16A34A]/10 text-[#166534]';
    }

    if (value === 'DIBATALKAN') {
        return 'border-destructive/20 bg-destructive/10 text-destructive';
    }

    return 'border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#92400E]';
}

function reporterName(pindah: Pindah): string {
    return pindah.pelapor_nama ?? pindah.pelapor_penduduk?.nama_lengkap ?? '-';
}

function dusunName(pindah: Pindah): string {
    return (
        pindah.penduduk.wilayah_dusun?.nama_dusun ??
        pindah.penduduk.dusun ??
        '-'
    );
}

function tujuan(pindah: Pindah): string {
    return (
        [pindah.desa_tujuan, pindah.kecamatan_tujuan, pindah.kabupaten_tujuan]
            .filter(Boolean)
            .join(', ') || '-'
    );
}

export default function PindahIndex({
    pindah,
    filters,
    filterOptions,
    stats,
}: PindahIndexProps) {
    const [filterData, setFilterData] = useState<PindahFilters>(filters);
    const [deleteTarget, setDeleteTarget] = useState<Pindah | null>(null);

    function submitFilters(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        router.get(index.url(), filterData, {
            preserveScroll: true,
            preserveState: true,
        });
    }

    function resetFilters() {
        const emptyFilters = {
            search: '',
            status: '',
            dusun_id: '',
            tanggal_dari: '',
            tanggal_sampai: '',
            pelapor_tipe: '',
        };

        setFilterData(emptyFilters);

        router.get(index.url(), emptyFilters, {
            preserveScroll: true,
            preserveState: true,
        });
    }

    function deletePindah() {
        if (!deleteTarget) {
            return;
        }

        router.delete(destroy.url(deleteTarget.id), {
            preserveScroll: true,
            onFinish: () => setDeleteTarget(null),
        });
    }

    return (
        <>
            <Head title="Data Pindah" />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Peristiwa Kependudukan
                        </p>
                        <h1 className="text-2xl font-semibold">Data Pindah</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola perpindahan penduduk dan status pindah secara
                            otomatis.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create.url()}>
                            <Plus />
                            Tambah Pindah
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    {statCards.map((stat) => (
                        <div
                            className="rounded-lg border border-border bg-card p-4 shadow-sm"
                            key={stat.key}
                        >
                            <p className="text-sm text-muted-foreground">
                                {stat.label}
                            </p>
                            <p
                                className={`mt-2 text-2xl font-semibold ${stat.className}`}
                            >
                                {stats[stat.key]}
                            </p>
                        </div>
                    ))}
                </div>

                <form
                    className="rounded-lg border border-border bg-card p-4 shadow-sm"
                    onSubmit={submitFilters}
                >
                    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1fr_auto]">
                        <div className="space-y-2">
                            <Label htmlFor="search">Search</Label>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    id="search"
                                    placeholder="NIK, nama, tujuan, pelapor"
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
                                {filterOptions.status.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label>Dusun</Label>
                            <select
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                value={filterData.dusun_id}
                                onChange={(event) =>
                                    setFilterData({
                                        ...filterData,
                                        dusun_id: event.target.value,
                                    })
                                }
                            >
                                <option value="">Semua</option>
                                {filterOptions.dusun.map((dusun) => (
                                    <option key={dusun.id} value={dusun.id}>
                                        {dusun.nama_dusun}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tanggal_dari">Tanggal Dari</Label>
                            <Input
                                id="tanggal_dari"
                                type="date"
                                value={filterData.tanggal_dari}
                                onChange={(event) =>
                                    setFilterData({
                                        ...filterData,
                                        tanggal_dari: event.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tanggal_sampai">
                                Tanggal Sampai
                            </Label>
                            <Input
                                id="tanggal_sampai"
                                type="date"
                                value={filterData.tanggal_sampai}
                                onChange={(event) =>
                                    setFilterData({
                                        ...filterData,
                                        tanggal_sampai: event.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Tipe Pelapor</Label>
                            <select
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                value={filterData.pelapor_tipe}
                                onChange={(event) =>
                                    setFilterData({
                                        ...filterData,
                                        pelapor_tipe: event.target.value,
                                    })
                                }
                            >
                                <option value="">Semua</option>
                                {filterOptions.pelapor_tipe.map(
                                    (pelaporTipe) => (
                                        <option
                                            key={pelaporTipe}
                                            value={pelaporTipe}
                                        >
                                            {pelaporTipe.replaceAll('_', ' ')}
                                        </option>
                                    ),
                                )}
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
                        <table className="w-full min-w-[1120px] text-left text-sm">
                            <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground uppercase">
                                <tr>
                                    <th className="px-4 py-3">NIK</th>
                                    <th className="px-4 py-3">Nama</th>
                                    <th className="px-4 py-3">Jenis Kelamin</th>
                                    <th className="px-4 py-3">Dusun</th>
                                    <th className="px-4 py-3">
                                        Tanggal Pindah
                                    </th>
                                    <th className="px-4 py-3">Tujuan</th>
                                    <th className="px-4 py-3">Alasan</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Pelapor</th>
                                    <th className="px-4 py-3 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {pindah.data.map((item) => (
                                    <tr
                                        className="hover:bg-muted/30"
                                        key={item.id}
                                    >
                                        <td className="px-4 py-3">
                                            {item.penduduk.nik}
                                        </td>
                                        <td className="px-4 py-3 font-medium">
                                            {item.penduduk.nama_lengkap}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${genderBadge(
                                                    item.penduduk.jenis_kelamin,
                                                )}`}
                                            >
                                                {item.penduduk.jenis_kelamin}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {dusunName(item)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {formatDate(item.tanggal_pindah)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {tujuan(item)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.alasan_pindah ?? '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${statusBadge(
                                                    item.status,
                                                )}`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="space-y-1">
                                                <p>{reporterName(item)}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {item.pelapor_tipe.replaceAll(
                                                        '_',
                                                        ' ',
                                                    )}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    asChild
                                                    size="icon"
                                                    variant="ghost"
                                                >
                                                    <Link
                                                        href={show.url(item.id)}
                                                    >
                                                        <Eye />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    asChild
                                                    size="icon"
                                                    variant="ghost"
                                                >
                                                    <Link
                                                        href={edit.url(item.id)}
                                                    >
                                                        <Edit />
                                                    </Link>
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
                                {pindah.data.length === 0 && (
                                    <tr>
                                        <td
                                            className="px-4 py-12 text-center"
                                            colSpan={10}
                                        >
                                            <div className="mx-auto flex max-w-sm flex-col items-center gap-3 text-muted-foreground">
                                                <MoveRight className="size-10 text-primary" />
                                                <div>
                                                    <p className="font-medium text-foreground">
                                                        Belum ada data pindah
                                                    </p>
                                                    <p className="mt-1 text-sm">
                                                        Tambahkan catatan pindah
                                                        untuk mulai mengelola
                                                        modul ini.
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-border px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            Menampilkan {pindah.from ?? 0}-{pindah.to ?? 0} dari{' '}
                            {pindah.total} data
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {pindah.links.map((link) => (
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
                open={Boolean(deleteTarget)}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus data pindah?</DialogTitle>
                        <DialogDescription>
                            Data pindah {deleteTarget?.penduduk.nama_lengkap}{' '}
                            akan dihapus menggunakan soft delete dan status
                            penduduk disinkronkan ulang.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            onClick={() => setDeleteTarget(null)}
                            variant="outline"
                        >
                            Batal
                        </Button>
                        <Button onClick={deletePindah} variant="destructive">
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

PindahIndex.layout = {
    breadcrumbs: moduleBreadcrumbs('Pindah', index()),
};
