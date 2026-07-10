<?php

namespace App\Models;

use Database\Factories\BantuanFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'kode_bantuan', 'nama_bantuan', 'jenis_bantuan', 'sumber_bantuan',
    'tahun', 'deskripsi', 'status', 'is_published', 'published_at',
    'pengumuman_id', 'tampilkan_penerima',
])]
class Bantuan extends Model
{
    /** @use HasFactory<BantuanFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'bantuan';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tahun' => 'integer',
            'is_published' => 'boolean',
            'published_at' => 'datetime',
            'tampilkan_penerima' => 'boolean',
        ];
    }

    public function penerimaBantuan(): HasMany
    {
        return $this->hasMany(PenerimaBantuan::class);
    }

    public function pengumuman(): BelongsTo
    {
        return $this->belongsTo(Pengumuman::class);
    }
}
