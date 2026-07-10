<?php

use App\Models\Dusun;
use App\Models\Penduduk;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Inertia\Testing\AssertableInertia;
use Spatie\Permission\Models\Role;

test('laporan index and penduduk preview require authenticated permissioned user', function () {
    $dusun = Dusun::factory()->create(['nama_dusun' => 'Dusun Laporan']);
    Penduduk::factory()->create([
        'nik' => '3201010101011234',
        'nama_lengkap' => 'Warga Laporan',
        'dusun_id' => $dusun->id,
        'jenis_kelamin' => 'LAKI-LAKI',
        'status_penduduk' => 'AKTIF',
    ]);

    $this->get(route('laporan.index'))->assertRedirect(route('login'));

    $this->seed(RolePermissionSeeder::class);
    $user = User::factory()->create();
    $user->assignRole(Role::findByName('Super Admin'));

    $this->actingAs($user)
        ->get(route('laporan.index'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('laporan/index')
            ->has('reportTypes', 7));

    $this->actingAs($user)
        ->get(route('laporan.show', [
            'jenis' => 'penduduk',
            'dusun_id' => $dusun->id,
            'status' => 'AKTIF',
            'search' => 'Warga',
        ]))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('laporan/show')
            ->where('report.meta.key', 'penduduk')
            ->where('report.rows.0.nama', 'Warga Laporan')
            ->where('report.rows.0.nik', '3201010101011234'));
});

test('laporan can export pdf and excel', function () {
    Penduduk::factory()->create([
        'nama_lengkap' => 'Export Laporan',
        'status_penduduk' => 'AKTIF',
    ]);

    $this->seed(RolePermissionSeeder::class);
    $user = User::factory()->create();
    $user->assignRole(Role::findByName('Super Admin'));

    $this->actingAs($user)
        ->get(route('laporan.excel', ['jenis' => 'penduduk']))
        ->assertOk()
        ->assertHeader('content-type', 'application/vnd.ms-excel; charset=UTF-8');

    $this->actingAs($user)
        ->get(route('laporan.pdf', ['jenis' => 'penduduk']))
        ->assertOk()
        ->assertHeader('content-type', 'application/pdf');
});
