<?php

use App\Models\Pendatang;
use App\Models\Penduduk;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

function validPendatangPayload(array $overrides = []): array
{
    return [
        'nik' => '3374010101010099',
        'nama_lengkap' => 'Budi Pendatang',
        'jenis_kelamin' => 'L',
        'tempat_lahir' => 'Bandung',
        'tanggal_lahir' => '1990-01-01',
        'agama' => 'Islam',
        'status_perkawinan' => 'KAWIN',
        'pendidikan' => 'SMA',
        'pekerjaan' => 'Karyawan',
        'no_hp' => '081234567890',
        'alamat_asal' => 'Alamat Asal',
        'desa_asal' => 'Desa Asal',
        'kecamatan_asal' => 'Kecamatan Asal',
        'kabupaten_asal' => 'Kabupaten Asal',
        'provinsi_asal' => 'Jawa Barat',
        'dusun_id' => null,
        'alamat_tujuan' => 'Alamat Tujuan',
        'rt' => '001',
        'rw' => '002',
        'tanggal_datang' => '2026-07-06',
        'alasan_datang' => 'Pekerjaan',
        'keterangan' => 'Menunggu verifikasi',
        'status' => 'PROSES',
        'pelapor_tipe' => 'KELUARGA',
        'pelapor_id' => null,
        'pelapor_nama' => 'Pelapor Keluarga',
        'pelapor_kontak' => '081111111111',
        ...$overrides,
    ];
}

test('pendatang index displays paginated data with filters and stats', function () {
    $user = User::factory()->create();
    $target = Pendatang::factory()->create([
        'nik' => '3374010101010098',
        'nama_lengkap' => 'Budi Datang',
        'jenis_kelamin' => 'L',
        'desa_asal' => 'Desa Target',
        'tanggal_datang' => '2026-07-06',
        'status' => 'PROSES',
        'pelapor_tipe' => 'KELUARGA',
        'pelapor_nama' => 'Pelapor Target',
    ]);

    Pendatang::factory()->create(['status' => 'DITOLAK', 'tanggal_datang' => '2026-01-01']);

    $this->actingAs($user)
        ->get(route('pendatang.index', [
            'search' => 'Budi',
            'status' => 'PROSES',
            'jenis_kelamin' => 'L',
            'tanggal_dari' => '2026-07-01',
            'tanggal_sampai' => '2026-07-31',
            'pelapor_tipe' => 'KELUARGA',
        ]))
        ->assertSuccessful()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('pendatang/index')
            ->where('pendatang.data.0.id', $target->id)
            ->where('filters.search', 'Budi')
            ->has('stats.total')
        );
});

test('pendatang can be created in proses status', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('pendatang.store'), validPendatangPayload())
        ->assertRedirect(route('pendatang.index'));

    $this->assertDatabaseHas('pendatang', [
        'nik' => '3374010101010099',
        'nama_lengkap' => 'Budi Pendatang',
        'status' => 'PROSES',
    ]);
});

test('pendatang can be accepted as penduduk', function () {
    $pendatang = Pendatang::factory()->create([
        'status' => 'PROSES',
        'penduduk_id' => null,
        'nik' => '3374010101010088',
        'nama_lengkap' => 'Calon Penduduk',
        'jenis_kelamin' => 'P',
    ]);

    $this->actingAs(User::factory()->create())
        ->post(route('pendatang.accept', $pendatang))
        ->assertRedirect(route('pendatang.index'));

    $pendatang->refresh();

    expect($pendatang->status)->toBe('DITERIMA')
        ->and($pendatang->penduduk_id)->not->toBeNull();

    $this->assertDatabaseHas('penduduk', [
        'id' => $pendatang->penduduk_id,
        'nik' => '3374010101010088',
        'status_penduduk' => 'AKTIF',
    ]);
});

test('pendatang can be rejected from proses status', function () {
    $pendatang = Pendatang::factory()->create(['status' => 'PROSES']);

    $this->actingAs(User::factory()->create())
        ->post(route('pendatang.reject', $pendatang))
        ->assertRedirect(route('pendatang.index'));

    expect($pendatang->refresh()->status)->toBe('DITOLAK');
});

test('pendatang validation blocks duplicate penduduk nik when accepted', function () {
    Penduduk::factory()->create(['nik' => '3374010101010077']);

    $this->actingAs(User::factory()->create())
        ->post(route('pendatang.store'), validPendatangPayload([
            'nik' => '3374010101010077',
            'status' => 'DITERIMA',
        ]))
        ->assertSessionHasErrors(['nik']);
});

test('pendatang delete uses soft delete and keeps accepted penduduk', function () {
    $penduduk = Penduduk::factory()->create();
    $pendatang = Pendatang::factory()->create([
        'status' => 'DITERIMA',
        'penduduk_id' => $penduduk->id,
    ]);

    $this->actingAs(User::factory()->create())
        ->delete(route('pendatang.destroy', $pendatang))
        ->assertRedirect(route('pendatang.index'));

    $this->assertSoftDeleted($pendatang);
    $this->assertModelExists($penduduk);
});
