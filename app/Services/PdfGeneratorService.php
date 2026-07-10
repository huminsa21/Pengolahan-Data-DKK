<?php

namespace App\Services;

use App\Models\ProfilDesa;
use Barryvdh\DomPDF\Facade\Pdf;
use Barryvdh\DomPDF\PDF as DomPdf;

class PdfGeneratorService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function generateSurat(array $data = []): DomPdf
    {
        return $this->generate('Surat', $data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function generateLaporan(array $data = []): DomPdf
    {
        return $this->generate('Laporan', $data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function generate(string $jenisDokumen, array $data): DomPdf
    {
        return Pdf::loadView('pdf.base', [
            ...$this->defaultData($jenisDokumen),
            ...$data,
        ])->setPaper('a4');
    }

    /**
     * @return array<string, mixed>
     */
    private function defaultData(string $jenisDokumen): array
    {
        $profilDesa = ProfilDesa::current();

        return [
            'jenisDokumen' => $jenisDokumen,
            'namaAplikasi' => config('desa.nama_aplikasi', 'Sistem Informasi Kependudukan Desa'),
            'namaDesa' => $profilDesa->nama_desa,
            'kecamatan' => $profilDesa->kecamatan,
            'kabupaten' => $profilDesa->kabupaten,
            'provinsi' => $profilDesa->provinsi,
            'alamatDesa' => $profilDesa->alamat ?: 'Alamat kantor desa',
            'kodePos' => $profilDesa->kode_pos,
            'teleponDesa' => $profilDesa->telepon,
            'emailDesa' => $profilDesa->email,
            'logoPath' => $profilDesa->logoPublicPath(),
            'nomorSurat' => '-',
            'tanggal' => now()->translatedFormat('d F Y'),
            'judul' => $jenisDokumen,
            'isi' => 'Isi dokumen disiapkan oleh modul terkait.',
            'namaKepalaDesa' => $profilDesa->nama_kepala_desa ?: 'Kepala Desa',
            'nipKepalaDesa' => $profilDesa->nip_kepala_desa,
        ];
    }
}
