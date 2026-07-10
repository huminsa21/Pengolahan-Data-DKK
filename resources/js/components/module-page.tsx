import { Head } from '@inertiajs/react';
import { appBrand } from '@/lib/branding';
import type { BreadcrumbItem } from '@/types';

type ModuleMetric = {
    label: string;
    value: string;
    tone?: 'primary' | 'success' | 'warning' | 'danger';
};

type ModulePageProps = {
    title: string;
    description: string;
    metrics: ModuleMetric[];
    focusItems: string[];
};

const toneClasses: Record<NonNullable<ModuleMetric['tone']>, string> = {
    primary: 'border-primary/20 bg-primary/10 text-primary',
    success: 'border-[#16A34A]/20 bg-[#16A34A]/10 text-[#16A34A]',
    warning: 'border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#B45309]',
    danger: 'border-[#DC2626]/20 bg-[#DC2626]/10 text-[#DC2626]',
};

export function ModulePage({
    title,
    description,
    metrics,
    focusItems,
}: ModulePageProps) {
    return (
        <>
            <Head title={title} />
            <div className="flex flex-1 flex-col gap-6 bg-background p-4 text-foreground sm:p-6">
                <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="max-w-3xl space-y-2">
                            <p className="text-sm font-medium text-primary">
                                {appBrand}
                            </p>
                            <h1 className="text-2xl font-semibold tracking-normal text-foreground">
                                {title}
                            </h1>
                            <p className="text-sm leading-6 text-muted-foreground">
                                {description}
                            </p>
                        </div>
                        <div className="w-fit rounded-md border border-[#F9A826]/30 bg-[#F9A826]/10 px-3 py-2 text-sm font-medium text-[#9A5F00]">
                            Tahap fondasi
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    {metrics.map((metric) => (
                        <div
                            className="rounded-lg border border-border bg-card p-4 shadow-sm"
                            key={metric.label}
                        >
                            <p className="text-sm text-muted-foreground">
                                {metric.label}
                            </p>
                            <p
                                className={`mt-3 inline-flex rounded-md border px-3 py-1 text-lg font-semibold ${toneClasses[metric.tone ?? 'primary']}`}
                            >
                                {metric.value}
                            </p>
                        </div>
                    ))}
                </section>

                <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
                    <h2 className="text-base font-semibold text-foreground">
                        Ruang lingkup modul
                    </h2>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {focusItems.map((item) => (
                            <div
                                className="flex items-center gap-3 rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground"
                                key={item}
                            >
                                <span className="size-2 rounded-full bg-secondary" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}

export function moduleBreadcrumbs(
    title: string,
    href: BreadcrumbItem['href'],
): BreadcrumbItem[] {
    return [{ title, href }];
}
