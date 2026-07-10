<?php

namespace Database\Factories;

use App\Models\Surat;
use App\Models\JenisSurat;
use App\Models\Penduduk;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Surat>
 */
class SuratFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nomor_surat' => fake()->unique()->numerify('###/DOMISILI/DS/##/####'),
            'jenis_surat_id' => JenisSurat::factory(),
            'penduduk_id' => Penduduk::factory(),
            'referensi_tipe' => null,
            'referensi_id' => null,
            'tanggal_surat' => fake()->dateTimeBetween('-6 months')->format('Y-m-d'),
            'keperluan' => fake()->sentence(4),
            'data_json' => ['catatan' => fake()->sentence()],
            'status' => fake()->randomElement(['DRAFT', 'SELESAI', 'DIBATALKAN']),
            'dibuat_oleh' => User::factory(),
        ];
    }
}
