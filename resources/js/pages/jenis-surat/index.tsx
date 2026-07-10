import { Head, Link, router } from '@inertiajs/react';
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
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
import { create, destroy, edit, index, show } from '@/routes/jenis-surat';
import type { JenisSurat, Paginated } from './types';

export default function JenisSuratIndex({
    jenisSurat,
    filters,
    stats,
}: {
    jenisSurat: Paginated<JenisSurat>;
    filters: { search: string };
    stats: { total: number; aktif: number; nonaktif: number };
}) {
    const [search, setSearch] = useState(filters.search);
    const [selected, setSelected] = useState<JenisSurat | null>(null);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        router.get(index.url(), { search }, { preserveState: true });
    }

    function remove() {
        if (!selected) {
            return;
        }

        router.delete(destroy.url(selected.id), {
            preserveScroll: true,
            onFinish: () => setSelected(null),
        });
    }

    return (
        <>
            <Head title="Jenis Surat" />
            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
                <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Master Surat
                        </p>
                        <h1 className="text-2xl font-semibold">
                            Jenis Surat
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola template dasar surat desa.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create.url()}>
                            <Plus />
                            Tambah Jenis Surat
                        </Link>
                    </Button>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    {[
                        ['Total', stats.total],
                        ['Aktif', stats.aktif],
                        ['Nonaktif', stats.nonaktif],
                    ].map(([label, value]) => (
                        <div
                            className="rounded-lg border border-border bg-card p-4 shadow-sm"
                            key={label}
                        >
                            <p className="text-sm text-muted-foreground">
                                {label}
                            </p>
                            <p className="mt-2 text-2xl font-semibold">
                                {value}
                            </p>
                        </div>
                    ))}
                </section>

                <form
                    className="rounded-lg border border-border bg-card p-4 shadow-sm"
                    onSubmit={submit}
                >
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            className="pl-9"
                            placeholder="Cari kode atau nama surat"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>
                </form>

                <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/50 text-left">
                                <tr>
                                    <th className="px-4 py-3">Kode</th>
                                    <th className="px-4 py-3">Nama Surat</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Dipakai</th>
                                    <th className="px-4 py-3 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {jenisSurat.data.map((item) => (
                                    <tr className="border-b" key={item.id}>
                                        <td className="px-4 py-3 font-medium">
                                            {item.kode_surat}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.nama_surat}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                variant={
                                                    item.is_active
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {item.is_active
                                                    ? 'Aktif'
                                                    : 'Nonaktif'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.surat_count ?? 0} surat
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    asChild
                                                    size="icon"
                                                    variant="outline"
                                                >
                                                    <Link href={show.url(item.id)}>
                                                        <Eye />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    asChild
                                                    size="icon"
                                                    variant="outline"
                                                >
                                                    <Link href={edit.url(item.id)}>
                                                        <Pencil />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    disabled={
                                                        (item.surat_count ?? 0) >
                                                        0
                                                    }
                                                    size="icon"
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() =>
                                                        setSelected(item)
                                                    }
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {jenisSurat.data.length === 0 && (
                                    <tr>
                                        <td
                                            className="px-4 py-8 text-center text-muted-foreground"
                                            colSpan={5}
                                        >
                                            Belum ada jenis surat.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className="flex flex-wrap gap-2">
                    {jenisSurat.links.map((link, indexLink) => (
                        <Button
                            asChild={Boolean(link.url)}
                            disabled={!link.url}
                            key={`${link.label}-${indexLink}`}
                            size="sm"
                            variant={link.active ? 'default' : 'outline'}
                        >
                            {link.url ? (
                                <Link
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                    href={link.url}
                                />
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

            <Dialog open={Boolean(selected)} onOpenChange={() => setSelected(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus jenis surat?</DialogTitle>
                        <DialogDescription>
                            Jenis surat yang belum digunakan akan dihapus dari
                            master data.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setSelected(null)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={remove}
                        >
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
