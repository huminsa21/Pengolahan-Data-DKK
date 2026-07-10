<?php

namespace Database\Seeders;

use App\Models\Dusun;
use App\Models\Penduduk;
use Illuminate\Database\Seeder;

class PendudukSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dusun = Dusun::pluck('id', 'nama_dusun');

        Penduduk::factory()
            ->count(20)
            ->create(function () use ($dusun): array {
                $namaDusun = $dusun->keys()->random();

                return [
                    'dusun_id' => $dusun[$namaDusun],
                    'dusun' => $namaDusun,
                ];
            });
    }
}
