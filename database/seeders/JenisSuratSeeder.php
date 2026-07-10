<?php

namespace Database\Seeders;

use App\Models\JenisSurat;
use Illuminate\Database\Seeder;

class JenisSuratSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jenisSurat = [
            ['kode_surat' => 'DOMISILI', 'nama_surat' => 'Surat Keterangan Domisili'],
            ['kode_surat' => 'PINDAH', 'nama_surat' => 'Surat Keterangan Pindah'],
            ['kode_surat' => 'DATANG', 'nama_surat' => 'Surat Keterangan Datang'],
            ['kode_surat' => 'KELAHIRAN', 'nama_surat' => 'Surat Keterangan Kelahiran'],
            ['kode_surat' => 'KEMATIAN', 'nama_surat' => 'Surat Keterangan Kematian'],
        ];

        foreach ($jenisSurat as $surat) {
            JenisSurat::updateOrCreate(
                ['kode_surat' => $surat['kode_surat']],
                [
                    'nama_surat' => $surat['nama_surat'],
                    'template_surat' => 'Template '.$surat['nama_surat'].' untuk {{ nama_lengkap }} dengan keperluan {{ keperluan }}.',
                    'is_active' => true,
                ],
            );
        }
    }
}
