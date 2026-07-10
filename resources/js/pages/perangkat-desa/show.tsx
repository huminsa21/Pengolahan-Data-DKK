import { Head, Link } from '@inertiajs/react';

import { moduleBreadcrumbs } from '@/components/module-page';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    edit,
    index,
} from '@/actions/App/Http/Controllers/PerangkatDesaController';
import type { PerangkatDesa } from './types';

function formatDate(value?: string | null, withTime = false): string {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    }).format(new Date(value));
}

function roleNames(perangkatDesa: PerangkatDesa): string {
    const roles = perangkatDesa.user?.roles ?? [];

    return (
        roles
            .map((role) => (typeof role === 'string' ? role : role.name))
            .join(', ') || '-'
    );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
    return (
        <div className="grid gap-1 rounded-md border bg-background px-4 py-3">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="text-sm font-medium">{value || '-'}</p>
        </div>
    );
}

export default function PerangkatDesaShow({
    perangkatDesa,
}: {
    perangkatDesa: PerangkatDesa;
}) {
    const penduduk = perangkatDesa.penduduk;
    const user = perangkatDesa.user;

    return (
        <>
            <Head title="Detail Perangkat Desa" />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Pengaturan
                        </p>
                        <h1 className="text-2xl font-semibold">
                            Detail Perangkat Desa
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {penduduk?.nama_lengkap ?? '-'} sebagai{' '}
                            {perangkatDesa.jabatan}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href={index.url()}>Kembali</Link>
                        </Button>
                        <Button asChild>
                            <Link href={edit.url(perangkatDesa.id)}>Edit</Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <section className="rounded-lg border bg-card p-5 shadow-sm lg:col-span-2">
                        <h2 className="text-base font-semibold">
                            Data Penduduk
                        </h2>
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                            <InfoRow
                                label="Nama"
                                value={penduduk?.nama_lengkap}
                            />
                            <InfoRow label="NIK" value={penduduk?.nik} />
                            <InfoRow
                                label="Dusun"
                                value={
                                    penduduk?.wilayah_dusun?.nama_dusun ??
                                    penduduk?.dusun
                                }
                            />
                            <InfoRow label="No HP" value={penduduk?.no_hp} />
                            <InfoRow label="Alamat" value={penduduk?.alamat} />
                        </div>
                    </section>

                    <section className="rounded-lg border bg-card p-5 shadow-sm">
                        <h2 className="text-base font-semibold">
                            Status Perangkat
                        </h2>
                        <div className="mt-4 space-y-3">
                            <Badge
                                className={
                                    perangkatDesa.status === 'AKTIF'
                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                        : 'border-slate-200 bg-slate-50 text-slate-700'
                                }
                                variant="outline"
                            >
                                {perangkatDesa.status}
                            </Badge>
                            <InfoRow
                                label="Jabatan"
                                value={perangkatDesa.jabatan}
                            />
                            <InfoRow
                                label="Nomor SK"
                                value={perangkatDesa.nomor_sk}
                            />
                            <InfoRow
                                label="Tanggal Mulai"
                                value={formatDate(perangkatDesa.tanggal_mulai)}
                            />
                            <InfoRow
                                label="Tanggal Selesai"
                                value={formatDate(
                                    perangkatDesa.tanggal_selesai,
                                )}
                            />
                        </div>
                    </section>
                </div>

                <section className="rounded-lg border bg-card p-5 shadow-sm">
                    <h2 className="text-base font-semibold">Akun Login</h2>
                    <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <InfoRow
                            label="Status Akun"
                            value={
                                user
                                    ? user.is_active
                                        ? 'Aktif'
                                        : 'Nonaktif'
                                    : 'Belum ada akun'
                            }
                        />
                        <InfoRow label="NIK Login" value={user?.nik} />
                        <InfoRow
                            label="Role"
                            value={roleNames(perangkatDesa)}
                        />
                        <InfoRow
                            label="Last Login"
                            value={formatDate(user?.last_login_at, true)}
                        />
                    </div>
                </section>
            </div>
        </>
    );
}

PerangkatDesaShow.layout = {
    breadcrumbs: moduleBreadcrumbs('Detail Perangkat Desa', index()),
};
