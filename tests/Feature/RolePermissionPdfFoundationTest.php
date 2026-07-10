<?php

use App\Models\User;
use App\Services\PdfGeneratorService;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

test('default roles and permissions are seeded', function () {
    $this->seed();

    expect(Role::whereIn('name', [
        'Super Admin',
        'Kepala Desa',
        'Sekretaris Desa',
        'Kaur Pemerintahan',
        'Operator Desa',
        'Kepala Dusun',
    ])->count())->toBe(6)
        ->and(Permission::where('name', 'surat.print')->exists())->toBeTrue()
        ->and(Permission::where('name', 'surat.approve')->exists())->toBeTrue()
        ->and(Permission::where('name', 'profil_desa.view')->exists())->toBeTrue()
        ->and(Permission::where('name', 'profil_desa.update')->exists())->toBeTrue()
        ->and(Permission::where('name', 'perangkat_desa.view')->exists())->toBeTrue()
        ->and(Permission::where('name', 'perangkat_desa.create_user')->exists())->toBeTrue()
        ->and(Permission::where('name', 'users.view')->exists())->toBeTrue()
        ->and(Permission::where('name', 'roles.update')->exists())->toBeTrue()
        ->and(User::where('email', 'admin@desa.id')->first()?->hasRole('Super Admin'))->toBeTrue()
        ->and(Role::findByName('Kepala Desa')->hasPermissionTo('surat.approve'))->toBeTrue()
        ->and(Role::findByName('Kepala Desa')->hasPermissionTo('profil_desa.view'))->toBeTrue()
        ->and(Role::findByName('Kepala Desa')->hasPermissionTo('profil_desa.update'))->toBeFalse()
        ->and(Role::findByName('Operator Desa')->hasPermissionTo('profil_desa.view'))->toBeFalse()
        ->and(Role::findByName('Operator Desa')->hasPermissionTo('profil_desa.update'))->toBeFalse()
        ->and(Role::findByName('Operator Desa')->hasPermissionTo('perangkat_desa.view'))->toBeFalse()
        ->and(Role::findByName('Kepala Dusun')->hasPermissionTo('surat.create'))->toBeTrue()
        ->and(Role::findByName('Kepala Dusun')->hasPermissionTo('penduduk.view'))->toBeTrue()
        ->and(Role::findByName('Kepala Dusun')->hasPermissionTo('penduduk.delete'))->toBeFalse();
});

test('pdf generator renders the base surat template', function () {
    $pdf = app(PdfGeneratorService::class)->generateSurat([
        'nomorSurat' => '470/001/DS/2026',
        'judul' => 'Surat Keterangan',
        'isi' => 'Konten surat dasar.',
        'namaKepalaDesa' => 'Budi Santoso',
    ]);

    expect($pdf->output())->toStartWith('%PDF');
});
