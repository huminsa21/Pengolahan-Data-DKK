<?php

use App\Models\Bantuan;
use App\Models\PenerimaBantuan;
use App\Models\Penduduk;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

function validBantuanPayload(array $overrides = []): array
{
    return [
        'kode_bantuan' => 'BNT-TEST',
        'nama_bantuan' => 'Bantuan Pangan Test',
        'jenis_bantuan' => 'SEMBAKO',
        'sumber_bantuan' => 'Dana Desa',
        'tahun' => '2026',
        'deskripsi' => 'Program bantuan pangan untuk warga.',
        'status' => 'AKTIF',
        'tampilkan_penerima' => true,
        ...$overrides,
    ];
}

function validPenerimaBantuanPayload(array $overrides = []): array
{
    return [
        'penduduk_id' => Penduduk::factory()->create()->id,
        'tanggal_terima' => '2026-07-07',
        'nominal' => '150000',
        'status' => 'AKTIF',
        'keterangan' => 'Layak menerima bantuan',
        ...$overrides,
    ];
}

test('bantuan index displays data filters and stats', function () {
    $target = Bantuan::factory()->create([
        'kode_bantuan' => 'BNT-PANGAN',
        'nama_bantuan' => 'Bantuan Pangan Desa',
        'jenis_bantuan' => 'SEMBAKO',
        'tahun' => 2026,
        'status' => 'AKTIF',
    ]);

    Bantuan::factory()->create([
        'nama_bantuan' => 'Bantuan Lain',
        'tahun' => 2025,
        'status' => 'NONAKTIF',
    ]);

    $this->actingAs(User::factory()->create())
        ->get(route('bantuan.index', [
            'search' => 'Pangan',
            'status' => 'AKTIF',
            'tahun' => '2026',
        ]))
        ->assertSuccessful()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('bantuan/index')
            ->where('bantuan.data.0.id', $target->id)
            ->has('stats.total')
        );
});

test('bantuan can be created updated and soft deleted', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('bantuan.store'), validBantuanPayload())
        ->assertRedirect(route('bantuan.index'));

    $bantuan = Bantuan::where('kode_bantuan', 'BNT-TEST')->firstOrFail();

    $this->actingAs($user)
        ->put(route('bantuan.update', $bantuan), validBantuanPayload([
            'nama_bantuan' => 'Bantuan Pangan Revisi',
        ]))
        ->assertRedirect(route('bantuan.index'));

    expect($bantuan->refresh()->nama_bantuan)->toBe('Bantuan Pangan Revisi');

    $this->actingAs($user)
        ->delete(route('bantuan.destroy', $bantuan))
        ->assertRedirect(route('bantuan.index'));

    $this->assertSoftDeleted($bantuan);
});

test('penerima bantuan can be added updated and removed without duplicates', function () {
    $bantuan = Bantuan::factory()->create();
    $penduduk = Penduduk::factory()->create();
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('bantuan.penerima-bantuan.store', $bantuan), validPenerimaBantuanPayload([
            'penduduk_id' => $penduduk->id,
        ]))
        ->assertRedirect();

    $penerima = PenerimaBantuan::where('bantuan_id', $bantuan->id)->firstOrFail();

    $this->actingAs($user)
        ->post(route('bantuan.penerima-bantuan.store', $bantuan), validPenerimaBantuanPayload([
            'penduduk_id' => $penduduk->id,
        ]))
        ->assertSessionHasErrors('penduduk_id');

    $this->actingAs($user)
        ->put(route('penerima-bantuan.update', $penerima), validPenerimaBantuanPayload([
            'penduduk_id' => $penduduk->id,
            'status' => 'SELESAI',
        ]))
        ->assertRedirect();

    expect($penerima->refresh()->status)->toBe('SELESAI');

    $this->actingAs($user)
        ->delete(route('penerima-bantuan.destroy', $penerima))
        ->assertRedirect();

    $this->assertDatabaseMissing('penerima_bantuan', ['id' => $penerima->id]);
});

test('bantuan publish creates pengumuman and public page hides full nik', function () {
    $user = User::factory()->create();
    $bantuan = Bantuan::factory()->create([
        'nama_bantuan' => 'Bantuan Publik',
        'tampilkan_penerima' => true,
    ]);
    $penduduk = Penduduk::factory()->create([
        'nik' => '1207123456781234',
        'nama_lengkap' => 'Warga Penerima',
    ]);

    PenerimaBantuan::factory()->create([
        'bantuan_id' => $bantuan->id,
        'penduduk_id' => $penduduk->id,
        'status' => 'AKTIF',
    ]);

    $this->actingAs($user)
        ->post(route('bantuan.publish', $bantuan))
        ->assertRedirect();

    $bantuan->refresh();

    expect($bantuan->is_published)->toBeTrue()
        ->and($bantuan->pengumuman_id)->not->toBeNull();

    $this->get(route('informasi.bantuan.show', $bantuan))
        ->assertSuccessful()
        ->assertDontSee('1207123456781234')
        ->assertSee('1207********1234')
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('informasi/bantuan/show')
            ->where('bantuan.penerima_bantuan.0.penduduk.nama_lengkap', 'Warga Penerima')
            ->where('bantuan.penerima_bantuan.0.penduduk.nik', '1207********1234')
        );
});

test('bantuan can be unpublished and archives pengumuman', function () {
    $user = User::factory()->create();
    $bantuan = Bantuan::factory()->create();

    $this->actingAs($user)->post(route('bantuan.publish', $bantuan));

    $this->actingAs($user)
        ->post(route('bantuan.unpublish', $bantuan->refresh()))
        ->assertRedirect();

    expect($bantuan->refresh()->is_published)->toBeFalse()
        ->and($bantuan->pengumuman->status)->toBe('ARCHIVED');
});
