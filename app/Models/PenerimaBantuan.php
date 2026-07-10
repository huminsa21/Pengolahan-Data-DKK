<?php

namespace App\Models;

use Database\Factories\PenerimaBantuanFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'bantuan_id', 'penduduk_id', 'tanggal_terima', 'nominal', 'status',
    'keterangan',
])]
class PenerimaBantuan extends Model
{
    /** @use HasFactory<PenerimaBantuanFactory> */
    use HasFactory, HasUuids;

    protected $table = 'penerima_bantuan';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tanggal_terima' => 'date',
            'nominal' => 'decimal:2',
        ];
    }

    public function penduduk(): BelongsTo
    {
        return $this->belongsTo(Penduduk::class);
    }

    public function bantuan(): BelongsTo
    {
        return $this->belongsTo(Bantuan::class);
    }
}
