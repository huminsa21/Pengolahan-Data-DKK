<?php

use App\Models\Dusun;
use App\Models\Kematian;
use App\Models\Penduduk;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

function validKematianPayload(array $overrides = []): array
{
    $penduduk = Penduduk::factory()->create(['status_penduduk' => 'AKTIF']);

    return [
        'penduduk_id' => $penduduk->id,
        'tanggal_meninggal' => '2026-07-02',
        'tempat_meninggal' => 'Rumah',
        'sebab_meninggal' => 'Sakit',
        'keterangan' => 'Dilaporkan keluarga',
        'pelapor_tipe' => 'KELUARGA',
        'pelapor_id' => null,
        'pelapor_nama' => 'Pelapor Keluarga',
        'pelapor_kontak' => '081234567890',
        ...$overrides,
    ];
}

test('kematian index displays paginated data with filters and stats', function () {
    $user = User::factory()->create();
    $dusun = Dusun::factory()->create();
    $penduduk = Penduduk::factory()->create([
        'dusun_id' => $dusun->id,
        'nama_lengkap' => 'Budi Wafat',
        'nik' => '3374010101010001',
        'jenis_kelamin' => 'L',
    ]);
    $target = Kematian::factory()->create([
        'penduduk_id' => $penduduk->id,
        'tanggal_meninggal' => '2026-07-02',
        'sebab_meninggal' => 'Sakit keras',
        'pelapor_tipe' => 'KELUARGA',
        'pelapor_nama' => 'Pelapor Target',
    ]);

    Kematian::factory()->create([
        'tanggal_meninggal' => '2026-01-01',
        'pelapor_tipe' => 'RT',
        'pelapor_nama' => 'Pelapor Lain',
    ]);

    $this->actingAs($user)
        ->get(route('kematian.index', [
            'search' => 'Budi',
            'jenis_kelamin' => 'L',
            'dusun_id' => $dusun->id,
            'tanggal_dari' => '2026-07-01',
            'tanggal_sampai' => '2026-07-31',
            'pelapor_tipe' => 'KELUARGA',
        ]))
        ->assertSuccessful()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('kematian/index')
            ->where('kematian.data.0.id', $target->id)
            ->where('filters.search', 'Budi')
            ->has('stats.total')
        );
});

test('kematian can be created and marks penduduk as meninggal', function () {
    $penduduk = Penduduk::factory()->create(['status_penduduk' => 'AKTIF']);
    $pelapor = Penduduk::factory()->create(['nama_lengkap' => 'Pelapor Penduduk', 'no_hp' => '081111111111']);

    $this->actingAs(User::factory()->create())
        ->post(route('kematian.store'), validKematianPayload([
            'penduduk_id' => $penduduk->id,
            'pelapor_tipe' => 'PENDUDUK',
            'pelapor_id' => $pelapor->id,
            'pelapor_nama' => null,
        ]))
        ->assertRedirect(route('kematian.index'));

    $this->assertDatabaseHas('kematian', [
        'penduduk_id' => $penduduk->id,
        'pelapor_tipe' => 'PENDUDUK',
        'pelapor_id' => $pelapor->id,
        'pelapor_nama' => 'Pelapor Penduduk',
        'pelapor_kontak' => '081111111111',
    ]);

    expect($penduduk->refresh()->status_penduduk)->toBe('MENINGGAL');
});

test('kematian validation prevents duplicate active death records', function () {
    $penduduk = Penduduk::factory()->create(['status_penduduk' => 'MENINGGAL']);
    Kematian::factory()->create(['penduduk_id' => $penduduk->id]);

    $this->actingAs(User::factory()->create())
        ->post(route('kematian.store'), validKematianPayload([
            'penduduk_id' => $penduduk->id,
        ]))
        ->assertSessionHasErrors(['penduduk_id']);
});

test('kematian can be updated and keeps selected penduduk meninggal', function () {
    $oldPenduduk = Penduduk::factory()->create(['status_penduduk' => 'MENINGGAL']);
    $newPenduduk = Penduduk::factory()->create(['status_penduduk' => 'AKTIF']);
    $kematian = Kematian::factory()->create([
        'penduduk_id' => $oldPenduduk->id,
        'tanggal_meninggal' => '2026-07-01',
    ]);

    $this->actingAs(User::factory()->create())
        ->put(route('kematian.update', $kematian), validKematianPayload([
            'penduduk_id' => $newPenduduk->id,
            'tanggal_meninggal' => '2026-07-03',
            'sebab_meninggal' => 'Kecelakaan',
        ]))
        ->assertRedirect(route('kematian.index'));

    expect($kematian->refresh()->penduduk_id)->toBe($newPenduduk->id)
        ->and($kematian->sebab_meninggal)->toBe('Kecelakaan')
        ->and($oldPenduduk->refresh()->status_penduduk)->toBe('AKTIF')
        ->and($newPenduduk->refresh()->status_penduduk)->toBe('MENINGGAL');
});

test('kematian delete uses soft delete and restores penduduk status', function () {
    $penduduk = Penduduk::factory()->create(['status_penduduk' => 'MENINGGAL']);
    $kematian = Kematian::factory()->create(['penduduk_id' => $penduduk->id]);

    $this->actingAs(User::factory()->create())
        ->delete(route('kematian.destroy', $kematian))
        ->assertRedirect(route('kematian.index'));

    $this->assertSoftDeleted($kematian);
    expect($penduduk->refresh()->status_penduduk)->toBe('AKTIF');
});
