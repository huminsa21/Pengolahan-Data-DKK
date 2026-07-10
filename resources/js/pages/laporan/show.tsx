import { Head, Link, router } from '@inertiajs/react';
import { Download, FileSpreadsheet, FileText, Search, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';

import { moduleBreadcrumbs } from '@/components/module-page';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    excel,
    index,
    pdf,
    show,
} from '@/actions/App/Http/Controllers/LaporanController';

type Column = {
    key: string;
    label: string;
};

type Filters = {
    date_from: string;
    date_to: string;
    dusun_id: string;
    status: string;
    search: string;
    jenis_surat_id: string;
};

type Report = {
    meta: {
        key: string;
        label: string;
        title: string;
        description: string;
        date_label: string;
        status_options: string[];
        search_placeholder: string;
    };
    filters: Filters;
    columns: Column[];
    rows: Array<Record<string, string | number | null>>;
    total: number;
};

type LaporanShowProps = {
    report: Report;
    filterOptions: {
        dusun: Array<{
            id: string;
            nama_dusun: string;
        }>;
        jenis_surat: Array<{
            id: string;
            nama_surat: string;
        }>;
    };
};

function cleanFilters(filters: Filters): Record<string, string> {
    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== ''),
    ) as Record<string, string>;
}

export default function LaporanShow({
    report,
    filterOptions,
}: LaporanShowProps) {
    const [filters, setFilters] = useState<Filters>(report.filters);
    const isSuratReport = report.meta.key === 'surat';

    function submitFilters(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        router.get(show.url(report.meta.key), cleanFilters(filters), {
            preserveScroll: true,
            preserveState: true,
        });
    }

    function resetFilters() {
        const emptyFilters: Filters = {
            date_from: '',
            date_to: '',
            dusun_id: '',
            status: '',
            search: '',
            jenis_surat_id: '',
        };

        setFilters(emptyFilters);
        router.get(
            show.url(report.meta.key),
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    }

    return (
        <>
            <Head title={report.meta.title} />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Laporan
                        </p>
                        <h1 className="text-2xl font-semibold">
                            {report.meta.title}
                        </h1>
                        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                            {report.meta.description}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline">
                            <Link href={index.url()}>Semua Laporan</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <a
                                href={pdf.url(report.meta.key, {
                                    query: cleanFilters(filters),
                                })}
                            >
                                <FileText />
                                Export PDF
                            </a>
                        </Button>
                        <Button asChild>
                            <a
                                href={excel.url(report.meta.key, {
                                    query: cleanFilters(filters),
                                })}
                            >
                                <FileSpreadsheet />
                                Export Excel
                            </a>
                        </Button>
                    </div>
                </div>

                <Card className="rounded-lg">
                    <CardHeader>
                        <CardTitle className="text-base">
                            Filter Laporan
                        </CardTitle>
                        <CardDescription>
                            Preview menampilkan 25 data pertama dari total{' '}
                            {report.total} data yang cocok.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="grid gap-4" onSubmit={submitFilters}>
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date_from">
                                        {report.meta.date_label} Mulai
                                    </Label>
                                    <Input
                                        id="date_from"
                                        type="date"
                                        value={filters.date_from}
                                        onChange={(event) =>
                                            setFilters({
                                                ...filters,
                                                date_from: event.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date_to">
                                        {report.meta.date_label} Sampai
                                    </Label>
                                    <Input
                                        id="date_to"
                                        type="date"
                                        value={filters.date_to}
                                        onChange={(event) =>
                                            setFilters({
                                                ...filters,
                                                date_to: event.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dusun_id">Dusun</Label>
                                    <select
                                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                        id="dusun_id"
                                        value={filters.dusun_id}
                                        onChange={(event) =>
                                            setFilters({
                                                ...filters,
                                                dusun_id: event.target.value,
                                            })
                                        }
                                    >
                                        <option value="">Semua dusun</option>
                                        {filterOptions.dusun.map((dusun) => (
                                            <option
                                                key={dusun.id}
                                                value={dusun.id}
                                            >
                                                {dusun.nama_dusun}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <select
                                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                        disabled={
                                            report.meta.status_options
                                                .length === 0
                                        }
                                        id="status"
                                        value={filters.status}
                                        onChange={(event) =>
                                            setFilters({
                                                ...filters,
                                                status: event.target.value,
                                            })
                                        }
                                    >
                                        <option value="">Semua status</option>
                                        {report.meta.status_options.map(
                                            (status) => (
                                                <option
                                                    key={status}
                                                    value={status}
                                                >
                                                    {status}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </div>
                            </div>

                            <div className="grid gap-4 lg:grid-cols-[1fr_260px_auto]">
                                <div className="space-y-2">
                                    <Label htmlFor="search">Search</Label>
                                    <div className="relative">
                                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            className="pl-9"
                                            id="search"
                                            placeholder={
                                                report.meta.search_placeholder
                                            }
                                            value={filters.search}
                                            onChange={(event) =>
                                                setFilters({
                                                    ...filters,
                                                    search: event.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                {isSuratReport && (
                                    <div className="space-y-2">
                                        <Label htmlFor="jenis_surat_id">
                                            Jenis Surat
                                        </Label>
                                        <select
                                            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                            id="jenis_surat_id"
                                            value={filters.jenis_surat_id}
                                            onChange={(event) =>
                                                setFilters({
                                                    ...filters,
                                                    jenis_surat_id:
                                                        event.target.value,
                                                })
                                            }
                                        >
                                            <option value="">
                                                Semua jenis
                                            </option>
                                            {filterOptions.jenis_surat.map(
                                                (jenisSurat) => (
                                                    <option
                                                        key={jenisSurat.id}
                                                        value={jenisSurat.id}
                                                    >
                                                        {jenisSurat.nama_surat}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    </div>
                                )}
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
                    </CardContent>
                </Card>

                <Card className="overflow-hidden rounded-lg">
                    <CardHeader>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle className="text-base">
                                    Preview Tabel
                                </CardTitle>
                                <CardDescription>
                                    Data yang sama dipakai untuk export PDF dan
                                    Excel.
                                </CardDescription>
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground">
                                <Download className="size-4" />
                                {report.total} data
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[920px] text-left text-sm">
                                <thead className="border-y border-border bg-muted/50 text-xs text-muted-foreground uppercase">
                                    <tr>
                                        <th className="w-12 px-4 py-3">No</th>
                                        {report.columns.map((column) => (
                                            <th
                                                className="px-4 py-3"
                                                key={column.key}
                                            >
                                                {column.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {report.rows.map((row, index) => (
                                        <tr
                                            className="hover:bg-muted/30"
                                            key={`${index}-${Object.values(row).join('-')}`}
                                        >
                                            <td className="px-4 py-3">
                                                {index + 1}
                                            </td>
                                            {report.columns.map((column) => (
                                                <td
                                                    className="px-4 py-3"
                                                    key={column.key}
                                                >
                                                    {row[column.key] ?? '-'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    {report.rows.length === 0 && (
                                        <tr>
                                            <td
                                                className="px-4 py-10 text-center text-muted-foreground"
                                                colSpan={
                                                    report.columns.length + 1
                                                }
                                            >
                                                Tidak ada data laporan yang
                                                cocok.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

LaporanShow.layout = {
    breadcrumbs: moduleBreadcrumbs('Laporan', index()),
};
