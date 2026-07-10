import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Search, Skull, Trash2, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import {
    create,
    destroy,
    edit,
    index,
    show,
} from '@/actions/App/Http/Controllers/KematianController';
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
    Kematian,
    KematianFilterOptions,
    KematianFilters,
    KematianStats,
    PaginatedKematian,
} from './types';

type KematianIndexProps = {
    kematian: PaginatedKematian;
    filters: KematianFilters;
    filterOptions: KematianFilterOptions;
    stats: KematianStats;
};

const statCards: {
    key: keyof KematianStats;
    label: string;
    className: string;
}[] = [
    { key: 'total', label: 'Total Kematian', className: 'text-primary' },
    { key: 'bulan_ini', label: 'Bulan Ini', className: 'text-[#F59E0B]' },
    { key: 'tahun_ini', label: 'Tahun Ini', className: 'text-[#16A34A]' },
    { key: 'laki_laki', label: 'Laki-laki', className: 'text-[#2E7D32]' },
    { key: 'perempuan', label: 'Perempuan', className: 'text-[#F9A826]' },
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

function reporterName(kematian: Kematian): string {
    return (
        kematian.pelapor_nama ?? kematian.pelapor_penduduk?.nama_lengkap ?? '-'
    );
}

function dusunName(kematian: Kematian): string {
    return (
        kematian.penduduk.wilayah_dusun?.nama_dusun ??
        kematian.penduduk.dusun ??
        '-'
    );
}

export default function KematianIndex({
    kematian,
    filters,
    filterOptions,
    stats,
}: KematianIndexProps) {
    const [filterData, setFilterData] = useState<KematianFilters>(filters);
    const [deleteTarget, setDeleteTarget] = useState<Kematian | null>(null);

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
            jenis_kelamin: '',
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

    function deleteKematian() {
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
            <Head title="Data Kematian" />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Peristiwa Kependudukan
                        </p>
                        <h1 className="text-2xl font-semibold">
                            Data Kematian
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola catatan kematian penduduk dan sinkronkan
                            status penduduk secara otomatis.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create.url()}>
                            <Plus />
                            Tambah Kematian
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
                    <div className="grid gap-4 lg:grid-cols-[1.4fr_0.7fr_1fr_1fr_1fr_1fr_auto]">
                        <div className="space-y-2">
                            <Label htmlFor="search">Search</Label>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    id="search"
                                    placeholder="NIK, nama, sebab, pelapor"
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
                            <Label>Jenis Kelamin</Label>
                            <select
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                value={filterData.jenis_kelamin}
                                onChange={(event) =>
                                    setFilterData({
                                        ...filterData,
                                        jenis_kelamin: event.target.value,
                                    })
                                }
                            >
                                <option value="">Semua</option>
                                <option value="L">L</option>
                                <option value="P">P</option>
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
                                    <th className="px-4 py-3">Nama Penduduk</th>
                                    <th className="px-4 py-3">Jenis Kelamin</th>
                                    <th className="px-4 py-3">Dusun</th>
                                    <th className="px-4 py-3">
                                        Tanggal Meninggal
                                    </th>
                                    <th className="px-4 py-3">
                                        Tempat Meninggal
                                    </th>
                                    <th className="px-4 py-3">
                                        Sebab Meninggal
                                    </th>
                                    <th className="px-4 py-3">Pelapor</th>
                                    <th className="px-4 py-3 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {kematian.data.map((item) => (
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
                                            {formatDate(item.tanggal_meninggal)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.tempat_meninggal ?? '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.sebab_meninggal ?? '-'}
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
                                {kematian.data.length === 0 && (
                                    <tr>
                                        <td
                                            className="px-4 py-12 text-center"
                                            colSpan={9}
                                        >
                                            <div className="mx-auto flex max-w-sm flex-col items-center gap-3 text-muted-foreground">
                                                <Skull className="size-10 text-primary" />
                                                <div>
                                                    <p className="font-medium text-foreground">
                                                        Belum ada data kematian
                                                    </p>
                                                    <p className="mt-1 text-sm">
                                                        Tambahkan catatan
                                                        kematian untuk mulai
                                                        mengelola modul ini.
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
                            Menampilkan {kematian.from ?? 0}-{kematian.to ?? 0}{' '}
                            dari {kematian.total} data
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {kematian.links.map((link) => (
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
                        <DialogTitle>Hapus data kematian?</DialogTitle>
                        <DialogDescription>
                            Data kematian {deleteTarget?.penduduk.nama_lengkap}{' '}
                            akan dihapus menggunakan soft delete dan status
                            penduduk dikembalikan jika tidak ada data kematian
                            aktif lain.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            onClick={() => setDeleteTarget(null)}
                            variant="outline"
                        >
                            Batal
                        </Button>
                        <Button onClick={deleteKematian} variant="destructive">
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

KematianIndex.layout = {
    breadcrumbs: moduleBreadcrumbs('Kematian', index()),
};
