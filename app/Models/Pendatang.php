<?php

namespace App\Models;

use Database\Factories\PendatangFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'penduduk_id', 'pelapor_tipe', 'pelapor_id', 'pelapor_nama',
    'pelapor_kontak', 'nik', 'nama_lengkap', 'jenis_kelamin', 'tempat_lahir',
    'tanggal_lahir', 'agama', 'status_perkawinan', 'pendidikan', 'pekerjaan',
    'no_hp', 'alamat_asal', 'desa_asal', 'kecamatan_asal', 'kabupaten_asal',
    'provinsi_asal', 'dusun_id', 'alamat_tujuan', 'rt', 'rw', 'tanggal_datang',
    'alasan_datang', 'status', 'keterangan',
])]
class Pendatang extends Model
{
    /** @use HasFactory<PendatangFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'pendatang';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tanggal_lahir' => 'date',
            'tanggal_datang' => 'date',
        ];
    }

    public function penduduk(): BelongsTo
    {
        return $this->belongsTo(Penduduk::class);
    }

    public function pelaporPenduduk(): BelongsTo
    {
        return $this->belongsTo(Penduduk::class, 'pelapor_id');
    }

    public function dusun(): BelongsTo
    {
        return $this->belongsTo(Dusun::class, 'dusun_id');
    }
}
