<?php

namespace Database\Factories;

use App\Models\Penduduk;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Penduduk>
 */
class PendudukFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $jenisKelamin = fake()->randomElement(['LAKI-LAKI', 'PEREMPUAN']);
        $isKepalaKeluarga = fake()->boolean(25);

        return [
            'nik' => fake()->unique()->numerify('################'),
            'nama_lengkap' => fake()->name($jenisKelamin === 'LAKI-LAKI' ? 'male' : 'female'),
            'jenis_kelamin' => $jenisKelamin,
            'tempat_lahir' => fake()->city(),
            'tanggal_lahir' => fake()->dateTimeBetween('-75 years', '-1 years')->format('Y-m-d'),
            'agama' => fake()->randomElement(['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu']),
            'status_perkawinan' => fake()->randomElement(['BELUM KAWIN', 'KAWIN', 'CERAI HIDUP', 'CERAI MATI']),
            'pendidikan' => fake()->randomElement(['SD', 'SMP', 'SMA', 'D3', 'S1', 'S2']),
            'pekerjaan' => fake()->randomElement(['Petani', 'Pedagang', 'Guru', 'Wiraswasta', 'Buruh', 'Belum Bekerja']),
            'no_hp' => fake()->optional()->phoneNumber(),
            'alamat' => fake()->streetAddress(),
            'dusun' => fake()->randomElement(['Dusun Krajan', 'Dusun Tengah', 'Dusun Timur']),
            'rt' => str_pad((string) fake()->numberBetween(1, 9), 3, '0', STR_PAD_LEFT),
            'rw' => str_pad((string) fake()->numberBetween(1, 5), 3, '0', STR_PAD_LEFT),
            'desa' => 'Desa Sukamaju',
            'kecamatan' => 'Kecamatan Makmur',
            'kabupaten' => 'Kabupaten Sentosa',
            'provinsi' => 'Jawa Tengah',
            'no_kk' => fake()->optional(0.8)->numerify('################'),
            'hubungan_keluarga' => $isKepalaKeluarga ? 'KEPALA KELUARGA' : fake()->randomElement(['ISTRI', 'ANAK', 'FAMILI LAIN']),
            'is_kepala_keluarga' => $isKepalaKeluarga,
            'status_penduduk' => 'AKTIF',
        ];
    }
}
