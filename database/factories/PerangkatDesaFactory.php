<?php

namespace Database\Factories;

use App\Models\Penduduk;
use App\Models\PerangkatDesa;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PerangkatDesa>
 */
class PerangkatDesaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'penduduk_id' => Penduduk::factory(),
            'jabatan' => fake()->randomElement(PerangkatDesa::JABATAN),
            'nomor_sk' => fake()->optional()->bothify('SK-###/DS/####'),
            'tanggal_mulai' => fake()->optional()->date(),
            'tanggal_selesai' => null,
            'status' => 'AKTIF',
            'user_id' => null,
            'created_by' => null,
        ];
    }
}
