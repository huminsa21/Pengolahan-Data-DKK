import { ModulePage, moduleBreadcrumbs } from '@/components/module-page';
import { index as penerimaBantuanIndex } from '@/routes/penerima-bantuan';

export default function PenerimaBantuanIndex() {
    return (
        <ModulePage
            title="Penerima Bantuan"
            description="Relasi penerimaan bantuan antara program bantuan dan penduduk, lengkap dengan tanggal terima, nominal, status, dan keterangan."
            metrics={[
                {
                    label: 'Relasi',
                    value: 'Bantuan + Penduduk',
                    tone: 'primary',
                },
                {
                    label: 'Constraint',
                    value: 'Unique per program',
                    tone: 'success',
                },
                {
                    label: 'Status',
                    value: 'AKTIF / SELESAI / DIBATALKAN',
                    tone: 'warning',
                },
            ]}
            focusItems={[
                'Menghubungkan penduduk dengan program bantuan',
                'Mencegah penerima ganda pada program yang sama',
                'Nominal dan tanggal terima bantuan',
                'Status penyaluran bantuan',
            ]}
        />
    );
}

PenerimaBantuanIndex.layout = {
    breadcrumbs: moduleBreadcrumbs('Penerima Bantuan', penerimaBantuanIndex()),
};
