import type { LucideIcon } from 'lucide-react';

type StatCardProps = {
    icon: LucideIcon;
    label: string;
    value: string;
    description: string;
};

export function StatCard({
    icon: Icon,
    label,
    value,
    description,
}: StatCardProps) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {label}
                    </p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                        {value}
                    </p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                    <Icon className="size-7" />
                </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
                {description}
            </p>
        </div>
    );
}
