<?php

use App\Models\JenisSurat;
use App\Models\Penduduk;
use App\Models\Surat;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;

function suratUser(): User
{
    test()->seed(RolePermissionSeeder::class);

    $user = User::factory()->create();
    $user->assignRole('Super Admin');

    return $user;
}

test('jenis surat can be managed and cannot be deleted when used', function () {
    $this->actingAs(suratUser());

    $this->post(route('jenis-surat.store'), [
        'kode_surat' => 'USAHA',
        'nama_surat' => 'Surat Keterangan Usaha',
        'template_surat' => null,
        'is_active' => true,
    ])->assertRedirect(route('jenis-surat.index'));

    $jenisSurat = JenisSurat::where('kode_surat', 'USAHA')->firstOrFail();

    $this->put(route('jenis-surat.update', $jenisSurat), [
        'kode_surat' => 'USAHA',
        'nama_surat' => 'Surat Keterangan Usaha Mikro',
        'template_surat' => 'Template usaha',
        'is_active' => true,
    ])->assertRedirect(route('jenis-surat.index'));

    Surat::factory()->create([
        'jenis_surat_id' => $jenisSurat->id,
        'status' => 'DRAFT',
        'nomor_surat' => null,
    ]);

    $this->delete(route('jenis-surat.destroy', $jenisSurat))->assertRedirect();

    expect(JenisSurat::whereKey($jenisSurat->id)->exists())->toBeTrue();
});

test('surat draft can be completed with generated yearly number and pdf output', function () {
    $user = suratUser();
    $this->actingAs($user);

    $jenisSurat = JenisSurat::factory()->create([
        'kode_surat' => 'DOMISILI',
        'nama_surat' => 'Surat Keterangan Domisili',
    ]);
    $penduduk = Penduduk::factory()->create();

    $this->post(route('surat.store'), [
        'jenis_surat_id' => $jenisSurat->id,
        'penduduk_id' => $penduduk->id,
        'tanggal_surat' => '2026-07-07',
        'keperluan' => 'Administrasi bank',
        'status' => 'DRAFT',
    ])->assertRedirect(route('surat.index'));

    $surat = Surat::firstOrFail();

    expect($surat->nomor_surat)->toBeNull()
        ->and($surat->status)->toBe('DRAFT');

    $this->get(route('surat.preview', $surat))
        ->assertSuccessful()
        ->assertHeader('content-type', 'application/pdf');

    $this->get(route('surat.download', $surat))->assertSessionHasErrors('status');

    $this->post(route('surat.complete', $surat))->assertRedirect();

    $surat->refresh();

    expect($surat->nomor_surat)->toBe('001/DOMISILI/DS/VII/2026')
        ->and($surat->status)->toBe('SELESAI')
        ->and($surat->data_json)->not->toBeEmpty();

    $this->get(route('surat.download', $surat))
        ->assertSuccessful()
        ->assertHeader('content-type', 'application/pdf');
});

test('nomor surat sequence resets by year', function () {
    $this->actingAs(suratUser());

    $jenisSurat = JenisSurat::factory()->create(['kode_surat' => 'DOMISILI']);
    $penduduk = Penduduk::factory()->create();

    $oldSurat = Surat::factory()->create([
        'jenis_surat_id' => $jenisSurat->id,
        'penduduk_id' => $penduduk->id,
        'tanggal_surat' => '2025-12-31',
        'nomor_surat' => '001/DOMISILI/DS/XII/2025',
        'status' => 'SELESAI',
    ]);

    $newSurat = Surat::factory()->create([
        'jenis_surat_id' => $jenisSurat->id,
        'penduduk_id' => $penduduk->id,
        'tanggal_surat' => '2026-01-02',
        'nomor_surat' => null,
        'status' => 'DRAFT',
    ]);

    $this->post(route('surat.complete', $newSurat))->assertRedirect();

    expect($oldSurat->fresh()->nomor_surat)->toBe('001/DOMISILI/DS/XII/2025')
        ->and($newSurat->fresh()->nomor_surat)->toBe('001/DOMISILI/DS/I/2026');
});
