<?php

use App\Models\Dusun;
use App\Models\User;
use Database\Seeders\DusunSeeder;
use Inertia\Testing\AssertableInertia;

function validDusunPayload(array $overrides = []): array
{
    return [
        'kode_dusun' => 'DSN-010',
        'nama_dusun' => 'Dusun X',
        'kepala_dusun' => 'Kepala Dusun X',
        'no_hp_kepala_dusun' => '081234567890',
        'keterangan' => 'Wilayah baru',
        'is_active' => true,
        ...$overrides,
    ];
}

test('dusun seeder creates default master data', function () {
    $this->seed(DusunSeeder::class);

    expect(Dusun::whereIn('nama_dusun', [
        'Dusun I',
        'Dusun II',
        'Dusun III',
        'Dusun IV',
    ])->count())->toBe(4);
});

test('dusun index displays paginated data with stats', function () {
    $dusun = Dusun::factory()->create([
        'kode_dusun' => 'DSN-001',
        'nama_dusun' => 'Dusun I',
        'kepala_dusun' => 'Pak Kepala',
    ]);

    $this->actingAs(User::factory()->create())
        ->get(route('dusun.index', ['search' => 'Pak Kepala']))
        ->assertSuccessful()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('dusun/index')
            ->where('dusun.data.0.id', $dusun->id)
            ->where('filters.search', 'Pak Kepala')
            ->has('stats.total')
        );
});

test('dusun can be created', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('dusun.store'), validDusunPayload())
        ->assertRedirect(route('dusun.index'));

    $this->assertDatabaseHas('dusun', [
        'kode_dusun' => 'DSN-010',
        'nama_dusun' => 'Dusun X',
    ]);
});

test('dusun validation requires name and unique nullable code', function () {
    Dusun::factory()->create(['kode_dusun' => 'DSN-010']);

    $this->actingAs(User::factory()->create())
        ->post(route('dusun.store'), validDusunPayload(['nama_dusun' => '']))
        ->assertSessionHasErrors('nama_dusun');

    $this->actingAs(User::factory()->create())
        ->post(route('dusun.store'), validDusunPayload())
        ->assertSessionHasErrors('kode_dusun');
});

test('dusun can be updated with the same code', function () {
    $dusun = Dusun::factory()->create([
        'kode_dusun' => 'DSN-010',
        'nama_dusun' => 'Dusun Lama',
    ]);

    $this->actingAs(User::factory()->create())
        ->put(route('dusun.update', $dusun), validDusunPayload([
            'kode_dusun' => 'DSN-010',
            'nama_dusun' => 'Dusun Baru',
        ]))
        ->assertRedirect(route('dusun.index'));

    expect($dusun->refresh()->nama_dusun)->toBe('Dusun Baru');
});

test('dusun delete uses soft delete', function () {
    $dusun = Dusun::factory()->create();

    $this->actingAs(User::factory()->create())
        ->delete(route('dusun.destroy', $dusun))
        ->assertRedirect(route('dusun.index'));

    $this->assertSoftDeleted($dusun);
});
