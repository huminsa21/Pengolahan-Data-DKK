import { Head, Link, router } from '@inertiajs/react';
import { Baby, Edit, Eye, Plus, Search, Trash2, UserPlus, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import {
    createPenduduk,
    create,
    destroy,
    edit,
    index,
    show,
} from '@/actions/App/Http/Controllers/KelahiranController';
import { show as showPenduduk } from '@/actions/App/Http/Controllers/PendudukController';
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
    Kelahiran,
    KelahiranFilters,
    KelahiranStats,
    PaginatedKelahiran,
} from './types';

type KelahiranIndexProps = {
    kelahiran: PaginatedKelahiran;
    filters: KelahiranFilters;
    stats: KelahiranStats;
};

const statCards: {
    key: keyof KelahiranStats;
    label: string;
    className: string;
}[] = [
    { key: 'total', label: 'Total Kelahiran', className: 'text-primary' },
    { key: 'laki_laki', label: 'Laki-laki', className: 'text-[#2E7D32]' },
    { key: 'perempuan', label: 'Perempuan', className: 'text-[#F9A826]' },
    { key: 'bulan_ini', label: 'Bulan Ini', className: 'text-[#16A34A]' },
];

function parentName(
    relation: Kelahiran['ayah'] | Kelahiran['ibu'],
    backup: string | null,
): string {
    return relation?.nama_lengkap ?? backup ?? '-';
}

function reporterName(kelahiran: Kelahiran): string {
    return (
        kelahiran.pelapor_nama ??
        kelahiran.pelapor_penduduk?.nama_lengkap ??
        '-'
    );
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
}

function genderBadge(value: string): string {
    if (value === 'L') {
        return 'border-primary/20 bg-primary/10 text-primary';
    }

    return 'border-[#F9A826]/20 bg-[#F9A826]/10 text-[#9A5F00]';
}

