import { Head, Link, router } from '@inertiajs/react';
import {
    Check,
    Edit,
    Eye,
    Plus,
    Search,
    Trash2,
    UserPlus,
    X,
} from 'lucide-react';
import { useState, type FormEvent } from 'react';
import {
    accept,
    create,
    destroy,
    edit,
    index,
    reject,
    show,
} from '@/actions/App/Http/Controllers/PendatangController';
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
    PaginatedPendatang,
    Pendatang,
    PendatangFilterOptions,
    PendatangFilters,
    PendatangStats,
} from './types';

type PendatangIndexProps = {
    pendatang: PaginatedPendatang;
    filters: PendatangFilters;
    filterOptions: PendatangFilterOptions;
    stats: PendatangStats;
};

const statCards: {
    key: keyof PendatangStats;
    label: string;
    className: string;
}[] = [
    { key: 'total', label: 'Total Pendatang', className: 'text-primary' },
    { key: 'proses', label: 'Proses', className: 'text-[#F59E0B]' },
    { key: 'diterima', label: 'Diterima', className: 'text-[#16A34A]' },
    { key: 'ditolak', label: 'Ditolak', className: 'text-[#DC2626]' },
    { key: 'bulan_ini', label: 'Bulan Ini', className: 'text-[#F9A826]' },
];

function formatDate(value: string): string {
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
}

function statusBadge(status: string): string {
    if (status === 'DITERIMA')
        return 'border-[#16A34A]/20 bg-[#16A34A]/10 text-[#166534]';
    if (status === 'DITOLAK')
        return 'border-destructive/20 bg-destructive/10 text-destructive';
    return 'border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#92400E]';
}

function genderBadge(value: string): string {
    return value === 'L'
        ? 'border-primary/20 bg-primary/10 text-primary'
        : 'border-[#F9A826]/20 bg-[#F9A826]/10 text-[#9A5F00]';
}

function reporterName(pendatang: Pendatang): string {
    return (
        pendatang.pelapor_nama ??
        pendatang.pelapor_penduduk?.nama_lengkap ??
        '-'
    );
}

function asal(pendatang: Pendatang): string {
    return (
        [
            pendatang.desa_asal,
            pendatang.kecamatan_asal,
            pendatang.kabupaten_asal,
        ]
            .filter(Boolean)
            .join(', ') || '-'
    );
}

