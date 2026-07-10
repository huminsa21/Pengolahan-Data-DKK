<?php

namespace Database\Factories;

use App\Models\Pindah;
use App\Models\Penduduk;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pindah>
 */
class PindahFactory extends Factory
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
            'tanggal_pindah' => fake()->dateTimeBetween('-1 year')->format('Y-m-d'),
            'alamat_tujuan' => fake()->address(),
            'desa_tujuan' => fake()->city(),
            'kecamatan_tujuan' => fake()->city(),
            'kabupaten_tujuan' => fake()->city(),
            'provinsi_tujuan' => fake()->state(),
            'alasan_pindah' => fake()->randomElement(['Pekerjaan', 'Keluarga', 'Pendidikan']),
            'status' => fake()->randomElement(['PROSES', 'SELESAI', 'DIBATALKAN']),
            'keterangan' => fake()->optional()->sentence(),
        ];
    }
}
