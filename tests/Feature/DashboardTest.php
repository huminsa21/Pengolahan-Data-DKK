<?php

use App\Models\Bantuan;
use App\Models\Dusun;
use App\Models\JenisSurat;
use App\Models\Kelahiran;
use App\Models\Kematian;
use App\Models\Pendatang;
use App\Models\Penduduk;
use App\Models\PenerimaBantuan;
use App\Models\Pengumuman;
use App\Models\Pindah;
use App\Models\Surat;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('dashboard displays filtered village statistics', function () {
    $year = now()->year;
    $user = User::factory()->create();
    $dusun = Dusun::factory()->create(['nama_dusun' => 'Dusun Utara']);
    $otherDusun = Dusun::factory()->create(['nama_dusun' => 'Dusun Selatan']);
    $male = Penduduk::factory()->create([
        'nama_lengkap' => 'Budi Statistik',
        'jenis_kelamin' => 'LAKI-LAKI',
        'dusun_id' => $dusun->id,
        'is_kepala_keluarga' => true,
        'status_penduduk' => 'AKTIF',
    ]);
    $female = Penduduk::factory()->create([
        'nama_lengkap' => 'Sari Statistik',
        'jenis_kelamin' => 'PEREMPUAN',
        'dusun_id' => $dusun->id,
        'status_penduduk' => 'AKTIF',
    ]);
    $dead = Penduduk::factory()->create([
        'nama_lengkap' => 'Warga Meninggal',
        'dusun_id' => $dusun->id,
        'status_penduduk' => 'AKTIF',
    ]);

    Penduduk::factory()->create([
        'dusun_id' => $otherDusun->id,
        'status_penduduk' => 'AKTIF',
    ]);

    Kelahiran::factory()->create([
        'nama_bayi' => 'Bayi Statistik',
        'tanggal_lahir' => now()->toDateString(),
        'ayah_id' => $male->id,
        'ibu_id' => $female->id,
        'pelapor_tipe' => 'KELUARGA',
        'pelapor_id' => null,
    ]);
    Kematian::factory()->create([
        'penduduk_id' => $dead->id,
        'tanggal_meninggal' => now()->toDateString(),
        'pelapor_tipe' => 'KELUARGA',
        'pelapor_id' => null,
    ]);
    Pendatang::factory()->create([
        'nama_lengkap' => 'Pendatang Statistik',
        'dusun_id' => $dusun->id,
        'tanggal_datang' => now()->toDateString(),
        'pelapor_tipe' => 'KELUARGA',
        'pelapor_id' => null,
        'status' => 'DITERIMA',
    ]);
    Pindah::factory()->create([
        'penduduk_id' => $female->id,
        'tanggal_pindah' => now()->toDateString(),
        'pelapor_tipe' => 'KELUARGA',
        'pelapor_id' => null,
        'status' => 'PROSES',
    ]);

    $bantuan = Bantuan::factory()->create([
        'nama_bantuan' => 'Bantuan Statistik',
        'tahun' => $year,
        'status' => 'AKTIF',
    ]);
    PenerimaBantuan::factory()->create([
        'bantuan_id' => $bantuan->id,
        'penduduk_id' => $male->id,
    ]);

    $jenisSurat = JenisSurat::factory()->create(['nama_surat' => 'Surat Statistik']);
    Surat::factory()->create([
        'jenis_surat_id' => $jenisSurat->id,
        'penduduk_id' => $male->id,
        'tanggal_surat' => now()->toDateString(),
        'status' => 'SELESAI',
        'dibuat_oleh' => $user->id,
    ]);
    Pengumuman::factory()->create([
        'judul' => 'Pengumuman Statistik',
        'tanggal_publish' => now(),
        'status' => 'PUBLISHED',
        'created_by' => $user->id,
    ]);

    $this->actingAs($user)
        ->get(route('dashboard', [
            'year' => $year,
            'dusun_id' => $dusun->id,
        ]))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('dashboard')
            ->where('filters.year', $year)
            ->where('filters.dusun_id', $dusun->id)
            ->has('summaryStats', 13)
            ->where('summaryStats.0.value', 3)
            ->where('summaryStats.1.value', 2)
            ->where('summaryStats.5.value', 1)
            ->where('summaryStats.6.value', 1)
            ->where('charts.jenisKelamin.0.value', 1)
            ->where('charts.jenisKelamin.1.value', 1)
            ->where('recent.kelahiran.0.nama', 'Bayi Statistik')
            ->where('recent.surat.0.jenis', 'Surat Statistik')
            ->where('recent.pengumuman.0.judul', 'Pengumuman Statistik'));
});
