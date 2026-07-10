import { Head, Link } from '@inertiajs/react';
import {
    Baby,
    BadgeDollarSign,
    FileDown,
    FileText,
    Skull,
    Truck,
    UserPlus,
    Users,
    type LucideIcon,
} from 'lucide-react';

import { moduleBreadcrumbs } from '@/components/module-page';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { index, show } from '@/actions/App/Http/Controllers/LaporanController';

type ReportType = {
    key: string;
    label: string;
    title: string;
    description: string;
};

type LaporanIndexProps = {
    reportTypes: ReportType[];
};

const icons: Record<string, LucideIcon> = {
    penduduk: Users,
    kelahiran: Baby,
    kematian: Skull,
    pendatang: UserPlus,
    pindah: Truck,
    bantuan: BadgeDollarSign,
    surat: FileText,
};

export default function LaporanIndex({ reportTypes }: LaporanIndexProps) {
    return (
        <>
            <Head title="Laporan" />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-primary">Laporan</p>
                    <h1 className="text-2xl font-semibold">
                        Laporan dan Export Data
                    </h1>
                    <p className="max-w-3xl text-sm text-muted-foreground">
                        Pilih jenis laporan untuk melihat preview data,
                        memfilter periode, lalu export ke PDF atau Excel.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {reportTypes.map((reportType) => {
                        const Icon = icons[reportType.key] ?? FileDown;

                        return (
                            <Card className="rounded-lg" key={reportType.key}>
                                <CardHeader className="flex-row items-start gap-4">
                                    <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                                        <Icon className="size-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <CardTitle className="text-base">
                                            {reportType.title}
                                        </CardTitle>
                                        <CardDescription className="mt-1 leading-6">
                                            {reportType.description}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Button asChild>
                                        <Link href={show.url(reportType.key)}>
                                            Buka Laporan
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

LaporanIndex.layout = {
    breadcrumbs: moduleBreadcrumbs('Laporan', index()),
};
