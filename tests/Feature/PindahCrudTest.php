<?php

use App\Models\Dusun;
use App\Models\Kematian;
use App\Models\Penduduk;
use App\Models\Pindah;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

function validPindahPayload(array $overrides = []): array
{
    $penduduk = Penduduk::factory()->create(['status_penduduk' => 'AKTIF']);

    return [
        'penduduk_id' => $penduduk->id,
        'tanggal_pindah' => '2026-07-05',
        'alamat_tujuan' => 'Jalan Tujuan',
        'desa_tujuan' => 'Desa Baru',
        'kecamatan_tujuan' => 'Kecamatan Baru',
        'kabupaten_tujuan' => 'Kabupaten Baru',
        'provinsi_tujuan' => 'Jawa Barat',
        'alasan_pindah' => 'Pekerjaan',
        'status' => 'PROSES',
        'keterangan' => 'Menunggu verifikasi',
        'pelapor_tipe' => 'KELUARGA',
        'pelapor_id' => null,
        'pelapor_nama' => 'Pelapor Keluarga',
        'pelapor_kontak' => '081234567890',
        ...$overrides,
    ];
}

test('pindah index displays paginated data with filters and stats', function () {
    $user = User::factory()->create();
    $dusun = Dusun::factory()->create();
    $penduduk = Penduduk::factory()->create([
        'dusun_id' => $dusun->id,
        'nama_lengkap' => 'Budi Pindah',
        'nik' => '3374010101010011',
        'status_penduduk' => 'AKTIF',
    ]);
    $target = Pindah::factory()->create([
        'penduduk_id' => $penduduk->id,
        'tanggal_pindah' => '2026-07-05',
        'desa_tujuan' => 'Desa Target',
        'kecamatan_tujuan' => 'Kecamatan Target',
        'kabupaten_tujuan' => 'Kabupaten Target',
        'status' => 'PROSES',
        'pelapor_tipe' => 'KELUARGA',
        'pelapor_nama' => 'Pelapor Target',
    ]);

    Pindah::factory()->create(['tanggal_pindah' => '2026-01-01', 'status' => 'DIBATALKAN']);

    $this->actingAs($user)
        ->get(route('pindah.index', [
            'search' => 'Budi',
            'status' => 'PROSES',
            'dusun_id' => $dusun->id,
            'tanggal_dari' => '2026-07-01',
            'tanggal_sampai' => '2026-07-31',
            'pelapor_tipe' => 'KELUARGA',
        ]))
        ->assertSuccessful()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('pindah/index')
            ->where('pindah.data.0.id', $target->id)
            ->where('filters.search', 'Budi')
            ->has('stats.total')
        );
});

test('pindah can be created in proses without changing penduduk status', function () {
    $penduduk = Penduduk::factory()->create(['status_penduduk' => 'AKTIF']);

    $this->actingAs(User::factory()->create())
        ->post(route('pindah.store'), validPindahPayload([
            'penduduk_id' => $penduduk->id,
            'status' => 'PROSES',
        ]))
        ->assertRedirect(route('pindah.index'));

    $this->assertDatabaseHas('pindah', [
        'penduduk_id' => $penduduk->id,
        'status' => 'PROSES',
    ]);

    expect($penduduk->refresh()->status_penduduk)->toBe('AKTIF');
});

test('pindah selesai marks penduduk as pindah and stores penduduk reporter data', function () {
    $penduduk = Penduduk::factory()->create(['status_penduduk' => 'AKTIF']);
    $pelapor = Penduduk::factory()->create(['nama_lengkap' => 'Pelapor Pindah', 'no_hp' => '089999999999']);

    $this->actingAs(User::factory()->create())
        ->post(route('pindah.store'), validPindahPayload([
            'penduduk_id' => $penduduk->id,
            'status' => 'SELESAI',
            'pelapor_tipe' => 'PENDUDUK',
            'pelapor_id' => $pelapor->id,
            'pelapor_nama' => null,
        ]))
        ->assertRedirect(route('pindah.index'));

    $this->assertDatabaseHas('pindah', [
        'penduduk_id' => $penduduk->id,
        'status' => 'SELESAI',
        'pelapor_id' => $pelapor->id,
        'pelapor_nama' => 'Pelapor Pindah',
        'pelapor_kontak' => '089999999999',
    ]);

    expect($penduduk->refresh()->status_penduduk)->toBe('PINDAH');
});

test('pindah validation requires active penduduk on create', function () {
    $penduduk = Penduduk::factory()->create(['status_penduduk' => 'PINDAH']);

    $this->actingAs(User::factory()->create())
        ->post(route('pindah.store'), validPindahPayload([
            'penduduk_id' => $penduduk->id,
        ]))
        ->assertSessionHasErrors(['penduduk_id']);
});

test('pindah update syncs old and new penduduk statuses', function () {
    $oldPenduduk = Penduduk::factory()->create(['status_penduduk' => 'PINDAH']);
    $newPenduduk = Penduduk::factory()->create(['status_penduduk' => 'AKTIF']);
    $pindah = Pindah::factory()->create([
        'penduduk_id' => $oldPenduduk->id,
        'status' => 'SELESAI',
    ]);

    $this->actingAs(User::factory()->create())
        ->put(route('pindah.update', $pindah), validPindahPayload([
            'penduduk_id' => $newPenduduk->id,
            'status' => 'SELESAI',
            'desa_tujuan' => 'Desa Update',
        ]))
        ->assertRedirect(route('pindah.index'));

    expect($pindah->refresh()->penduduk_id)->toBe($newPenduduk->id)
        ->and($oldPenduduk->refresh()->status_penduduk)->toBe('AKTIF')
        ->and($newPenduduk->refresh()->status_penduduk)->toBe('PINDAH');
});

test('pindah delete restores penduduk status unless penduduk has active death', function () {
    $penduduk = Penduduk::factory()->create(['status_penduduk' => 'PINDAH']);
    $pindah = Pindah::factory()->create([
        'penduduk_id' => $penduduk->id,
        'status' => 'SELESAI',
    ]);

    $this->actingAs(User::factory()->create())
        ->delete(route('pindah.destroy', $pindah))
        ->assertRedirect(route('pindah.index'));

    $this->assertSoftDeleted($pindah);
    expect($penduduk->refresh()->status_penduduk)->toBe('AKTIF');

    $meninggal = Penduduk::factory()->create(['status_penduduk' => 'PINDAH']);
    $pindahMeninggal = Pindah::factory()->create([
        'penduduk_id' => $meninggal->id,
        'status' => 'SELESAI',
    ]);
    Kematian::factory()->create(['penduduk_id' => $meninggal->id]);

    $this->actingAs(User::factory()->create())
        ->delete(route('pindah.destroy', $pindahMeninggal))
        ->assertRedirect(route('pindah.index'));

    expect($meninggal->refresh()->status_penduduk)->toBe('MENINGGAL');
});
