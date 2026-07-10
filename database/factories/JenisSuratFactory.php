<?php

namespace Database\Factories;

use App\Models\JenisSurat;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<JenisSurat>
 */
class JenisSuratFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'kode_surat' => fake()->unique()->bothify('JS-###'),
            'nama_surat' => fake()->words(3, true),
            'template_surat' => 'Template surat {{ nama_lengkap }} untuk keperluan {{ keperluan }}.',
            'is_active' => true,
        ];
    }
}
