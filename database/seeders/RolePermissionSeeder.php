<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = collect([
            'penduduk.view',
            'penduduk.create',
            'penduduk.update',
            'penduduk.delete',
            'kelahiran.view',
            'kelahiran.create',
            'kelahiran.update',
            'kelahiran.delete',
            'kematian.view',
            'kematian.create',
            'kematian.update',
            'kematian.delete',
            'pendatang.view',
            'pendatang.create',
            'pendatang.update',
            'pendatang.delete',
            'pindah.view',
            'pindah.create',
            'pindah.update',
            'pindah.delete',
            'bantuan.view',
            'bantuan.create',
            'bantuan.update',
            'bantuan.delete',
            'bantuan.publish',
            'pengumuman.view',
            'pengumuman.create',
            'pengumuman.update',
            'pengumuman.delete',
            'pengumuman.publish',
            'jenis_surat.view',
            'jenis_surat.create',
            'jenis_surat.update',
            'jenis_surat.delete',
            'surat.view',
            'surat.create',
            'surat.update',
            'surat.delete',
            'surat.print',
            'surat.approve',
            'profil_desa.view',
            'profil_desa.update',
            'laporan.view',
            'laporan.export',
            'perangkat_desa.view',
            'perangkat_desa.create',
            'perangkat_desa.update',
            'perangkat_desa.delete',
            'perangkat_desa.create_user',
            'perangkat_desa.reset_password',
            'perangkat_desa.disable_user',
            'users.view',
            'users.update',
            'roles.view',
            'roles.update',
        ]);

        $guardName = 'web';

        $permissions->each(fn (string $permission): Permission => Permission::findOrCreate($permission, $guardName));

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $roles = collect([
            'Super Admin' => $permissions->all(),
            'Operator Desa' => $permissions->reject(fn (string $permission): bool => str_starts_with($permission, 'profil_desa.')
                || str_starts_with($permission, 'perangkat_desa.')
                || str_starts_with($permission, 'users.')
                || str_starts_with($permission, 'roles.'))->all(),
            'Kaur Pemerintahan' => $permissions->filter(fn (string $permission): bool => str_starts_with($permission, 'penduduk.')
                || str_starts_with($permission, 'kelahiran.')
                || str_starts_with($permission, 'kematian.')
                || str_starts_with($permission, 'pendatang.')
                || str_starts_with($permission, 'pindah.')
                || str_starts_with($permission, 'surat.'))->all(),
            'Kepala Dusun' => $permissions->filter(fn (string $permission): bool => in_array($permission, [
                'penduduk.view',
                'kelahiran.view',
                'kelahiran.create',
                'kematian.view',
                'kematian.create',
                'pendatang.view',
                'pendatang.create',
                'pindah.view',
                'pindah.create',
                'surat.view',
                'surat.create',
            ], true))->all(),
            'Sekretaris Desa' => $permissions->filter(fn (string $permission): bool => str_starts_with($permission, 'surat.')
                || str_starts_with($permission, 'pengumuman.')
                || str_starts_with($permission, 'laporan.')
                || $permission === 'penduduk.view')->reject(fn (string $permission): bool => $permission === 'surat.approve')->all(),
            'Kepala Desa' => $permissions->filter(fn (string $permission): bool => str_ends_with($permission, '.view')
                || in_array($permission, ['laporan.export', 'surat.approve', 'surat.print', 'pengumuman.view'], true))->all(),
        ]);

        $roles->each(function (array $rolePermissions, string $roleName) use ($guardName): void {
            Role::findOrCreate($roleName, $guardName)->syncPermissions($rolePermissions);
        });

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
