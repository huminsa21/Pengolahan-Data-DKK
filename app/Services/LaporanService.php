<?php

namespace App\Services;

use App\Models\Bantuan;
use App\Models\Dusun;
use App\Models\JenisSurat;
use App\Models\Kelahiran;
use App\Models\Kematian;
use App\Models\Pendatang;
use App\Models\Penduduk;
use App\Models\Pindah;
use App\Models\Surat;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;
use InvalidArgumentException;

class LaporanService
{
    /**
     * @return array<string, array<string, mixed>>
     */
    public function types(): array
    {
        return [
            'penduduk' => [
                'label' => 'Penduduk',
                'title' => 'Laporan Data Penduduk',
                'description' => 'Rekap data penduduk berdasarkan tanggal input, dusun, status, nama, atau NIK.',
                'date_label' => 'Tanggal Input',
                'status_options' => ['AKTIF', 'PINDAH', 'MENINGGAL'],
                'search_placeholder' => 'Cari nama atau NIK',
            ],
            'kelahiran' => [
                'label' => 'Kelahiran',
                'title' => 'Laporan Kelahiran',
                'description' => 'Rekap peristiwa kelahiran berdasarkan tanggal lahir, dusun orang tua, dan nama bayi.',
                'date_label' => 'Tanggal Lahir',
                'status_options' => [],
                'search_placeholder' => 'Cari nama bayi, ayah, atau ibu',
            ],
            'kematian' => [
                'label' => 'Kematian',
                'title' => 'Laporan Kematian',
                'description' => 'Rekap peristiwa kematian berdasarkan tanggal meninggal, dusun, nama, atau NIK.',
                'date_label' => 'Tanggal Meninggal',
                'status_options' => [],
                'search_placeholder' => 'Cari nama atau NIK',
            ],
            'pendatang' => [
                'label' => 'Pendatang',
                'title' => 'Laporan Pendatang',
                'description' => 'Rekap pendatang berdasarkan tanggal datang, dusun tujuan, status, nama, atau NIK.',
                'date_label' => 'Tanggal Datang',
                'status_options' => ['PROSES', 'DITERIMA', 'DITOLAK'],
                'search_placeholder' => 'Cari nama atau NIK',
            ],
            'pindah' => [
                'label' => 'Pindah',
                'title' => 'Laporan Pindah',
                'description' => 'Rekap perpindahan penduduk berdasarkan tanggal pindah, dusun, status, nama, atau NIK.',
                'date_label' => 'Tanggal Pindah',
                'status_options' => ['PROSES', 'SELESAI', 'DIBATALKAN'],
                'search_placeholder' => 'Cari nama atau NIK',
            ],
            'bantuan' => [
                'label' => 'Bantuan',
                'title' => 'Laporan Bantuan',
                'description' => 'Rekap program bantuan berdasarkan tanggal input, status, dan nama program.',
                'date_label' => 'Tanggal Input',
                'status_options' => ['AKTIF', 'NONAKTIF'],
                'search_placeholder' => 'Cari nama, kode, jenis, atau sumber bantuan',
            ],
            'surat' => [
                'label' => 'Surat',
                'title' => 'Laporan Surat',
                'description' => 'Rekap surat berdasarkan tanggal surat, dusun pemohon, status, nomor, nama, atau NIK.',
                'date_label' => 'Tanggal Surat',
                'status_options' => ['DRAFT', 'SELESAI', 'DIBATALKAN'],
                'search_placeholder' => 'Cari nomor surat, nama, atau NIK',
            ],
        ];
    }

    /**
     * @return array<int, array{key: string, label: string, title: string, description: string}>
     */
    public function typeCards(): array
    {
        return collect($this->types())
            ->map(fn (array $type, string $key): array => [
                'key' => $key,
                'label' => $type['label'],
                'title' => $type['title'],
                'description' => $type['description'],
            ])
            ->values()
            ->all();
    }

