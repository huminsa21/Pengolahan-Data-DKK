<?php

namespace App\Services;

use App\Models\PerangkatDesa;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;

class PerangkatDesaUserService
{
    public function createUser(PerangkatDesa $perangkatDesa): User
    {
        $perangkatDesa->loadMissing('penduduk');

        if ($perangkatDesa->status !== 'AKTIF') {
            throw ValidationException::withMessages([
                'status' => 'Akun login hanya bisa dibuat untuk perangkat desa aktif.',
            ]);
        }

        if ($perangkatDesa->user_id) {
            throw ValidationException::withMessages([
                'user_id' => 'Perangkat desa ini sudah memiliki akun login.',
            ]);
        }

        if (blank($perangkatDesa->penduduk?->nik)) {
            throw ValidationException::withMessages([
                'nik' => 'NIK penduduk belum tersedia.',
            ]);
        }

        if (User::query()->where('nik', $perangkatDesa->penduduk->nik)->exists()) {
            throw ValidationException::withMessages([
                'nik' => 'NIK sudah digunakan oleh akun lain.',
            ]);
        }

        return DB::transaction(function () use ($perangkatDesa): User {
            $user = User::query()->create([
                'name' => $perangkatDesa->penduduk->nama_lengkap,
                'email' => null,
                'nik' => $perangkatDesa->penduduk->nik,
                'login_type' => 'NIK',
                'password' => Hash::make('password'),
                'must_change_password' => true,
                'is_active' => true,
                'perangkat_desa_id' => $perangkatDesa->id,
            ]);

            $role = Role::findOrCreate($perangkatDesa->roleName(), 'web');
            $user->syncRoles([$role]);

            $perangkatDesa->forceFill(['user_id' => $user->id])->save();

            return $user;
        });
    }

    public function resetPassword(PerangkatDesa $perangkatDesa): void
    {
        $user = $this->userOrFail($perangkatDesa);

        $user->forceFill([
            'password' => Hash::make('password'),
            'must_change_password' => true,
            'is_active' => true,
        ])->save();
    }

    public function disableUser(PerangkatDesa $perangkatDesa): void
    {
        $user = $this->userOrFail($perangkatDesa);

        $user->forceFill(['is_active' => false])->save();
    }

    private function userOrFail(PerangkatDesa $perangkatDesa): User
    {
        $perangkatDesa->loadMissing('user');

        if (! $perangkatDesa->user) {
            throw ValidationException::withMessages([
                'user_id' => 'Perangkat desa ini belum memiliki akun login.',
            ]);
        }

        return $perangkatDesa->user;
    }
}
