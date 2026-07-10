<?php

namespace Database\Factories;

use App\Models\Pengumuman;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pengumuman>
 */
class PengumumanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'judul' => fake()->sentence(4),
            'isi' => fake()->paragraphs(3, true),
            'tanggal_publish' => fake()->dateTimeBetween('-1 month', '+1 month'),
            'status' => fake()->randomElement(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
            'created_by' => User::factory(),
        ];
    }
}
