import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, MapPinned, Plus, Search, Trash2, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import {
    create,
    destroy,
    edit,
    index,
    show,
} from '@/actions/App/Http/Controllers/DusunController';
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
import type { Dusun, DusunFilters, DusunStats, PaginatedDusun } from './types';

type DusunIndexProps = {
    dusun: PaginatedDusun;
    filters: DusunFilters;
    stats: DusunStats;
};

export default function DusunIndex({ dusun, filters, stats }: DusunIndexProps) {
    const [filterData, setFilterData] = useState<DusunFilters>(filters);
    const [deleteTarget, setDeleteTarget] = useState<Dusun | null>(null);

    function submitFilters(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        router.get(index.url(), filterData, {
            preserveScroll: true,
            preserveState: true,
        });
    }

    function resetFilters() {
        const emptyFilters = { search: '' };

        setFilterData(emptyFilters);

        router.get(index.url(), emptyFilters, {
            preserveScroll: true,
            preserveState: true,
        });
    }

    function deleteDusun() {
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
            <Head title="Master Dusun" />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Master Data
                        </p>
                        <h1 className="text-2xl font-semibold">Dusun</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola struktur wilayah dusun untuk data penduduk.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create.url()}>
                            <Plus />
                            Tambah Dusun
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                        <p className="text-sm text-muted-foreground">
                            Total Dusun
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-primary">
                            {stats.total}
                        </p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                        <p className="text-sm text-muted-foreground">Aktif</p>
                        <p className="mt-2 text-2xl font-semibold text-[#16A34A]">
                            {stats.aktif}
                        </p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
                        <p className="text-sm text-muted-foreground">
                            Nonaktif
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-[#F59E0B]">
                            {stats.nonaktif}
                        </p>
                    </div>
                </div>

                <form
                    className="rounded-lg border border-border bg-card p-4 shadow-sm"
                    onSubmit={submitFilters}
                >
                    <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                        <div className="space-y-2">
                            <Label htmlFor="search">Search</Label>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    id="search"
                                    placeholder="Kode, nama, kepala dusun"
                                    value={filterData.search}
                                    onChange={(event) =>
                                        setFilterData({
                                            search: event.target.value,
                                        })
                                    }
                                />
                            </div>
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
                        <table className="w-full min-w-[760px] text-left text-sm">
                            <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground uppercase">
                                <tr>
                                    <th className="px-4 py-3">Kode Dusun</th>
                                    <th className="px-4 py-3">Nama Dusun</th>
                                    <th className="px-4 py-3">Kepala Dusun</th>
                                    <th className="px-4 py-3">No HP</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {dusun.data.map((item) => (
                                    <tr
                                        className="hover:bg-muted/30"
                                        key={item.id}
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {item.kode_dusun ?? '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.nama_dusun}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.kepala_dusun ?? '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.no_hp_kepala_dusun ?? '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${
                                                    item.is_active
                                                        ? 'border-[#16A34A]/20 bg-[#16A34A]/10 text-[#16A34A]'
                                                        : 'border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#B45309]'
                                                }`}
                                            >
                                                {item.is_active
                                                    ? 'Aktif'
                                                    : 'Nonaktif'}
                                            </span>
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
                                {dusun.data.length === 0 && (
                                    <tr>
                                        <td
                                            className="px-4 py-12 text-center"
                                            colSpan={6}
                                        >
                                            <div className="mx-auto flex max-w-sm flex-col items-center gap-3 text-muted-foreground">
                                                <MapPinned className="size-10 text-primary" />
                                                <div>
                                                    <p className="font-medium text-foreground">
                                                        Belum ada data dusun
                                                    </p>
                                                    <p className="mt-1 text-sm">
                                                        Tambahkan dusun untuk
                                                        mulai menata wilayah
                                                        penduduk.
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
                            Menampilkan {dusun.from ?? 0}-{dusun.to ?? 0} dari{' '}
                            {dusun.total} data
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {dusun.links.map((link) => (
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
                        <DialogTitle>Hapus data dusun?</DialogTitle>
                        <DialogDescription>
                            Data {deleteTarget?.nama_dusun} akan dihapus
                            menggunakan soft delete. Data penduduk tetap aman
                            dan relasinya menjadi kosong.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            onClick={() => setDeleteTarget(null)}
                            variant="outline"
                        >
                            Batal
                        </Button>
                        <Button onClick={deleteDusun} variant="destructive">
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

DusunIndex.layout = {
    breadcrumbs: moduleBreadcrumbs('Dusun', index()),
};
