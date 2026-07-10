<?php

namespace Database\Factories;

use App\Models\Kematian;
use App\Models\Penduduk;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Kematian>
 */
class KematianFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $pelaporTipe = fake()->randomElement(['PENDUDUK', 'KELUARGA', 'KEPALA_DUSUN', 'PERANGKAT_DESA']);
        $isPelaporPenduduk = $pelaporTipe === 'PENDUDUK';

        return [
            'penduduk_id' => Penduduk::factory(),
            'pelapor_tipe' => $pelaporTipe,
            'pelapor_id' => $isPelaporPenduduk ? Penduduk::factory() : null,
            'pelapor_nama' => $isPelaporPenduduk ? null : fake()->name(),
            'pelapor_kontak' => fake()->optional(0.7)->phoneNumber(),
            'tanggal_meninggal' => fake()->dateTimeBetween('-2 years')->format('Y-m-d'),
            'tempat_meninggal' => fake()->city(),
            'sebab_meninggal' => fake()->randomElement(['Sakit', 'Kecelakaan', 'Usia lanjut']),
            'keterangan' => fake()->optional()->sentence(),
        ];
    }
}
