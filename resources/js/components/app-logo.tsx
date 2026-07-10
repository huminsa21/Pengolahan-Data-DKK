import AppLogoIcon from '@/components/app-logo-icon';
import { appBrand } from '@/lib/branding';
import { usePage } from '@inertiajs/react';

export default function AppLogo() {
    const { desa } = usePage().props;

    return (
        <>
            <div className="flex aspect-square size-9 items-center justify-center rounded-md border border-sidebar-border bg-white p-1">
                <AppLogoIcon className="size-7 object-contain" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                    {desa?.nama_desa ?? appBrand}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                    {desa?.nama_aplikasi ?? appBrand}
                </span>
            </div>
        </>
    );
}
