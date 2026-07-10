import { Head, router } from '@inertiajs/react';
import type { ReactNode } from 'react';
import {
    Baby,
    FileText,
    HandHeart,
    HeartPulse,
    Home,
    MapPinned,
    Megaphone,
    MoveRight,
    UserCheck,
    UserRoundCheck,
    Users,
    VenusAndMars,
    type LucideIcon,
} from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';

type SummaryStat = {
    key: string;
    label: string;
    value: number;
};

type ChartPoint = {
    name: string;
    total: number;
};

type GenderPoint = {
    name: string;
    value: number;
};

type MonthlyEventPoint = {
    month: string;
    kelahiran: number;
    kematian: number;
    pendatang: number;
    pindah: number;
};

type RecentItems = {
    kelahiran: Array<{
        nama: string;
        tanggal: string | null;
        orang_tua: string;
    }>;
    kematian: Array<{
        nama: string;
        tanggal: string | null;
        sebab: string | null;
    }>;
    pendatang: Array<{
        nama: string;
        tanggal: string | null;
        status: string;
    }>;
    surat: Array<{
        nomor: string;
        jenis: string;
        status: string;
        tanggal: string | null;
    }>;
    pengumuman: Array<{
        judul: string;
        status: string;
        tanggal: string | null;
    }>;
};

type DashboardProps = {
    filters: {
        year: number;
        dusun_id: string | null;
    };
    filterOptions: {
        years: number[];
        dusun: Array<{
            id: string;
            nama: string;
        }>;
    };
    summaryStats: SummaryStat[];
    charts: {
        pendudukPerDusun: ChartPoint[];
        jenisKelamin: GenderPoint[];
        peristiwaBulanan: MonthlyEventPoint[];
        bantuanPerProgram: ChartPoint[];
        suratPerJenis: ChartPoint[];
    };
    recent: RecentItems;
};

const statIcons: Record<string, LucideIcon> = {
    total_penduduk: Users,
    penduduk_aktif: UserCheck,
    laki_laki: VenusAndMars,
    perempuan: VenusAndMars,
    kepala_keluarga: Home,
    kelahiran_tahun_ini: Baby,
    kematian_tahun_ini: HeartPulse,
    pendatang_tahun_ini: MapPinned,
    pindah_tahun_ini: MoveRight,
    program_bantuan_aktif: HandHeart,
    total_penerima_bantuan: UserRoundCheck,
    surat_bulan_ini: FileText,
    pengumuman_published: Megaphone,
};

const pieColors = ['#047857', '#0f766e'];

