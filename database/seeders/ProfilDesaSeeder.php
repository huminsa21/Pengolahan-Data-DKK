<?php

namespace Database\Seeders;

use App\Models\ProfilDesa;
use Illuminate\Database\Seeder;

class ProfilDesaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ProfilDesa::query()->firstOrCreate([], [
            'nama_desa' => 'Desa Kodon-Kodon',
            'kecamatan' => 'Merek',
            'kabupaten' => 'Karo',
            'provinsi' => 'Sumatera Utara',
            'logo_path' => 'img/logo.png',
        ]);
    }
}