export default function KelahiranIndex({
    kelahiran,
    filters,
    stats,
}: KelahiranIndexProps) {
    const [filterData, setFilterData] = useState<KelahiranFilters>(filters);
    const [deleteTarget, setDeleteTarget] = useState<Kelahiran | null>(null);
    const [convertTarget, setConvertTarget] = useState<Kelahiran | null>(null);

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
            tanggal_dari: '',
            tanggal_sampai: '',
        };

        setFilterData(emptyFilters);

        router.get(index.url(), emptyFilters, {
            preserveScroll: true,
            preserveState: true,
        });
    }

    function deleteKelahiran() {
        if (!deleteTarget) {
            return;
        }

        router.delete(destroy.url(deleteTarget.id), {
            preserveScroll: true,
            onFinish: () => setDeleteTarget(null),
        });
    }

    function createPendudukBayi() {
        if (!convertTarget) {
            return;
        }

        router.post(createPenduduk.url(convertTarget.id), undefined, {
            preserveScroll: true,
            onFinish: () => setConvertTarget(null),
        });
    }

    return (
        <>
            <Head title="Data Kelahiran" />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Peristiwa Kependudukan
                        </p>
                        <h1 className="text-2xl font-semibold">
                            Data Kelahiran
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola catatan kelahiran bayi dan relasi orang tua
                            atau pelapor dari data penduduk.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create.url()}>
                            <Plus />
                            Tambah Kelahiran
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
                    <div className="grid gap-4 lg:grid-cols-[1.5fr_0.8fr_1fr_1fr_auto]">
                        <div className="space-y-2">
                            <Label htmlFor="search">Search</Label>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    id="search"
                                    placeholder="Nama bayi, ayah, ibu, keterangan"
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
                                    <th className="px-4 py-3">Nama Bayi</th>
                                    <th className="px-4 py-3">Jenis Kelamin</th>
                                    <th className="px-4 py-3">
                                        Tempat/Tanggal Lahir
                                    </th>
                                    <th className="px-4 py-3">Waktu Lahir</th>
                                    <th className="px-4 py-3">Ayah</th>
                                    <th className="px-4 py-3">Ibu</th>
                                    <th className="px-4 py-3">Pelapor</th>
                                    <th className="px-4 py-3">
                                        Status Penduduk Bayi
                                    </th>
                                    <th className="px-4 py-3 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {kelahiran.data.map((item) => (
                                    <tr
                                        className="hover:bg-muted/30"
                                        key={item.id}
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {item.nama_bayi}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${genderBadge(
                                                    item.jenis_kelamin,
                                                )}`}
                                            >
                                                {item.jenis_kelamin}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.tempat_lahir},{' '}
                                            {formatDate(item.tanggal_lahir)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.waktu_lahir?.slice(0, 5) ??
                                                '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {parentName(
                                                item.ayah,
                                                item.nama_ayah,
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {parentName(
                                                item.ibu,
                                                item.nama_ibu,
                                            )}
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
                                            {item.penduduk_id_bayi ? (
                                                <span className="inline-flex rounded-md border border-[#16A34A]/20 bg-[#16A34A]/10 px-2 py-1 text-xs font-medium text-[#166534]">
                                                    Sudah Masuk Penduduk
                                                </span>
                                            ) : (
                                                <span className="inline-flex rounded-md border border-[#F59E0B]/20 bg-[#F59E0B]/10 px-2 py-1 text-xs font-medium text-[#92400E]">
                                                    Belum Masuk Penduduk
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                {item.penduduk_id_bayi ? (
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        <Link
                                                            href={showPenduduk.url(
                                                                item.penduduk_id_bayi,
                                                            )}
                                                        >
                                                            Lihat Penduduk
                                                        </Link>
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick={() =>
                                                            setConvertTarget(
                                                                item,
                                                            )
                                                        }
                                                        size="sm"
                                                        type="button"
                                                        variant="outline"
                                                    >
                                                        <UserPlus />
                                                        Jadikan Penduduk
                                                    </Button>
                                                )}
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
                                {kelahiran.data.length === 0 && (
                                    <tr>
                                        <td
                                            className="px-4 py-12 text-center"
                                            colSpan={9}
                                        >
                                            <div className="mx-auto flex max-w-sm flex-col items-center gap-3 text-muted-foreground">
                                                <Baby className="size-10 text-primary" />
                                                <div>
                                                    <p className="font-medium text-foreground">
                                                        Belum ada data kelahiran
                                                    </p>
                                                    <p className="mt-1 text-sm">
                                                        Tambahkan catatan
                                                        kelahiran pertama untuk
                                                        mulai mengelola modul
                                                        ini.
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
                            Menampilkan {kelahiran.from ?? 0}-
                            {kelahiran.to ?? 0} dari {kelahiran.total} data
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {kelahiran.links.map((link) => (
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
                        <DialogTitle>Hapus data kelahiran?</DialogTitle>
                        <DialogDescription>
                            Data kelahiran {deleteTarget?.nama_bayi} akan
                            dihapus menggunakan soft delete.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            onClick={() => setDeleteTarget(null)}
                            variant="outline"
                        >
                            Batal
                        </Button>
                        <Button onClick={deleteKelahiran} variant="destructive">
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={Boolean(convertTarget)}
                onOpenChange={(open) => !open && setConvertTarget(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Jadikan bayi sebagai penduduk?</DialogTitle>
                        <DialogDescription>
                            Sistem akan membuat data penduduk aktif untuk{' '}
                            {convertTarget?.nama_bayi} dan tetap menyimpan
                            catatan kelahiran sebagai riwayat peristiwa.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            onClick={() => setConvertTarget(null)}
                            variant="outline"
                        >
                            Batal
                        </Button>
                        <Button onClick={createPendudukBayi}>
                            Jadikan Penduduk
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

KelahiranIndex.layout = {
    breadcrumbs: moduleBreadcrumbs('Kelahiran', index()),
};
