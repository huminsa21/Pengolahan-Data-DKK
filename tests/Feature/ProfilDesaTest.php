<?php

use App\Models\Penduduk;
use App\Models\PerangkatDesa;
use App\Models\ProfilDesa;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;

test('profil desa current returns fallback when table is empty', function () {
    $profilDesa = ProfilDesa::current();

    expect($profilDesa->exists)->toBeFalse()
        ->and($profilDesa->nama_desa)->toBe('Desa Kodon-Kodon')
        ->and($profilDesa->logoUrl())->toBe(asset('img/logo.png'));
});

test('profil desa seeder creates default profile', function () {
    $this->seed(\Database\Seeders\ProfilDesaSeeder::class);

    expect(ProfilDesa::query()->count())->toBe(1)
        ->and(ProfilDesa::current()->nama_desa)->toBe('Desa Kodon-Kodon')
        ->and(ProfilDesa::current()->logo_path)->toBe('img/logo.png');
});

test('authorized roles can view and update profil desa', function () {
    $this->seed(RolePermissionSeeder::class);
    $user = User::factory()->create();
    $user->assignRole(Role::findByName('Super Admin'));

    $this->actingAs($user)
        ->get('/profil-desa')
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('profil-desa/show')
            ->where('profilDesa.nama_desa', 'Desa Kodon-Kodon'));

    $this->actingAs($user)
        ->put('/profil-desa', [
            'nama_desa' => 'Desa Baru',
            'kecamatan' => 'Merek',
            'kabupaten' => 'Karo',
            'provinsi' => 'Sumatera Utara',
            'alamat' => 'Jalan Desa',
            'kode_pos' => '22173',
            'telepon' => '08123456789',
            'email' => 'desa@example.test',
            'website' => 'https://desa.example.test',
            'nama_kepala_desa' => 'Budi Santoso',
            'nip_kepala_desa' => '123456789012345678',
            'visi' => 'Terwujudnya desa mandiri',
            'misi' => 'Melayani warga dengan baik',
            'sejarah' => 'Sejarah singkat desa.',
            'jam_pelayanan' => 'Senin - Jumat, 08.00 - 15.00',
            'maps_embed' => 'https://maps.example.test',
            'facebook' => 'https://facebook.test/desa',
            'instagram' => 'https://instagram.test/desa',
            'youtube' => 'https://youtube.test/desa',
            'background_type' => 'COLOR',
            'background_color' => '#047857',
            'background_overlay_opacity' => 0.5,
        ])
        ->assertRedirect('/profil-desa');

    expect(ProfilDesa::current()->nama_desa)->toBe('Desa Baru')
        ->and(ProfilDesa::current()->email)->toBe('desa@example.test')
        ->and(ProfilDesa::current()->visi)->toBe('Terwujudnya desa mandiri')
        ->and(ProfilDesa::current()->jam_pelayanan)->toBe('Senin - Jumat, 08.00 - 15.00')
        ->and(ProfilDesa::current()->background_type)->toBe('COLOR')
        ->and(ProfilDesa::current()->background_color)->toBe('#047857')
        ->and(ProfilDesa::current()->background_overlay_opacity)->toBe(0.5);
});

test('operator desa cannot access profil desa management', function () {
    $this->seed(RolePermissionSeeder::class);
    $user = User::factory()->create();
    $user->assignRole(Role::findByName('Operator Desa'));

    $this->actingAs($user)->get('/profil-desa')->assertForbidden();
    $this->actingAs($user)->get('/profil-desa/edit')->assertForbidden();
});

test('profil desa edit can use active kepala desa from perangkat desa', function () {
    $this->seed(RolePermissionSeeder::class);
    $user = User::factory()->create();
    $user->assignRole(Role::findByName('Super Admin'));
    $penduduk = Penduduk::factory()->create([
        'nik' => '1206010101010001',
        'nama_lengkap' => 'Kepala Dari Perangkat',
    ]);

    PerangkatDesa::factory()->create([
        'penduduk_id' => $penduduk->id,
        'jabatan' => 'Kepala Desa',
        'status' => 'AKTIF',
        'nomor_sk' => 'SK-001',
    ]);

    $this->actingAs($user)
        ->get('/profil-desa/edit')
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->where('kepalaDesaOptions.0.nama_lengkap', 'Kepala Dari Perangkat')
            ->where('kepalaDesaOptions.0.nik', '1206010101010001')
            ->where('kepalaDesaOptions.0.nomor_sk', 'SK-001'));
});

test('inertia shared branding uses profil desa record', function () {
    ProfilDesa::factory()->create([
        'nama_desa' => 'Desa Branding',
        'kecamatan' => 'Kecamatan Uji',
        'kabupaten' => 'Kabupaten Uji',
        'provinsi' => 'Provinsi Uji',
        'logo_path' => 'img/logo.png',
        'background_type' => 'GRADIENT',
    ]);

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->where('desa.nama_desa', 'Desa Branding')
            ->where('desa.kecamatan', 'Kecamatan Uji')
            ->where('desa.logo', asset('img/logo.png'))
            ->where('desa.logo_url', asset('img/logo.png'))
            ->where('desa.background_type', 'GRADIENT')
            ->where('desa.public_background_style.backgroundImage', 'linear-gradient(135deg, #047857, #14532d)'));
});

test('public profil desa page displays current profile data', function () {
    ProfilDesa::factory()->create([
        'nama_desa' => 'Desa Publik',
        'kecamatan' => 'Kecamatan Publik',
        'kabupaten' => 'Kabupaten Publik',
        'provinsi' => 'Provinsi Publik',
        'alamat' => 'Jalan Publik',
        'kode_pos' => '22173',
        'telepon' => '08123456789',
        'email' => 'publik@example.test',
        'nama_kepala_desa' => 'Kepala Publik',
        'nip_kepala_desa' => '123456789012345678',
        'visi' => 'Visi Publik',
        'misi' => 'Misi Publik',
        'sejarah' => 'Sejarah Publik',
        'jam_pelayanan' => 'Senin - Jumat',
        'maps_embed' => '<iframe src="https://maps.example.test"></iframe>',
        'facebook' => 'https://facebook.test/desa-publik',
        'background_type' => 'COLOR',
        'background_color' => '#064e3b',
        'background_overlay_opacity' => 0.45,
    ]);

    $this->get(route('informasi.profil-desa'))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('informasi/profil-desa')
            ->where('profilDesa.nama_desa', 'Desa Publik')
            ->where('profilDesa.kecamatan', 'Kecamatan Publik')
            ->where('profilDesa.visi', 'Visi Publik')
            ->where('profilDesa.maps_embed', '<iframe src="https://maps.example.test"></iframe>')
            ->where('profilDesa.public_background_style.backgroundColor', '#064e3b')
            ->where('desa.nama_desa', 'Desa Publik'));
});
