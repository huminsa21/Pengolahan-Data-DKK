<?php

namespace App\Services;

use App\Models\Bantuan;
use App\Models\Dusun;
use App\Models\JenisSurat;
use App\Models\Kelahiran;
use App\Models\Kematian;
use App\Models\Pendatang;
use App\Models\Penduduk;
use App\Models\PenerimaBantuan;
use App\Models\Pengumuman;
use App\Models\Pindah;
use App\Models\Surat;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class DashboardService
{
    /**
     * @return array<int, array{key: string, label: string, value: int}>
     */
    public function getSummaryStats(int $year, ?string $dusunId = null): array
    {
        $penduduk = $this->pendudukQuery($dusunId);
        $pendudukAktif = $this->pendudukQuery($dusunId)->where('status_penduduk', 'AKTIF');

        return [
            ['key' => 'total_penduduk', 'label' => 'Total Penduduk', 'value' => (clone $penduduk)->count()],
            ['key' => 'penduduk_aktif', 'label' => 'Penduduk Aktif', 'value' => (clone $pendudukAktif)->count()],
            ['key' => 'laki_laki', 'label' => 'Laki-laki', 'value' => (clone $pendudukAktif)->where('jenis_kelamin', 'LAKI-LAKI')->count()],
            ['key' => 'perempuan', 'label' => 'Perempuan', 'value' => (clone $pendudukAktif)->where('jenis_kelamin', 'PEREMPUAN')->count()],
            ['key' => 'kepala_keluarga', 'label' => 'Kepala Keluarga', 'value' => (clone $pendudukAktif)->where('is_kepala_keluarga', true)->count()],
            ['key' => 'kelahiran_tahun_ini', 'label' => 'Kelahiran Tahun Ini', 'value' => $this->filterKelahiran($year, $dusunId)->count()],
            ['key' => 'kematian_tahun_ini', 'label' => 'Kematian Tahun Ini', 'value' => $this->filterKematian($year, $dusunId)->count()],
            ['key' => 'pendatang_tahun_ini', 'label' => 'Pendatang Tahun Ini', 'value' => $this->filterPendatang($year, $dusunId)->count()],
            ['key' => 'pindah_tahun_ini', 'label' => 'Pindah Tahun Ini', 'value' => $this->filterPindah($year, $dusunId)->count()],
            ['key' => 'program_bantuan_aktif', 'label' => 'Program Bantuan Aktif', 'value' => Bantuan::query()->where('status', 'AKTIF')->count()],
            ['key' => 'total_penerima_bantuan', 'label' => 'Total Penerima Bantuan', 'value' => PenerimaBantuan::query()->count()],
            ['key' => 'surat_bulan_ini', 'label' => 'Surat Bulan Ini', 'value' => Surat::query()->whereYear('tanggal_surat', now()->year)->whereMonth('tanggal_surat', now()->month)->count()],
            ['key' => 'pengumuman_published', 'label' => 'Pengumuman Published', 'value' => Pengumuman::query()->where('status', 'PUBLISHED')->count()],
        ];
    }

    /**
     * @return array<int, array{name: string, total: int}>
     */
    public function getPendudukPerDusun(?int $year = null): array
    {
        return Dusun::query()
            ->withCount(['penduduk as total' => fn (Builder $query) => $query->where('status_penduduk', 'AKTIF')])
            ->orderBy('nama_dusun')
            ->get()
            ->map(fn (Dusun $dusun): array => [
                'name' => $dusun->nama_dusun,
                'total' => (int) $dusun->total,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{name: string, value: int}>
     */
    public function getJenisKelaminStats(?string $dusunId = null): array
    {
        $query = $this->pendudukQuery($dusunId)->where('status_penduduk', 'AKTIF');

        return [
            ['name' => 'Laki-laki', 'value' => (clone $query)->where('jenis_kelamin', 'LAKI-LAKI')->count()],
            ['name' => 'Perempuan', 'value' => (clone $query)->where('jenis_kelamin', 'PEREMPUAN')->count()],
        ];
    }

    /**
     * @return array<int, array{month: string, kelahiran: int, kematian: int, pendatang: int, pindah: int}>
     */
    public function getPeristiwaBulanan(int $year, ?string $dusunId = null): array
    {
        $kelahiran = $this->countByMonth($this->filterKelahiran($year, $dusunId)->get(['tanggal_lahir']), 'tanggal_lahir');
        $kematian = $this->countByMonth($this->filterKematian($year, $dusunId)->get(['tanggal_meninggal']), 'tanggal_meninggal');
        $pendatang = $this->countByMonth($this->filterPendatang($year, $dusunId)->get(['tanggal_datang']), 'tanggal_datang');
        $pindah = $this->countByMonth($this->filterPindah($year, $dusunId)->get(['tanggal_pindah']), 'tanggal_pindah');

        return collect(range(1, 12))
            ->map(fn (int $month): array => [
                'month' => Carbon::create($year, $month, 1)->translatedFormat('M'),
                'kelahiran' => $kelahiran[$month] ?? 0,
                'kematian' => $kematian[$month] ?? 0,
                'pendatang' => $pendatang[$month] ?? 0,
                'pindah' => $pindah[$month] ?? 0,
            ])
            ->all();
    }

    /**
     * @return array<int, array{name: string, total: int}>
     */
    public function getBantuanStats(?int $year = null): array
    {
        return Bantuan::query()
            ->when($year, fn (Builder $query) => $query->where('tahun', $year))
            ->withCount('penerimaBantuan as total')
            ->orderByDesc('total')
            ->limit(8)
            ->get()
            ->map(fn (Bantuan $bantuan): array => [
                'name' => $bantuan->nama_bantuan,
                'total' => (int) $bantuan->total,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{name: string, total: int}>
     */
    public function getSuratStats(?int $year = null): array
    {
        return JenisSurat::query()
            ->withCount(['surat as total' => fn (Builder $query) => $query->when($year, fn (Builder $query) => $query->whereYear('tanggal_surat', $year))])
            ->orderByDesc('total')
            ->limit(8)
            ->get()
            ->map(fn (JenisSurat $jenisSurat): array => [
                'name' => $jenisSurat->nama_surat,
                'total' => (int) $jenisSurat->total,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array{
     *     kelahiran: array<int, array{nama: string, tanggal: ?string, orang_tua: string}>,
     *     kematian: array<int, array{nama: string, tanggal: ?string, sebab: ?string}>,
     *     pendatang: array<int, array{nama: string, tanggal: ?string, status: string}>,
     *     surat: array<int, array{nomor: string, jenis: string, status: string, tanggal: ?string}>,
     *     pengumuman: array<int, array{judul: string, status: string, tanggal: ?string}>
     * }
     */
    public function getRecentActivities(?string $dusunId = null): array
    {
        return [
            'kelahiran' => Kelahiran::query()
                ->with(['ayah:id,nama_lengkap,dusun_id', 'ibu:id,nama_lengkap,dusun_id'])
                ->when($dusunId, fn (Builder $query) => $query->where(function (Builder $query) use ($dusunId): void {
                    $query->whereHas('ayah', fn (Builder $query) => $query->where('dusun_id', $dusunId))
                        ->orWhereHas('ibu', fn (Builder $query) => $query->where('dusun_id', $dusunId));
                }))
                ->latest('tanggal_lahir')
                ->limit(5)
                ->get()
                ->map(fn (Kelahiran $kelahiran): array => [
                    'nama' => $kelahiran->nama_bayi,
                    'tanggal' => $kelahiran->tanggal_lahir?->toDateString(),
                    'orang_tua' => collect([
                        $kelahiran->ayah?->nama_lengkap ?? $kelahiran->nama_ayah,
                        $kelahiran->ibu?->nama_lengkap ?? $kelahiran->nama_ibu,
                    ])->filter()->implode(' / ') ?: '-',
                ])
                ->all(),
            'kematian' => Kematian::query()
                ->with('penduduk:id,nama_lengkap,dusun_id')
                ->when($dusunId, fn (Builder $query) => $query->whereHas('penduduk', fn (Builder $query) => $query->where('dusun_id', $dusunId)))
                ->latest('tanggal_meninggal')
                ->limit(5)
                ->get()
                ->map(fn (Kematian $kematian): array => [
                    'nama' => $kematian->penduduk?->nama_lengkap ?? '-',
                    'tanggal' => $kematian->tanggal_meninggal?->toDateString(),
                    'sebab' => $kematian->sebab_meninggal,
                ])
                ->all(),
            'pendatang' => Pendatang::query()
                ->when($dusunId, fn (Builder $query) => $query->where('dusun_id', $dusunId))
                ->latest('tanggal_datang')
                ->limit(5)
                ->get()
                ->map(fn (Pendatang $pendatang): array => [
                    'nama' => $pendatang->nama_lengkap,
                    'tanggal' => $pendatang->tanggal_datang?->toDateString(),
                    'status' => $pendatang->status,
                ])
                ->all(),
            'surat' => Surat::query()
                ->with('jenisSurat:id,nama_surat')
                ->latest('tanggal_surat')
                ->limit(5)
                ->get()
                ->map(fn (Surat $surat): array => [
                    'nomor' => $surat->nomor_surat,
                    'jenis' => $surat->jenisSurat?->nama_surat ?? '-',
                    'status' => $surat->status,
                    'tanggal' => $surat->tanggal_surat?->toDateString(),
                ])
                ->all(),
            'pengumuman' => Pengumuman::query()
                ->latest('tanggal_publish')
                ->limit(5)
                ->get()
                ->map(fn (Pengumuman $pengumuman): array => [
                    'judul' => $pengumuman->judul,
                    'status' => $pengumuman->status,
                    'tanggal' => $pengumuman->tanggal_publish?->toDateString(),
                ])
                ->all(),
        ];
    }

    /**
     * @return array{years: array<int, int>, dusun: array<int, array{id: string, nama: string}>}
     */
    public function getFilterOptions(): array
    {
        $currentYear = now()->year;

        return [
            'years' => range($currentYear, $currentYear - 5),
            'dusun' => Dusun::query()
                ->orderBy('nama_dusun')
                ->get(['id', 'nama_dusun'])
                ->map(fn (Dusun $dusun): array => [
                    'id' => $dusun->id,
                    'nama' => $dusun->nama_dusun,
                ])
                ->all(),
        ];
    }

    private function pendudukQuery(?string $dusunId = null): Builder
    {
        return Penduduk::query()
            ->when($dusunId, fn (Builder $query) => $query->where('dusun_id', $dusunId));
    }

    private function filterKelahiran(int $year, ?string $dusunId = null): Builder
    {
        return Kelahiran::query()
            ->whereYear('tanggal_lahir', $year)
            ->when($dusunId, fn (Builder $query) => $query->where(function (Builder $query) use ($dusunId): void {
                $query->whereHas('bayiPenduduk', fn (Builder $query) => $query->where('dusun_id', $dusunId))
                    ->orWhereHas('ayah', fn (Builder $query) => $query->where('dusun_id', $dusunId))
                    ->orWhereHas('ibu', fn (Builder $query) => $query->where('dusun_id', $dusunId));
            }));
    }

    private function filterKematian(int $year, ?string $dusunId = null): Builder
    {
        return Kematian::query()
            ->whereYear('tanggal_meninggal', $year)
            ->when($dusunId, fn (Builder $query) => $query->whereHas('penduduk', fn (Builder $query) => $query->where('dusun_id', $dusunId)));
    }

    private function filterPendatang(int $year, ?string $dusunId = null): Builder
    {
        return Pendatang::query()
            ->whereYear('tanggal_datang', $year)
            ->when($dusunId, fn (Builder $query) => $query->where('dusun_id', $dusunId));
    }

    private function filterPindah(int $year, ?string $dusunId = null): Builder
    {
        return Pindah::query()
            ->whereYear('tanggal_pindah', $year)
            ->when($dusunId, fn (Builder $query) => $query->whereHas('penduduk', fn (Builder $query) => $query->where('dusun_id', $dusunId)));
    }

    /**
     * @param  iterable<int, object>  $records
     * @return array<int, int>
     */
    private function countByMonth(iterable $records, string $dateColumn): array
    {
        $counts = [];

        foreach ($records as $record) {
            $date = $record->{$dateColumn};

            if (! $date instanceof Carbon) {
                continue;
            }

            $month = (int) $date->format('n');
            $counts[$month] = ($counts[$month] ?? 0) + 1;
        }

        return $counts;
    }
}
