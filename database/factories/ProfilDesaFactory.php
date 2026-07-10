<?php

namespace Database\Factories;

use App\Models\ProfilDesa;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProfilDesa>
 */
class ProfilDesaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_desa' => 'Desa '.$this->faker->city(),
            'kecamatan' => $this->faker->city(),
            'kabupaten' => $this->faker->city(),
            'provinsi' => $this->faker->state(),
            'alamat' => $this->faker->address(),
            'kode_pos' => $this->faker->postcode(),
            'telepon' => $this->faker->phoneNumber(),
            'email' => $this->faker->safeEmail(),
            'website' => $this->faker->url(),
            'nama_kepala_desa' => $this->faker->name(),
            'nip_kepala_desa' => $this->faker->numerify('##################'),
            'logo_path' => 'img/logo.png',
            'visi' => $this->faker->sentence(),
            'misi' => $this->faker->paragraph(),
            'sejarah' => $this->faker->paragraphs(2, true),
            'jam_pelayanan' => 'Senin - Jumat, 08.00 - 15.00',
            'maps_embed' => null,
            'facebook' => null,
            'instagram' => null,
            'youtube' => null,
            'background_path' => null,
            'background_type' => null,
            'background_color' => null,
            'background_overlay_opacity' => 0.35,
        ];
    }
}
