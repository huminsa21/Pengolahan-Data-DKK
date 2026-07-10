import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Search, Trash2, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import {
    create,
    destroy,
    edit,
    index,
    show,
} from '@/actions/App/Http/Controllers/PendudukController';
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
    PaginatedPenduduk,
    Penduduk,
    PendudukFilters,
    PendudukStats,
} from './types';

type PendudukIndexProps = {
    penduduk: PaginatedPenduduk;
    filters: PendudukFilters;
    filterOptions: {
        dusun: Array<{
            id: string;
            nama_dusun: string;
        }>;
    };
    stats: PendudukStats;
};

const statCards: {
    key: keyof PendudukStats;
    label: string;
    className: string;
}[] = [
    { key: 'total', label: 'Total Penduduk', className: 'text-primary' },
    { key: 'aktif', label: 'Aktif', className: 'text-[#16A34A]' },
    { key: 'pindah', label: 'Pindah', className: 'text-[#F59E0B]' },
    { key: 'meninggal', label: 'Meninggal', className: 'text-[#DC2626]' },
    {
        key: 'kepala_keluarga',
        label: 'Kepala Keluarga',
        className: 'text-[#2E7D32]',
    },
];

function formatGender(value: string): string {
    if (value === 'L' || value === 'LAKI-LAKI') {
        return 'L';
    }

    if (value === 'P' || value === 'PEREMPUAN') {
        return 'P';
    }

    return value;
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
}

function statusClass(status: string): string {
    if (status === 'AKTIF') {
        return 'border-[#16A34A]/20 bg-[#16A34A]/10 text-[#16A34A]';
    }

    if (status === 'PINDAH') {
        return 'border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#B45309]';
    }

    return 'border-[#DC2626]/20 bg-[#DC2626]/10 text-[#DC2626]';
}

export default function PendudukIndex({
    penduduk,
    filters,
    filterOptions,
    stats,
}: PendudukIndexProps) {
    const [filterData, setFilterData] = useState<PendudukFilters>(filters);
    const [deleteTarget, setDeleteTarget] = useState<Penduduk | null>(null);

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
            status_penduduk: '',
            dusun_id: '',
        };

        setFilterData(emptyFilters);

        router.get(index.url(), emptyFilters, {
            preserveScroll: true,
            preserveState: true,
        });
    }

    function deletePenduduk() {
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
            <Head title="Data Penduduk" />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Master Data
                        </p>
                        <h1 className="text-2xl font-semibold">
                            Data Penduduk
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola data warga, status kependudukan, alamat, dan
                            informasi keluarga.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create.url()}>
                            <Plus />
                            Tambah Penduduk
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
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
                    <div className="grid gap-4 lg:grid-cols-[1.5fr_repeat(3,1fr)_auto]">
                        <div className="space-y-2">
                            <Label htmlFor="search">Search</Label>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    id="search"
                                    placeholder="NIK, nama, dusun, status"
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
                            <Label>Status</Label>
                            <select
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                value={filterData.status_penduduk}
                                onChange={(event) =>
                                    setFilterData({
                                        ...filterData,
                                        status_penduduk: event.target.value,
                                    })
                                }
                            >
                                <option value="">Semua</option>
                                <option value="AKTIF">AKTIF</option>
                                <option value="PINDAH">PINDAH</option>
                                <option value="MENINGGAL">MENINGGAL</option>
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
                        <table className="w-full min-w-[980px] text-left text-sm">
                            <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground uppercase">
                                <tr>
                                    <th className="px-4 py-3">NIK</th>
                                    <th className="px-4 py-3">Nama Lengkap</th>
                                    <th className="px-4 py-3">Jenis Kelamin</th>
                                    <th className="px-4 py-3">
                                        Tempat/Tanggal Lahir
                                    </th>
                                    <th className="px-4 py-3">Dusun/RT/RW</th>
                                    <th className="px-4 py-3">Pekerjaan</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">
                                        Kepala Keluarga
                                    </th>
                                    <th className="px-4 py-3 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {penduduk.data.map((item) => (
                                    <tr
                                        className="hover:bg-muted/30"
                                        key={item.id}
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {item.nik}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.nama_lengkap}
                                        </td>
                                        <td className="px-4 py-3">
                                            {formatGender(item.jenis_kelamin)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.tempat_lahir},{' '}
                                            {formatDate(item.tanggal_lahir)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.wilayah_dusun?.nama_dusun ??
                                                item.dusun}{' '}
                                            / {item.rt} / {item.rw}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.pekerjaan}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${statusClass(
                                                    item.status_penduduk,
                                                )}`}
                                            >
                                                {item.status_penduduk}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.is_kepala_keluarga
                                                ? 'Ya'
                                                : 'Tidak'}
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
                                {penduduk.data.length === 0 && (
                                    <tr>
                                        <td
                                            className="px-4 py-10 text-center text-muted-foreground"
                                            colSpan={9}
                                        >
                                            Tidak ada data penduduk yang cocok.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-border px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            Menampilkan {penduduk.from ?? 0}-{penduduk.to ?? 0}{' '}
                            dari {penduduk.total} data
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {penduduk.links.map((link) => (
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
                        <DialogTitle>Hapus data penduduk?</DialogTitle>
                        <DialogDescription>
                            Data {deleteTarget?.nama_lengkap} akan dihapus
                            menggunakan soft delete dan tidak muncul di daftar
                            aktif.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            onClick={() => setDeleteTarget(null)}
                            variant="outline"
                        >
                            Batal
                        </Button>
                        <Button onClick={deletePenduduk} variant="destructive">
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

PendudukIndex.layout = {
    breadcrumbs: moduleBreadcrumbs('Penduduk', index()),
};
