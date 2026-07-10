import { desaLogo } from '@/lib/branding';
import { usePage } from '@inertiajs/react';
import type { ImgHTMLAttributes } from 'react';

type AppLogoIconProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'>;

export default function AppLogoIcon({
    alt = 'Logo Desa',
    className,
    ...props
}: AppLogoIconProps) {
    const { desa } = usePage().props;

    return (
        <img
            alt={alt}
            className={className}
            src={desa?.logo ?? desaLogo}
            {...props}
        />
    );
}
