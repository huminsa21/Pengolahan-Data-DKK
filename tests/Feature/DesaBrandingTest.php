<?php

use App\Services\PdfGeneratorService;
use Inertia\Testing\AssertableInertia as Assert;

test('public welcome page receives desa branding props', function () {
    $response = $this->get('/');

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('welcome')
            ->where('desa.nama_desa', config('desa.nama_desa'))
            ->where('desa.kecamatan', config('desa.kecamatan'))
            ->where('desa.kabupaten', config('desa.kabupaten'))
            ->where('desa.logo', asset(config('desa.logo')))
            ->where('desa.nama_aplikasi', config('desa.nama_aplikasi')));
});

test('root blade uses desa logo as favicon', function () {
    $html = view('app', [
        'page' => ['component' => 'welcome'],
    ])->render();

    expect($html)->toContain('/img/logo.png');
});

test('pdf base template uses desa kop and footer', function () {
    $service = app(PdfGeneratorService::class);
    $reflection = new ReflectionClass($service);
    $method = $reflection->getMethod('defaultData');
    $method->setAccessible(true);

    $html = view('pdf.base', [
        ...$method->invoke($service, 'Surat'),
        'nomorSurat' => '470/001/DS/2026',
        'judul' => 'Surat Keterangan',
        'isi' => 'Isi surat.',
    ])->render();

    expect($html)->toContain(public_path('img/logo.png'))
        ->and($html)->toContain('Pemerintah Kabupaten '.config('desa.kabupaten'))
        ->and($html)->toContain('Kecamatan '.config('desa.kecamatan'))
        ->and($html)->toContain(config('desa.nama_desa'))
        ->and($html)->toContain('Nomor: 470/001/DS/2026')
        ->and($html)->toContain('Dokumen dicetak oleh Sistem Informasi Kependudukan Desa');
});
