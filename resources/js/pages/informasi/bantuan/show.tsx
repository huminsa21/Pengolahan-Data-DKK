import { Link } from '@inertiajs/react';
import { bantuanIndex } from '@/actions/App/Http/Controllers/InformasiController';
import { Button } from '@/components/ui/button';
import { PublicLayout } from '../layout';
import type { PublicBantuan } from '../types';

function formatDate(value: string | null): string {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(value));
}

function maskNik(value: string | null): string {
    if (!value) {
        return 'NIK belum tersedia';
    }

    if (value.length <= 8) {
        return '********';
    }

    return `${value.slice(0, 4)}********${value.slice(-4)}`;
}

export default function InformasiBantuanShow({
    bantuan,
}: {
    bantuan: PublicBantuan;
}) {
    return (
        <PublicLayout title={bantuan.nama_bantuan}>
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-emerald-700">
                    Detail Bantuan
                </p>
                <h1 className="mt-2 max-w-4xl text-3xl font-semibold text-slate-950">
                    {bantuan.nama_bantuan}
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                    {[
                        bantuan.jenis_bantuan,
                        bantuan.sumber_bantuan,
                        bantuan.tahun ?? '-',
                    ].join(' · ')}
                </p>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
                    {bantuan.deskripsi ?? 'Tidak ada deskripsi.'}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                    <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                        Dipublikasikan {formatDate(bantuan.published_at)}
                    </span>
                    <span className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
                        {bantuan.penerima_bantuan_count ?? 0} penerima
                    </span>
                </div>
                <Button asChild className="mt-5" variant="outline">
                    <Link href={bantuanIndex.url()}>Kembali</Link>
                </Button>
            </section>

            {bantuan.tampilkan_penerima && (
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-6">
                        <h2 className="text-lg font-semibold">
                            Daftar Penerima
                        </h2>
                        <p className="mt-1 text-sm text-slate-600">
                            NIK ditampilkan dalam bentuk masking untuk menjaga
                            privasi warga.
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 uppercase">
                                <tr>
                                    <th className="px-4 py-3">Nama Penduduk</th>
                                    <th className="px-4 py-3">NIK</th>
                                    <th className="px-4 py-3">Dusun</th>
                                    <th className="px-4 py-3">RT/RW</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {(bantuan.penerima_bantuan ?? []).map(
                                    (item) => (
                                        <tr
                                            className="transition hover:bg-slate-50"
                                            key={item.id}
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                {item.penduduk.nama_lengkap}
                                            </td>
                                            <td className="px-4 py-3">
                                                {maskNik(item.penduduk.nik)}
                                            </td>
                                            <td className="px-4 py-3">
                                                {item.penduduk.wilayah_dusun
                                                    ?.nama_dusun ??
                                                    item.penduduk.dusun}
                                            </td>
                                            <td className="px-4 py-3">
                                                {item.penduduk.rt}/
                                                {item.penduduk.rw}
                                            </td>
                                            <td className="px-4 py-3">
                                                {item.status}
                                            </td>
                                        </tr>
                                    ),
                                )}
                                {(bantuan.penerima_bantuan ?? []).length ===
                                    0 && (
                                    <tr>
                                        <td
                                            className="px-4 py-8 text-center text-slate-600"
                                            colSpan={5}
                                        >
                                            Daftar penerima belum tersedia.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
