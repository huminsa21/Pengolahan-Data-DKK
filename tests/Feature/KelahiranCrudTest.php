<?php

use App\Models\Kelahiran;
use App\Models\Penduduk;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

function validKelahiranPayload(array $overrides = []): array
{
    return [
        'nama_bayi' => 'Bayi Sehat',
        'jenis_kelamin' => 'L',
        'tempat_lahir' => 'Puskesmas Sukamaju',
        'tanggal_lahir' => '2026-07-01',
        'waktu_lahir' => '08:30',
        'ayah_id' => null,
        'ibu_id' => null,
        'pelapor_tipe' => 'KELUARGA',
        'pelapor_id' => null,
        'pelapor_nama' => 'Pelapor Keluarga',
        'pelapor_kontak' => '081234567890',
        'nama_ayah' => 'Ayah Backup',
        'nama_ibu' => 'Ibu Backup',
        'alamat' => 'Dusun Krajan RT 001 RW 002',
        'keterangan' => 'Lahir normal',
        ...$overrides,
    ];
}

test('kelahiran index displays paginated data with filters and stats', function () {
    $user = User::factory()->create();
    $ayah = Penduduk::factory()->create(['nama_lengkap' => 'Budi Ayah']);
    $ibu = Penduduk::factory()->create(['nama_lengkap' => 'Siti Ibu']);
    $target = Kelahiran::factory()->create([
        'nama_bayi' => 'Bayi Target',
        'jenis_kelamin' => 'L',
        'tanggal_lahir' => '2026-07-01',
        'ayah_id' => $ayah->id,
        'ibu_id' => $ibu->id,
        'nama_ayah' => null,
        'nama_ibu' => null,
        'keterangan' => 'Catatan khusus',
    ]);

    Kelahiran::factory()->create([
        'nama_bayi' => 'Bayi Lain',
        'jenis_kelamin' => 'P',
        'tanggal_lahir' => '2026-01-01',
    ]);

    $this->actingAs($user)
        ->get(route('kelahiran.index', [
            'search' => 'Budi',
            'jenis_kelamin' => 'L',
            'tanggal_dari' => '2026-07-01',
            'tanggal_sampai' => '2026-07-31',
        ]))
        ->assertSuccessful()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('kelahiran/index')
            ->where('kelahiran.data.0.id', $target->id)
            ->where('filters.search', 'Budi')
            ->has('stats.total')
        );
});

test('kelahiran can be created with relations and backup names', function () {
    $ayah = Penduduk::factory()->create(['jenis_kelamin' => 'L']);
    $ibu = Penduduk::factory()->create([
        'dusun_id' => $ayah->dusun_id,
        'jenis_kelamin' => 'P',
    ]);
    $pelapor = Penduduk::factory()->create();

    $this->actingAs(User::factory()->create())
        ->post(route('kelahiran.store'), validKelahiranPayload([
            'ayah_id' => $ayah->id,
            'ibu_id' => $ibu->id,
            'pelapor_tipe' => 'PENDUDUK',
            'pelapor_id' => $pelapor->id,
            'nama_ayah' => null,
            'nama_ibu' => null,
        ]))
        ->assertRedirect(route('kelahiran.index'));

    $this->assertDatabaseHas('kelahiran', [
        'nama_bayi' => 'Bayi Sehat',
        'ayah_id' => $ayah->id,
        'ibu_id' => $ibu->id,
        'pelapor_id' => $pelapor->id,
        'pelapor_nama' => $pelapor->nama_lengkap,
    ]);
});

test('kelahiran validation requires baby name gender and valid penduduk relations', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('kelahiran.store'), validKelahiranPayload([
            'nama_bayi' => '',
            'jenis_kelamin' => 'X',
            'ayah_id' => 'not-a-valid-uuid',
        ]))
        ->assertSessionHasErrors(['nama_bayi', 'jenis_kelamin', 'ayah_id']);
});

test('kelahiran can be updated', function () {
    $kelahiran = Kelahiran::factory()->create([
        'nama_bayi' => 'Nama Lama',
        'jenis_kelamin' => 'L',
    ]);

    $this->actingAs(User::factory()->create())
        ->put(route('kelahiran.update', $kelahiran), validKelahiranPayload([
            'nama_bayi' => 'Nama Baru',
            'jenis_kelamin' => 'P',
            'waktu_lahir' => null,
        ]))
        ->assertRedirect(route('kelahiran.index'));

    expect($kelahiran->refresh()->nama_bayi)->toBe('Nama Baru')
        ->and($kelahiran->jenis_kelamin)->toBe('P');
});

test('kelahiran can be converted into active penduduk baby', function () {
    $ayah = Penduduk::factory()->create([
        'jenis_kelamin' => 'L',
        'dusun_id' => null,
        'dusun' => 'Dusun I',
        'rt' => '001',
        'rw' => '002',
        'no_kk' => '3320010101010001',
    ]);

    $kelahiran = Kelahiran::factory()->create([
        'nama_bayi' => 'Bayi Baru',
        'jenis_kelamin' => 'P',
        'tempat_lahir' => 'Puskesmas Sukamaju',
        'tanggal_lahir' => '2026-07-07',
        'ayah_id' => $ayah->id,
        'ibu_id' => null,
        'alamat' => 'Dusun I RT 001 RW 002',
    ]);

    $this->actingAs(User::factory()->create())
        ->post(route('kelahiran.create-penduduk', $kelahiran))
        ->assertRedirect();

    $kelahiran->refresh();

    expect($kelahiran->penduduk_id_bayi)->not->toBeNull();

    $this->assertDatabaseHas('penduduk', [
        'id' => $kelahiran->penduduk_id_bayi,
        'nik' => null,
        'nama_lengkap' => 'Bayi Baru',
        'jenis_kelamin' => 'P',
        'tempat_lahir' => 'Puskesmas Sukamaju',
        'tanggal_lahir' => '2026-07-07 00:00:00',
        'alamat' => 'Dusun I RT 001 RW 002',
        'rt' => '001',
        'rw' => '002',
        'no_kk' => '3320010101010001',
        'hubungan_keluarga' => 'ANAK',
        'status_penduduk' => 'AKTIF',
    ]);
});

test('kelahiran conversion rejects already converted data', function () {
    $pendudukBayi = Penduduk::factory()->create();
    $kelahiran = Kelahiran::factory()->create([
        'penduduk_id_bayi' => $pendudukBayi->id,
    ]);

    $this->actingAs(User::factory()->create())
        ->post(route('kelahiran.create-penduduk', $kelahiran))
        ->assertSessionHasErrors('penduduk_id_bayi');
});

test('kelahiran delete uses soft delete', function () {
    $kelahiran = Kelahiran::factory()->create();

    $this->actingAs(User::factory()->create())
        ->delete(route('kelahiran.destroy', $kelahiran))
        ->assertRedirect(route('kelahiran.index'));

    $this->assertSoftDeleted($kelahiran);
});
