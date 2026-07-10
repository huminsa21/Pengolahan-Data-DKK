<?php

use App\Models\Bantuan;
use App\Models\JenisSurat;
use App\Models\Kematian;
use App\Models\Penduduk;
use App\Models\PenerimaBantuan;
use App\Models\Pengumuman;
use App\Models\Pindah;
use App\Models\User;
use Illuminate\Support\Facades\Schema;

test('kependudukan schema and seeders are ready', function () {
    $this->seed();

    $tables = [
        'penduduk',
        'kelahiran',
        'kematian',
        'pendatang',
        'pindah',
        'bantuan',
        'penerima_bantuan',
        'pengumuman',
        'jenis_surat',
        'surat',
    ];

    expect(collect($tables)->every(fn (string $table): bool => Schema::hasTable($table)))->toBeTrue();

    expect(User::where('email', 'admin@desa.id')->exists())->toBeTrue()
        ->and(Penduduk::count())->toBe(20)
        ->and(Bantuan::count())->toBe(3)
        ->and(Pengumuman::count())->toBe(3)
        ->and(JenisSurat::whereIn('kode_surat', [
            'DOMISILI',
            'PINDAH',
            'DATANG',
            'KELAHIRAN',
            'KEMATIAN',
        ])->count())->toBe(5);
});

test('penerima bantuan connects penduduk and bantuan', function () {
    $penerimaBantuan = PenerimaBantuan::factory()->create();

    expect($penerimaBantuan->penduduk)->toBeInstanceOf(Penduduk::class)
        ->and($penerimaBantuan->bantuan)->toBeInstanceOf(Bantuan::class);
});

test('kematian marks penduduk as meninggal', function () {
    $penduduk = Penduduk::factory()->create(['status_penduduk' => 'AKTIF']);

    Kematian::factory()->create([
        'penduduk_id' => $penduduk->id,
        'pelapor_id' => null,
    ]);

    expect($penduduk->refresh()->status_penduduk)->toBe('MENINGGAL');
});

test('pindah selesai marks penduduk as pindah', function () {
    $penduduk = Penduduk::factory()->create(['status_penduduk' => 'AKTIF']);

    Pindah::factory()->create([
        'penduduk_id' => $penduduk->id,
        'status' => 'SELESAI',
    ]);

    expect($penduduk->refresh()->status_penduduk)->toBe('PINDAH');
});
