import { Head, Link, router } from '@inertiajs/react';
import {
    Edit,
    Eye,
    KeyRound,
    Plus,
    Search,
    ShieldOff,
    UserCheck,
    UserX,
    X,
} from 'lucide-react';
import { useState, type FormEvent } from 'react';

import {
    create,
    createUser,
    destroy,
    disableUser,
    edit,
    index,
    resetPassword,
    show,
} from '@/actions/App/Http/Controllers/PerangkatDesaController';
import { moduleBreadcrumbs } from '@/components/module-page';
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
import { Label } from '@/components/ui/label';
import type {
    PaginatedPerangkatDesa,
    PerangkatDesa,
    PerangkatFilters,
    PerangkatOptions,
    PerangkatStats,
} from './types';

type ActionTarget = {
    type:
        'create-user' | 'reset-password' | 'disable-user' | 'disable-perangkat';
    item: PerangkatDesa;
} | null;

function formatDate(value?: string | null): string {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
}

function statusClass(status: string): string {
    return status === 'AKTIF'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
        : 'border-slate-200 bg-slate-50 text-slate-700';
}

function roleNames(item: PerangkatDesa): string {
    const roles = item.user?.roles ?? [];

    return (
        roles
            .map((role) => (typeof role === 'string' ? role : role.name))
            .join(', ') || '-'
    );
}

function actionCopy(action: NonNullable<ActionTarget>): {
    title: string;
    description: string;
    button: string;
} {
    const name = action.item.penduduk?.nama_lengkap ?? 'perangkat desa';

    if (action.type === 'create-user') {
        return {
            title: 'Buat akun login?',
            description: `Akun NIK untuk ${name} akan dibuat dengan password default: password.`,
            button: 'Buat Akun',
        };
    }

    if (action.type === 'reset-password') {
        return {
            title: 'Reset password?',
            description: `Password ${name} akan direset menjadi default: password.`,
            button: 'Reset Password',
        };
    }

    if (action.type === 'disable-user') {
        return {
            title: 'Nonaktifkan akun login?',
            description: `Akun login ${name} tidak bisa digunakan sampai diaktifkan kembali.`,
            button: 'Nonaktifkan Akun',
        };
    }

    return {
        title: 'Nonaktifkan perangkat desa?',
        description: `${name} akan berstatus NONAKTIF dan akun loginnya ikut dinonaktifkan.`,
        button: 'Nonaktifkan',
    };
}

