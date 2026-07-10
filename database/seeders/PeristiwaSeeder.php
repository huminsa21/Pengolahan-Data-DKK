<?php

namespace Database\Seeders;

use App\Models\Kelahiran;
use App\Models\Kematian;
use App\Models\Pendatang;
use App\Models\Penduduk;
use App\Models\Pindah;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Seeder;

class PeristiwaSeeder extends Seeder
{
    /**
     * Seed the application's peristiwa kependudukan data.
     */
    public function run(): void
    {
        $penduduk = Penduduk::query()->limit(25)->get();

        if ($penduduk->isEmpty()) {
            return;
        }

        Kelahiran::factory()
            ->count(12)
            ->recycle($penduduk)
            ->sequence(fn () => $this->pelaporData($penduduk))
            ->create();

        Kematian::factory()
            ->count(6)
            ->recycle($penduduk)
            ->sequence(fn () => $this->pelaporData($penduduk))
            ->create();

        Pendatang::factory()
            ->count(8)
            ->recycle($penduduk)
            ->sequence(fn () => $this->pelaporData($penduduk))
            ->create();

        Pindah::factory()
            ->count(8)
            ->recycle($penduduk)
            ->sequence(fn () => $this->pelaporData($penduduk))
            ->create();
    }

    /**
     * @param  Collection<int, Penduduk>  $penduduk
     * @return array<string, mixed>
     */
    private function pelaporData(Collection $penduduk): array
    {
        $pelaporTipe = fake()->randomElement(['PENDUDUK', 'KELUARGA', 'KEPALA_DUSUN', 'PERANGKAT_DESA']);

        if ($pelaporTipe !== 'PENDUDUK') {
            return [
                'pelapor_tipe' => $pelaporTipe,
                'pelapor_id' => null,
                'pelapor_nama' => fake()->name(),
                'pelapor_kontak' => fake()->optional(0.7)->phoneNumber(),
            ];
        }

        /** @var Penduduk $pelapor */
        $pelapor = $penduduk->random();

        return [
            'pelapor_tipe' => 'PENDUDUK',
            'pelapor_id' => $pelapor->id,
            'pelapor_nama' => $pelapor->nama_lengkap,
            'pelapor_kontak' => $pelapor->no_hp,
        ];
    }
}
