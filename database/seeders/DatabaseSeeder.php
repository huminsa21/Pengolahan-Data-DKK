<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ProfilDesaSeeder::class,
            RolePermissionSeeder::class,
            AdminSeeder::class,
            DusunSeeder::class,
            JenisSuratSeeder::class,
            PendudukSeeder::class,
            PeristiwaSeeder::class,
            BantuanSeeder::class,
            PengumumanSeeder::class,
        ]);
    }
}
