<?php

namespace App\Models;

use Database\Factories\KematianFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'penduduk_id', 'pelapor_tipe', 'pelapor_id', 'pelapor_nama',
    'pelapor_kontak', 'tanggal_meninggal', 'tempat_meninggal',
    'sebab_meninggal', 'keterangan',
])]
class Kematian extends Model
{
    /** @use HasFactory<KematianFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'kematian';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tanggal_meninggal' => 'date',
        ];
    }

    protected static function booted(): void
    {
        static::created(function (Kematian $kematian): void {
            $kematian->penduduk()->update(['status_penduduk' => 'MENINGGAL']);
        });
    }

    public function penduduk(): BelongsTo
    {
        return $this->belongsTo(Penduduk::class);
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
