<?php

namespace App\Services;

use App\Models\JenisSurat;
use App\Models\Kelahiran;
use App\Models\Kematian;
use App\Models\Pendatang;
use App\Models\Penduduk;
use App\Models\Pindah;
use App\Models\ProfilDesa;
use App\Models\Surat;
use Barryvdh\DomPDF\Facade\Pdf;
use Barryvdh\DomPDF\PDF as DomPdf;
use Carbon\CarbonInterface;
use Illuminate\Http\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class SuratService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function createDraft(array $data): Surat
    {
        return Surat::create([
            ...$data,
            'nomor_surat' => null,
            'status' => $data['status'] ?? 'DRAFT',
        ])->refresh();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function updateDraft(Surat $surat, array $data): Surat
    {
        if (! $surat->isDraft()) {
            throw ValidationException::withMessages([
                'status' => 'Hanya surat draft yang dapat diperbarui.',
            ]);
        }

        $surat->update(Arr::except($data, ['nomor_surat', 'status', 'dibuat_oleh']));

        return $surat->refresh();
    }

    public function complete(Surat $surat): Surat
    {
        if ($surat->status === 'DIBATALKAN') {
            throw ValidationException::withMessages([
                'status' => 'Surat yang dibatalkan tidak dapat diselesaikan.',
            ]);
        }

        return DB::transaction(function () use ($surat): Surat {
            $surat = Surat::query()
                ->with('jenisSurat')
                ->whereKey($surat->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($surat->isSelesai() && $surat->nomor_surat) {
                return $surat;
            }

            $surat->forceFill([
                'nomor_surat' => $this->generateNomorSurat($surat->jenisSurat, $surat->tanggal_surat),
                'data_json' => $this->buildDataJson($surat),
                'status' => 'SELESAI',
            ])->save();

            return $surat->refresh();
        });
    }

    public function cancel(Surat $surat): Surat
    {
        if ($surat->isSelesai()) {
            throw ValidationException::withMessages([
                'status' => 'Surat selesai tidak dapat dibatalkan.',
            ]);
        }

        $surat->update(['status' => 'DIBATALKAN']);

        return $surat->refresh();
    }

    public function generateNomorSurat(JenisSurat $jenisSurat, CarbonInterface $tanggal): string
    {
        $lastNumber = Surat::query()
            ->whereYear('tanggal_surat', $tanggal->year)
            ->whereNotNull('nomor_surat')
            ->lockForUpdate()
            ->pluck('nomor_surat')
            ->map(fn (string $nomorSurat): int => (int) Str::before($nomorSurat, '/'))
            ->max() ?? 0;

        $sequence = str_pad((string) ($lastNumber + 1), 3, '0', STR_PAD_LEFT);

        return "{$sequence}/{$jenisSurat->kode_surat}/DS/{$this->romanMonth((int) $tanggal->format('n'))}/{$tanggal->year}";
    }

    /**
     * @return array<string, mixed>
     */
    public function buildDataJson(Surat $surat): array
    {
        $surat->loadMissing(['jenisSurat', 'penduduk.wilayahDusun']);

        return match ($surat->jenisSurat->kode_surat) {
            'DOMISILI' => ['penduduk' => $this->pendudukPayload($surat->penduduk), 'keperluan' => $surat->keperluan],
            'KELAHIRAN' => ['kelahiran' => $this->kelahiranPayload($this->referenceModel(Kelahiran::class, $surat))],
            'KEMATIAN' => ['kematian' => $this->kematianPayload($this->referenceModel(Kematian::class, $surat))],
            'PINDAH' => ['pindah' => $this->pindahPayload($this->referenceModel(Pindah::class, $surat))],
            'DATANG' => ['pendatang' => $this->pendatangPayload($this->referenceModel(Pendatang::class, $surat), $surat->penduduk)],
            default => ['penduduk' => $this->pendudukPayload($surat->penduduk), 'keperluan' => $surat->keperluan],
        };
    }

    public function previewPdf(Surat $surat): Response
    {
        return $this->makePdf($surat)->stream($this->filename($surat));
    }

    public function downloadPdf(Surat $surat): Response
    {
        if (! $surat->isSelesai()) {
            throw ValidationException::withMessages([
                'status' => 'Surat draft belum dapat diunduh sebagai dokumen final.',
            ]);
        }

        return $this->makePdf($surat)->download($this->filename($surat));
    }

    private function makePdf(Surat $surat): DomPdf
    {
        $surat->loadMissing(['jenisSurat', 'penduduk.wilayahDusun', 'pembuat']);
        $desa = ProfilDesa::current()->toPdfArray();

        $view = 'pdf.surat.'.Str::lower($surat->jenisSurat->kode_surat);

        if (! view()->exists($view)) {
            $view = 'pdf.surat.base';
        }

        return Pdf::loadView($view, [
            'surat' => $surat,
            'data' => $surat->data_json ?: $this->buildDataJson($surat),
            'isDraft' => ! $surat->isSelesai(),
            'desa' => $desa,
        ])->setPaper('a4');
    }

    private function filename(Surat $surat): string
    {
        $nomorSurat = Str::of($surat->nomor_surat ?: 'draft')
            ->replace('/', '-')
            ->lower();

        return 'surat-'.Str::lower($surat->jenisSurat->kode_surat).'-'.$nomorSurat.'.pdf';
    }

    /**
     * @return array<string, mixed>|null
     */
    private function pendudukPayload(?Penduduk $penduduk): ?array
    {
        if (! $penduduk) {
            return null;
        }

        return [
            'nama' => $penduduk->nama_lengkap,
            'nik' => $penduduk->nik,
            'tempat_lahir' => $penduduk->tempat_lahir,
            'tanggal_lahir' => $penduduk->tanggal_lahir?->translatedFormat('d F Y'),
            'jenis_kelamin' => $penduduk->jenis_kelamin,
            'pekerjaan' => $penduduk->pekerjaan,
            'alamat' => $penduduk->alamat,
            'dusun' => $penduduk->wilayahDusun?->nama_dusun ?? $penduduk->dusun,
            'rt' => $penduduk->rt,
            'rw' => $penduduk->rw,
            'desa' => $penduduk->desa,
            'kecamatan' => $penduduk->kecamatan,
            'kabupaten' => $penduduk->kabupaten,
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    private function kelahiranPayload(?Kelahiran $kelahiran): ?array
    {
        if (! $kelahiran) {
            return null;
        }

        $kelahiran->loadMissing(['ayah', 'ibu', 'pelaporPenduduk']);

        return [
            'nama_bayi' => $kelahiran->nama_bayi,
            'jenis_kelamin' => $kelahiran->jenis_kelamin,
            'tempat_lahir' => $kelahiran->tempat_lahir,
            'tanggal_lahir' => $kelahiran->tanggal_lahir?->translatedFormat('d F Y'),
            'ayah' => $kelahiran->ayah?->nama_lengkap ?? $kelahiran->nama_ayah,
            'ibu' => $kelahiran->ibu?->nama_lengkap ?? $kelahiran->nama_ibu,
            'pelapor' => $kelahiran->pelaporPenduduk?->nama_lengkap ?? $kelahiran->pelapor_nama,
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    private function kematianPayload(?Kematian $kematian): ?array
    {
        if (! $kematian) {
            return null;
        }

        $kematian->loadMissing(['penduduk', 'pelaporPenduduk']);

        return [
            'penduduk' => $this->pendudukPayload($kematian->penduduk),
            'tanggal_meninggal' => $kematian->tanggal_meninggal?->translatedFormat('d F Y'),
            'tempat_meninggal' => $kematian->tempat_meninggal,
            'sebab_meninggal' => $kematian->sebab_meninggal,
            'pelapor' => $kematian->pelaporPenduduk?->nama_lengkap ?? $kematian->pelapor_nama,
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    private function pindahPayload(?Pindah $pindah): ?array
    {
        if (! $pindah) {
            return null;
        }

        $pindah->loadMissing('penduduk.wilayahDusun');

        return [
            'penduduk' => $this->pendudukPayload($pindah->penduduk),
            'alamat_asal' => $pindah->penduduk?->alamat,
            'alamat_tujuan' => collect([$pindah->alamat_tujuan, $pindah->desa_tujuan, $pindah->kecamatan_tujuan, $pindah->kabupaten_tujuan, $pindah->provinsi_tujuan])->filter()->implode(', '),
            'tanggal_pindah' => $pindah->tanggal_pindah?->translatedFormat('d F Y'),
            'alasan_pindah' => $pindah->alasan_pindah,
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    private function pendatangPayload(?Pendatang $pendatang, ?Penduduk $penduduk): ?array
    {
        if (! $pendatang && ! $penduduk) {
            return null;
        }

        return [
            'nama' => $pendatang?->nama_lengkap ?? $penduduk?->nama_lengkap,
            'nik' => $pendatang?->nik ?? $penduduk?->nik,
            'alamat_asal' => collect([$pendatang?->alamat_asal, $pendatang?->desa_asal, $pendatang?->kecamatan_asal, $pendatang?->kabupaten_asal, $pendatang?->provinsi_asal])->filter()->implode(', '),
            'alamat_tujuan' => $pendatang?->alamat_tujuan ?? $penduduk?->alamat,
            'tanggal_datang' => $pendatang?->tanggal_datang?->translatedFormat('d F Y'),
            'alasan_datang' => $pendatang?->alasan_datang,
        ];
    }

    /**
     * @template TModel of \Illuminate\Database\Eloquent\Model
     *
     * @param  class-string<TModel>  $modelClass
     * @return TModel|null
     */
    private function referenceModel(string $modelClass, Surat $surat)
    {
        if (! $surat->referensi_id) {
            return null;
        }

        return $modelClass::query()->find($surat->referensi_id);
    }

    private function romanMonth(int $month): string
    {
        return [
            1 => 'I',
            2 => 'II',
            3 => 'III',
            4 => 'IV',
            5 => 'V',
            6 => 'VI',
            7 => 'VII',
            8 => 'VIII',
            9 => 'IX',
            10 => 'X',
            11 => 'XI',
            12 => 'XII',
        ][$month];
    }
}