    /**
     * @return array{dusun: array<int, array{id: string, nama_dusun: string}>, jenis_surat: array<int, array{id: string, nama_surat: string}>}
     */
    public function filterOptions(): array
    {
        return [
            'dusun' => Dusun::query()
                ->select(['id', 'nama_dusun'])
                ->where('is_active', true)
                ->orderBy('nama_dusun')
                ->get()
                ->toArray(),
            'jenis_surat' => JenisSurat::query()
                ->select(['id', 'nama_surat'])
                ->where('is_active', true)
                ->orderBy('nama_surat')
                ->get()
                ->toArray(),
        ];
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function preview(string $jenis, array $filters): array
    {
        $this->guardType($jenis);

        $query = $this->query($jenis, $filters);
        $total = (clone $query)->count();

        return [
            'meta' => $this->meta($jenis),
            'filters' => $this->normalizeFilters($filters),
            'columns' => $this->columns($jenis),
            'rows' => $query->limit(25)->get()->map(fn (object $record): array => $this->row($jenis, $record))->all(),
            'total' => $total,
        ];
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return array<int, array<string, mixed>>
     */
    public function rowsForExport(string $jenis, array $filters): array
    {
        $this->guardType($jenis);

        return $this->query($jenis, $filters)
            ->get()
            ->map(fn (object $record): array => $this->row($jenis, $record))
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    public function meta(string $jenis): array
    {
        $this->guardType($jenis);

        return [
            'key' => $jenis,
            ...$this->types()[$jenis],
        ];
    }

    /**
     * @return array<int, array{key: string, label: string}>
     */
    public function columns(string $jenis): array
    {
        return match ($jenis) {
            'penduduk' => [
                ['key' => 'nik', 'label' => 'NIK'],
                ['key' => 'nama', 'label' => 'Nama Lengkap'],
                ['key' => 'jenis_kelamin', 'label' => 'JK'],
                ['key' => 'tanggal', 'label' => 'Tanggal Lahir'],
                ['key' => 'dusun', 'label' => 'Dusun'],
                ['key' => 'status', 'label' => 'Status'],
            ],
            'kelahiran' => [
                ['key' => 'nama', 'label' => 'Nama Bayi'],
                ['key' => 'jenis_kelamin', 'label' => 'JK'],
                ['key' => 'tanggal', 'label' => 'Tanggal Lahir'],
                ['key' => 'ayah', 'label' => 'Ayah'],
                ['key' => 'ibu', 'label' => 'Ibu'],
                ['key' => 'alamat', 'label' => 'Alamat'],
            ],
            'kematian' => [
                ['key' => 'nik', 'label' => 'NIK'],
                ['key' => 'nama', 'label' => 'Nama Penduduk'],
                ['key' => 'tanggal', 'label' => 'Tanggal Meninggal'],
                ['key' => 'dusun', 'label' => 'Dusun'],
                ['key' => 'sebab', 'label' => 'Sebab'],
                ['key' => 'pelapor', 'label' => 'Pelapor'],
            ],
            'pendatang' => [
                ['key' => 'nik', 'label' => 'NIK'],
                ['key' => 'nama', 'label' => 'Nama'],
                ['key' => 'tanggal', 'label' => 'Tanggal Datang'],
                ['key' => 'dusun', 'label' => 'Dusun Tujuan'],
                ['key' => 'asal', 'label' => 'Asal'],
                ['key' => 'status', 'label' => 'Status'],
            ],
            'pindah' => [
                ['key' => 'nik', 'label' => 'NIK'],
                ['key' => 'nama', 'label' => 'Nama Penduduk'],
                ['key' => 'tanggal', 'label' => 'Tanggal Pindah'],
                ['key' => 'dusun', 'label' => 'Dusun'],
                ['key' => 'tujuan', 'label' => 'Tujuan'],
                ['key' => 'status', 'label' => 'Status'],
            ],
            'bantuan' => [
                ['key' => 'kode', 'label' => 'Kode'],
                ['key' => 'nama', 'label' => 'Nama Bantuan'],
                ['key' => 'jenis', 'label' => 'Jenis'],
                ['key' => 'sumber', 'label' => 'Sumber'],
                ['key' => 'tahun', 'label' => 'Tahun'],
                ['key' => 'penerima', 'label' => 'Penerima'],
                ['key' => 'status', 'label' => 'Status'],
            ],
            'surat' => [
                ['key' => 'nomor', 'label' => 'Nomor Surat'],
                ['key' => 'jenis', 'label' => 'Jenis Surat'],
                ['key' => 'nama', 'label' => 'Nama Pemohon'],
                ['key' => 'nik', 'label' => 'NIK'],
                ['key' => 'tanggal', 'label' => 'Tanggal Surat'],
                ['key' => 'status', 'label' => 'Status'],
            ],
            default => throw new InvalidArgumentException("Jenis laporan {$jenis} tidak tersedia."),
        };
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    private function query(string $jenis, array $filters): Builder
    {
        $filters = $this->normalizeFilters($filters);

        return match ($jenis) {
            'penduduk' => $this->pendudukQuery($filters),
            'kelahiran' => $this->kelahiranQuery($filters),
            'kematian' => $this->kematianQuery($filters),
            'pendatang' => $this->pendatangQuery($filters),
            'pindah' => $this->pindahQuery($filters),
            'bantuan' => $this->bantuanQuery($filters),
            'surat' => $this->suratQuery($filters),
            default => throw new InvalidArgumentException("Jenis laporan {$jenis} tidak tersedia."),
        };
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return array{date_from: string, date_to: string, dusun_id: string, status: string, search: string, jenis_surat_id: string}
     */
    public function normalizeFilters(array $filters): array
    {
        return [
            'date_from' => (string) ($filters['date_from'] ?? ''),
            'date_to' => (string) ($filters['date_to'] ?? ''),
            'dusun_id' => (string) ($filters['dusun_id'] ?? ''),
            'status' => (string) ($filters['status'] ?? ''),
            'search' => (string) ($filters['search'] ?? ''),
            'jenis_surat_id' => (string) ($filters['jenis_surat_id'] ?? ''),
        ];
    }

    /**
     * @param  array<string, mixed>  $record
     * @return array<string, mixed>
     */
    private function row(string $jenis, object $record): array
    {
        return match ($jenis) {
            'penduduk' => [
                'nik' => $record->nik,
                'nama' => $record->nama_lengkap,
                'jenis_kelamin' => $this->gender($record->jenis_kelamin),
                'tanggal' => $this->date($record->tanggal_lahir),
                'dusun' => $record->wilayahDusun?->nama_dusun ?? $record->dusun ?? '-',
                'status' => $record->status_penduduk,
            ],
            'kelahiran' => [
                'nama' => $record->nama_bayi,
                'jenis_kelamin' => $this->gender($record->jenis_kelamin),
                'tanggal' => $this->date($record->tanggal_lahir),
                'ayah' => $record->ayah?->nama_lengkap ?? $record->nama_ayah ?? '-',
                'ibu' => $record->ibu?->nama_lengkap ?? $record->nama_ibu ?? '-',
                'alamat' => $record->alamat ?? '-',
            ],
            'kematian' => [
                'nik' => $record->penduduk?->nik ?? '-',
                'nama' => $record->penduduk?->nama_lengkap ?? '-',
                'tanggal' => $this->date($record->tanggal_meninggal),
                'dusun' => $record->penduduk?->wilayahDusun?->nama_dusun ?? $record->penduduk?->dusun ?? '-',
                'sebab' => $record->sebab_meninggal ?? '-',
                'pelapor' => $record->pelapor?->nama_lengkap ?? $record->pelapor_nama ?? '-',
            ],
            'pendatang' => [
                'nik' => $record->nik,
                'nama' => $record->nama_lengkap,
                'tanggal' => $this->date($record->tanggal_datang),
                'dusun' => $record->dusun?->nama_dusun ?? '-',
                'asal' => collect([$record->desa_asal, $record->kecamatan_asal, $record->kabupaten_asal])->filter()->implode(', ') ?: '-',
                'status' => $record->status,
            ],
            'pindah' => [
                'nik' => $record->penduduk?->nik ?? '-',
                'nama' => $record->penduduk?->nama_lengkap ?? '-',
                'tanggal' => $this->date($record->tanggal_pindah),
                'dusun' => $record->penduduk?->wilayahDusun?->nama_dusun ?? $record->penduduk?->dusun ?? '-',
                'tujuan' => collect([$record->desa_tujuan, $record->kecamatan_tujuan, $record->kabupaten_tujuan])->filter()->implode(', ') ?: '-',
                'status' => $record->status,
            ],
            'bantuan' => [
                'kode' => $record->kode_bantuan,
                'nama' => $record->nama_bantuan,
                'jenis' => $record->jenis_bantuan,
                'sumber' => $record->sumber_bantuan,
                'tahun' => $record->tahun,
                'penerima' => (int) $record->penerima_bantuan_count,
                'status' => $record->status,
            ],
            'surat' => [
                'nomor' => $record->nomor_surat,
                'jenis' => $record->jenisSurat?->nama_surat ?? '-',
                'nama' => $record->penduduk?->nama_lengkap ?? '-',
                'nik' => $record->penduduk?->nik ?? '-',
                'tanggal' => $this->date($record->tanggal_surat),
                'status' => $record->status,
            ],
            default => throw new InvalidArgumentException("Jenis laporan {$jenis} tidak tersedia."),
        };
    }

    /**
     * @param  array<string, string>  $filters
     */
    private function pendudukQuery(array $filters): Builder
    {
        return Penduduk::query()
            ->with('wilayahDusun:id,nama_dusun')
            ->select(['id', 'nik', 'nama_lengkap', 'jenis_kelamin', 'tanggal_lahir', 'dusun_id', 'dusun', 'status_penduduk', 'created_at'])
            ->when($filters['date_from'], fn (Builder $query, string $date) => $query->whereDate('created_at', '>=', $date))
            ->when($filters['date_to'], fn (Builder $query, string $date) => $query->whereDate('created_at', '<=', $date))
            ->when($filters['dusun_id'], fn (Builder $query, string $dusunId) => $query->where('dusun_id', $dusunId))
            ->when($filters['status'], fn (Builder $query, string $status) => $query->where('status_penduduk', $status))
            ->when($filters['search'], fn (Builder $query, string $search) => $query->where(fn (Builder $query) => $query->where('nik', 'like', "%{$search}%")->orWhere('nama_lengkap', 'like', "%{$search}%")))
            ->latest('created_at');
    }

    /**
     * @param  array<string, string>  $filters
     */
    private function kelahiranQuery(array $filters): Builder
    {
        return Kelahiran::query()
            ->with(['ayah:id,nama_lengkap,dusun_id', 'ibu:id,nama_lengkap,dusun_id'])
            ->when($filters['date_from'], fn (Builder $query, string $date) => $query->whereDate('tanggal_lahir', '>=', $date))
            ->when($filters['date_to'], fn (Builder $query, string $date) => $query->whereDate('tanggal_lahir', '<=', $date))
            ->when($filters['dusun_id'], fn (Builder $query, string $dusunId) => $query->where(fn (Builder $query) => $query
                ->whereHas('ayah', fn (Builder $query) => $query->where('dusun_id', $dusunId))
                ->orWhereHas('ibu', fn (Builder $query) => $query->where('dusun_id', $dusunId))))
            ->when($filters['search'], fn (Builder $query, string $search) => $query->where(fn (Builder $query) => $query
                ->where('nama_bayi', 'like', "%{$search}%")
                ->orWhere('nama_ayah', 'like', "%{$search}%")
                ->orWhere('nama_ibu', 'like', "%{$search}%")
                ->orWhereHas('ayah', fn (Builder $query) => $query->where('nama_lengkap', 'like', "%{$search}%"))
                ->orWhereHas('ibu', fn (Builder $query) => $query->where('nama_lengkap', 'like', "%{$search}%"))))
            ->latest('tanggal_lahir');
    }

    /**
     * @param  array<string, string>  $filters
     */
    private function kematianQuery(array $filters): Builder
    {
        return Kematian::query()
            ->with(['penduduk:id,nik,nama_lengkap,dusun_id,dusun', 'penduduk.wilayahDusun:id,nama_dusun', 'pelapor:id,nama_lengkap'])
            ->when($filters['date_from'], fn (Builder $query, string $date) => $query->whereDate('tanggal_meninggal', '>=', $date))
            ->when($filters['date_to'], fn (Builder $query, string $date) => $query->whereDate('tanggal_meninggal', '<=', $date))
            ->when($filters['dusun_id'], fn (Builder $query, string $dusunId) => $query->whereHas('penduduk', fn (Builder $query) => $query->where('dusun_id', $dusunId)))
            ->when($filters['search'], fn (Builder $query, string $search) => $query->whereHas('penduduk', fn (Builder $query) => $query->where('nik', 'like', "%{$search}%")->orWhere('nama_lengkap', 'like', "%{$search}%")))
            ->latest('tanggal_meninggal');
    }

    /**
     * @param  array<string, string>  $filters
     */
    private function pendatangQuery(array $filters): Builder
    {
        return Pendatang::query()
            ->with('dusun:id,nama_dusun')
            ->when($filters['date_from'], fn (Builder $query, string $date) => $query->whereDate('tanggal_datang', '>=', $date))
            ->when($filters['date_to'], fn (Builder $query, string $date) => $query->whereDate('tanggal_datang', '<=', $date))
            ->when($filters['dusun_id'], fn (Builder $query, string $dusunId) => $query->where('dusun_id', $dusunId))
            ->when($filters['status'], fn (Builder $query, string $status) => $query->where('status', $status))
            ->when($filters['search'], fn (Builder $query, string $search) => $query->where(fn (Builder $query) => $query->where('nik', 'like', "%{$search}%")->orWhere('nama_lengkap', 'like', "%{$search}%")))
            ->latest('tanggal_datang');
    }

    /**
     * @param  array<string, string>  $filters
     */
    private function pindahQuery(array $filters): Builder
    {
        return Pindah::query()
            ->with(['penduduk:id,nik,nama_lengkap,dusun_id,dusun', 'penduduk.wilayahDusun:id,nama_dusun'])
            ->when($filters['date_from'], fn (Builder $query, string $date) => $query->whereDate('tanggal_pindah', '>=', $date))
            ->when($filters['date_to'], fn (Builder $query, string $date) => $query->whereDate('tanggal_pindah', '<=', $date))
            ->when($filters['dusun_id'], fn (Builder $query, string $dusunId) => $query->whereHas('penduduk', fn (Builder $query) => $query->where('dusun_id', $dusunId)))
            ->when($filters['status'], fn (Builder $query, string $status) => $query->where('status', $status))
            ->when($filters['search'], fn (Builder $query, string $search) => $query->whereHas('penduduk', fn (Builder $query) => $query->where('nik', 'like', "%{$search}%")->orWhere('nama_lengkap', 'like', "%{$search}%")))
            ->latest('tanggal_pindah');
    }

    /**
     * @param  array<string, string>  $filters
     */
    private function bantuanQuery(array $filters): Builder
    {
        return Bantuan::query()
            ->withCount(['penerimaBantuan' => fn (Builder $query) => $query->when($filters['dusun_id'], fn (Builder $query, string $dusunId) => $query->whereHas('penduduk', fn (Builder $query) => $query->where('dusun_id', $dusunId)))])
            ->when($filters['date_from'], fn (Builder $query, string $date) => $query->whereDate('created_at', '>=', $date))
            ->when($filters['date_to'], fn (Builder $query, string $date) => $query->whereDate('created_at', '<=', $date))
            ->when($filters['status'], fn (Builder $query, string $status) => $query->where('status', $status))
            ->when($filters['search'], fn (Builder $query, string $search) => $query->where(fn (Builder $query) => $query
                ->where('kode_bantuan', 'like', "%{$search}%")
                ->orWhere('nama_bantuan', 'like', "%{$search}%")
                ->orWhere('jenis_bantuan', 'like', "%{$search}%")
                ->orWhere('sumber_bantuan', 'like', "%{$search}%")))
            ->latest('created_at');
    }

    /**
     * @param  array<string, string>  $filters
     */
    private function suratQuery(array $filters): Builder
    {
        return Surat::query()
            ->with(['jenisSurat:id,nama_surat', 'penduduk:id,nik,nama_lengkap,dusun_id'])
            ->when($filters['date_from'], fn (Builder $query, string $date) => $query->whereDate('tanggal_surat', '>=', $date))
            ->when($filters['date_to'], fn (Builder $query, string $date) => $query->whereDate('tanggal_surat', '<=', $date))
            ->when($filters['dusun_id'], fn (Builder $query, string $dusunId) => $query->whereHas('penduduk', fn (Builder $query) => $query->where('dusun_id', $dusunId)))
            ->when($filters['status'], fn (Builder $query, string $status) => $query->where('status', $status))
            ->when($filters['jenis_surat_id'], fn (Builder $query, string $jenisSuratId) => $query->where('jenis_surat_id', $jenisSuratId))
            ->when($filters['search'], fn (Builder $query, string $search) => $query->where(fn (Builder $query) => $query
                ->where('nomor_surat', 'like', "%{$search}%")
                ->orWhereHas('penduduk', fn (Builder $query) => $query->where('nik', 'like', "%{$search}%")->orWhere('nama_lengkap', 'like', "%{$search}%"))))
            ->latest('tanggal_surat');
    }

    private function guardType(string $jenis): void
    {
        if (! array_key_exists($jenis, $this->types())) {
            throw new InvalidArgumentException("Jenis laporan {$jenis} tidak tersedia.");
        }
    }

    private function gender(?string $value): string
    {
        return match ($value) {
            'L', 'LAKI-LAKI' => 'Laki-laki',
            'P', 'PEREMPUAN' => 'Perempuan',
            default => $value ?: '-',
        };
    }

    private function date(mixed $value): string
    {
        if ($value instanceof Carbon) {
            return $value->translatedFormat('d M Y');
        }

        if (is_string($value) && $value !== '') {
            return Carbon::parse($value)->translatedFormat('d M Y');
        }

        return '-';
    }
}