export default function PerangkatDesaIndex({
    perangkatDesa,
    filters,
    options,
    stats,
}: {
    perangkatDesa: PaginatedPerangkatDesa;
    filters: PerangkatFilters;
    options: PerangkatOptions;
    stats: PerangkatStats;
}) {
    const [filterData, setFilterData] = useState<PerangkatFilters>(filters);
    const [actionTarget, setActionTarget] = useState<ActionTarget>(null);

    function submitFilters(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        router.get(index.url(), filterData, {
            preserveScroll: true,
            preserveState: true,
        });
    }

    function resetFilters() {
        const emptyFilters = { search: '', jabatan: '', status: '', akun: '' };
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

        const options = {
            preserveScroll: true,
            onFinish: () => setActionTarget(null),
        };

        if (actionTarget.type === 'disable-perangkat') {
            router.delete(destroy.url(actionTarget.item.id), options);
            return;
        }

        const route = {
            'create-user': createUser,
            'reset-password': resetPassword,
            'disable-user': disableUser,
        }[actionTarget.type];

        router.post(route.url(actionTarget.item.id), {}, options);
    }

    const copy = actionTarget ? actionCopy(actionTarget) : null;

    return (
        <>
            <Head title="Perangkat Desa" />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Pengaturan
                        </p>
                        <h1 className="text-2xl font-semibold">
                            Perangkat Desa
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Kelola jabatan perangkat desa, akun login NIK, dan
                            status akses aplikasi.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create.url()}>
                            <Plus />
                            Tambah Perangkat
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    {[
                        ['Total', stats.total],
                        ['Aktif', stats.aktif],
                        ['Nonaktif', stats.nonaktif],
                        ['Punya Akun', stats.punya_akun],
                    ].map(([label, value]) => (
                        <div
                            className="rounded-lg border bg-card p-4 shadow-sm"
                            key={label}
                        >
                            <p className="text-sm text-muted-foreground">
                                {label}
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-primary">
                                {value}
                            </p>
                        </div>
                    ))}
                </div>

                <form
                    className="rounded-lg border bg-card p-4 shadow-sm"
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
                                    placeholder="Nama, NIK, jabatan, nomor SK"
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
                            <Label>Jabatan</Label>
                            <select
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                value={filterData.jabatan}
                                onChange={(event) =>
                                    setFilterData({
                                        ...filterData,
                                        jabatan: event.target.value,
                                    })
                                }
                            >
                                <option value="">Semua</option>
                                {options.jabatan.map((jabatan) => (
                                    <option key={jabatan} value={jabatan}>
                                        {jabatan}
                                    </option>
                                ))}
                            </select>
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
                            <Label>Akun Login</Label>
                            <select
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                value={filterData.akun}
                                onChange={(event) =>
                                    setFilterData({
                                        ...filterData,
                                        akun: event.target.value,
                                    })
                                }
                            >
                                <option value="">Semua</option>
                                <option value="ada">Sudah ada akun</option>
                                <option value="belum">Belum ada akun</option>
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

                <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1160px] text-left text-sm">
                            <thead className="border-b bg-muted/50 text-xs text-muted-foreground uppercase">
                                <tr>
                                    <th className="px-4 py-3">Nama</th>
                                    <th className="px-4 py-3">NIK</th>
                                    <th className="px-4 py-3">Jabatan</th>
                                    <th className="px-4 py-3">Nomor SK</th>
                                    <th className="px-4 py-3">Mulai</th>
                                    <th className="px-4 py-3">Selesai</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Akun</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {perangkatDesa.data.map((item) => (
                                    <tr
                                        className="hover:bg-muted/30"
                                        key={item.id}
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {item.penduduk?.nama_lengkap ?? '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.penduduk?.nik ?? '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.jabatan}
                                        </td>
                                        <td className="px-4 py-3">
                                            {item.nomor_sk ?? '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {formatDate(item.tanggal_mulai)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {formatDate(item.tanggal_selesai)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                className={statusClass(
                                                    item.status,
                                                )}
                                                variant="outline"
                                            >
                                                {item.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                className={
                                                    item.user
                                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                        : 'border-amber-200 bg-amber-50 text-amber-700'
                                                }
                                                variant="outline"
                                            >
                                                {item.user
                                                    ? 'Sudah Ada Akun'
                                                    : 'Belum Ada Akun'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            {roleNames(item)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-1">
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
                                                {!item.user &&
                                                    item.status === 'AKTIF' && (
                                                        <Button
                                                            onClick={() =>
                                                                setActionTarget(
                                                                    {
                                                                        type: 'create-user',
                                                                        item,
                                                                    },
                                                                )
                                                            }
                                                            size="icon"
                                                            type="button"
                                                            variant="ghost"
                                                        >
                                                            <UserCheck />
                                                        </Button>
                                                    )}
                                                {item.user && (
                                                    <>
                                                        <Button
                                                            onClick={() =>
                                                                setActionTarget(
                                                                    {
                                                                        type: 'reset-password',
                                                                        item,
                                                                    },
                                                                )
                                                            }
                                                            size="icon"
                                                            type="button"
                                                            variant="ghost"
                                                        >
                                                            <KeyRound />
                                                        </Button>
                                                        <Button
                                                            onClick={() =>
                                                                setActionTarget(
                                                                    {
                                                                        type: 'disable-user',
                                                                        item,
                                                                    },
                                                                )
                                                            }
                                                            size="icon"
                                                            type="button"
                                                            variant="ghost"
                                                        >
                                                            <ShieldOff />
                                                        </Button>
                                                    </>
                                                )}
                                                {item.status === 'AKTIF' && (
                                                    <Button
                                                        onClick={() =>
                                                            setActionTarget({
                                                                type: 'disable-perangkat',
                                                                item,
                                                            })
                                                        }
                                                        size="icon"
                                                        type="button"
                                                        variant="ghost"
                                                    >
                                                        <UserX className="text-destructive" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {perangkatDesa.data.length === 0 && (
                                    <tr>
                                        <td
                                            className="px-4 py-10 text-center text-muted-foreground"
                                            colSpan={10}
                                        >
                                            Tidak ada perangkat desa yang cocok.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            Menampilkan {perangkatDesa.from ?? 0}-
                            {perangkatDesa.to ?? 0} dari {perangkatDesa.total}{' '}
                            data
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {perangkatDesa.links.map((link) => (
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
                        <DialogTitle>{copy?.title}</DialogTitle>
                        <DialogDescription>
                            {copy?.description}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            onClick={() => setActionTarget(null)}
                            variant="outline"
                        >
                            Batal
                        </Button>
                        <Button onClick={runAction}>{copy?.button}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

PerangkatDesaIndex.layout = {
    breadcrumbs: moduleBreadcrumbs('Perangkat Desa', index()),
};
