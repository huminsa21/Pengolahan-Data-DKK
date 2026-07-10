<?php

namespace Database\Seeders;

use App\Models\Bantuan;
use Illuminate\Database\Seeder;

class BantuanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bantuan = [
            [
                'kode_bantuan' => 'BLT-DD',
                'nama_bantuan' => 'Bantuan Langsung Tunai Dana Desa',
                'jenis_bantuan' => 'TUNAI',
                'sumber_bantuan' => 'Dana Desa',
                'tahun' => (int) date('Y'),
                'deskripsi' => 'Program bantuan tunai untuk keluarga penerima manfaat.',
                'status' => 'AKTIF',
            ],
            [
                'kode_bantuan' => 'BPNT',
                'nama_bantuan' => 'Bantuan Pangan Non Tunai',
                'jenis_bantuan' => 'SEMBAKO',
                'sumber_bantuan' => 'APBN',
                'tahun' => (int) date('Y'),
                'deskripsi' => 'Program bantuan pangan untuk warga yang memenuhi kriteria.',
                'status' => 'AKTIF',
            ],
            [
                'kode_bantuan' => 'BEASISWA-DESA',
                'nama_bantuan' => 'Beasiswa Pendidikan Desa',
                'jenis_bantuan' => 'PENDIDIKAN',
                'sumber_bantuan' => 'APBD',
                'tahun' => (int) date('Y'),
                'deskripsi' => 'Program bantuan pendidikan untuk pelajar desa.',
                'status' => 'AKTIF',
            ],
        ];

        foreach ($bantuan as $program) {
            Bantuan::updateOrCreate(
                ['kode_bantuan' => $program['kode_bantuan']],
                $program,
            );
        }
    }
}
