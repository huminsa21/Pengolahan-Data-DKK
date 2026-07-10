import { Head, Link, router } from '@inertiajs/react';
import {
    Ban,
    Download,
    Eye,
    FileCheck2,
    Pencil,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
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
import {
    cancel,
    complete,
    create,
    destroy,
    download,
    edit,
    index,
    preview,
    show,
} from '@/routes/surat';
import type { JenisSurat } from '../jenis-surat/types';
import type { PaginatedSurat, Surat } from './types';

type Action = 'complete' | 'cancel' | 'delete';

export default function SuratIndex({
    surat,
    filters,
    options,
    stats,
}: {
    surat: PaginatedSurat;
    filters: {
        search: string;
        jenis_surat_id: string;
        status: string;
        tanggal_dari: string;
        tanggal_sampai: string;
    };
    options: { jenisSurat: JenisSurat[]; status: string[] };
    stats: {
        total: number;
        draft: number;
        selesai: number;
        dibatalkan: number;
        bulan_ini: number;
    };
}) {
    const [filterData, setFilterData] = useState(filters);
    const [confirm, setConfirm] = useState<{
        action: Action;
        surat: Surat;
    } | null>(null);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        router.get(index.url(), filterData, { preserveState: true });
    }

    function runAction() {
        if (!confirm) {
            return;
        }

        const callbacks = {
            preserveScroll: true,
            onFinish: () => setConfirm(null),
        };

        if (confirm.action === 'complete') {
            router.post(complete.url(confirm.surat.id), {}, callbacks);
        }

        if (confirm.action === 'cancel') {
            router.post(cancel.url(confirm.surat.id), {}, callbacks);
        }

        if (confirm.action === 'delete') {
            router.delete(destroy.url(confirm.surat.id), callbacks);
        }
    }

    return (
        <>
            <Head title="Surat" />
            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
                <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Layanan Surat
                        </p>
                        <h1 className="text-2xl font-semibold">Surat</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Buat, selesaikan, preview, dan cetak surat desa.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create.url()}>
                            <Plus />
                            Buat Surat
                        </Link>
                    </Button>
                </section>

                <section className="grid gap-4 md:grid-cols-5">
                    {[
                        ['Total Surat', stats.total],
                        ['Draft', stats.draft],
                        ['Selesai', stats.selesai],
                        ['Dibatalkan', stats.dibatalkan],
                        ['Bulan Ini', stats.bulan_ini],
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
                    <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_0.8fr_0.8fr_0.8fr_auto]">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                className="pl-9"
                                placeholder="Nomor, NIK, nama, jenis, keperluan"
                                value={filterData.search}
                                onChange={(event) =>
                                    setFilterData({
                                        ...filterData,
                                        search: event.target.value,
                                    })
                                }
                            />
                        </div>
                        <select
                            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                            value={filterData.jenis_surat_id}
                            onChange={(event) =>
                                setFilterData({
                                    ...filterData,
                                    jenis_surat_id: event.target.value,
                                })
                            }
                        >
                            <option value="">Semua jenis</option>
                            {options.jenisSurat.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.kode_surat}
                                </option>
                            ))}
                        </select>
                        <select
                            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                            value={filterData.status}
                            onChange={(event) =>
                                setFilterData({
                                    ...filterData,
                                    status: event.target.value,
                                })
                            }
                        >
                            <option value="">Semua status</option>
                            {options.status.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                        <Input
                            type="date"
                            value={filterData.tanggal_dari}
                            onChange={(event) =>
                                setFilterData({
                                    ...filterData,
                                    tanggal_dari: event.target.value,
                                })
                            }
                        />
                        <Input
                            type="date"
                            value={filterData.tanggal_sampai}
                            onChange={(event) =>
                                setFilterData({
                                    ...filterData,
                                    tanggal_sampai: event.target.value,
                                })
                            }
                        />
                        <Button type="submit">Filter</Button>
                    </div>
                </form>

                <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/50 text-left">
                                <tr>
                                    <th className="px-4 py-3">Nomor</th>
                                    <th className="px-4 py-3">Jenis</th>
                                    <th className="px-4 py-3">Penduduk</th>
                                    <th className="px-4 py-3">Tanggal</th>
                                    <th className="px-4 py-3">Keperluan</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Dibuat Oleh</th>
                                    <th className="px-4 py-3 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {surat.data.map((item) => (
                                    <tr className="border-b" key={item.id}>
                                        <td className="px-4 py-3 font-medium">
                                            {item.nomor_surat ?? 'Draft'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.jenis_surat?.kode_surat}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.penduduk
                                                ? `${item.penduduk.nik} - ${item.penduduk.nama_lengkap}`
                                                : '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.tanggal_surat?.slice(0, 10)}
                                        </td>
                                        <td className="max-w-48 truncate px-4 py-3">
                                            {item.keperluan ?? '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={item.status} />
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.pembuat?.name ?? '-'}
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
                                                {item.status === 'DRAFT' && (
                                                    <Button
                                                        asChild
                                                        size="icon"
                                                        variant="outline"
                                                    >
                                                        <Link
                                                            href={edit.url(
                                                                item.id,
                                                            )}
                                                        >
                                                            <Pencil />
                                                        </Link>
                                                    </Button>
                                                )}
                                                {item.status === 'DRAFT' && (
                                                    <Button
                                                        size="icon"
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            setConfirm({
                                                                action: 'complete',
                                                                surat: item,
                                                            })
                                                        }
                                                    >
                                                        <FileCheck2 />
                                                    </Button>
                                                )}
                                                {item.status === 'DRAFT' && (
                                                    <Button
                                                        size="icon"
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            setConfirm({
                                                                action: 'cancel',
                                                                surat: item,
                                                            })
                                                        }
                                                    >
                                                        <Ban />
                                                    </Button>
                                                )}
                                                <Button
                                                    asChild
                                                    size="icon"
                                                    variant="outline"
                                                >
                                                    <a
                                                        href={preview.url(
                                                            item.id,
                                                        )}
                                                        target="_blank"
                                                    >
                                                        <Eye />
                                                    </a>
                                                </Button>
                                                {item.status === 'SELESAI' && (
                                                    <Button
                                                        asChild
                                                        size="icon"
                                                        variant="outline"
                                                    >
                                                        <a
                                                            href={download.url(
                                                                item.id,
                                                            )}
                                                        >
                                                            <Download />
                                                        </a>
                                                    </Button>
                                                )}
                                                {item.status === 'DRAFT' && (
                                                    <Button
                                                        size="icon"
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() =>
                                                            setConfirm({
                                                                action: 'delete',
                                                                surat: item,
                                                            })
                                                        }
                                                    >
                                                        <Trash2 />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {surat.data.length === 0 && (
                                    <tr>
                                        <td
                                            className="px-4 py-8 text-center text-muted-foreground"
                                            colSpan={8}
                                        >
                                            Belum ada surat.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className="flex flex-wrap gap-2">
                    {surat.links.map((link, indexLink) => (
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

            <Dialog open={Boolean(confirm)} onOpenChange={() => setConfirm(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi aksi surat</DialogTitle>
                        <DialogDescription>
                            Aksi ini akan memproses surat yang dipilih.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setConfirm(null)}
                        >
                            Batal
                        </Button>
                        <Button type="button" onClick={runAction}>
                            Lanjutkan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export function StatusBadge({ status }: { status: Surat['status'] }) {
    const className =
        status === 'SELESAI'
            ? 'bg-[#16A34A] text-white'
            : status === 'DIBATALKAN'
              ? 'bg-[#DC2626] text-white'
              : '';

    return (
        <Badge className={className} variant={status === 'DRAFT' ? 'secondary' : 'default'}>
            {status}
        </Badge>
    );
}
