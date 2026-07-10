<?php

namespace App\Models;

use Database\Factories\KelahiranFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'penduduk_id_bayi', 'nama_bayi', 'jenis_kelamin', 'tanggal_lahir', 'tempat_lahir',
    'waktu_lahir', 'ayah_id', 'ibu_id', 'pelapor_tipe', 'pelapor_id',
    'pelapor_nama', 'pelapor_kontak', 'nama_ayah', 'nama_ibu', 'alamat',
    'keterangan',
])]
class Kelahiran extends Model
{
    /** @use HasFactory<KelahiranFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'kelahiran';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tanggal_lahir' => 'date',
            'waktu_lahir' => 'datetime:H:i',
        ];
    }

    public function ayah(): BelongsTo
    {
        return $this->belongsTo(Penduduk::class, 'ayah_id');
    }

    public function bayiPenduduk(): BelongsTo
    {
        return $this->belongsTo(Penduduk::class, 'penduduk_id_bayi');
    }

    public function ibu(): BelongsTo
    {
        return $this->belongsTo(Penduduk::class, 'ibu_id');
    }

    public function pelapor(): BelongsTo
    {
        return $this->belongsTo(Penduduk::class, 'pelapor_id');
    }

    public function pelaporPenduduk(): BelongsTo
    {
        return $this->belongsTo(Penduduk::class, 'pelapor_id');
    }
}
