import { Head, Link, router } from '@inertiajs/react';
import {
    Archive,
    Edit,
    Eye,
    Megaphone,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useState, type FormEvent } from 'react';
import {
    archive,
    create,
    destroy,
    edit,
    index,
    publish,
    show,
} from '@/actions/App/Http/Controllers/PengumumanController';
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
    PaginatedPengumuman,
    Pengumuman,
    PengumumanFilters,
    PengumumanStats,
} from './types';

type PengumumanIndexProps = {
    pengumuman: PaginatedPengumuman;
    filters: PengumumanFilters;
    stats: PengumumanStats;
};

const statCards: {
    key: keyof PengumumanStats;
    label: string;
    className: string;
}[] = [
    { key: 'total', label: 'Total', className: 'text-primary' },
    { key: 'draft', label: 'Draft', className: 'text-[#F59E0B]' },
    { key: 'published', label: 'Published', className: 'text-[#16A34A]' },
    { key: 'archived', label: 'Archived', className: 'text-[#DC2626]' },
];

function statusBadge(status: string): string {
    if (status === 'PUBLISHED') {
        return 'border-[#16A34A]/20 bg-[#16A34A]/10 text-[#166534]';
    }

    if (status === 'ARCHIVED') {
        return 'border-[#DC2626]/20 bg-[#DC2626]/10 text-[#DC2626]';
    }

    return 'border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#92400E]';
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

export default function PengumumanIndex({
    pengumuman,
    filters,
    stats,
}: PengumumanIndexProps) {
    const [filterData, setFilterData] = useState<PengumumanFilters>(filters);
    const [actionTarget, setActionTarget] = useState<{
        type: 'publish' | 'archive' | 'delete';
        item: Pengumuman;
    } | null>(null);

    function submitFilters(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        router.get(index.url(), filterData, {
            preserveScroll: true,
            preserveState: true,
        });
    }

    function resetFilters() {
        const emptyFilters = { search: '', status: '' };
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
                : archive.url(actionTarget.item.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setActionTarget(null),
            },
        );
    }

    return (
        <>
            <Head title="Pengumuman" />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Informasi Desa
                        </p>
                        <h1 className="text-2xl font-semibold">Pengumuman</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola pengumuman publik desa, status publikasi, dan
                            arsip informasi.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create.url()}>
                            <Plus />
                            Tambah Pengumuman
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
                    <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_auto]">
                        <div className="space-y-2">
                            <Label htmlFor="search">Search</Label>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    id="search"
                                    placeholder="Judul atau isi pengumuman"
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
                                <option value="DRAFT">DRAFT</option>
                                <option value="PUBLISHED">PUBLISHED</option>
                                <option value="ARCHIVED">ARCHIVED</option>
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
                                    <th className="px-4 py-3">Judul</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">
                                        Tanggal Publish
                                    </th>
                                    <th className="px-4 py-3">Pembuat</th>
                                    <th className="px-4 py-3">
                                        Terkait Bantuan
                                    </th>
                                    <th className="px-4 py-3 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {pengumuman.data.map((item) => (
                                    <tr
                                        className="hover:bg-muted/30"
                                        key={item.id}
                                    >
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium">
                                                    {item.judul}
                                                </p>
                                                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                                                    {item.isi}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${statusBadge(item.status)}`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {formatDate(item.tanggal_publish)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.pembuat?.name ?? '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.bantuan_count ?? 0}
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
                                                {item.status !==
                                                    'PUBLISHED' && (
                                                    <Button
                                                        onClick={() =>
                                                            setActionTarget({
                                                                type: 'publish',
                                                                item,
                                                            })
                                                        }
                                                        size="icon"
                                                        type="button"
                                                        variant="ghost"
                                                    >
                                                        <Megaphone className="text-[#16A34A]" />
                                                    </Button>
                                                )}
                                                {item.status !== 'ARCHIVED' && (
                                                    <Button
                                                        onClick={() =>
                                                            setActionTarget({
                                                                type: 'archive',
                                                                item,
                                                            })
                                                        }
                                                        size="icon"
                                                        type="button"
                                                        variant="ghost"
                                                    >
                                                        <Archive className="text-[#F59E0B]" />
                                                    </Button>
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
                                {pengumuman.data.length === 0 && (
                                    <tr>
                                        <td
                                            className="px-4 py-10 text-center text-muted-foreground"
                                            colSpan={6}
                                        >
                                            Tidak ada pengumuman yang cocok.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-border px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            Menampilkan {pengumuman.from ?? 0}-
                            {pengumuman.to ?? 0} dari {pengumuman.total} data
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {pengumuman.links.map((link) => (
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
                                'Publikasikan pengumuman?'}
                            {actionTarget?.type === 'archive' &&
                                'Archive pengumuman?'}
                            {actionTarget?.type === 'delete' &&
                                'Hapus pengumuman?'}
                        </DialogTitle>
                        <DialogDescription>
                            {actionTarget?.type === 'publish' &&
                                `${actionTarget.item.judul} akan tampil di halaman publik.`}
                            {actionTarget?.type === 'archive' &&
                                `${actionTarget.item.judul} akan masuk arsip dan tidak tampil di halaman publik.`}
                            {actionTarget?.type === 'delete' &&
                                (actionTarget.item.bantuan_count
                                    ? `${actionTarget.item.judul} terkait bantuan, sistem akan menolak penghapusan dan menyarankan archive.`
                                    : `${actionTarget.item.judul} akan dihapus menggunakan soft delete.`)}
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

PengumumanIndex.layout = {
    breadcrumbs: moduleBreadcrumbs('Pengumuman', index()),
};
