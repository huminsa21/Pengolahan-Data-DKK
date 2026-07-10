<?php

use App\Models\Bantuan;
use App\Models\Pengumuman;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

function validPengumumanPayload(array $overrides = []): array
{
    return [
        'judul' => 'Pengumuman Test',
        'isi' => 'Isi pengumuman untuk warga desa.',
        'tanggal_publish' => null,
        'status' => 'DRAFT',
        ...$overrides,
    ];
}

test('pengumuman index displays filtered data and stats', function () {
    $target = Pengumuman::factory()->create([
        'judul' => 'Rapat Warga Desa',
        'isi' => 'Agenda musyawarah desa.',
        'status' => 'PUBLISHED',
    ]);

    Pengumuman::factory()->create([
        'judul' => 'Arsip Lama',
        'status' => 'ARCHIVED',
    ]);

    $this->actingAs(User::factory()->create())
        ->get(route('pengumuman.index', [
            'search' => 'Rapat',
            'status' => 'PUBLISHED',
        ]))
        ->assertSuccessful()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('pengumuman/index')
            ->where('pengumuman.data.0.id', $target->id)
            ->has('stats.total')
        );
});

test('pengumuman can be created updated and soft deleted', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('pengumuman.store'), validPengumumanPayload())
        ->assertRedirect(route('pengumuman.index'));

    $pengumuman = Pengumuman::where('judul', 'Pengumuman Test')->firstOrFail();

    expect($pengumuman->created_by)->toBe($user->id);

    $this->actingAs($user)
        ->put(route('pengumuman.update', $pengumuman), validPengumumanPayload([
            'judul' => 'Pengumuman Revisi',
        ]))
        ->assertRedirect(route('pengumuman.index'));

    expect($pengumuman->refresh()->judul)->toBe('Pengumuman Revisi');

    $this->actingAs($user)
        ->delete(route('pengumuman.destroy', $pengumuman))
        ->assertRedirect(route('pengumuman.index'));

    $this->assertSoftDeleted($pengumuman);
});

test('pengumuman publish sets status and publish date when empty', function () {
    $pengumuman = Pengumuman::factory()->create([
        'status' => 'DRAFT',
        'tanggal_publish' => null,
    ]);

    $this->actingAs(User::factory()->create())
        ->post(route('pengumuman.publish', $pengumuman))
        ->assertRedirect();

    expect($pengumuman->refresh()->status)->toBe('PUBLISHED')
        ->and($pengumuman->tanggal_publish)->not->toBeNull();
});

test('pengumuman can be archived', function () {
    $pengumuman = Pengumuman::factory()->create(['status' => 'PUBLISHED']);

    $this->actingAs(User::factory()->create())
        ->post(route('pengumuman.archive', $pengumuman))
        ->assertRedirect();

    expect($pengumuman->refresh()->status)->toBe('ARCHIVED');
});

test('pengumuman linked to bantuan cannot be deleted', function () {
    $pengumuman = Pengumuman::factory()->create();
    Bantuan::factory()->create(['pengumuman_id' => $pengumuman->id]);

    $this->actingAs(User::factory()->create())
        ->delete(route('pengumuman.destroy', $pengumuman))
        ->assertRedirect();

    $this->assertModelExists($pengumuman);
});

test('public informasi only displays published pengumuman ordered by latest publish date', function () {
    $older = Pengumuman::factory()->create([
        'judul' => 'Published Lama',
        'status' => 'PUBLISHED',
        'tanggal_publish' => '2026-01-01 08:00:00',
    ]);
    $latest = Pengumuman::factory()->create([
        'judul' => 'Published Baru',
        'status' => 'PUBLISHED',
        'tanggal_publish' => '2026-07-07 08:00:00',
    ]);
    Pengumuman::factory()->create([
        'judul' => 'Draft Rahasia',
        'status' => 'DRAFT',
        'tanggal_publish' => '2026-07-08 08:00:00',
    ]);

    $this->get(route('informasi.index'))
        ->assertSuccessful()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('informasi/index')
            ->where('pengumuman.data.0.id', $latest->id)
            ->where('pengumuman.data.1.id', $older->id)
            ->missing('pengumuman.data.2')
        );
});
