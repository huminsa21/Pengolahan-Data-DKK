<?php

use App\Models\Dusun;
use App\Models\Penduduk;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

function validPendudukPayload(array $overrides = []): array
{
    return [
        'nik' => '3201010101010001',
        'nama_lengkap' => 'Siti Aminah',
        'jenis_kelamin' => 'P',
        'tempat_lahir' => 'Bandung',
        'tanggal_lahir' => '1990-01-01',
        'agama' => 'Islam',
        'status_perkawinan' => 'KAWIN',
        'pendidikan' => 'SMA',
        'pekerjaan' => 'Wiraswasta',
        'no_hp' => '081234567890',
        'alamat' => 'Jalan Melati No. 1',
        'dusun_id' => null,
        'dusun' => 'Dusun Krajan',
        'rt' => '001',
        'rw' => '002',
        'desa' => 'Desa Sukamaju',
        'kecamatan' => 'Kecamatan Makmur',
        'kabupaten' => 'Kabupaten Sentosa',
        'provinsi' => 'Jawa Tengah',
        'no_kk' => '3201010101010002',
        'hubungan_keluarga' => 'KEPALA KELUARGA',
        'is_kepala_keluarga' => true,
        'status_penduduk' => 'AKTIF',
        ...$overrides,
    ];
}

test('penduduk index displays paginated data with filters and stats', function () {
    $user = User::factory()->create();
    $dusun = Dusun::factory()->create(['nama_dusun' => 'Dusun Barat']);
    $target = Penduduk::factory()->create([
        'nik' => '3201010101019999',
        'nama_lengkap' => 'Budi Santoso',
        'jenis_kelamin' => 'L',
        'dusun_id' => $dusun->id,
        'dusun' => 'Dusun Barat',
        'status_penduduk' => 'AKTIF',
    ]);

    Penduduk::factory()->create([
        'nama_lengkap' => 'Warga Lain',
        'jenis_kelamin' => 'P',
        'dusun' => 'Dusun Timur',
        'status_penduduk' => 'PINDAH',
    ]);

    $this->actingAs($user)
        ->get(route('penduduk.index', [
            'search' => 'Budi',
            'jenis_kelamin' => 'L',
            'status_penduduk' => 'AKTIF',
            'dusun_id' => $dusun->id,
        ]))
        ->assertSuccessful()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('penduduk/index')
            ->where('penduduk.data.0.id', $target->id)
            ->where('filters.search', 'Budi')
            ->has('stats.total')
        );
});

test('penduduk can be created', function () {
    $dusun = Dusun::factory()->create(['nama_dusun' => 'Dusun I']);

    $this->actingAs(User::factory()->create())
        ->post(route('penduduk.store'), validPendudukPayload([
            'dusun_id' => $dusun->id,
            'dusun' => null,
        ]))
        ->assertRedirect(route('penduduk.index'));

    $this->assertDatabaseHas('penduduk', [
        'nik' => '3201010101010001',
        'nama_lengkap' => 'Siti Aminah',
        'jenis_kelamin' => 'P',
        'dusun_id' => $dusun->id,
        'dusun' => 'Dusun I',
    ]);
});

test('penduduk validation requires unique sixteen digit nik', function () {
    Penduduk::factory()->create(['nik' => '3201010101010001']);

    $this->actingAs(User::factory()->create())
        ->post(route('penduduk.store'), validPendudukPayload(['nik' => '123']))
        ->assertSessionHasErrors('nik');

    $this->actingAs(User::factory()->create())
        ->post(route('penduduk.store'), validPendudukPayload())
        ->assertSessionHasErrors('nik');
});

test('penduduk can be updated with the same nik', function () {
    $penduduk = Penduduk::factory()->create([
        'nik' => '3201010101010001',
        'nama_lengkap' => 'Nama Lama',
        'jenis_kelamin' => 'L',
    ]);

    $this->actingAs(User::factory()->create())
        ->put(route('penduduk.update', $penduduk), validPendudukPayload([
            'nik' => '3201010101010001',
            'nama_lengkap' => 'Nama Baru',
        ]))
        ->assertRedirect(route('penduduk.index'));

    expect($penduduk->refresh()->nama_lengkap)->toBe('Nama Baru');
});

test('penduduk delete uses soft delete', function () {
    $penduduk = Penduduk::factory()->create();

    $this->actingAs(User::factory()->create())
        ->delete(route('penduduk.destroy', $penduduk))
        ->assertRedirect(route('penduduk.index'));

    $this->assertSoftDeleted($penduduk);
});
