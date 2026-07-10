<?php

use App\Http\Controllers\KelahiranController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PendudukController;
use App\Http\Controllers\DusunController;
use App\Http\Controllers\BantuanController;
use App\Http\Controllers\ChangePasswordController;
use App\Http\Controllers\InformasiController;
use App\Http\Controllers\JenisSuratController;
use App\Http\Controllers\KematianController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\PendatangController;
use App\Http\Controllers\PenerimaBantuanController;
use App\Http\Controllers\PerangkatDesaController;
use App\Http\Controllers\PengumumanController;
use App\Http\Controllers\PindahController;
use App\Http\Controllers\ProfilDesaController;
use App\Http\Controllers\SuratController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::get('informasi', [InformasiController::class, 'index'])->name('informasi.index');
Route::get('informasi/bantuan', [InformasiController::class, 'bantuanIndex'])->name('informasi.bantuan.index');
Route::get('informasi/bantuan/{bantuan}', [InformasiController::class, 'bantuanShow'])->name('informasi.bantuan.show');
Route::get('informasi/profil-desa', [InformasiController::class, 'profilDesa'])->name('informasi.profil-desa');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('change-password', [ChangePasswordController::class, 'edit'])->name('change-password.edit');
    Route::put('change-password', [ChangePasswordController::class, 'update'])->name('change-password.update');
});

Route::middleware(['auth', 'verified', 'password.changed'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('dusun', DusunController::class);
    Route::resource('penduduk', PendudukController::class);
    Route::post('kelahiran/{kelahiran}/create-penduduk', [KelahiranController::class, 'createPenduduk'])->name('kelahiran.create-penduduk');
    Route::resource('kelahiran', KelahiranController::class);
    Route::resource('kematian', KematianController::class);
    Route::post('pendatang/{pendatang}/accept', [PendatangController::class, 'accept'])->name('pendatang.accept');
    Route::post('pendatang/{pendatang}/reject', [PendatangController::class, 'reject'])->name('pendatang.reject');
    Route::resource('pendatang', PendatangController::class);
    Route::resource('pindah', PindahController::class);
    Route::post('bantuan/{bantuan}/publish', [BantuanController::class, 'publish'])->name('bantuan.publish');
    Route::post('bantuan/{bantuan}/unpublish', [BantuanController::class, 'unpublish'])->name('bantuan.unpublish');
    Route::resource('bantuan', BantuanController::class);
    Route::get('penerima-bantuan', [PenerimaBantuanController::class, 'index'])->name('penerima-bantuan.index');
    Route::post('bantuan/{bantuan}/penerima-bantuan', [PenerimaBantuanController::class, 'store'])->name('bantuan.penerima-bantuan.store');
    Route::put('penerima-bantuan/{penerimaBantuan}', [PenerimaBantuanController::class, 'update'])->name('penerima-bantuan.update');
    Route::delete('penerima-bantuan/{penerimaBantuan}', [PenerimaBantuanController::class, 'destroy'])->name('penerima-bantuan.destroy');
    Route::post('pengumuman/{pengumuman}/publish', [PengumumanController::class, 'publish'])->name('pengumuman.publish');
    Route::post('pengumuman/{pengumuman}/archive', [PengumumanController::class, 'archive'])->name('pengumuman.archive');
    Route::resource('pengumuman', PengumumanController::class);

    Route::get('profil-desa', [ProfilDesaController::class, 'show'])
        ->middleware('permission:profil_desa.view')
        ->name('profil-desa.show');
    Route::get('profil-desa/edit', [ProfilDesaController::class, 'edit'])
        ->middleware('permission:profil_desa.update')
        ->name('profil-desa.edit');
    Route::put('profil-desa', [ProfilDesaController::class, 'update'])
        ->middleware('permission:profil_desa.update')
        ->name('profil-desa.update');

    Route::post('perangkat-desa/{perangkatDesa}/create-user', [PerangkatDesaController::class, 'createUser'])
        ->middleware('permission:perangkat_desa.create_user')
        ->name('perangkat-desa.create-user');
    Route::post('perangkat-desa/{perangkatDesa}/reset-password', [PerangkatDesaController::class, 'resetPassword'])
        ->middleware('permission:perangkat_desa.reset_password')
        ->name('perangkat-desa.reset-password');
    Route::post('perangkat-desa/{perangkatDesa}/disable-user', [PerangkatDesaController::class, 'disableUser'])
        ->middleware('permission:perangkat_desa.disable_user')
        ->name('perangkat-desa.disable-user');
    Route::resource('perangkat-desa', PerangkatDesaController::class)
        ->parameters(['perangkat-desa' => 'perangkatDesa'])
        ->middlewareFor(['index', 'show'], 'permission:perangkat_desa.view')
        ->middlewareFor(['create', 'store'], 'permission:perangkat_desa.create')
        ->middlewareFor(['edit', 'update'], 'permission:perangkat_desa.update')
        ->middlewareFor('destroy', 'permission:perangkat_desa.delete');

    Route::resource('jenis-surat', JenisSuratController::class)
        ->middlewareFor(['index', 'show'], 'permission:jenis_surat.view')
        ->middlewareFor(['create', 'store'], 'permission:jenis_surat.create')
        ->middlewareFor(['edit', 'update'], 'permission:jenis_surat.update')
        ->middlewareFor('destroy', 'permission:jenis_surat.delete');

    Route::post('surat/{surat}/complete', [SuratController::class, 'complete'])
        ->middleware('permission:surat.update')
        ->name('surat.complete');
    Route::post('surat/{surat}/cancel', [SuratController::class, 'cancel'])
        ->middleware('permission:surat.update')
        ->name('surat.cancel');
    Route::get('surat/{surat}/preview', [SuratController::class, 'preview'])
        ->middleware('permission:surat.print')
        ->name('surat.preview');
    Route::get('surat/{surat}/download', [SuratController::class, 'download'])
        ->middleware('permission:surat.print')
        ->name('surat.download');
    Route::resource('surat', SuratController::class)
        ->middlewareFor(['index', 'show'], 'permission:surat.view')
        ->middlewareFor(['create', 'store'], 'permission:surat.create')
        ->middlewareFor(['edit', 'update'], 'permission:surat.update')
        ->middlewareFor('destroy', 'permission:surat.delete');

    Route::get('laporan', [LaporanController::class, 'index'])
        ->middleware('permission:laporan.view')
        ->name('laporan.index');
    Route::get('laporan/{jenis}', [LaporanController::class, 'show'])
        ->middleware('permission:laporan.view')
        ->whereIn('jenis', ['penduduk', 'kelahiran', 'kematian', 'pendatang', 'pindah', 'bantuan', 'surat'])
        ->name('laporan.show');
    Route::get('laporan/{jenis}/pdf', [LaporanController::class, 'pdf'])
        ->middleware('permission:laporan.export')
        ->whereIn('jenis', ['penduduk', 'kelahiran', 'kematian', 'pendatang', 'pindah', 'bantuan', 'surat'])
        ->name('laporan.pdf');
    Route::get('laporan/{jenis}/excel', [LaporanController::class, 'excel'])
        ->middleware('permission:laporan.export')
        ->whereIn('jenis', ['penduduk', 'kelahiran', 'kematian', 'pendatang', 'pindah', 'bantuan', 'surat'])
        ->name('laporan.excel');
});

require __DIR__.'/settings.php';
