<?php

namespace App\Models;

use Database\Factories\JenisSuratFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['kode_surat', 'nama_surat', 'template_surat', 'is_active'])]
class JenisSurat extends Model
{
    /** @use HasFactory<JenisSuratFactory> */
    use HasFactory, HasUuids;

    protected $table = 'jenis_surat';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function surat(): HasMany
    {
        return $this->hasMany(Surat::class);
    }
}
