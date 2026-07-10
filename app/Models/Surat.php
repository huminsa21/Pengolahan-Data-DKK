<?php

namespace App\Models;

use Database\Factories\SuratFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'nomor_surat', 'jenis_surat_id', 'penduduk_id', 'tanggal_surat',
    'referensi_tipe', 'referensi_id', 'keperluan', 'data_json', 'status',
    'dibuat_oleh',
])]
class Surat extends Model
{
    /** @use HasFactory<SuratFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'surat';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tanggal_surat' => 'date',
            'data_json' => 'array',
        ];
    }

    public function penduduk(): BelongsTo
    {
        return $this->belongsTo(Penduduk::class);
    }

    public function jenisSurat(): BelongsTo
    {
        return $this->belongsTo(JenisSurat::class);
    }

    public function pembuat(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }

    public function isDraft(): bool
    {
        return $this->status === 'DRAFT';
    }

    public function isSelesai(): bool
    {
        return $this->status === 'SELESAI';
    }
}
