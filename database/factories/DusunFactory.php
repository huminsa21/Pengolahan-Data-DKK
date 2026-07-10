<?php

namespace Database\Factories;

use App\Models\Dusun;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Dusun>
 */
class DusunFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'kode_dusun' => fake()->boolean(80) ? fake()->unique()->bothify('DSN-##') : null,
            'nama_dusun' => fake()->randomElement(['Dusun I', 'Dusun II', 'Dusun III', 'Dusun IV']),
            'kepala_dusun' => fake()->name(),
            'no_hp_kepala_dusun' => fake()->optional()->phoneNumber(),
            'keterangan' => fake()->optional()->sentence(),
            'is_active' => true,
        ];
    }
}
