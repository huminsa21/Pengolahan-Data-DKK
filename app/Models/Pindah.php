<?php

namespace App\Models;

use Database\Factories\PindahFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'penduduk_id', 'pelapor_tipe', 'pelapor_id', 'pelapor_nama',
    'pelapor_kontak', 'tanggal_pindah', 'alamat_tujuan', 'desa_tujuan',
    'kecamatan_tujuan', 'kabupaten_tujuan', 'provinsi_tujuan',
    'alasan_pindah', 'status', 'keterangan',
])]
class Pindah extends Model
{
    /** @use HasFactory<PindahFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'pindah';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tanggal_pindah' => 'date',
        ];
    }

    protected static function booted(): void
    {
        static::saved(function (Pindah $pindah): void {
            if ($pindah->status === 'SELESAI') {
                $pindah->penduduk()->update(['status_penduduk' => 'PINDAH']);
            }
        });
    }

    public function penduduk(): BelongsTo
    {
        return $this->belongsTo(Penduduk::class);
    }

    public function pelaporPenduduk(): BelongsTo
    {
        return $this->belongsTo(Penduduk::class, 'pelapor_id');
    }
}
