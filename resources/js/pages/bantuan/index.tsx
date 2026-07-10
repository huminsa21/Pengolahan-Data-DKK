import { Head, Link, router } from '@inertiajs/react';
import {
    Edit,
    Eye,
    Megaphone,
    Plus,
    Search,
    Trash2,
    Users,
    X,
} from 'lucide-react';
import { useState, type FormEvent } from 'react';
import {
    create,
    destroy,
    edit,
    index,
    publish,
    show,
    unpublish,
} from '@/actions/App/Http/Controllers/BantuanController';
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
    BantuanFilters,
    BantuanStats,
    PaginatedBantuan,
} from './types';

type BantuanIndexProps = {
    bantuan: PaginatedBantuan;
    filters: BantuanFilters;
    filterOptions: {
        tahun: number[];
    };
    stats: BantuanStats;
};

const statCards: {
    key: keyof BantuanStats;
    label: string;
    className: string;
}[] = [
    { key: 'total', label: 'Total Bantuan', className: 'text-primary' },
    { key: 'aktif', label: 'Aktif', className: 'text-[#16A34A]' },
    { key: 'nonaktif', label: 'Nonaktif', className: 'text-[#DC2626]' },
    {
        key: 'dipublikasikan',
        label: 'Dipublikasikan',
        className: 'text-[#2E7D32]',
    },
    {
        key: 'total_penerima',
        label: 'Total Penerima',
        className: 'text-[#F9A826]',
    },
];

function statusBadge(status: string): string {
    return status === 'AKTIF'
        ? 'border-[#16A34A]/20 bg-[#16A34A]/10 text-[#166534]'
        : 'border-[#DC2626]/20 bg-[#DC2626]/10 text-[#DC2626]';
}

function publishBadge(isPublished: boolean): string {
    return isPublished
        ? 'border-[#16A34A]/20 bg-[#16A34A]/10 text-[#166534]'
        : 'border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#92400E]';
}

export default function BantuanIndex({
    bantuan,
    filters,
    filterOptions,
    stats,
}: BantuanIndexProps) {
    const [filterData, setFilterData] = useState<BantuanFilters>(filters);
    const [actionTarget, setActionTarget] = useState<{
        type: 'publish' | 'unpublish' | 'delete';
        item: Bantuan;
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
            tahun: '',
            is_published: '',
        };

        setFilterData(emptyFilters);
        router.get(index.url(), emptyFilters, {
            preserveScroll: true,
            preserveState: true,
        });
    }

    function runAction() {
        if (!actionTarget) {
            return;
        }

        if (actionTarget.type === 'delete') {
            router.delete(destroy.url(actionTarget.item.id), {
                preserveScroll: true,
                onFinish: () => setActionTarget(null),
            });

            return;
        }

        router.post(
            actionTarget.type === 'publish'
                ? publish.url(actionTarget.item.id)
                : unpublish.url(actionTarget.item.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setActionTarget(null),
            },
        );
    }

    return (
        <>
            <Head title="Bantuan" />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Layanan Desa
                        </p>
                        <h1 className="text-2xl font-semibold">
                            Program Bantuan
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola master program bantuan, penerima, dan
                            publikasi informasi bantuan desa.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create.url()}>
                            <Plus />
                            Tambah Bantuan
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
                    <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
                        <div className="space-y-2">
                            <Label htmlFor="search">Search</Label>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    id="search"
                                    placeholder="Kode, nama, jenis, sumber, tahun"
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
                                <option value="AKTIF">AKTIF</option>
                                <option value="NONAKTIF">NONAKTIF</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Tahun</Label>
                            <select
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                value={filterData.tahun}
                                onChange={(event) =>
                                    setFilterData({
                                        ...filterData,
                                        tahun: event.target.value,
                                    })
                                }
                            >
                                <option value="">Semua</option>
                                {filterOptions.tahun.map((tahun) => (
                                    <option key={tahun} value={tahun}>
                                        {tahun}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Publikasi</Label>
                            <select
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                value={filterData.is_published}
                                onChange={(event) =>
                                    setFilterData({
                                        ...filterData,
                                        is_published: event.target.value,
                                    })
                                }
                            >
                                <option value="">Semua</option>
                                <option value="1">Published</option>
                                <option value="0">Draft</option>
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
                        <table className="w-full min-w-[1180px] text-left text-sm">
                            <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground uppercase">
                                <tr>
                                    <th className="px-4 py-3">Kode</th>
                                    <th className="px-4 py-3">Nama Bantuan</th>
                                    <th className="px-4 py-3">Jenis</th>
                                    <th className="px-4 py-3">Sumber</th>
                                    <th className="px-4 py-3">Tahun</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Publikasi</th>
                                    <th className="px-4 py-3">
                                        Jumlah Penerima
                                    </th>
                                    <th className="px-4 py-3 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {bantuan.data.map((item) => (
                                    <tr
                                        className="hover:bg-muted/30"
                                        key={item.id}
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {item.kode_bantuan}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.nama_bantuan}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.jenis_bantuan}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.sumber_bantuan}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.tahun ?? '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${statusBadge(item.status)}`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${publishBadge(item.is_published)}`}
                                            >
                                                {item.is_published
                                                    ? 'Published'
                                                    : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.penerima_bantuan_count ?? 0}
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
                                                        href={show.url(item.id)}
                                                    >
                                                        <Users />
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
                                                        setActionTarget({
                                                            type: item.is_published
                                                                ? 'unpublish'
                                                                : 'publish',
                                                            item,
                                                        })
                                                    }
                                                    size="icon"
                                                    type="button"
                                                    variant="ghost"
                                                >
                                                    <Megaphone
                                                        className={
                                                            item.is_published
                                                                ? 'text-[#F59E0B]'
                                                                : 'text-[#16A34A]'
                                                        }
                                                    />
                                                </Button>
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
                                {bantuan.data.length === 0 && (
                                    <tr>
                                        <td
                                            className="px-4 py-10 text-center text-muted-foreground"
                                            colSpan={9}
                                        >
                                            Tidak ada program bantuan yang
                                            cocok.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-border px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            Menampilkan {bantuan.from ?? 0}-{bantuan.to ?? 0}{' '}
                            dari {bantuan.total} data
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {bantuan.links.map((link) => (
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
                            {actionTarget?.type === 'publish' &&
                                'Publikasikan bantuan?'}
                            {actionTarget?.type === 'unpublish' &&
                                'Tarik publikasi bantuan?'}
                            {actionTarget?.type === 'delete' &&
                                'Hapus program bantuan?'}
                        </DialogTitle>
                        <DialogDescription>
                            {actionTarget?.type === 'publish' &&
                                `${actionTarget.item.nama_bantuan} akan dibuatkan pengumuman dan tampil di halaman publik.`}
                            {actionTarget?.type === 'unpublish' &&
                                `${actionTarget.item.nama_bantuan} tidak akan tampil di halaman publik.`}
                            {actionTarget?.type === 'delete' &&
                                `${actionTarget.item.nama_bantuan} akan dihapus menggunakan soft delete.`}
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

BantuanIndex.layout = {
    breadcrumbs: moduleBreadcrumbs('Bantuan', index()),
};