export default function PendatangIndex({
    pendatang,
    filters,
    filterOptions,
    stats,
}: PendatangIndexProps) {
    const [filterData, setFilterData] = useState<PendatangFilters>(filters);
    const [actionTarget, setActionTarget] = useState<{
        type: 'accept' | 'reject' | 'delete';
        item: Pendatang;
    } | null>(null);

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
            jenis_kelamin: '',
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

    function runAction() {
        if (!actionTarget) return;

        if (actionTarget.type === 'delete') {
            router.delete(destroy.url(actionTarget.item.id), {
                preserveScroll: true,
                onFinish: () => setActionTarget(null),
            });

            return;
        }

        router.post(
            actionTarget.type === 'accept'
                ? accept.url(actionTarget.item.id)
                : reject.url(actionTarget.item.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setActionTarget(null),
            },
        );
    }

    return (
        <>
            <Head title="Data Pendatang" />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Peristiwa Kependudukan
                        </p>
                        <h1 className="text-2xl font-semibold">
                            Data Pendatang
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola data pendatang, proses penerimaan warga, dan
                            pelapor.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create.url()}>
                            <Plus />
                            Tambah Pendatang
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
                                    placeholder="NIK, nama, asal, pelapor"
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
                                {filterOptions.jenis_kelamin.map(
                                    (jenisKelamin) => (
                                        <option
                                            key={jenisKelamin}
                                            value={jenisKelamin}
                                        >
                                            {jenisKelamin}
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>
                        {(['tanggal_dari', 'tanggal_sampai'] as const).map(
                            (name) => (
                                <div className="space-y-2" key={name}>
                                    <Label htmlFor={name}>
                                        {name === 'tanggal_dari'
                                            ? 'Tanggal Dari'
                                            : 'Tanggal Sampai'}
                                    </Label>
                                    <Input
                                        id={name}
                                        type="date"
                                        value={filterData[name]}
                                        onChange={(event) =>
                                            setFilterData({
                                                ...filterData,
                                                [name]: event.target.value,
                                            })
                                        }
                                    />
                                </div>
                            ),
                        )}
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
                        <table className="w-full min-w-[1080px] text-left text-sm">
                            <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground uppercase">
                                <tr>
                                    <th className="px-4 py-3">NIK</th>
                                    <th className="px-4 py-3">Nama Lengkap</th>
                                    <th className="px-4 py-3">Jenis Kelamin</th>
                                    <th className="px-4 py-3">Asal</th>
                                    <th className="px-4 py-3">
                                        Tanggal Datang
                                    </th>
                                    <th className="px-4 py-3">Alasan</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Pelapor</th>
                                    <th className="px-4 py-3 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {pendatang.data.map((item) => (
                                    <tr
                                        className="hover:bg-muted/30"
                                        key={item.id}
                                    >
                                        <td className="px-4 py-3">
                                            {item.nik ?? '-'}
                                        </td>
                                        <td className="px-4 py-3 font-medium">
                                            {item.nama_lengkap}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${genderBadge(item.jenis_kelamin)}`}
                                            >
                                                {item.jenis_kelamin}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {asal(item)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {formatDate(item.tanggal_datang)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.alasan_datang ?? '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${statusBadge(item.status)}`}
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
                                                {item.status === 'PROSES' && (
                                                    <>
                                                        <Button
                                                            onClick={() =>
                                                                setActionTarget(
                                                                    {
                                                                        type: 'accept',
                                                                        item,
                                                                    },
                                                                )
                                                            }
                                                            size="icon"
                                                            type="button"
                                                            variant="ghost"
                                                        >
                                                            <Check className="text-[#16A34A]" />
                                                        </Button>
                                                        <Button
                                                            onClick={() =>
                                                                setActionTarget(
                                                                    {
                                                                        type: 'reject',
                                                                        item,
                                                                    },
                                                                )
                                                            }
                                                            size="icon"
                                                            type="button"
                                                            variant="ghost"
                                                        >
                                                            <X className="text-[#DC2626]" />
                                                        </Button>
                                                    </>
                                                )}
                                                <Button
                                                    onClick={() =>
                                                        setActionTarget({
                                                            type: 'delete',
                                                            item,
                                                        })
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
                                {pendatang.data.length === 0 && (
                                    <tr>
                                        <td
                                            className="px-4 py-12 text-center"
                                            colSpan={9}
                                        >
                                            <div className="mx-auto flex max-w-sm flex-col items-center gap-3 text-muted-foreground">
                                                <UserPlus className="size-10 text-primary" />
                                                <div>
                                                    <p className="font-medium text-foreground">
                                                        Belum ada data pendatang
                                                    </p>
                                                    <p className="mt-1 text-sm">
                                                        Tambahkan data pendatang
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
                            Menampilkan {pendatang.from ?? 0}-
                            {pendatang.to ?? 0} dari {pendatang.total} data
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {pendatang.links.map((link) => (
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
                open={Boolean(actionTarget)}
                onOpenChange={(open) => !open && setActionTarget(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {actionTarget?.type === 'accept' &&
                                'Terima jadi penduduk?'}
                            {actionTarget?.type === 'reject' &&
                                'Tolak pendatang?'}
                            {actionTarget?.type === 'delete' &&
                                'Hapus data pendatang?'}
                        </DialogTitle>
                        <DialogDescription>
                            {actionTarget?.type === 'accept' &&
                                `${actionTarget.item.nama_lengkap} akan dibuat sebagai data penduduk aktif.`}
                            {actionTarget?.type === 'reject' &&
                                `${actionTarget.item.nama_lengkap} akan diberi status DITOLAK.`}
                            {actionTarget?.type === 'delete' &&
                                `Data ${actionTarget.item.nama_lengkap} akan dihapus menggunakan soft delete.`}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            onClick={() => setActionTarget(null)}
                            variant="outline"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={runAction}
                            variant={
                                actionTarget?.type === 'delete'
                                    ? 'destructive'
                                    : 'default'
                            }
                        >
                            Lanjutkan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

PendatangIndex.layout = {
    breadcrumbs: moduleBreadcrumbs('Pendatang', index()),
};
