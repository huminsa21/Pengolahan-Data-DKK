<?php

namespace Database\Factories;

use App\Models\Kelahiran;
use App\Models\Penduduk;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Kelahiran>
 */
class KelahiranFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $jenisKelamin = fake()->randomElement(['L', 'P']);
        $pelaporTipe = fake()->randomElement(['PENDUDUK', 'KELUARGA', 'KEPALA_DUSUN', 'PERANGKAT_DESA']);
        $isPelaporPenduduk = $pelaporTipe === 'PENDUDUK';

        return [
            'nama_bayi' => fake()->firstName($jenisKelamin === 'L' ? 'male' : 'female'),
            'jenis_kelamin' => $jenisKelamin,
            'tanggal_lahir' => fake()->dateTimeBetween('-1 year')->format('Y-m-d'),
            'tempat_lahir' => fake()->city(),
            'waktu_lahir' => fake()->time('H:i:s'),
            'ayah_id' => Penduduk::factory(),
            'ibu_id' => Penduduk::factory(),
            'pelapor_tipe' => $pelaporTipe,
            'pelapor_id' => $isPelaporPenduduk ? Penduduk::factory() : null,
            'pelapor_nama' => $isPelaporPenduduk ? null : fake()->name(),
            'pelapor_kontak' => fake()->optional(0.7)->phoneNumber(),
            'nama_ayah' => null,
            'nama_ibu' => null,
            'alamat' => fake()->address(),
            'keterangan' => fake()->optional()->sentence(),
        ];
    }
}
