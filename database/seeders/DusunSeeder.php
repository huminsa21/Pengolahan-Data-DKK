<?php

namespace Database\Seeders;

use App\Models\Dusun;
use Illuminate\Database\Seeder;

class DusunSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dusun = [
            ['kode_dusun' => 'DSN-001', 'nama_dusun' => 'Dusun I', 'kepala_dusun' => 'Kepala Dusun I'],
            ['kode_dusun' => 'DSN-002', 'nama_dusun' => 'Dusun II', 'kepala_dusun' => 'Kepala Dusun II'],
            ['kode_dusun' => 'DSN-003', 'nama_dusun' => 'Dusun III', 'kepala_dusun' => 'Kepala Dusun III'],
            ['kode_dusun' => 'DSN-004', 'nama_dusun' => 'Dusun IV', 'kepala_dusun' => 'Kepala Dusun IV'],
        ];

        foreach ($dusun as $item) {
            Dusun::updateOrCreate(
                ['kode_dusun' => $item['kode_dusun']],
                [
                    ...$item,
                    'no_hp_kepala_dusun' => null,
                    'keterangan' => null,
                    'is_active' => true,
                ],
            );
        }
    }
}
