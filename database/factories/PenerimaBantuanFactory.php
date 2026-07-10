<?php

namespace Database\Factories;

use App\Models\PenerimaBantuan;
use App\Models\Bantuan;
use App\Models\Penduduk;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PenerimaBantuan>
 */
class PenerimaBantuanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'bantuan_id' => Bantuan::factory(),
            'penduduk_id' => Penduduk::factory(),
            'tanggal_terima' => fake()->dateTimeBetween('-1 year')->format('Y-m-d'),
            'nominal' => fake()->optional()->randomFloat(2, 100000, 1500000),
            'status' => fake()->randomElement(['AKTIF', 'SELESAI', 'DIBATALKAN']),
            'keterangan' => fake()->optional()->sentence(),
        ];
    }
}
