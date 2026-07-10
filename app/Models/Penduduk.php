<?php

namespace App\Models;

use Database\Factories\PendudukFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'nik', 'nama_lengkap', 'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir',
    'agama', 'status_perkawinan', 'pendidikan', 'pekerjaan', 'no_hp',
    'alamat', 'dusun_id', 'dusun', 'rt', 'rw', 'desa', 'kecamatan', 'kabupaten',
    'provinsi', 'no_kk', 'hubungan_keluarga', 'is_kepala_keluarga',
    'status_penduduk',
])]
class Penduduk extends Model
{
    /** @use HasFactory<PendudukFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'penduduk';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tanggal_lahir' => 'date',
            'is_kepala_keluarga' => 'boolean',
        ];
    }

    public function kematianSebagaiPelapor(): HasMany
    {
        return $this->hasMany(Kematian::class, 'pelapor_id');
    }

    public function dataKematian(): HasMany
    {
        return $this->hasMany(Kematian::class);
    }

    public function laporanKematian(): HasMany
    {
        return $this->hasMany(Kematian::class, 'pelapor_id');
    }

    public function wilayahDusun(): BelongsTo
    {
        return $this->belongsTo(Dusun::class, 'dusun_id');
    }

    public function kelahiranSebagaiAyah(): HasMany
    {
        return $this->hasMany(Kelahiran::class, 'ayah_id');
    }

    public function riwayatKelahiranBayi(): HasMany
    {
        return $this->hasMany(Kelahiran::class, 'penduduk_id_bayi');
    }

    public function kelahiranSebagaiIbu(): HasMany
    {
        return $this->hasMany(Kelahiran::class, 'ibu_id');
    }

    public function kelahiranSebagaiPelapor(): HasMany
    {
        return $this->hasMany(Kelahiran::class, 'pelapor_id');
    }

    public function pendatangSebagaiPelapor(): HasMany
    {
        return $this->hasMany(Pendatang::class, 'pelapor_id');
    }

    public function riwayatPendatang(): HasMany
    {
        return $this->hasMany(Pendatang::class);
    }

    public function laporanPendatang(): HasMany
    {
        return $this->hasMany(Pendatang::class, 'pelapor_id');
    }

    public function pindahSebagaiPelapor(): HasMany
    {
        return $this->hasMany(Pindah::class, 'pelapor_id');
    }

    public function dataPindah(): HasMany
    {
        return $this->hasMany(Pindah::class);
    }

    public function laporanPindah(): HasMany
    {
        return $this->hasMany(Pindah::class, 'pelapor_id');
    }

    public function pindah(): HasMany
    {
        return $this->hasMany(Pindah::class);
    }

    public function penerimaBantuan(): HasMany
    {
        return $this->hasMany(PenerimaBantuan::class);
    }

    public function surat(): HasMany
    {
        return $this->hasMany(Surat::class);
    }

    public function perangkatDesa(): HasMany
    {
        return $this->hasMany(PerangkatDesa::class);
    }
}
