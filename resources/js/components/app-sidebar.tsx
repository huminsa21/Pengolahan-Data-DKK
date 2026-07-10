import { Link, usePage } from '@inertiajs/react';
import {
    Baby,
    BadgeDollarSign,
    Building2,
    ClipboardList,
    FileStack,
    FileText,
    HandCoins,
    Home,
    LayoutGrid,
    Megaphone,
    MapPinned,
    Skull,
    Truck,
    UserPlus,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as bantuanIndex } from '@/routes/bantuan';
import { index as laporanIndex } from '@/actions/App/Http/Controllers/LaporanController';
import { index as perangkatDesaIndex } from '@/actions/App/Http/Controllers/PerangkatDesaController';
import { index as dusunIndex } from '@/routes/dusun';
import { index as jenisSuratIndex } from '@/routes/jenis-surat';
import { index as kelahiranIndex } from '@/routes/kelahiran';
import { index as kematianIndex } from '@/routes/kematian';
import { index as pendatangIndex } from '@/routes/pendatang';
import { index as pendudukIndex } from '@/routes/penduduk';
import { index as penerimaBantuanIndex } from '@/routes/penerima-bantuan';
import { index as pengumumanIndex } from '@/routes/pengumuman';
import { index as pindahIndex } from '@/routes/pindah';
import { show as profilDesaShow } from '@/routes/profil-desa';
import { index as suratIndex } from '@/routes/surat';
import type { NavItem } from '@/types';

const dashboardNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const masterNavItems: NavItem[] = [
    {
        title: 'Dusun',
        href: dusunIndex(),
        icon: MapPinned,
        permission: 'penduduk.view',
    },
    {
        title: 'Penduduk',
        href: pendudukIndex(),
        icon: Users,
        permission: 'penduduk.view',
    }
    
];

const peristiwaNavItems: NavItem[] = [
    {
        title: 'Kelahiran',
        href: kelahiranIndex(),
        icon: Baby,
        permission: 'kelahiran.view',
    },
    {
        title: 'Kematian',
        href: kematianIndex(),
        icon: Skull,
        permission: 'kematian.view',
    },
    {
        title: 'Pendatang',
        href: pendatangIndex(),
        icon: UserPlus,
        permission: 'pendatang.view',
    },
    {
        title: 'Pindah',
        href: pindahIndex(),
        icon: Truck,
        permission: 'pindah.view',
    },
];

const layananNavItems: NavItem[] = [
    {
        title: 'Bantuan',
        href: bantuanIndex(),
        icon: BadgeDollarSign,
        permission: 'bantuan.view',
    },
    {
        title: 'Penerima Bantuan',
        href: penerimaBantuanIndex(),
        icon: HandCoins,
        permission: 'bantuan.view',
    },
    {
        title: 'Pengumuman',
        href: pengumumanIndex(),
        icon: Megaphone,
        permission: 'pengumuman.view',
    },
    {
        title: 'Jenis Surat',
        href: jenisSuratIndex(),
        icon: FileStack,
        permission: 'jenis_surat.view',
    },
    {
        title: 'Surat',
        href: suratIndex(),
        icon: FileText,
        permission: 'surat.view',
    },
    {
        title: 'Laporan',
        href: laporanIndex(),
        icon: ClipboardList,
        permission: 'laporan.view',
    },
];

const pengaturanNavItems: NavItem[] = [
    {
        title: 'Profil Desa',
        href: profilDesaShow(),
        icon: Building2,
        permission: 'profil_desa.view',
    },
    {
        title: 'Perangkat Desa',
        href: perangkatDesaIndex(),
        icon: Users,
        permission: 'perangkat_desa.view',
    },
];

export function AppSidebar() {
    const { desa, auth } = usePage().props;
    const userPermissions = auth.user?.permissions ?? [];
    const can = (permission?: NavItem['permission']) => {
        if (!permission) {
            return true;
        }

        const requiredPermissions = Array.isArray(permission)
            ? permission
            : [permission];

        return requiredPermissions.some((permission) =>
            userPermissions.includes(permission),
        );
    };
    const filterItems = (items: NavItem[]) =>
        items.filter((item) => can(item.permission));
    const footerNavItems: NavItem[] = [
        {
            title: desa?.nama_desa ?? 'Desa',
            href: dashboard(),
            icon: Home,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={dashboardNavItems} label="Dashboard" />
                <NavMain
                    items={filterItems(masterNavItems)}
                    label="Master Data"
                />
                <NavMain
                    items={filterItems(peristiwaNavItems)}
                    label="Peristiwa"
                />
                <NavMain items={filterItems(layananNavItems)} label="Layanan" />
                <NavMain
                    items={filterItems(pengaturanNavItems)}
                    label="Pengaturan"
                />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
