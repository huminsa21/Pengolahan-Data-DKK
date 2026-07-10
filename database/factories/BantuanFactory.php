<?php

namespace Database\Factories;

use App\Models\Bantuan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Bantuan>
 */
class BantuanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'kode_bantuan' => fake()->unique()->bothify('BNT-####'),
            'nama_bantuan' => fake()->randomElement(['Bantuan Pangan', 'Bantuan Tunai', 'Bantuan Pendidikan']),
            'jenis_bantuan' => fake()->randomElement(['SEMBAKO', 'TUNAI', 'PENDIDIKAN']),
            'sumber_bantuan' => fake()->randomElement(['APBN', 'APBD', 'Dana Desa']),
            'tahun' => fake()->numberBetween((int) date('Y') - 2, (int) date('Y')),
            'deskripsi' => fake()->sentence(),
            'status' => fake()->randomElement(['AKTIF', 'NONAKTIF']),
            'is_published' => false,
            'published_at' => null,
            'pengumuman_id' => null,
            'tampilkan_penerima' => fake()->boolean(80),
        ];
    }
}
