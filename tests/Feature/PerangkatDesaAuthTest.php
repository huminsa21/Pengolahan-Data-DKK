<?php

use App\Models\Penduduk;
use App\Models\PerangkatDesa;
use App\Models\User;
use App\Services\PerangkatDesaUserService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia;
use Spatie\Permission\Models\Role;

function superAdminUser(): User
{
    test()->seed(RolePermissionSeeder::class);

    $user = User::factory()->create([
        'email' => 'admin@desa.id',
        'login_type' => 'EMAIL',
        'is_active' => true,
    ]);
    $user->assignRole(Role::findByName('Super Admin'));

    return $user;
}

function activePerangkatDesa(array $pendudukOverrides = [], array $perangkatOverrides = []): PerangkatDesa
{
    $penduduk = Penduduk::factory()->create([
        'nik' => $pendudukOverrides['nik'] ?? '1207050101900001',
        'nama_lengkap' => $pendudukOverrides['nama_lengkap'] ?? 'Perangkat Uji',
        'status_penduduk' => 'AKTIF',
        ...$pendudukOverrides,
    ]);

    return PerangkatDesa::factory()->create([
        'penduduk_id' => $penduduk->id,
        'jabatan' => 'Sekretaris Desa',
        'status' => 'AKTIF',
        ...$perangkatOverrides,
    ]);
}

test('super admin can login using email username', function () {
    $user = superAdminUser();

    $this->post(route('login.store'), [
        'username' => $user->email,
        'password' => 'password',
    ])->assertRedirect(route('dashboard', absolute: false));

    $this->assertAuthenticatedAs($user);
    expect($user->refresh()->last_login_at)->not->toBeNull();
});

test('perangkat desa can login using nik after account is created and must change password', function () {
    superAdminUser();
    $perangkatDesa = activePerangkatDesa();
    $user = app(PerangkatDesaUserService::class)->createUser($perangkatDesa);

    $this->post(route('login.store'), [
        'username' => $perangkatDesa->penduduk->nik,
        'password' => 'password',
    ])->assertRedirect(route('dashboard', absolute: false));

    $this->assertAuthenticatedAs($user);

    $this->get(route('dashboard'))
        ->assertRedirect(route('change-password.edit'));
});

test('perangkat desa can change default password before accessing dashboard', function () {
    superAdminUser();
    $perangkatDesa = activePerangkatDesa();
    $user = app(PerangkatDesaUserService::class)->createUser($perangkatDesa);

    $this->actingAs($user)
        ->put(route('change-password.update'), [
            'password_baru' => 'password-baru',
            'konfirmasi_password' => 'password-baru',
        ])
        ->assertRedirect(route('dashboard'));

    expect($user->refresh()->must_change_password)->toBeFalse()
        ->and(Hash::check('password-baru', $user->password))->toBeTrue();
});

test('inactive user cannot login', function () {
    superAdminUser();
    $perangkatDesa = activePerangkatDesa();
    $user = app(PerangkatDesaUserService::class)->createUser($perangkatDesa);
    $user->forceFill(['is_active' => false])->save();

    $this->post(route('login.store'), [
        'username' => $perangkatDesa->penduduk->nik,
        'password' => 'password',
    ])->assertSessionHasErrors('username');

    $this->assertGuest();
});

test('penduduk without perangkat login account cannot login using nik', function () {
    Penduduk::factory()->create([
        'nik' => '1207050101900002',
        'status_penduduk' => 'AKTIF',
    ]);

    $this->post(route('login.store'), [
        'username' => '1207050101900002',
        'password' => 'password',
    ]);

    $this->assertGuest();
});

test('reset password returns perangkat account to default password', function () {
    $admin = superAdminUser();
    $perangkatDesa = activePerangkatDesa();
    $user = app(PerangkatDesaUserService::class)->createUser($perangkatDesa);
    $user->forceFill([
        'password' => Hash::make('changed-password'),
        'must_change_password' => false,
    ])->save();

    $this->actingAs($admin)
        ->post(route('perangkat-desa.reset-password', $perangkatDesa))
        ->assertRedirect();

    expect($user->refresh()->must_change_password)->toBeTrue()
        ->and(Hash::check('password', $user->password))->toBeTrue();
});

test('sidebar shared permissions follow current user permissions', function () {
    $admin = superAdminUser();

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->has('auth.user.permissions')
            ->where('auth.user.permissions', fn ($permissions): bool => collect($permissions)->contains('perangkat_desa.view')));

    $operator = User::factory()->create();
    $operator->assignRole(Role::findByName('Operator Desa'));

    $this->actingAs($operator)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->where('auth.user.permissions', fn ($permissions): bool => ! collect($permissions)->contains('perangkat_desa.view')));
});