function formatNumber(value: number): string {
    return new Intl.NumberFormat('id-ID').format(value);
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

function statusTone(status: string): string {
    const normalizedStatus = status.toUpperCase();

    if (
        ['PUBLISHED', 'SELESAI', 'DITERIMA', 'AKTIF'].includes(normalizedStatus)
    ) {
        return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    }

    if (['DRAFT', 'DIAJUKAN', 'PENDING'].includes(normalizedStatus)) {
        return 'border-amber-200 bg-amber-50 text-amber-700';
    }

    return 'border-slate-200 bg-slate-50 text-slate-700';
}

function EmptyChart() {
    return (
        <div className="flex h-[260px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            Belum ada data untuk ditampilkan.
        </div>
    );
}

function StatCard({ stat }: { stat: SummaryStat }) {
    const Icon = statIcons[stat.key] ?? Users;

    return (
        <Card className="gap-4 rounded-lg py-5">
            <CardContent className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">
                        {stat.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
                        {formatNumber(stat.value)}
                    </p>
                </div>
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <Icon className="size-5" />
                </div>
            </CardContent>
        </Card>
    );
}

function ChartCard({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <Card className="rounded-lg">
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

function RecentCard<TItem>({
    title,
    items,
    renderItem,
}: {
    title: string;
    items: TItem[];
    renderItem: (item: TItem, index: number) => ReactNode;
}) {
    return (
        <Card className="rounded-lg">
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {items.length > 0 ? (
                    items.map(renderItem)
                ) : (
                    <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                        Belum ada data terbaru.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

export default function Dashboard({
    filters,
    filterOptions,
    summaryStats,
    charts,
    recent,
}: DashboardProps) {
    const selectedDusun = filterOptions.dusun.find(
        (dusun) => dusun.id === filters.dusun_id,
    );

    const updateFilter = (nextFilters: {
        year?: number;
        dusun_id?: string | null;
    }) => {
        router.get(
            dashboard.url(),
            {
                year: nextFilters.year ?? filters.year,
                dusun_id:
                    nextFilters.dusun_id === undefined
                        ? filters.dusun_id
                        : nextFilters.dusun_id,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 rounded-lg border bg-card p-5 shadow-sm lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-emerald-700">
                            Dashboard Admin
                        </p>
                        <h1 className="mt-2 text-2xl font-semibold text-slate-950">
                            Selamat datang, Administrator Desa
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Ringkasan data desa tahun {filters.year}
                            {selectedDusun
                                ? ` untuk ${selectedDusun.nama}`
                                : ''}
                            .
                        </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="dashboard-year">Tahun</Label>
                            <Select
                                value={String(filters.year)}
                                onValueChange={(value) =>
                                    updateFilter({ year: Number(value) })
                                }
                            >
                                <SelectTrigger
                                    id="dashboard-year"
                                    className="w-full sm:w-[160px]"
                                >
                                    <SelectValue placeholder="Pilih tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filterOptions.years.map((year) => (
                                        <SelectItem
                                            key={year}
                                            value={String(year)}
                                        >
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dashboard-dusun">Dusun</Label>
                            <Select
                                value={filters.dusun_id ?? 'all'}
                                onValueChange={(value) =>
                                    updateFilter({
                                        dusun_id:
                                            value === 'all' ? null : value,
                                    })
                                }
                            >
                                <SelectTrigger
                                    id="dashboard-dusun"
                                    className="w-full sm:w-[220px]"
                                >
                                    <SelectValue placeholder="Semua dusun" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua dusun
                                    </SelectItem>
                                    {filterOptions.dusun.map((dusun) => (
                                        <SelectItem
                                            key={dusun.id}
                                            value={dusun.id}
                                        >
                                            {dusun.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {summaryStats.map((stat) => (
                        <StatCard key={stat.key} stat={stat} />
                    ))}
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                    <ChartCard
                        title="Penduduk per Dusun"
                        description="Penduduk aktif berdasarkan wilayah dusun."
                    >
                        {charts.pendudukPerDusun.length > 0 ? (
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={charts.pendudukPerDusun}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="name"
                                            tickLine={false}
                                        />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip
                                            formatter={(value) =>
                                                formatNumber(Number(value))
                                            }
                                        />
                                        <Bar
                                            dataKey="total"
                                            name="Penduduk"
                                            fill="#047857"
                                            radius={[6, 6, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <EmptyChart />
                        )}
                    </ChartCard>

                    <ChartCard
                        title="Jenis Kelamin"
                        description="Komposisi penduduk aktif laki-laki dan perempuan."
                    >
                        {charts.jenisKelamin.some((item) => item.value > 0) ? (
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={charts.jenisKelamin}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={62}
                                            outerRadius={104}
                                            paddingAngle={4}
                                        >
                                            {charts.jenisKelamin.map(
                                                (item, index) => (
                                                    <Cell
                                                        key={item.name}
                                                        fill={
                                                            pieColors[
                                                                index %
                                                                    pieColors.length
                                                            ]
                                                        }
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) =>
                                                formatNumber(Number(value))
                                            }
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <EmptyChart />
                        )}
                    </ChartCard>

                    <ChartCard
                        title="Peristiwa Kependudukan"
                        description={`Kelahiran, kematian, pendatang, dan pindah selama ${filters.year}.`}
                    >
                        <div className="h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={charts.peristiwaBulanan}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" tickLine={false} />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip
                                        formatter={(value) =>
                                            formatNumber(Number(value))
                                        }
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="kelahiran"
                                        name="Kelahiran"
                                        stroke="#047857"
                                        strokeWidth={2}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="kematian"
                                        name="Kematian"
                                        stroke="#475569"
                                        strokeWidth={2}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="pendatang"
                                        name="Pendatang"
                                        stroke="#0f766e"
                                        strokeWidth={2}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="pindah"
                                        name="Pindah"
                                        stroke="#f59e0b"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>

                    <ChartCard
                        title="Bantuan per Program"
                        description="Jumlah penerima pada setiap program bantuan."
                    >
                        {charts.bantuanPerProgram.length > 0 ? (
                            <div className="h-[320px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={charts.bantuanPerProgram}
                                        layout="vertical"
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            type="number"
                                            allowDecimals={false}
                                        />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            width={140}
                                            tickLine={false}
                                        />
                                        <Tooltip
                                            formatter={(value) =>
                                                formatNumber(Number(value))
                                            }
                                        />
                                        <Bar
                                            dataKey="total"
                                            name="Penerima"
                                            fill="#0f766e"
                                            radius={[0, 6, 6, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <EmptyChart />
                        )}
                    </ChartCard>

                    <ChartCard
                        title="Surat per Jenis"
                        description="Jumlah surat yang dibuat berdasarkan jenis surat."
                    >
                        {charts.suratPerJenis.length > 0 ? (
                            <div className="h-[320px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={charts.suratPerJenis}
                                        layout="vertical"
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            type="number"
                                            allowDecimals={false}
                                        />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            width={140}
                                            tickLine={false}
                                        />
                                        <Tooltip
                                            formatter={(value) =>
                                                formatNumber(Number(value))
                                            }
                                        />
                                        <Bar
                                            dataKey="total"
                                            name="Surat"
                                            fill="#334155"
                                            radius={[0, 6, 6, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <EmptyChart />
                        )}
                    </ChartCard>
                </div>

                <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
                    <RecentCard
                        title="Kelahiran Terbaru"
                        items={recent.kelahiran}
                        renderItem={(kelahiran) => {
                            return (
                                <div
                                    key={`${kelahiran.nama}-${kelahiran.tanggal}`}
                                    className="rounded-lg border p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-medium text-slate-950">
                                                {kelahiran.nama}
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {kelahiran.orang_tua}
                                            </p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDate(kelahiran.tanggal)}
                                        </span>
                                    </div>
                                </div>
                            );
                        }}
                    />

                    <RecentCard
                        title="Kematian Terbaru"
                        items={recent.kematian}
                        renderItem={(kematian) => {
                            return (
                                <div
                                    key={`${kematian.nama}-${kematian.tanggal}`}
                                    className="rounded-lg border p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-medium text-slate-950">
                                                {kematian.nama}
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {kematian.sebab ?? '-'}
                                            </p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDate(kematian.tanggal)}
                                        </span>
                                    </div>
                                </div>
                            );
                        }}
                    />

                    <RecentCard
                        title="Pendatang Terbaru"
                        items={recent.pendatang}
                        renderItem={(pendatang) => {
                            return (
                                <div
                                    key={`${pendatang.nama}-${pendatang.tanggal}`}
                                    className="rounded-lg border p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-medium text-slate-950">
                                                {pendatang.nama}
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {formatDate(pendatang.tanggal)}
                                            </p>
                                        </div>
                                        <Badge
                                            className={statusTone(
                                                pendatang.status,
                                            )}
                                            variant="outline"
                                        >
                                            {pendatang.status}
                                        </Badge>
                                    </div>
                                </div>
                            );
                        }}
                    />

                    <RecentCard
                        title="Surat Terbaru"
                        items={recent.surat}
                        renderItem={(surat) => {
                            return (
                                <div
                                    key={`${surat.nomor}-${surat.tanggal}`}
                                    className="rounded-lg border p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-medium text-slate-950">
                                                {surat.nomor}
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {surat.jenis}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {formatDate(surat.tanggal)}
                                            </p>
                                        </div>
                                        <Badge
                                            className={statusTone(surat.status)}
                                            variant="outline"
                                        >
                                            {surat.status}
                                        </Badge>
                                    </div>
                                </div>
                            );
                        }}
                    />

                    <RecentCard
                        title="Pengumuman Terbaru"
                        items={recent.pengumuman}
                        renderItem={(pengumuman) => {
                            return (
                                <div
                                    key={`${pengumuman.judul}-${pengumuman.tanggal}`}
                                    className="rounded-lg border p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-medium text-slate-950">
                                                {pengumuman.judul}
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {formatDate(pengumuman.tanggal)}
                                            </p>
                                        </div>
                                        <Badge
                                            className={statusTone(
                                                pengumuman.status,
                                            )}
                                            variant="outline"
                                        >
                                            {pengumuman.status}
                                        </Badge>
                                    </div>
                                </div>
                            );
                        }}
                    />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
