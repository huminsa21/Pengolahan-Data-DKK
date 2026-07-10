<?php

namespace Database\Factories;

use App\Models\Pendatang;
use App\Models\Penduduk;
use App\Models\Dusun;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pendatang>
 */
class PendatangFactory extends Factory
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
            'penduduk_id' => null,
            'pelapor_tipe' => $pelaporTipe,
            'pelapor_id' => $isPelaporPenduduk ? Penduduk::factory() : null,
            'pelapor_nama' => $isPelaporPenduduk ? null : fake()->name(),
            'pelapor_kontak' => fake()->optional(0.7)->phoneNumber(),
            'nik' => fake()->unique()->numerify('################'),
            'nama_lengkap' => fake()->name($jenisKelamin === 'L' ? 'male' : 'female'),
            'jenis_kelamin' => $jenisKelamin,
            'tempat_lahir' => fake()->city(),
            'tanggal_lahir' => fake()->dateTimeBetween('-70 years', '-17 years')->format('Y-m-d'),
            'agama' => fake()->randomElement(['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha']),
            'status_perkawinan' => fake()->randomElement(['BELUM KAWIN', 'KAWIN']),
            'pendidikan' => fake()->randomElement(['SD', 'SMP', 'SMA', 'S1']),
            'pekerjaan' => fake()->jobTitle(),
            'no_hp' => fake()->optional()->phoneNumber(),
            'alamat_asal' => fake()->address(),
            'desa_asal' => fake()->city(),
            'kecamatan_asal' => fake()->city(),
            'kabupaten_asal' => fake()->city(),
            'provinsi_asal' => fake()->state(),
            'dusun_id' => Dusun::factory(),
            'alamat_tujuan' => fake()->address(),
            'rt' => fake()->numerify('0##'),
            'rw' => fake()->numerify('0##'),
            'tanggal_datang' => fake()->dateTimeBetween('-1 year')->format('Y-m-d'),
            'alasan_datang' => fake()->randomElement(['Pekerjaan', 'Keluarga', 'Pendidikan']),
            'status' => fake()->randomElement(['PROSES', 'DITERIMA', 'DITOLAK']),
            'keterangan' => fake()->optional()->sentence(),
        ];
    }
}
